import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, X, Camera } from "lucide-react";
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
    <div className="min-h-screen bg-[#087e96] text-[#fff9e8] [background-image:radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:16px_16px]">
      <SiteHeader />
      <main>
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-10 sm:flex-row sm:py-12">
          <div className="relative flex aspect-[4/5] w-48 shrink-0 -rotate-3 flex-col items-center justify-center overflow-hidden rounded-xl border-4 border-[#ffdb55] bg-[#079bb1] p-4 text-center shadow-xl sm:w-56">
            <span className="text-5xl text-[#ffdb55]">⚑</span>
            <span className="font-display text-3xl uppercase leading-none text-[#ffdb55]">Impossível descrever</span>
            <span className="mt-4 font-display text-4xl text-white [text-shadow:3px_3px_0_#f36b21]">ACAMP’S</span>
            <span className="mt-2 font-bold">2K27.1</span>
            <span className="mt-4 bg-[#f36b21] px-2 py-1 text-xs font-bold">11 A 15 DE JANEIRO</span>
          </div>
          <div className="text-center sm:text-left">
            <span className="rounded-full bg-[#fff9e8] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#075a70]">Fotos oficiais</span>
            <h1 className="mt-4 font-display text-5xl uppercase leading-none text-[#ffdb55] sm:text-7xl">ACAMP’S<br/>2K27.1</h1>
            <p className="mt-3 font-display text-2xl uppercase text-white">Impossível descrever</p>
            <p className="mt-4 text-sm font-bold uppercase">11 a 15 de janeiro · Pousada Recanto do Mar</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-12">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.3em] text-[#ffdb55]">Reviva cada instante</p>
              <h2 className="mt-2 font-display text-4xl uppercase text-[#fff9e8] sm:text-5xl">Galeria do Acamp's</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/55">Escolha um dos cinco dias e encontre os registros feitos com carinho pela equipe de comunicação.</p>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Dias do acampamento">
            {CAMP_DAYS.map((d) => {
              const active = d.day === dia;
              return (
                <Link key={d.day} to="/" search={{ dia: d.day }} className={`group rounded-full border px-4 py-2 transition duration-200 ${active ? "border-[#ffdb55] bg-[#ffdb55] text-[#07465a] shadow-lg shadow-[#ffdb55]/10" : "border-white/10 bg-white/[0.035] text-white/75 hover:border-[#ffdb55]/60 hover:bg-white/[0.07]"}`}>
                  <span className="hidden">Janeiro · 2027</span>
                  <span className="inline text-sm font-bold uppercase">{d.weekday}</span>
                  <span className="ml-2 inline text-xs font-medium opacity-70">{d.date}</span>
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
