import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

type SearchResult = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  href: string;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const search = params.q?.trim() || "";

  const results: SearchResult[] = [];

  if (search) {
    const pattern = `%${search}%`;

    const [knowledge, publications, expeditions, media] = await Promise.all([
      supabase
        .from("knowledge_resources")
        .select("id, title, description")
        .eq("published", true)
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(10),

      supabase
        .from("publications")
        .select("id, title, description")
        .eq("published", true)
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(10),

      supabase
        .from("expeditions")
        .select("id, title, description")
        .eq("published", true)
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(10),

      supabase
        .from("media")
        .select("id, title, description")
        .eq("published", true)
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(10),
    ]);

    if (knowledge.data) {
      results.push(
        ...knowledge.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: "Knowledge",
          href: `/knowledge/${item.id}`,
        }))
      );
    }

    if (publications.data) {
      results.push(
        ...publications.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: "Research",
          href: `/publications/${item.id}`,
        }))
      );
    }

    if (expeditions.data) {
      results.push(
        ...expeditions.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: "Expedition",
          href: `/expeditions/${item.id}`,
        }))
      );
    }

    if (media.data) {
      results.push(
        ...media.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: "Media",
          href: `/media/${item.id}`,
        }))
      );
    }
  }

  return (
    <main className="theme-page min-h-screen bg-slate-950 text-white dark:bg-slate-950">
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 animate-pulse rounded-full bg-cyan-400/10 blur-3xl [animation-delay:700ms]" />

        <div className="relative mx-auto max-w-5xl px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Integrated Search
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Search Polar Science
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Search knowledge resources, research publications,
            expeditions and media from one place.
          </p>

          <form action="/search" method="GET" className="mt-8 flex gap-3">
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search climate, Antarctica, oceans..."
              className="flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-slate-500 transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />

            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-sky-500/[0.035] blur-3xl" />

        <div className="relative">
          {!search ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-12 text-center backdrop-blur-xl transition duration-300 hover:border-cyan-400/30 hover:bg-white/[0.05]">
              <h2 className="text-lg font-semibold text-white">
                Start your search
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Search across the portal&apos;s knowledge,
                research, expeditions and media.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white">
                  Search results
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {results.length} results found for &quot;{search}&quot;
                </p>
              </div>

              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.href}
                      className="group block rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:shadow-[0_0_30px_rgba(34,211,238,0.06)]"
                    >
                      <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1 text-xs font-semibold text-cyan-300">
                        {result.type}
                      </span>

                      <h3 className="mt-4 text-xl font-semibold text-white transition group-hover:text-cyan-300">
                        {result.title}
                      </h3>

                      {result.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                          {result.description}
                        </p>
                      )}

                      <p className="mt-4 text-sm font-medium text-cyan-300">
                        View resource →
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-12 text-center backdrop-blur-xl transition duration-300 hover:border-cyan-400/30">
                  <h2 className="text-lg font-semibold text-white">
                    No results found
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Try another keyword or search term.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
