import { db } from "@/lib/db";
import { fileAssetPublicUrl } from "@/lib/storage/fileAssetUrl";
import type { WorkspaceReadinessModule, WorkspaceReadinessResult } from "./types";

function has(value: unknown) {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function moneyPositive(value: unknown) {
  if (value == null) return false;
  return Number(value) > 0;
}

function moduleResult(module: WorkspaceReadinessModule): WorkspaceReadinessModule {
  return { ...module, ready: module.missingFields.length === 0 };
}

export async function getWorkspaceReadiness(campaignId: string): Promise<WorkspaceReadinessResult> {
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    include: {
      propertyDetail: true,
      content: true,
      media: { include: { fileAsset: true } },
      documents: { include: { fileAsset: true } },
      faqs: true,
    },
  });

  if (!campaign) {
    return {
      ready: false,
      completionPercentage: 0,
      modules: [
        { key: "overview", label: "Overview", ready: false, missingFields: ["Listing shell"], warnings: [] },
      ],
    };
  }

  const overviewMissing = [
    !has(campaign.title) ? "Listing title" : null,
    !has(campaign.content?.aboutCampaign) ? "Short description" : null,
    !has(campaign.campaignOpenDate) ? "Publish date" : null,
    !has(campaign.campaignCloseDate) ? "Expiry date" : null,
  ].filter(Boolean) as string[];

  const property = campaign.propertyDetail;
  const propertyMissing = [
    !has(property?.propertyType) ? "Property type" : null,
    !has(property?.assetCategory) ? "Asset category" : null,
    !has(property?.occupancyStatus) ? "Occupancy status" : null,
    !has(property?.location) ? "City" : null,
    !has(property?.state) ? "State" : null,
    !has(property?.fullAddress) ? "Full address" : null,
    !moneyPositive(property?.reservePrice) ? "Market value" : null,
  ].filter(Boolean) as string[];

  const participationMissing = [
    !moneyPositive(campaign.campaignTarget) ? "Participation target" : null,
    !moneyPositive(campaign.minimumParticipationAmount) ? "Minimum participation amount" : null,
    !moneyPositive(campaign.maximumParticipationAmount) ? "Maximum participation amount" : null,
    !moneyPositive(campaign.holdingReturnRateMonthly) ? "Holding return" : null,
    !has(campaign.maximumHoldingPeriodMonths) ? "Holding period" : null,
    !has(campaign.campaignOpenDate) ? "Participation start date" : null,
    !has(campaign.campaignCloseDate) ? "Participation end date" : null,
  ].filter(Boolean) as string[];

  const memberShare = campaign.memberProfitDistributionPercentagePlanned;
  const platformShare = campaign.platformProfitSharePercentagePlanned;
  const settlementWarnings: string[] = [];
  const settlementMissing: string[] = [];
  if (memberShare != null || platformShare != null) {
    const total = Number(memberShare ?? 0) + Number(platformShare ?? 0);
    if (Math.abs(total - 100) > 0.01) settlementMissing.push("Member and platform final return percentages must total 100%");
  } else {
    settlementWarnings.push("Settlement percentages are optional until final review.");
  }

  const mediaWarnings = campaign.media
    .filter((media) => media.fileAsset && !fileAssetPublicUrl(media.fileAsset))
    .map((media) => `${media.mediaType} file URL is not resolvable`);

  const documentWarnings = campaign.documents
    .filter((document) => document.fileAsset && !document.fileAsset.objectKey)
    .map((document) => `${document.title} file asset is incomplete`);

  const memberInfoMissing = [
    !has(campaign.content?.importantInformation) ? "Important information" : null,
    !has(campaign.content?.riskDisclaimer) ? "Risk disclaimer" : null,
  ].filter(Boolean) as string[];

  const modules = [
    moduleResult({ key: "overview", label: "Overview", ready: false, missingFields: overviewMissing, warnings: [] }),
    moduleResult({ key: "property", label: "Property", ready: false, missingFields: propertyMissing, warnings: [] }),
    moduleResult({ key: "participation", label: "Participation", ready: false, missingFields: participationMissing, warnings: [] }),
    moduleResult({ key: "settlement", label: "Settlement", ready: false, optional: true, missingFields: settlementMissing, warnings: settlementWarnings }),
    moduleResult({ key: "media", label: "Media", ready: false, optional: true, missingFields: [], warnings: mediaWarnings }),
    moduleResult({ key: "documents", label: "Documents", ready: false, optional: true, missingFields: [], warnings: documentWarnings }),
    moduleResult({ key: "memberInfo", label: "Member Info", ready: false, missingFields: memberInfoMissing, warnings: [] }),
  ];

  const blockingModules = modules.filter((module) => !module.optional);
  const complete = blockingModules.filter((module) => module.ready).length;

  return {
    ready: blockingModules.every((module) => module.ready) && modules.every((module) => module.missingFields.length === 0),
    completionPercentage: Math.round((complete / blockingModules.length) * 100),
    modules,
  };
}
