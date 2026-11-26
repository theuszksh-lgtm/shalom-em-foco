import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Trash2, Upload, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CAMP_DAYS } from "@/lib/camp";
import { photosQuery } from "@/lib/photos";

export const Route = createFileRoute("/comunicacao")({
  head: () => ({
    meta: [
      { title: "Equipe de comunicação — Acamps 2K27.1" },
      { name: "description", content: "Área da equipe de comunicação para enviar as fotos oficiais de cada dia do Acamp's." },
      { property: "og:title", content: "Equipe de comunicação — Acamps 2K27.1" },
      { property: "og:description", content: "Envio das fotos oficiais do Acampamento de Jovens Shalom." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Comunicacao,
});

function Comunicacao() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [member, setMember] = useState("");
  const [busy, setBusy] = useState(false);
  const members = ["Lise", "Matheus", "Maria Clara", "Lucas Gomes", "Enzo"];
  const choose = async (name: string) => {
    setBusy(true);
    try {
      if (!session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) { toast.error("Acesso indisponível: a autenticação anônima precisa estar habilitada."); return; }
      }
      setMember(name);
    } catch { toast.error("Não foi possível acessar."); } finally { setBusy(false); }
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#087e96] [background-image:radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:16px_16px]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mx-auto max-w-lg text-center"><span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#075a70]">Equipe de fotografia</span><h1 className="mt-5 text-6xl uppercase text-primary">ACAMP’S 2K27.1</h1><p className="mt-2 font-display text-2xl uppercase">Um pedacinho do céu</p></div>
        <p className="mt-4 text-center text-foreground/85">Área exclusiva da equipe de comunicação do retiro para enviar as fotos de cada dia.</p>
        <div className="mt-8">
          {!ready ? <p>Carregando...</p> : !member || !session ? <div className="mx-auto max-w-md rounded-2xl border border-white/20 bg-card p-6"><h2 className="text-3xl uppercase text-primary">Quem está enviando?</h2><p className="mt-2">Selecione seu nome na equipe.</p><div className="mt-5 grid gap-2">{members.map(name => <Button key={name} disabled={busy} onClick={() => choose(name)} className="h-14 text-lg font-bold">{name}</Button>)}</div></div> : <TeamGate userId={session.user.id} email={member} onExit={() => setMember("")} />}
        </div>
      </main>
    </div>
  );
}

function TeamGate({ userId, email, onExit }: { userId: string; email: string; onExit: () => void }) {
  const qc = useQueryClient();
  const role = useQuery({
    queryKey: ["role", userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "comunicacao" });
      if (error) throw error;
      return data === true;
    },
  });
  const [code, setCode] = useState("");

  const claim = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.rpc("claim_team_role", { _code: code });
    if (error || !data) { toast.error("Código inválido."); return; }
    toast.success("Acesso liberado!");
    qc.invalidateQueries({ queryKey: ["role", userId] });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm">
        <span>Conectado como <strong>{email}</strong></span>
        <button onClick={async () => { await supabase.auth.signOut(); onExit(); }} className="inline-flex items-center gap-1 font-semibold"><LogOut className="h-4 w-4" /> Sair</button>
      </div>
      {role.isLoading ? null : role.data ? <Uploader /> : (
        <form onSubmit={claim} className="mx-auto max-w-md rounded-2xl bg-card p-6 shadow-[var(--shadow-pop)]">
          <h2 className="text-2xl uppercase">Código da equipe</h2>
          <p className="mt-1 text-sm opacity-85">Digite o código de acesso da equipe de comunicação para liberar os envios.</p>
          <Input className="mt-4" value={code} onChange={(e) => setCode(e.target.value)} required type="password" placeholder="Senha da equipe" />
          <Button type="submit" className="mt-3 w-full font-bold">Liberar acesso</Button>
        </form>
      )}
    </div>
  );
}

function Uploader() {
  const qc = useQueryClient();
  const [day, setDay] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const photos = useQuery(photosQuery(day));

  const upload = async () => {
    if (!files.length) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setProgress({ done: 0, total: files.length });
    let fails = 0;
    for (const [i, f] of files.entries()) {
      const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `dia-${day}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("fotos").upload(path, f, { contentType: f.type });
      if (up.error) { fails++; } else {
        const ins = await supabase.from("photos").insert({ day, storage_path: path, caption: caption.trim().slice(0, 200) || null, uploaded_by: u.user.id });
        if (ins.error) fails++;
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setProgress(null);
    setFiles([]);
    setCaption("");
    qc.invalidateQueries({ queryKey: ["photos", day] });
    if (fails) toast.error(`${fails} foto(s) não foram enviadas.`); else toast.success("Fotos enviadas!");
  };

  const remove = async (id: string, path: string) => {
    if (!confirm("Remover esta foto?")) return;
    await supabase.storage.from("fotos").remove([path]);
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (error) { toast.error("Não foi possível remover."); return; }
    qc.invalidateQueries({ queryKey: ["photos", day] });
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-widest">1. Escolha o dia</p>
        <div className="flex flex-wrap gap-3">
          {CAMP_DAYS.map((d) => (
            <button key={d.day} onClick={() => setDay(d.day)} className={`rounded-xl border-2 px-5 py-3 text-left ${d.day === day ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-pop)]" : "border-border bg-card"}`}>
              <span className="block font-display text-2xl uppercase leading-none">{d.weekday}</span>
              <span className="text-xs font-semibold opacity-80">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-pop)]">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest">2. Envie as fotos do {CAMP_DAYS[day - 1]?.weekday}</p>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary">
          <Upload className="h-8 w-8 text-primary" />
          <span className="mt-2 font-semibold">{files.length ? `${files.length} foto(s) selecionada(s)` : "Clique para escolher fotos"}</span>
          <span className="text-xs opacity-75">JPG, PNG, WEBP ou HEIC · até 20 MB cada</span>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic" className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        </label>
        <Input className="mt-4" maxLength={200} placeholder="Legenda (opcional, vale para todas)" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <Button onClick={upload} disabled={!files.length || !!progress} className="mt-4 w-full font-bold">
          {progress ? `Enviando ${progress.done}/${progress.total}...` : "Enviar fotos"}
        </Button>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-widest">Fotos já publicadas neste dia ({photos.data?.length ?? 0})</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {photos.data?.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img src={p.url} alt="" className="h-full w-full object-cover" loading="lazy" />
              <button onClick={() => remove(p.id, p.storage_path)} aria-label="Remover" className="absolute right-1 top-1 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-90">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
