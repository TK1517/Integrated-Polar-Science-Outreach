"use client";

import { useState } from "react";

type Expedition = {
  id: string;
  name: string;
  expedition_number: string | null;
  year: number | null;
  region: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  description: string | null;
  objectives: string | null;
  research_areas: string | null;
  participating_institutions: string | null;
  cover_image_url: string | null;
  published: boolean | null;
};

type Props = {
  expedition: Expedition;
  updateAction: (formData: FormData) => Promise<void>;
};

export default function EditExpeditionForm({
  expedition,
  updateAction,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-6">
          <div className="mx-auto my-8 w-full max-w-3xl rounded-2xl bg-white p-7 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Edit Expedition
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the expedition information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form
              action={updateAction}
              className="mt-7 space-y-6"
            >
              <input
                type="hidden"
                name="id"
                value={expedition.id}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Expedition Name *
                  </label>

                  <input
                    name="name"
                    required
                    defaultValue={expedition.name}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Expedition Number
                  </label>

                  <input
                    name="expedition_number"
                    defaultValue={
                      expedition.expedition_number || ""
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Year
                  </label>

                  <input
                    name="year"
                    type="number"
                    defaultValue={expedition.year ?? ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Region
                  </label>

                  <select
  name="region"
  defaultValue={expedition.region || ""}
  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
>
  <option value="">Select region</option>
  <option value="Arctic">Arctic</option>
  <option value="Antarctica">Antarctica</option>
  <option value="Both">Both</option>
</select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    defaultValue={expedition.start_date || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="end_date"
                    defaultValue={expedition.end_date || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Location
                  </label>

                  <input
                    name="location"
                    defaultValue={expedition.location || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Cover Image URL
                  </label>

                  <input
                    name="cover_image_url"
                    type="url"
                    defaultValue={
                      expedition.cover_image_url || ""
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={4}
                  defaultValue={expedition.description || ""}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Scientific Objectives
                </label>

                <textarea
                  name="objectives"
                  rows={5}
                  defaultValue={expedition.objectives || ""}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Research Areas
                </label>

                <textarea
                  name="research_areas"
                  rows={4}
                  defaultValue={expedition.research_areas || ""}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Participating Institutions
                </label>

                <textarea
                  name="participating_institutions"
                  rows={4}
                  defaultValue={
                    expedition.participating_institutions || ""
                  }
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={Boolean(expedition.published)}
                  className="h-4 w-4"
                />

                Published
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}