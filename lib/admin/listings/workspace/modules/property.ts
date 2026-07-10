import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import { buildListingAuditData } from "../audit";
import { optionalDecimal, requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

export async function savePropertyModule(formData: FormData): Promise<WorkspaceModuleResult> {
  await requireAdminPermission("listing.manage");
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Save Overview before saving Property.");
  const tenure = requiredString(formData, "tenure") || "Freehold";
  const data = {
    propertyType: requiredString(formData, "propertyType"),
    assetCategory: requiredString(formData, "assetCategory"),
    occupancyStatus: requiredString(formData, "occupancyStatus"),
    tenure: tenure as "Freehold" | "Leasehold",
    tenureAlias: tenure === "Freehold" ? "FH" as const : "LH" as const,
    isLaca: requiredString(formData, "isLaca") === "on" || requiredString(formData, "isLaca") === "true",
    bumiStatus: (requiredString(formData, "bumiStatus") || "OpenMarket") as "Bumi" | "NonBumi" | "OpenMarket",
    builtUpArea: requiredString(formData, "builtUpArea") || null,
    landArea: requiredString(formData, "landArea") || null,
    bedrooms: requiredString(formData, "bedrooms") ? Number(requiredString(formData, "bedrooms")) : null,
    bathrooms: requiredString(formData, "bathrooms") ? Number(requiredString(formData, "bathrooms")) : null,
    reservePrice: optionalDecimal(requiredString(formData, "reservePrice")),
    state: requiredString(formData, "state"),
    location: requiredString(formData, "location"),
    fullAddress: requiredString(formData, "fullAddress"),
    yearBuilt: requiredString(formData, "yearBuilt") || null,
  };
  const fieldErrors: Record<string, string> = {};
  for (const [field, label] of Object.entries({ propertyType: "Property Type", assetCategory: "Asset Category", occupancyStatus: "Occupancy Status", location: "City", state: "State", fullAddress: "Full Address" })) {
    if (!String((data as Record<string, unknown>)[field] ?? "").trim()) fieldErrors[field] = `Please complete ${label}.`;
  }
  if (Object.keys(fieldErrors).length) throw new WorkspaceValidationError("Please complete property fields.", fieldErrors);
  const saved = await db.$transaction(async (tx) => {
    const property = await tx.propertyDetail.upsert({ where: { campaignId }, update: data, create: { campaignId, ...data } });
    await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.property.saved", entityId: campaignId, entityType: "PropertyDetail", afterSnapshot: property }) });
    return property;
  });
  return { ok: true, status: "saved", message: "Property saved.", updatedAt: saved.updatedAt.toISOString() };
}
