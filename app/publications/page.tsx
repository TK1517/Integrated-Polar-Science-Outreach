import { supabase } from "@/lib/supabase/client";
import PublicationCard from "@/components/publications/PublicationCard";
import PublicationFilters from "@/components/publications/PublicationFilters";
import {
  emptyUuid,
  getConnectedRecordIds,
} from "@/lib/knowledge-graph";

type PublicationsPageProps = {
  searchParams: Promise<{
    search?: string;
    region?: string;
    area?: string;
    year?: string;
    resource_ids?: string;
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
  const connectedPublicationIds = await getConnectedRecordIds(
    params.resource_ids,
    "publication"
  );

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

  if (connectedPublicationIds) {
    query = query.in(
      "id",
      connectedPublicationIds.length > 0
        ? connectedPublicationIds
        : [emptyUuid]
    );
  }

  const { data, error } = await query;

  return (
    <main className="theme-page min-h-screen bg-slate-950 text-white dark:bg-slate-950">
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Research Repository
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Polar Research & Publications
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Explore research publications, scientific studies and
            knowledge produced through polar research.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-sky-500/[0.035] blur-3xl" />

        <div className="relative">
          <PublicationFilters />

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-white">
              Research Publications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {data?.length || 0} publications found
            </p>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-sm text-red-300 backdrop-blur-xl">
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
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-12 text-center backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">
                No publications found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
