"use client";

import { useState } from "react";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string | null;
  resource_type: string | null;
  region: string | null;
  author: string | null;
  published_date: string | null;
  image_url: string | null;
  external_url: string | null;
  featured: boolean;
  published: boolean;
};

type Props = {
  resource: Resource;
  updateAction: (formData: FormData) => Promise<void>;
};

export default function EditKnowledgeForm({
  resource,
  updateAction,
}: Props) {
  const [open, setOpen] = useState(false);

  const publishedDate = resource.published_date
    ? resource.published_date.substring(0, 10)
    : "";

  return (
    <>
      {/* EDIT BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Edit
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-6">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Edit Resource
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the knowledge resource details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {/* FORM */}
            <form
              action={updateAction}
              className="mt-6 space-y-6"
            >
              {/* ID */}
              <input
                type="hidden"
                name="id"
                value={resource.id}
              />

              {/* TITLE */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Title *
                </label>

                <input
                  type="text"
                  name="title"
                  defaultValue={resource.title}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  defaultValue={resource.description ?? ""}
                  required
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
                />
              </div>

              {/* CONTENT */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Content
                </label>

                <textarea
                  name="content"
                  defaultValue={resource.content ?? ""}
                  rows={10}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
                />
              </div>

              {/* CATEGORY + RESOURCE TYPE */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    defaultValue={resource.category ?? ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Resource Type
                  </label>

                  <input
                    type="text"
                    name="resource_type"
                    defaultValue={resource.resource_type ?? ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>

              </div>

              {/* REGION + AUTHOR */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Region
                  </label>

                  <input
                    type="text"
                    name="region"
                    defaultValue={resource.region ?? ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Author
                  </label>

                  <input
                    type="text"
                    name="author"
                    defaultValue={resource.author ?? ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>

              </div>

              {/* DATE + IMAGE */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Published Date
                  </label>

                  <input
                    type="date"
                    name="published_date"
                    defaultValue={publishedDate}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Image URL
                  </label>

                  <input
                    type="url"
                    name="image_url"
                    defaultValue={resource.image_url ?? ""}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                  />
                </div>

              </div>

              {/* EXTERNAL URL */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  External URL
                </label>

                <input
                  type="url"
                  name="external_url"
                  defaultValue={resource.external_url ?? ""}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-500"
                />
              </div>

              {/* STATUS */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-medium text-slate-700">
                  Resource Status
                </p>

                <div className="flex gap-8">

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="published"
                      value="true"
                      defaultChecked={resource.published}
                      className="h-4 w-4"
                    />

                    Published
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="featured"
                      value="true"
                      defaultChecked={resource.featured}
                      className="h-4 w-4"
                    />

                    Featured
                  </label>

                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
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