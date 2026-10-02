import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

import EditExpeditionForm from "./EditExpeditionForm";
import DeleteExpeditionButton from "./DeleteExpeditionButton";
import { updateExpedition, deleteExpedition } from "./actions";

async function createExpedition(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const expeditionNumber = String(
    formData.get("expedition_number") || ""
  ).trim();
  const yearValue = String(formData.get("year") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const startDate = String(formData.get("start_date") || "").trim();
  const endDate = String(formData.get("end_date") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const objectives = String(formData.get("objectives") || "").trim();
  const researchAreas = String(
    formData.get("research_areas") || ""
  ).trim();
  const participatingInstitutions = String(
    formData.get("participating_institutions") || ""
  ).trim();
  const coverImageUrl = String(
    formData.get("cover_image_url") || ""
  ).trim();

  const published = formData.get("published") === "on";

  if (!name) {
    throw new Error("Expedition name is required.");
  }

  const year = yearValue ? Number(yearValue) : null;

  if (yearValue && Number.isNaN(year)) {
    throw new Error("Year must be a valid number.");
  }

  const { error } = await supabase.from("expeditions").insert({
    name,
    expedition_number: expeditionNumber || null,
    year,
    region: region || null,
    start_date: startDate || null,
    end_date: endDate || null,
    location: location || null,
    description: description || null,
    objectives: objectives || null,
    research_areas: researchAreas || null,
    participating_institutions:
      participatingInstitutions || null,
    cover_image_url: coverImageUrl || null,
    published,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/expeditions");
  revalidatePath("/expeditions");
}

export default async function AdminExpeditionsPage() {
  const { data: expeditions, error } = await supabase
    .from("expeditions")
    .select("*")
    .order("year", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Manage Expeditions
          </h1>

          <p className="mt-3 text-slate-500">
            Add and manage polar research expeditions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Add Expedition */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-950">
            Add Expedition
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add a new polar research expedition to the repository.
          </p>

          <form
            action={createExpedition}
            className="mt-8 space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Expedition Name *
                </label>

                <input
                  name="name"
                  required
                  placeholder="Antarctic Research Expedition"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Expedition Number */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Expedition Number
                </label>

                <input
                  name="expedition_number"
                  placeholder="Expedition 01"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Year */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Year
                </label>

                <input
                  name="year"
                  type="number"
                  placeholder="2026"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Region */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Region
                </label>

                <select
  name="region"
  defaultValue=""
  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
>
  <option value="">Select region</option>
  <option value="Arctic">Arctic</option>
  <option value="Antarctica">Antarctica</option>
  <option value="Both">Both</option>
</select>
              </div>

              {/* Start Date */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  name="start_date"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  End Date
                </label>

                <input
                  type="date"
                  name="end_date"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Location
                </label>

                <input
                  name="location"
                  placeholder="Antarctica Research Station"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Cover Image */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Cover Image URL
                </label>

                <input
                  name="cover_image_url"
                  type="url"
                  placeholder="https://..."
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                placeholder="Describe the expedition..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            {/* Objectives */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Scientific Objectives
              </label>

              <textarea
                name="objectives"
                rows={5}
                placeholder="What are the main scientific objectives?"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            {/* Research Areas */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Research Areas
              </label>

              <textarea
                name="research_areas"
                rows={4}
                placeholder="Climate science, glaciology, oceanography..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            {/* Institutions */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Participating Institutions
              </label>

              <textarea
                name="participating_institutions"
                rows={4}
                placeholder="Institutions participating in the expedition..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            {/* Published */}
            <div>
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="published"
                  className="h-4 w-4"
                />

                Published
              </label>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Expedition
            </button>
          </form>
        </div>

        {/* Existing Expeditions */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-950">
            Existing Expeditions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {expeditions?.length || 0} expedition(s) in the
            repository.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">
              Unable to load expeditions.
            </p>

            <p className="mt-2">{error.message}</p>
          </div>
        ) : expeditions && expeditions.length > 0 ? (
          <div className="mt-6 space-y-5">
            {expeditions.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
  <div>
    <h3 className="text-xl font-semibold text-slate-950">
      {item.name}
    </h3>

    {item.description && (
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {item.description}
      </p>
    )}

    <div className="mt-4 flex flex-wrap gap-2">
      {item.expedition_number && (
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
          {item.expedition_number}
        </span>
      )}

      {item.region && (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          {item.region}
        </span>
      )}

      {item.year && (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          {item.year}
        </span>
      )}

      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          item.published
            ? "bg-green-50 text-green-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {item.published ? "Published" : "Draft"}
      </span>
    </div>
  </div>

  <div className="flex shrink-0 gap-3">
  <EditExpeditionForm
    expedition={{
      id: item.id,
      name: item.name,
      expedition_number: item.expedition_number,
      year: item.year,
      region: item.region,
      start_date: item.start_date,
      end_date: item.end_date,
      location: item.location,
      description: item.description,
      objectives: item.objectives,
      research_areas: item.research_areas,
      participating_institutions:
        item.participating_institutions,
      cover_image_url: item.cover_image_url,
      published: item.published,
    }}
    updateAction={updateExpedition}
  />

  <DeleteExpeditionButton
    expeditionId={item.id}
    expeditionName={item.name}
    deleteAction={deleteExpedition}
  />
</div>
</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              No expeditions found.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}