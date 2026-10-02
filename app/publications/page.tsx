import { supabase } from "@/lib/supabase/client";
import PublicationCard from "@/components/publications/PublicationCard";
import PublicationFilters from "@/components/publications/PublicationFilters";

type PublicationsPageProps = {
  searchParams: Promise<{
    search?: string;
    region?: string;
    area?: string;
    year?: string;
  }>;
};

export default async function PublicationsPage({
  searchParams,
}: PublicationsPageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const region = params.region || "";
  const area = params.area || "";
  const year = params.year || "";

  let query = supabase
    .from("publications")
    .select("*")
    .eq("published", true)
    .order("publication_year", {
      ascending: false,
    });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,authors.ilike.%${search}%,abstract.ilike.%${search}%`
    );
  }

  if (region) {
    query = query.eq("region", region);
  }

  if (area) {
    query = query.eq("research_area", area);
  }

  if (year) {
    query = query.eq("publication_year", Number(year));
  }

  const { data, error } = await query;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Research Repository
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Polar Research & Publications
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Explore research publications, scientific studies and
            knowledge produced through polar research.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <PublicationFilters />

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">
            Research Publications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {data?.length || 0} publications found
          </p>
        </div>

        {error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Unable to load publications.
            <br />
            {error.message}
          </div>
        ) : data && data.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((publication) => (
              <PublicationCard
                key={publication.id}
                id={publication.id}
                title={publication.title}
                authors={publication.authors}
                institution={publication.institution}
                abstract={publication.abstract}
                researchArea={publication.research_area}
                region={publication.region}
                year={publication.publication_year}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No publications found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}