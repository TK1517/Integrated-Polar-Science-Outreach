"use client";

import { useRouter, useSearchParams } from "next/navigation";

const regions = ["All", "Arctic", "Antarctica", "Both"];

const categories = [
  "All",
  "Climate",
  "Oceanography",
  "Glaciology",
  "Biology",
  "Atmospheric Science",
  "Geology",
  "Polar Technology",
  "Environmental Science",
];

const resourceTypes = [
  "All",
  "Article",
  "Report",
  "Dataset",
  "Educational Resource",
  "Research Summary",
  "Video",
];

export default function KnowledgeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentRegion = searchParams.get("region") || "All";
  const currentCategory = searchParams.get("category") || "All";
  const currentType = searchParams.get("type") || "All";

  function updateFilter(
    key: string,
    value: string
  ) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/knowledge?${params.toString()}`);
  }

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value.trim()) {
      params.delete("search");
    } else {
      params.set("search", value);
    }

    router.push(`/knowledge?${params.toString()}`);
  }

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">

      <div>
        <label
          htmlFor="knowledge-search"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Search
        </label>

        <input
          id="knowledge-search"
          type="search"
          defaultValue={currentSearch}
          placeholder="Search polar science knowledge..."
          onChange={(event) =>
            updateSearch(event.target.value)
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">

        <FilterSelect
          label="Region"
          value={currentRegion}
          options={regions}
          onChange={(value) =>
            updateFilter("region", value)
          }
        />

        <FilterSelect
          label="Topic"
          value={currentCategory}
          options={categories}
          onChange={(value) =>
            updateFilter("category", value)
          }
        />

        <FilterSelect
          label="Resource Type"
          value={currentType}
          options={resourceTypes}
          onChange={(value) =>
            updateFilter("type", value)
          }
        />

      </div>

    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}