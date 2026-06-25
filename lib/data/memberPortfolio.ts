import type { getMemberParticipations } from "@/lib/data/memberParticipations";

export type MemberParticipation = Awaited<ReturnType<typeof getMemberParticipations>>[number] & {
  assetCategory?: string;
  occupancyStatus?: string;
  estimatedYield?: string;
  dateSubmitted?: string;
  property?: { propertyType?: string };
};

export const DASHBOARD_ESTIMATED_ANNUAL_YIELD = "18.0% p.a.";

export function formatRMCompact(value: number) {
  return `RM${value.toLocaleString("en-MY")}`;
}

export function getPortfolioSummary(records: MemberParticipation[]) {
  const totalParticipation = records.reduce((total, record) => total + record.participationAmount, 0);
  const activeCount = records.filter((record) => record.status === "Active" || record.status === "Property Secured" || record.status === "Renovation In Progress" || record.status === "Listed For Sale" || record.status === "Under Offer").length;
  const submittedCount = records.filter((record) => record.status === "Submitted").length;
  const pendingReviewCount = records.filter((record) => record.status === "Pending Review").length;
  const currentStatus = pendingReviewCount > 0 ? "Pending Review" : activeCount > 0 ? "Active" : submittedCount > 0 ? "Submitted" : records.length > 0 ? "In Progress" : "No participation yet";

  return {
    totalParticipation,
    totalParticipationLabel: formatRMCompact(totalParticipation),
    estimatedAnnualYield: DASHBOARD_ESTIMATED_ANNUAL_YIELD,
    activeCount,
    submittedCount,
    pendingReviewCount,
    currentStatus,
  };
}

export function getAssetCategory(record: MemberParticipation) {
  return record.assetCategory || record.property?.propertyType || "Residential Asset";
}

export function getOccupancyStatus(record: MemberParticipation) {
  return record.occupancyStatus || "To be confirmed";
}

export function getPortfolioAllocation(records: MemberParticipation[]) {
  const total = records.reduce((sum, record) => sum + record.participationAmount, 0);
  const grouped = records.reduce<Record<string, number>>((acc, record) => {
    const category = getAssetCategory(record).replace(/ Asset$/i, "");
    acc[category] = (acc[category] || 0) + record.participationAmount;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getRecentActivities(records: MemberParticipation[]) {
  const activities = records.flatMap((record) => {
    const submitted = { title: "Participation Submitted", date: record.dateSubmitted || record.latestUpdate, body: `${record.propertyName} participation recorded.` };
    const latest = record.latestUpdate ? { title: record.status === "Pending Review" ? "Declaration Completed" : record.status === "Active" ? "Participation Approved" : String(record.status), date: record.latestUpdate, body: record.propertyName } : null;
    return latest ? [submitted, latest] : [submitted];
  });

  if (activities.length === 0) {
    return [
      { title: "Portfolio ready", date: "Today", body: "Browse opportunities to submit your first participation." },
      { title: "Declaration flow available", date: "Preview", body: "Member declarations are ready for opportunity participation." },
      { title: "Participation review", date: "Preview", body: "Submitted opportunities will appear here for review." },
    ];
  }

  return activities.slice(0, 5);
}
