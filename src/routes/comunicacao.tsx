import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Trash2, Upload, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CAMP_DAYS } from "@/lib/camp";
import { photosQuery } from "@/lib/photos";

export const Route = createFileRoute("/comunicacao")({
  head: () => ({
    meta: [
      { title: "Equipe de comunicação — Acamp's Shalom" },
      { name: "description", content: "Área da equipe de comunicação para enviar as fotos oficiais de cada dia do Acamp's." },
      { property: "og:title", content: "Equipe de comunicação — Acamp's Shalom" },
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
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-5xl uppercase text-primary">Comunicação</h1>
        <p className="mt-2 text-foreground/85">Área exclusiva da equipe de comunicação do retiro para enviar as fotos de cada dia.</p>
        <div className="mt-8">
          {!ready ? null : !session ? <AuthForm /> : <TeamGate userId={session.user.id} email={session.user.email ?? ""} />}
        </div>
      </main>
    </div>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/comunicacao` } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up" && !data.session) toast.success("Conta criada! Confirme pelo link enviado ao seu e-mail.");
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/comunicacao` });
    if (r.error) toast.error("Não foi possível entrar com Google.");
  };

  return (
    <div className="max-w-md rounded-2xl bg-card p-6 text-card-foreground shadow-[var(--shadow-pop)]">
      <h2 className="text-2xl uppercase">{mode === "in" ? "Entrar" : "Criar conta"}</h2>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div className="space-y-1.5"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" disabled={busy} className="w-full font-bold">{mode === "in" ? "Entrar" : "Criar conta"}</Button>
      </form>
      <Button type="button" onClick={google} className="mt-3 w-full gap-2.5 border border-[#747775] bg-[#FFFFFF] text-[#1F1F1F] hover:bg-[#F2F2F2]">
        <svg aria-hidden="true" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
        Continuar com Google
      </Button>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm underline">
        {mode === "in" ? "Primeira vez? Criar conta" : "Já tenho conta"}
      </button>
    </div>
  );
}

function TeamGate({ userId, email }: { userId: string; email: string }) {
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
        <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-1 font-semibold"><LogOut className="h-4 w-4" /> Sair</button>
      </div>
      {role.isLoading ? null : role.data ? <Uploader /> : (
        <form onSubmit={claim} className="max-w-md rounded-2xl bg-card p-6 shadow-[var(--shadow-pop)]">
          <h2 className="text-2xl uppercase">Código da equipe</h2>
          <p className="mt-1 text-sm opacity-85">Digite o código de acesso da equipe de comunicação para liberar os envios.</p>
          <Input className="mt-4" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="Código" />
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
