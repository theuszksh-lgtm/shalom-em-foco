import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, X } from "lucide-react";
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
      { title: "Galeria oficial — Acamp's Shalom" },
      { name: "description", content: "Veja as fotos oficiais de cada dia do Acampamento de Jovens Shalom, de 11 a 15 de janeiro." },
      { property: "og:title", content: "Galeria oficial — Acamp's Shalom" },
      { property: "og:description", content: "As fotos oficiais dos 5 dias do Acamp's, pela Comunidade Católica Shalom." },
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
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/80">Acampamento de Jovens Shalom</p>
        <h1 className="mt-3 text-6xl uppercase leading-none text-primary sm:text-8xl">Impossível descrever</h1>
        <p className="mt-4 inline-block rounded-md bg-secondary px-4 py-1.5 text-sm font-bold uppercase text-secondary-foreground">
          11 a 15 de janeiro · Pousada Recanto do Mar
        </p>
        <p className="mx-auto mt-5 max-w-xl text-foreground/90">
          As fotos oficiais do Acamp's, oferecido pela Comunidade Católica Shalom. Escolha o dia e reviva cada momento.
        </p>
      </section>

      <nav className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4" aria-label="Dias do acampamento">
        {CAMP_DAYS.map((d) => {
          const active = d.day === dia;
          return (
            <Link
              key={d.day}
              to="/"
              search={{ dia: d.day }}
              className={`rounded-xl border-2 px-5 py-3 text-left transition ${active ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-pop)]" : "border-border bg-card text-card-foreground hover:border-primary"}`}
            >
              <span className="block font-display text-2xl uppercase leading-none">{d.weekday}</span>
              <span className="text-xs font-semibold opacity-80">{d.date}</span>
            </Link>
          );
        })}
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-3xl uppercase text-foreground">{current?.weekday} — {current?.date}</h2>
        {isLoading && (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="mb-3 h-48 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        )}
        {error && <p className="text-foreground">Não foi possível carregar as fotos agora.</p>}
        {data && data.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <p className="font-display text-3xl uppercase text-primary">Em breve</p>
            <p className="mt-2 text-foreground/80">As fotos deste dia ainda estão sendo preparadas pela equipe de comunicação.</p>
          </div>
        )}
        {data && data.length > 0 && (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {data.map((p) => (
              <button key={p.id} onClick={() => setOpen(p)} className="mb-3 block w-full overflow-hidden rounded-xl bg-muted">
                <img src={p.url} alt={p.caption ?? `Foto do dia ${dia}`} loading="lazy" className="w-full transition duration-300 hover:scale-105" />
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-foreground/80">
        Comunidade Católica Shalom · Acamp's
      </footer>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-popover/95 p-4" onClick={() => setOpen(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-card p-2 text-card-foreground" aria-label="Fechar"><X /></button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={open.url} alt={open.caption ?? ""} className="max-h-[80vh] rounded-lg object-contain" />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-popover-foreground">
              <span>{open.caption}</span>
              <a href={open.url} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                <Download className="h-4 w-4" /> Baixar
              </a>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
