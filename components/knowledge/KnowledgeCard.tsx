import Link from "next/link";

type KnowledgeCardProps = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  resourceType: string | null;
  region: string | null;
  publishedDate: string | null;
};

export default function KnowledgeCard({
  id,
  title,
  description,
  category,
  resourceType,
  region,
  publishedDate,
}: KnowledgeCardProps) {
  return (
    <Link
      href={`/knowledge/${id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          {category || "General"}
        </span>

        {region && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {region}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-xl font-semibold leading-7 text-slate-900 group-hover:text-sky-700 dark:text-slate-100">
        {title}
      </h2>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description || "Explore this polar science resource."}
      </p>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            {resourceType || "Resource"}
          </span>

          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Read resource →
          </span>
        </div>

        {publishedDate && (
          <p className="mt-3 text-xs text-slate-400">
            {new Date(publishedDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}
