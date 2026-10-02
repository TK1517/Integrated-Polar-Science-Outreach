import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { notFound } from "next/navigation";

type PublicationDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicationDetailPage({
  params,
}: PublicationDetailProps) {
  const { id } = await params;

  const { data: publication, error } = await supabase
    .from("publications")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error || !publication) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <Link
            href="/publications"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to Research Repository
          </Link>

          <div className="mt-8 flex flex-wrap gap-3">
            {publication.research_area && (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                {publication.research_area}
              </span>
            )}

            {publication.region && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {publication.region}
              </span>
            )}

            {publication.publication_year && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {publication.publication_year}
              </span>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {publication.title}
          </h1>

          {publication.authors && (
            <p className="mt-6 text-lg font-medium text-slate-700">
              {publication.authors}
            </p>
          )}

          {publication.institution && (
            <p className="mt-2 text-sm text-slate-500">
              {publication.institution}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Abstract
          </h2>

          <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-600">
            {publication.abstract ||
              "Abstract information will be available soon."}
          </p>

          {publication.keywords && (
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Keywords
              </h2>

              <p className="mt-3 text-sm text-slate-600">
                {publication.keywords}
              </p>
            </div>
          )}

          <div className="mt-10 grid gap-6 border-t border-slate-200 pt-8 sm:grid-cols-2">
            {publication.doi && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  DOI
                </p>

                <p className="mt-2 break-all text-sm text-slate-700">
                  {publication.doi}
                </p>
              </div>
            )}

            {publication.publication_year && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Publication Year
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {publication.publication_year}
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            {publication.pdf_url && (
              <a
                href={publication.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                View PDF →
              </a>
            )}

            {publication.external_url && (
              <a
                href={publication.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                External Source →
              </a>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}