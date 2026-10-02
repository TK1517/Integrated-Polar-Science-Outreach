"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function updateExpedition(formData: FormData) {
  const id = String(formData.get("id") || "").trim();

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

  if (!id) {
    throw new Error("Expedition ID is missing.");
  }

  if (!name) {
    throw new Error("Expedition name is required.");
  }

  const year = yearValue ? Number(yearValue) : null;

  if (yearValue && Number.isNaN(year)) {
    throw new Error("Year must be a valid number.");
  }

  const { data, error } = await supabase
    .from("expeditions")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Update matched 0 rows. Check the expedition ID and Supabase RLS UPDATE policy."
    );
  }

  revalidatePath("/admin/expeditions");
  revalidatePath("/expeditions");
  revalidatePath(`/expeditions/${id}`);
}

export async function deleteExpedition(formData: FormData) {
  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Expedition ID is missing.");
  }

  const { error } = await supabase
    .from("expeditions")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/expeditions");
  revalidatePath("/expeditions");
  revalidatePath(`/expeditions/${id}`);
}