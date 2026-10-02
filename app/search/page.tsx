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

  let results: SearchResult[] = [];

  if (search) {
    const pattern = `%${search}%`;

    const [
      knowledge,
      publications,
      expeditions,
      media,
    ] = await Promise.all([
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
    <main className="min-h-screen bg-slate-50">

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">

          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Integrated Search
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Search Polar Science
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Search knowledge resources, research publications,
            expeditions and media from one place.
          </p>

          <form
            action="/search"
            method="GET"
            className="mt-8 flex gap-3"
          >
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search climate, Antarctica, oceans..."
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />

            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white hover:bg-sky-700"
            >
              Search
            </button>
          </form>

        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">

        {!search ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Start your search
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Search across the portal's knowledge,
              research, expeditions and media.
            </p>
          </div>
        ) : (
          <div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900">
                Search results
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {results.length} results found for "{search}"
              </p>
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">

                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.href}
                    className="block rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-sky-300 hover:shadow-sm"
                  >
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      {result.type}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                      {result.title}
                    </h3>

                    {result.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {result.description}
                      </p>
                    )}

                    <p className="mt-4 text-sm font-medium text-slate-900">
                      View resource →
                    </p>
                  </Link>
                ))}

              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  No results found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try another keyword or search term.
                </p>
              </div>
            )}

          </div>
        )}

      </section>

    </main>
  );
}