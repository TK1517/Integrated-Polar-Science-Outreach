import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { notFound } from "next/navigation";

type KnowledgeDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function KnowledgeDetailPage({
  params,
}: KnowledgeDetailProps) {
  const { id } = await params;

  const { data: resource, error } = await supabase
    .from("knowledge_resources")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error || !resource) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <Link
            href="/knowledge"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to Knowledge Repository
          </Link>

          <div className="mt-8 flex flex-wrap gap-3">
            {resource.category && (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                {resource.category}
              </span>
            )}

            {resource.region && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {resource.region}
              </span>
            )}

            {resource.resource_type && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {resource.resource_type}
              </span>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {resource.title}
          </h1>

          {resource.description && (
            <p className="mt-6 text-xl leading-8 text-slate-500">
              {resource.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
            {resource.author && (
              <div>
                <span className="font-medium text-slate-700">
                  Author
                </span>
                <br />
                {resource.author}
              </div>
            )}

            {resource.published_date && (
              <div>
                <span className="font-medium text-slate-700">
                  Published
                </span>
                <br />
                {new Date(
                  resource.published_date
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12">
          <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
            {resource.content ||
              "Detailed content for this resource will be available soon."}
          </div>

          {resource.external_url && (
            <div className="mt-10 border-t border-slate-200 pt-8">
              <a
                href={resource.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Visit External Resource →
              </a>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}