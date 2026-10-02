"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function updatePublication(formData: FormData) {
  const id = String(formData.get("id") || "").trim();

  const title = String(formData.get("title") || "").trim();
  const authors = String(formData.get("authors") || "").trim();
  const institution = String(formData.get("institution") || "").trim();
  const abstract = String(formData.get("abstract") || "").trim();
  const keywords = String(formData.get("keywords") || "").trim();
  const researchArea = String(
    formData.get("research_area") || ""
  ).trim();
  const region = String(formData.get("region") || "").trim();

  const publicationYearRaw = String(
    formData.get("publication_year") || ""
  ).trim();

  const doi = String(formData.get("doi") || "").trim();
  const pdfUrl = String(formData.get("pdf_url") || "").trim();
  const externalUrl = String(
    formData.get("external_url") || ""
  ).trim();

  const published = formData.get("published") === "on";

  if (!id) {
    throw new Error("Publication ID is missing.");
  }

  if (!title || !abstract) {
    throw new Error("Title and abstract are required.");
  }

  const publicationYear = publicationYearRaw
    ? Number(publicationYearRaw)
    : null;

  const { data, error } = await supabase
    .from("publications")
    .update({
      title,
      authors: authors || null,
      institution: institution || null,
      abstract,
      keywords: keywords || null,
      research_area: researchArea || null,
      region: region || null,
      publication_year: publicationYear,
      doi: doi || null,
      pdf_url: pdfUrl || null,
      external_url: externalUrl || null,
      published,
    })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Update matched 0 rows. Check the publication ID and Supabase RLS UPDATE policy."
    );
  }

  revalidatePath("/admin/publications");
  revalidatePath("/publications");
}