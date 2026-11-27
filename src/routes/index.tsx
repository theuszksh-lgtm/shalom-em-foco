import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Download, X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
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

const backgroundPhotosByDay = [
  [
    "ACAMP'S 2K25.1-52.jpg",
    "ACAMP'S 2K25.1-66.jpg",
    "ACAMP'S 2K25.1-179.jpg",
    "IMG_4707.jpg",
    "Acamps missa -08.jpg",
    "Acamps lazer-035.jpg"
  ],
  [
    "Acamps lazer-022.jpg",
    "Acamps lazer-039.jpg",
    "Acamps lazer-044.jpg",
    "Acamps lazer-128.jpg"
  ],
  [
    "Acamps missa -22.jpg",
    "Canto das Irias -010.jpg",
    "IMG_5849.jpg"
  ],
  [
    "IMG_5858.jpg",
    "Lazer -061.jpg",
    "Lazer -120.jpg"
  ],
  [
    "Missa Quarta -19.jpg",
    "Swing leva -79.jpg",
    "Swing leva -86.jpg"
  ]
];

function Index() {
  const { dia } = Route.useSearch();
  const { data, isLoading, error } = useQuery(photosQuery(dia));
  const [open, setOpen] = useState<Photo | null>(null);
  const openIndex = data?.findIndex(p => p.id === open?.id) ?? -1;
  const previous = openIndex > 0 ? data?.[openIndex - 1] : undefined;
  const next = openIndex >= 0 ? data?.[openIndex + 1] : undefined;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft" && previous) { e.preventDefault(); setOpen(previous); }
      if (e.key === "ArrowRight" && next) { e.preventDefault(); setOpen(next); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, previous, next]);
  const [heroFade, setHeroFade] = useState(0);
  useEffect(() => {
    let frame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      frame = 0;
      setHeroFade(reduced.matches ? 0 : Math.min(1, Math.max(0, window.scrollY / 65)));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    reduced.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      reduced.removeEventListener("change", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  const current = CAMP_DAYS[dia - 1];
  const backgroundPhotos = backgroundPhotosByDay[dia - 1] ?? backgroundPhotosByDay[0];

  return (
    <div className="relative isolate min-h-screen bg-[#087e96] text-[#fff9e8] [background-image:radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:16px_16px]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className={`grid h-full w-full ${backgroundPhotos.length === 6 ? "grid-cols-2 grid-rows-3 sm:grid-cols-3 sm:grid-rows-2" : backgroundPhotos.length === 4 ? "grid-cols-2 grid-rows-2" : "grid-cols-1 grid-rows-3 sm:grid-cols-3 sm:grid-rows-1"}`}>
          {backgroundPhotos.map((name) => (
            <div key={name} className="relative min-h-0 min-w-0 overflow-hidden">
              <img src={"/" + encodeURIComponent(name)} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-[#075a70]/55" />
      </div>
      <SiteHeader />
      <main>
        <section className="relative isolate mx-auto flex max-w-6xl flex-col items-center gap-8 overflow-hidden rounded-2xl px-6 py-10 sm:flex-row sm:py-12">
          <img src="/image.png" alt="Arte oficial do Acamps — Um pedacinho do céu" className="w-48 shrink-0 rounded-xl shadow-2xl sm:w-56" style={{ opacity: 1 - heroFade, filter: `blur(${heroFade * 12}px)`, transform: `translateY(${heroFade * -18}px) scale(${1 - heroFade * 0.09}) rotate(-3deg)`, willChange: "opacity, transform, filter" }} />
          <div className="text-center sm:text-left">
            <span className="rounded-full bg-[#fff9e8] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#075a70]">Fotos oficiais</span>
            <h1 className="mt-4 font-display text-5xl uppercase leading-none text-[#ffdb55] sm:text-7xl">ACAMP’S<br/>2K27.1</h1>
            <p className="mt-3 font-display text-2xl uppercase text-white">Um pedacinho do céu</p>
            <p className="mt-4 text-sm font-bold uppercase">11 a 15 de janeiro · Pousada Recanto do Mar</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl rounded-2xl bg-[#075a70]/35 px-5 py-6 pb-12 backdrop-blur-[2px]">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.3em] text-[#ffdb55]">Reviva cada instante</p>
              <h2 className="mt-2 font-display text-4xl uppercase text-[#fff9e8] sm:text-5xl">Galeria do Acamp's</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/85">Escolha um dos cinco dias e encontre os registros feitos com carinho pela equipe de comunicação.</p>
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
            <span className="text-xs font-semibold uppercase tracking-[.2em] text-white/75">Fotos oficiais</span>
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
        {previous && <button type="button" aria-label="Foto anterior" onClick={e => { e.stopPropagation(); setOpen(previous); }} className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white ring-1 ring-white/30 hover:bg-white/20 sm:left-6"><ChevronLeft /></button>}
        {next && <button type="button" aria-label="Próxima foto" onClick={e => { e.stopPropagation(); setOpen(next); }} className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white ring-1 ring-white/30 hover:bg-white/20 sm:right-6"><ChevronRight /></button>}
        <figure className="max-h-full max-w-5xl w-full px-8 sm:px-14" onClick={(e) => e.stopPropagation()}>
          <img src={open.url} alt={open.caption ?? ""} className="mx-auto max-h-[80vh] max-w-full rounded-xl object-contain" />
          <figcaption className="mt-3 flex items-center justify-between gap-4 text-white">
            <span>{open.caption} {openIndex >= 0 && <small className="block text-white/70">{openIndex + 1} / {data?.length}</small>}</span>
            <a href={open.url} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#ffdb55] px-4 py-2 text-sm font-bold text-[#07465a]"><Download className="h-4 w-4" /> Baixar</a>
          </figcaption>
        </figure>
      </div>}
    </div>
  );
}
