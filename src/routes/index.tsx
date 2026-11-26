import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, X, Camera, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { CAMP_DAYS, isCampDay } from "@/lib/camp";
import { photosQuery, type Photo } from "@/lib/photos";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { dia: number } => {
    const n = Number(s["dia"]);
    return { dia: isCampDay(n) ? n : 1 };
  },
  head: () => ({
    meta: [
      { title: "Acamps 2K27.1 — Acamp's" },
      { name: "description", content: "Reviva os encontros, a alegria e a presença de Deus nos cinco dias do Acamp's." },
      { property: "og:title", content: "Acamps 2K27.1 — Acamp's" },
      { property: "og:description", content: "As memórias do nosso encontro, em imagens." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { dia } = Route.useSearch();
  const { data, isLoading, error } = useQuery(photosQuery(dia));
  const [open, setOpen] = useState<Photo | null>(null);
  const current = CAMP_DAYS[dia - 1];

  return (
    <div className="min-h-screen bg-[#087e96] text-[#fff9e8]">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_20%_15%,rgba(255,213,64,.32),transparent_42%),radial-gradient(ellipse_at_85%_80%,rgba(0,67,103,.55),transparent_48%),linear-gradient(135deg,#079bb1_0%,#087e96_55%,#05627c_100%)]" />
          <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:radial-gradient(rgba(255,255,255,.8)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:py-28 lg:grid-cols-[1.1fr_.9fr]">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#ffdb55]/40 bg-[#ffdb55]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#ffe477]">
                <Sparkles className="h-3.5 w-3.5" /> Comunidade Católica Shalom
              </p>
              <h1 className="mt-7 font-display text-6xl uppercase leading-[.92] tracking-tight text-[#fff9e8] sm:text-8xl lg:text-[6.5rem]">
                <span className="text-[#ffdb55]">Impossível</span><br />descrever.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                Tem momentos que a gente não consegue explicar. Só sentir, guardar e reviver. Aqui estão as memórias dos cinco dias do nosso Acamp's.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-[#f36b21] px-5 py-3 font-bold text-white ">11 a 15 de janeiro</span>
                <span className="rounded-full border border-white/15 px-5 py-3 text-white/70">Pousada Recanto do Mar</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-5 rounded-[2rem] border border-[#ffdb55]/20 rotate-3" />
              <div className="relative grid grid-cols-2 gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/30">
                <div className="col-span-2 flex min-h-44 flex-col justify-between rounded-2xl bg-gradient-to-br from-[#ffb000]/35 via-[#078da6]/45 to-[#075a70] p-6">
                  <Camera className="h-7 w-7 text-[#ffe477]" />
                  <p className="font-display text-3xl uppercase leading-tight text-[#fff9e8]">ACAMP’S<br />2K27.1</p>
                </div>
                <div className="h-24 rounded-2xl bg-gradient-to-br from-[#ffdc55]/35 to-[#f36b21]/50" />
                <div className="flex h-24 items-end rounded-2xl bg-gradient-to-br from-[#10a6bd]/60 to-[#075a70] p-4 text-xs font-semibold uppercase tracking-[.2em] text-white/70">Fé · encontro · alegria</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.3em] text-[#ffdb55]">Reviva cada instante</p>
              <h2 className="mt-2 font-display text-4xl uppercase text-[#fff9e8] sm:text-5xl">Galeria do Acamp's</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/55">Escolha um dos cinco dias e encontre os registros feitos com carinho pela equipe de comunicação.</p>
          </div>

          <nav className="grid grid-cols-2 gap-3 sm:grid-cols-5" aria-label="Dias do acampamento">
            {CAMP_DAYS.map((d) => {
              const active = d.day === dia;
              return (
                <Link key={d.day} to="/" search={{ dia: d.day }} className={`group rounded-2xl border p-4 transition duration-200 ${active ? "border-[#ffdb55] bg-[#ffdb55] text-[#07465a] shadow-lg shadow-[#ffdb55]/10" : "border-white/10 bg-white/[0.035] text-white/75 hover:border-[#ffdb55]/60 hover:bg-white/[0.07]"}`}>
                  <span className="block text-[10px] font-bold uppercase tracking-[.25em] opacity-65">Janeiro · 2027</span>
                  <span className="mt-2 block font-display text-3xl uppercase">{d.weekday}</span>
                  <span className="mt-1 block text-xs font-medium opacity-70">{d.date}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 flex items-center justify-between border-b border-white/10 pb-5">
            <h3 className="font-display text-3xl uppercase text-[#fff9e8]">{current?.weekday} <span className="text-[#ffdb55]">/</span> {current?.date}</h3>
            <span className="text-xs font-semibold uppercase tracking-[.2em] text-white/40">Fotos oficiais</span>
          </div>
          {isLoading && <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-white/10" />)}</div>}
          {error && <p className="mt-6 rounded-2xl border border-red-300/20 bg-red-300/5 p-6 text-sm text-red-100">Não foi possível carregar as fotos agora. Tente novamente em instantes.</p>}
          {data && data.length === 0 && <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/[.025] px-6 py-16 text-center"><Camera className="mx-auto h-8 w-8 text-[#ffdb55]" /><p className="mt-4 font-display text-3xl uppercase text-[#fff9e8]">Em breve</p><p className="mt-2 text-sm text-white/55">As fotos deste dia ainda estão sendo preparadas pela equipe de comunicação.</p></div>}
          {data && data.length > 0 && <div className="mt-6 columns-2 gap-3 sm:columns-3 lg:columns-4">{data.map((p) => <button key={p.id} onClick={() => setOpen(p)} className="mb-3 block w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"><img src={p.url} alt={p.caption ?? `Foto do dia ${dia}`} loading="lazy" className="w-full transition duration-500 hover:scale-105" /></button>)}</div>}
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/10 px-5 py-10 text-center">
        <p className="font-display text-xl uppercase tracking-wide text-[#ffdb55]">Acamps 2K27.1</p>
        <p className="mt-2 text-xs text-white/45">Comunidade Católica Shalom · Acamp's</p>
      </footer>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setOpen(null)}>
        <button className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white" aria-label="Fechar"><X /></button>
        <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
          <img src={open.url} alt={open.caption ?? ""} className="max-h-[80vh] rounded-xl object-contain" />
          <figcaption className="mt-3 flex items-center justify-between gap-4 text-white">
            <span>{open.caption}</span>
            <a href={open.url} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#ffdb55] px-4 py-2 text-sm font-bold text-[#07465a]"><Download className="h-4 w-4" /> Baixar</a>
          </figcaption>
        </figure>
      </div>}
    </div>
  );
}
