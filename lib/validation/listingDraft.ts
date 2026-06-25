import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));
const moneyAmount = z.coerce.number().finite().nonnegative();
const percentage = z.coerce.number().finite().min(0).max(100);

export const listingDraftSchema = z.object({
  title: z.string().trim().min(3).max(160),
  campaignCode: z.string().trim().min(3).max(64),
  slug: z.string().trim().min(3).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  lifecycleStatus: z.enum(["Draft", "Open", "Funded", "Holding", "Sold", "DistributionProcessing", "Distributed", "Cancelled"]),
  publishStatus: z.enum(["Draft", "Published", "Archived"]),
  visibility: z.enum(["InternalOnly", "MemberVisible", "ParticipantsOnly"]),
  campaignTarget: moneyAmount,
  minimumParticipationAmount: moneyAmount,
  maximumParticipationAmount: moneyAmount,
  campaignOpenDate: z.coerce.date().optional(),
  campaignCloseDate: z.coerce.date().optional(),
  holdingReturnRateMonthly: percentage,
  returnType: z.enum(["Fixed", "Target", "UpTo"]),
  maximumHoldingPeriodMonths: z.coerce.number().int().positive().max(120),
  principalProtectionEnabled: z.coerce.boolean(),
  property: z.object({
    propertyType: z.string().trim().min(2).max(120),
    assetCategory: z.string().trim().min(2).max(120),
    occupancyStatus: z.string().trim().min(2).max(120),
    tenure: z.enum(["Freehold", "Leasehold"]),
    tenureAlias: z.enum(["FH", "LH"]),
    isLaca: z.coerce.boolean(),
    bumiStatus: z.enum(["Bumi", "NonBumi", "OpenMarket"]),
    builtUpArea: optionalText,
    landArea: optionalText,
    bedrooms: z.coerce.number().int().nonnegative().optional(),
    bathrooms: z.coerce.number().int().nonnegative().optional(),
    auctionDate: z.coerce.date().optional(),
    reservePrice: moneyAmount.optional(),
    state: z.string().trim().min(2).max(80),
    location: z.string().trim().min(2).max(160),
    fullAddress: z.string().trim().min(5).max(500),
    yearBuilt: optionalText,
  }),
  content: z.object({
    aboutCampaign: z.string().trim().min(10).max(4000),
    importantInformation: optionalText,
    riskDisclaimer: optionalText,
    holdingReturnExplanation: optionalText,
    finalDistributionExplanation: optionalText,
  }),
});

export type ListingDraftInput = z.infer<typeof listingDraftSchema>;
