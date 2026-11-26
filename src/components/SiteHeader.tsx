import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#075a70]/85 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-4 sm:gap-4 sm:px-5">
        <Link to="/" search={{ dia: 1 }} className="group flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex shrink-0 items-center gap-2"><img src="/pjj.png" alt="PJJ Sobral" className="h-10 w-10 rounded-lg object-contain sm:h-12 sm:w-12" /><img src="/acamps%20-logo.png" alt="Acamps" className="h-12 w-24 object-contain sm:h-16 sm:w-32" /></span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link to="/participante" className="rounded-full px-2 py-2 sm:px-4 text-white/75 transition hover:bg-white/10 hover:text-white">Galeria</Link>
          <Link to="/comunicacao" className="rounded-full border border-[#ffdb55]/50 bg-[#ffdb55] px-2 py-2 sm:px-4 text-[#07465a] transition hover:bg-[#ffed91]">Fotógrafos</Link>
        </nav>
      </div>
    </header>
  );
}
