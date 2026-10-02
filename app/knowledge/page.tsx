import { supabase } from "@/lib/supabase/client";
import KnowledgeCard from "@/components/knowledge/KnowledgeCard";
import KnowledgeFilters from "@/components/knowledge/KnowledgeFilters";

type KnowledgePageProps = {
  searchParams: Promise<{
    search?: string;
    region?: string;
    category?: string;
    type?: string;
  }>;
};

export default async function KnowledgePage({
  searchParams,
}: KnowledgePageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const region = params.region || "";
  const category = params.category || "";
  const type = params.type || "";

  let query = supabase
    .from("knowledge_resources")
    .select("*")
    .eq("published", true)
    .order("published_date", {
      ascending: false,
    });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (region) {
    query = query.eq("region", region);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (type) {
    query = query.eq("resource_type", type);
  }

  const { data, error } = await query;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Knowledge Repository
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Explore Polar Science
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Discover scientific knowledge, educational resources,
            research summaries and information from the Arctic and
            Antarctic regions.
          </p>

        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        <KnowledgeFilters />

        <div className="mt-10 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Knowledge Resources
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {data?.length || 0} resources found
            </p>
          </div>

        </div>

        {error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Unable to load knowledge resources.
            <br />
            {error.message}
          </div>
        ) : data && data.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {data.map((item) => (
              <KnowledgeCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                resourceType={item.resource_type}
                region={item.region}
                publishedDate={item.published_date}
              />
            ))}

          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <h3 className="text-lg font-semibold text-slate-900">
              No resources found
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