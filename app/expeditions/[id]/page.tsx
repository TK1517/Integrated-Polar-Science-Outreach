import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { notFound } from "next/navigation";

type ExpeditionDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExpeditionDetailPage({
  params,
}: ExpeditionDetailProps) {
  const { id } = await params;

  const { data: expedition, error } = await supabase
    .from("expeditions")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error || !expedition) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-5xl px-6 py-14">

          <Link
            href="/expeditions"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to Expeditions
          </Link>

          <div className="mt-8 flex flex-wrap gap-3">

            {expedition.region && (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                {expedition.region}
              </span>
            )}

            {expedition.status && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {expedition.status}
              </span>
            )}

          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {expedition.title}
          </h1>

          {expedition.location && (
            <p className="mt-5 text-lg text-slate-600">
              📍 {expedition.location}
            </p>
          )}

          {expedition.institution && (
            <p className="mt-2 text-sm text-slate-500">
              {expedition.institution}
            </p>
          )}

        </div>

      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">

        <article className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12">

          <h2 className="text-xl font-semibold text-slate-900">
            About the Expedition
          </h2>

          <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-600">
            {expedition.description ||
              "Expedition information will be available soon."}
          </p>

          <div className="mt-10 grid gap-6 border-t border-slate-200 pt-8 sm:grid-cols-2">

            {expedition.start_date && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Start Date
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {new Date(
                    expedition.start_date
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}

            {expedition.end_date && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  End Date
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {new Date(
                    expedition.end_date
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}

          </div>

          {expedition.objectives && (
            <div className="mt-10 border-t border-slate-200 pt-8">

              <h2 className="text-xl font-semibold text-slate-900">
                Research Objectives
              </h2>

              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-600">
                {expedition.objectives}
              </p>

            </div>
          )}

          {expedition.external_url && (
            <div className="mt-10 border-t border-slate-200 pt-8">

              <a
                href={expedition.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Visit Expedition Resource →
              </a>

            </div>
          )}

        </article>

      </section>

    </main>
  );
}