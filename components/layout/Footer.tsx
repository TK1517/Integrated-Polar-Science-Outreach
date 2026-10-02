import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-10 md:grid-cols-4">

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold">
              Polar Science Portal
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
              A unified digital gateway for exploring polar science,
              research, expeditions, knowledge and media.
            </p>
          </div>

          <div>
            <h3 className="font-medium">
              Explore
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link className="block hover:text-white" href="/knowledge">
                Knowledge
              </Link>

              <Link className="block hover:text-white" href="/publications">
                Research
              </Link>

              <Link className="block hover:text-white" href="/expeditions">
                Expeditions
              </Link>

              <Link className="block hover:text-white" href="/media">
                Media
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium">
              Portal
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link className="block hover:text-white" href="/about">
                About
              </Link>

              <Link className="block hover:text-white" href="/search">
                Search
              </Link>

              <Link className="block hover:text-white" href="/admin">
                Admin
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © 2026 Polar Science Portal. MVP demonstration.
        </div>

      </div>
    </footer>
  );
}