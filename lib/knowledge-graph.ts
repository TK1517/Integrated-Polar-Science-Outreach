import { supabase } from "@/lib/supabase/client";

type EvidenceType = "publication" | "expedition" | "media";

const emptyUuid = "00000000-0000-0000-0000-000000000000";

export async function getConnectedRecordIds(
  resourceIdsParam: string | undefined,
  recordType: EvidenceType
) {
  if (!resourceIdsParam) {
    return null;
  }

  const resourceIds = resourceIdsParam
    .split(",")
    .map((id) => id.trim().toLowerCase())
    .filter((id) => /^[0-9a-f-]{36}$/.test(id));

  if (resourceIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("graph_edges")
    .select("source_type,source_id,target_type,target_id")
    .or(
      `source_id.in.(${resourceIds.join(",")}),target_id.in.(${resourceIds.join(",")})`
    );

  if (error) {
    return [];
  }

  const resourceIdSet = new Set(resourceIds);
  const connectedIds = new Set<string>();

  for (const edge of data || []) {
    const sourceType = edge.source_type.trim().toLowerCase();
    const targetType = edge.target_type.trim().toLowerCase();
    const sourceId = edge.source_id.trim().toLowerCase();
    const targetId = edge.target_id.trim().toLowerCase();

    if (
      sourceType === "resource" &&
      targetType === recordType &&
      resourceIdSet.has(sourceId)
    ) {
      connectedIds.add(targetId);
    }

    if (
      sourceType === recordType &&
      targetType === "resource" &&
      resourceIdSet.has(targetId)
    ) {
      connectedIds.add(sourceId);
    }
  }

  return [...connectedIds];
}

export { emptyUuid };
