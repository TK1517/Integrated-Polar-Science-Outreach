import Link from "next/link";

const navigation = [
  { name: "Knowledge", href: "/knowledge" },
  { name: "Research", href: "/publications" },
  { name: "Expeditions", href: "/expeditions" },
  { name: "Media", href: "/media" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            ❄
          </div>

          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900">
              Polar Science
            </div>

            <div className="text-xs text-slate-500">
              India
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/search"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Search
          </Link>
        </nav>

        <button
          className="rounded-lg border border-slate-200 px-3 py-2 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

      </div>
    </header>
  );
}