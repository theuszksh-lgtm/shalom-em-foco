import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" search={{ dia: 1 }} className="flex items-baseline gap-2">
          <span className="font-display text-2xl text-foreground">ACAMP'S</span>
          <span className="hidden text-xs font-semibold uppercase tracking-widest text-primary sm:inline">Fotos oficiais</span>
        </Link>
        <nav className="flex gap-2 text-sm font-semibold">
          <Link to="/" search={{ dia: 1 }} className="rounded-full px-4 py-2 text-foreground hover:bg-muted" activeOptions={{ includeSearch: false }} activeProps={{ className: "bg-muted" }}>Galeria</Link>
          <Link to="/comunicacao" className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground hover:opacity-90">Comunicação</Link>
        </nav>
      </div>
    </header>
  );
}
