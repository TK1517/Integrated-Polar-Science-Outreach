import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default async function AdminPage() {
  const [
    knowledgeResponse,
    publicationsResponse,
    expeditionsResponse,
    mediaResponse,
  ] = await Promise.all([
    supabase
      .from("knowledge_resources")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("publications")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("expeditions")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("media")
      .select("id", { count: "exact", head: true }),
  ]);

  const sections = [
    {
      title: "Knowledge",
      count: knowledgeResponse.count ?? 0,
      description: "Educational resources and science articles.",
      href: "/admin/knowledge",
    },
    {
      title: "Research",
      count: publicationsResponse.count ?? 0,
      description: "Research publications and scientific work.",
      href: "/admin/publications",
    },
    {
      title: "Expeditions",
      count: expeditionsResponse.count ?? 0,
      description: "Polar missions and field expeditions.",
      href: "/admin/expeditions",
    },
    {
      title: "Media",
      count: mediaResponse.count ?? 0,
      description: "Videos, photo stories and other media.",
      href: "/admin/media",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">

          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Polar Science Portal
          </h1>

          <p className="mt-4 max-w-2xl text-slate-500">
            Manage the portal's scientific knowledge, research,
            expeditions and media content.
          </p>

        </div>
      </section>

      {/* Dashboard */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <h2 className="text-xl font-semibold text-slate-900">
          Content Overview
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-sky-300 hover:shadow-sm"
            >

              <p className="text-sm font-medium text-slate-500">
                {section.title}
              </p>

              <p className="mt-3 text-4xl font-semibold text-slate-950">
                {section.count}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {section.description}
              </p>

              <p className="mt-5 text-sm font-medium text-slate-900">
                Manage →
              </p>

            </Link>
          ))}

        </div>

      </section>

    </main>
  );
}