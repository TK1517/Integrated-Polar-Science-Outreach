"use client";

import { useState } from "react";

type Media = {
  id: string;
  title: string;
  media_type: string;
  description: string | null;
  content: string | null;
  published_date: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  external_url: string | null;
  featured: boolean;
  published: boolean;
};

type Props = {
  media: Media;
  updateAction: (formData: FormData) => Promise<void>;
};

export default function EditMediaForm({
  media,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-950">
                Edit Media
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form action={updateAction} className="mt-8 space-y-6">
              <input
                type="hidden"
                name="id"
                value={media.id}
              />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Title *
                  </label>

                  <input
                    name="title"
                    required
                    defaultValue={media.title}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                {/* Media Type */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Media Type *
                  </label>

                  <select
                    name="media_type"
                    required
                    defaultValue={media.media_type}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
                  >
                    <option value="News">News</option>
                    <option value="Video">Video</option>
                    <option value="Photo Story">
                      Photo Story
                    </option>
                    <option value="Announcement">
                      Announcement
                    </option>
                    <option value="Interview">
                      Interview
                    </option>
                  </select>
                </div>

                {/* Published Date */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Published Date
                  </label>

                  <input
                    type="date"
                    name="published_date"
                    defaultValue={media.published_date || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Thumbnail URL
                  </label>

                  <input
                    name="thumbnail_url"
                    type="url"
                    defaultValue={media.thumbnail_url || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Video URL
                  </label>

                  <input
                    name="video_url"
                    type="url"
                    defaultValue={media.video_url || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                  />
                </div>

                {/* External URL */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    External URL
                  </label>

                  <input
                    name="external_url"
                    type="url"
                    defaultValue={media.external_url || ""}
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
                  defaultValue={media.description || ""}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Content
                </label>

                <textarea
                  name="content"
                  rows={7}
                  defaultValue={media.content || ""}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="published"
                    value="on"
                    defaultChecked={media.published}
                    className="h-4 w-4"
                  />
                  Published
                </label>

                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="featured"
                    value="on"
                    defaultChecked={media.featured}
                    className="h-4 w-4"
                  />
                  Featured
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
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