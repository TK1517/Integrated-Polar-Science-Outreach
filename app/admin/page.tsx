import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();

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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
                Administration
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Polar Science Portal
              </h1>

              <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
                Manage the portal&apos;s scientific knowledge, research,
                expeditions and media content.
              </p>
            </div>

            <LogoutButton />
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Content Overview
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-sky-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-sm font-medium text-slate-500">
                {section.title}
              </p>

              <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
                {section.count}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {section.description}
              </p>

              <p className="mt-5 text-sm font-medium text-slate-900 dark:text-slate-100">
                Manage →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
