"use client";

import { useState } from "react";

type Props = {
  expeditionId: string;
  expeditionName: string;
  deleteAction: (formData: FormData) => Promise<void>;
};

export default function DeleteExpeditionButton({
  expeditionId,
  expeditionName,
  deleteAction,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-950">
              Delete Expedition?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {expeditionName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <form action={deleteAction}>
                <input
                  type="hidden"
                  name="id"
                  value={expeditionId}
                />

                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}