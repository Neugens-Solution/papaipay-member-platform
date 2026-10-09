import { formatEnumLabel } from "@/lib/utils/formatters";

/** Admin-facing status: a published listing hidden from members is "On Hold". */
export function adminListingStatusLabel(listing: { lifecycleStatus: string; publishStatus?: string | null; visibility?: string | null }) {
  if (listing.publishStatus === "Published" && listing.visibility === "InternalOnly") return "On Hold";
  return formatEnumLabel(listing.lifecycleStatus);
}

/** Whether members can open the listing's opportunity page. */
export function isVisibleToMembers(listing: { publishStatus?: string | null; visibility?: string | null }) {
  return listing.publishStatus === "Published" && listing.visibility === "MemberVisible";
}
