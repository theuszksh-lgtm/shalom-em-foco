import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#075a70]/85 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" search={{ dia: 1 }} className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffdb55]/50 bg-[#ffdb55]/10 text-[#ffe477] transition group-hover:bg-[#ffdb55]/20">✦</span>
          <span>
            <span className="block font-display text-2xl leading-none tracking-wide text-[#fff9e8]">ACAMPS 2K27.1</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">Acamp's · fotos oficiais</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link to="/participante" className="rounded-full px-4 py-2 text-white/75 transition hover:bg-white/10 hover:text-white">Participante</Link>
          <Link to="/comunicacao" className="rounded-full border border-[#ffdb55]/50 bg-[#ffdb55] px-4 py-2 text-[#07465a] transition hover:bg-[#ffed91]">Comunicação</Link>
        </nav>
      </div>
    </header>
  );
}
