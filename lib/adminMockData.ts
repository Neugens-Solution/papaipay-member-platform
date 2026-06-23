const ruleText = "If not sold within 24 months, Participation Amount only will be returned.";

const gallery = [
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
];

export const campaignLifecycleStatuses = ["Draft", "Open", "Funded", "Holding", "Sold", "Distribution Processing", "Distributed", "Cancelled"] as const;

export const documentCategories = [
  "Proclamation of Sale",
  "Conditions of Sale",
  "Title Search",
  "Valuation Report",
  "Property Photos",
  "Location Map",
  "Legal Documents",
  "Other Documents",
];

const baseDocuments = documentCategories.map((category, index) => ({
  id: `DOC-${String(index + 1).padStart(6, "0")}`,
  category,
  fileName: `${category}.pdf`,
  visibility: index < 6 ? "Member Visible" : "Internal Only",
  status: index < 5 ? "Published" : "Ready",
}));

const updates = [
  { date: "18 Jun 2026", title: "Campaign Opened", body: "The campaign is open for member participation review." },
  { date: "20 Jun 2026", title: "Document Review Completed", body: "Core property documents have been reviewed for member access." },
];

const faqs = [
  { question: "When is Holding Return paid?", answer: "Holding Return accrues during the holding period and is paid once during final distribution." },
  { question: "What happens after 24 months?", answer: ruleText },
];

const campaignTimeline = ["Campaign Created", "Campaign Opened", "Property Review", "Distribution Processing"];

export const adminKpis = [
  { label: "Total Listings", value: "60", helper: "All campaign listing records", trend: "18 active / 42 completed" },
  { label: "Active Campaigns", value: "18", helper: "Open, funded or in holding", trend: "+3 this month" },
  { label: "Registered Members", value: "8,420", helper: "Member accounts registered", trend: "+6.8% MoM" },
  { label: "Pending eKYC", value: "12", helper: "Members awaiting verification review", trend: "Operational priority" },
  { label: "Total Investment", value: "RM18.6M", helper: "Confirmed participation value", trend: "+14.2% QoQ" },
  { label: "Total Distribution", value: "RM2.84M", helper: "Completed distributions", trend: "+RM420K MoM" },
  { label: "Pending Distribution", value: "RM386K", helper: "Awaiting processing", trend: "126 records" },
  { label: "Monthly Investment", value: "RM1.92M", helper: "June 2026 activity", trend: "+9.4% vs May" },
];

export const operationalSummary = [
  { label: "Pending eKYC", value: "12", tone: "slate" },
  { label: "Pending Distributions", value: "126", tone: "sand" },
  { label: "Open Campaigns", value: "18", tone: "green" },
  { label: "Draft Announcements", value: "2", tone: "mint" },
];

export const members = [
  { id: "MEM-000001", name: "Amina Rahman", email: "amina.rahman@example.com", phone: "+60 12-438 9210", status: "Verified", participation: "RM125,000", distribution: "RM8,500", joined: "12 Jan 2026", activeCampaigns: 4, completedCampaigns: 2 },
  { id: "MEM-000002", name: "Daniel Tan", email: "daniel.tan@example.com", phone: "+60 16-229 1840", status: "Verified", participation: "RM86,000", distribution: "RM5,920", joined: "28 Jan 2026", activeCampaigns: 3, completedCampaigns: 1 },
  { id: "MEM-000003", name: "Nur Iman", email: "nur.iman@example.com", phone: "+60 13-776 2019", status: "Pending", participation: "RM42,000", distribution: "RM1,250", joined: "04 Feb 2026", activeCampaigns: 7, completedCampaigns: 0 },
  { id: "MEM-000004", name: "Raj Kumar", email: "raj.kumar@example.com", phone: "+60 17-552 9004", status: "Verified", participation: "RM151,500", distribution: "RM12,430", joined: "16 Feb 2026", activeCampaigns: 2, completedCampaigns: 4 },
  { id: "MEM-000005", name: "Siti Aisyah", email: "siti.aisyah@example.com", phone: "+60 18-314 2280", status: "Review", participation: "RM63,000", distribution: "RM3,840", joined: "22 Mar 2026", activeCampaigns: 5, completedCampaigns: 1 },
];

export const memberDetail = {
  bank: "Maybank ••••9021",
  nominee: "Farid Rahman (Brother)",
  address: "No. 18, Jalan Anggerik 3, Ampang, Selangor",
  ic: "900812-14-••••",
  verified: "12 June 2026",
};

export const participationHistory = [
  { participationId: "PAR-000001", memberId: "MEM-000001", campaignId: "CAM-000001", campaignCode: "PP-SGR-2026-001", listing: "Kajang Terrace House", date: "12 Jun 2026", amount: "RM42,500", status: "Confirmed", distributionStatus: "Pending" },
  { participationId: "PAR-000002", memberId: "MEM-000001", campaignId: "CAM-000002", campaignCode: "PP-SGR-2026-002", listing: "Shah Alam Terrace House", date: "02 Jun 2026", amount: "RM55,000", status: "Confirmed", distributionStatus: "Processing" },
  { participationId: "PAR-000003", memberId: "MEM-000001", campaignId: "CAM-000006", campaignCode: "PP-PRK-2026-006", listing: "Ipoh Terrace House", date: "20 May 2026", amount: "RM27,500", status: "Confirmed", distributionStatus: "Paid" },
];

export const distributionHistory = [
  { distributionId: "DIS-000001", distributionBatchId: "DBT-000001", participationId: "PAR-000001", campaignId: "CAM-000004", campaignCode: "PP-KL-2026-004", listing: "Cheras Terrace House", participationAmount: "RM42,500", principalReturn: "RM42,500", holdingReturn: "RM956", profitDistribution: "RM1,894", amount: "RM45,350", status: "Paid", paid: "14 Jun 2026", ref: "PAY-000001" },
  { distributionId: "DIS-000002", distributionBatchId: "DBT-000001", participationId: "PAR-000002", campaignId: "CAM-000005", campaignCode: "PP-NS-2026-005", listing: "Seremban Semi-D", participationAmount: "RM32,000", principalReturn: "RM32,000", holdingReturn: "RM1,440", profitDistribution: "RM480", amount: "RM33,920", status: "Processing", paid: "Scheduled", ref: "PAY-000002" },
];

const settlementFor = (purchasePrice: number, salePrice: number, collectedAmount: number, holdingReturnPool: number, memberProfitDistributionPercentage = 70) => {
  const acquisitionCosts = { auctionDeposit: 55000, balancePurchasePrice: purchasePrice - 55000, legalFee: 8200, stampDuty: 13500, disbursement: 1800, titleSearch: 450, otherAcquisitionCosts: 1200 };
  const holdingCosts = { maintenanceFee: 4200, sinkingFund: 1800, quitRent: 360, assessment: 720, utilities: 960, insurance: 1250, securityCharges: 1800, otherHoldingCosts: 650 };
  const renovationCosts = { renovation: 24000, contractor: 12500, materials: 8600, cleaning: 1200, defectRectification: 3200, otherPreparationCosts: 900 };
  const disposalCosts = { agentFee: 14400, legalFeeOnSale: 6200, rpgt: 0, marketing: 1600, documentation: 900, otherDisposalCosts: 500 };
  const platformCosts = { platformFee: 9000, managementFee: 6500, administrationFee: 2500, otherPlatformCosts: 750 };
  const totalCosts = Object.values(acquisitionCosts).reduce((sum, value) => sum + value, 0) + Object.values(holdingCosts).reduce((sum, value) => sum + value, 0) + Object.values(renovationCosts).reduce((sum, value) => sum + value, 0) + Object.values(disposalCosts).reduce((sum, value) => sum + value, 0) + Object.values(platformCosts).reduce((sum, value) => sum + value, 0);
  const grossProfit = salePrice - purchasePrice;
  const netProfit = salePrice - purchasePrice - totalCosts;
  const profitDistributionPool = Math.max(0, Math.round(netProfit * (memberProfitDistributionPercentage / 100)));
  const platformShare = Math.max(0, netProfit - profitDistributionPool);
  return { acquisitionCosts, holdingCosts, renovationCosts, disposalCosts, platformCosts, totalCosts, grossProfit, netProfit, memberProfitDistributionPercentage, platformProfitSharePercentage: 100 - memberProfitDistributionPercentage, principalReturnPool: collectedAmount, holdingReturnPool, profitDistributionPool, platformShare, finalDistributionPool: collectedAmount + holdingReturnPool + profitDistributionPool, calculationStatus: "Reviewed", calculationRemarks: "Calculation prepared for finance review before manual distribution processing." };
};

export const listings = [
  {
    id: "CAM-000001",
    campaignId: "CAM-000001",
    campaignCode: "PP-SGR-2026-001",
    slug: "kajang-terrace-house",
    name: "Kajang Terrace House",
    campaignTitle: "Kajang Terrace House",
    status: "Open",
    campaignTarget: 600000,
    target: 600000,
    collectedAmount: 420000,
    collected: 420000,
    remainingAmount: 180000,
    progressPercentage: 70,
    minimumParticipationAmount: 500,
    maximumParticipationAmount: 60000,
    daysRemaining: 24,
    campaignOpenDate: "2026-06-12",
    campaignCloseDate: "2026-07-12",
    propertyType: "Terrace House",
    tenure: "Freehold",
    tenureAlias: "FH",
    isLaca: false,
    bumiStatus: "Non-Bumi",
    builtUpArea: "1,600 sq ft",
    builtUp: "1,600 sq ft",
    landArea: "1,950 sq ft",
    bedrooms: 4,
    bathrooms: 3,
    auctionDate: "2026-07-15",
    reservePrice: 550000,
    state: "Selangor",
    location: "Kajang, Selangor",
    fullAddress: "Jalan Reko, Kajang, Selangor",
    yearBuilt: "2015",
    participants: 128,
    primaryImage: gallery[0],
    gallery,
    galleryCount: gallery.length,
    imageCaptions: ["Front view", "Living area", "Exterior detail"],
    documents: baseDocuments,
    aboutCampaign: "This campaign aims to acquire a terrace house in Kajang through auction, improve readiness, and complete disposal during the campaign lifecycle.",
    importantInformation: "All participation is subject to campaign documents and terms. Please review documents before participating.",
    updates,
    faqs,
    riskDisclaimer: "Property campaigns may be affected by auction timing, legal review, market demand, holding costs and disposal conditions.",
    campaignTimeline,
    holdingReturnRate: "1.5% per month",
    returnType: "Target",
    maximumHoldingPeriodMonths: 24,
    principalProtectionEnabled: true,
    holdingReturnExplanation: "Holding Return accrues during the holding period and is paid once during final distribution.",
    finalDistributionExplanation: "Final Distribution includes Principal Return, Holding Return and Profit Distribution where applicable.",
    twentyFourMonthRuleText: ruleText,
    purchasePrice: 550000,
    salePrice: 720000,
    ...settlementFor(550000, 720000, 420000, 94500),
  },
  {
    id: "CAM-000002",
    campaignId: "CAM-000002",
    campaignCode: "PP-SGR-2026-002",
    slug: "shah-alam-terrace-house",
    name: "Shah Alam Terrace House",
    campaignTitle: "Shah Alam Terrace House",
    status: "Funded",
    campaignTarget: 720000,
    target: 720000,
    collectedAmount: 720000,
    collected: 720000,
    remainingAmount: 0,
    progressPercentage: 100,
    minimumParticipationAmount: 500,
    maximumParticipationAmount: 65000,
    daysRemaining: 0,
    campaignOpenDate: "2026-05-20",
    campaignCloseDate: "2026-06-20",
    propertyType: "Terrace House",
    tenure: "Leasehold",
    tenureAlias: "LH",
    isLaca: true,
    bumiStatus: "Open Market",
    builtUpArea: "1,690 sq ft",
    builtUp: "1,690 sq ft",
    landArea: "2,100 sq ft",
    bedrooms: 4,
    bathrooms: 3,
    auctionDate: "2026-06-30",
    reservePrice: 670000,
    state: "Selangor",
    location: "Shah Alam, Selangor",
    fullAddress: "Seksyen 7, Shah Alam, Selangor",
    yearBuilt: "2014",
    participants: 146,
    primaryImage: gallery[1],
    gallery,
    galleryCount: gallery.length,
    imageCaptions: ["Building frontage", "Neighbourhood view", "Interior view"],
    documents: baseDocuments,
    aboutCampaign: "This campaign has reached its participation target and is being prepared for acquisition steps.",
    importantInformation: "Campaign is funded and no longer accepting new participation.",
    updates,
    faqs,
    riskDisclaimer: "Auction and acquisition timelines remain subject to documentation and settlement review.",
    campaignTimeline: ["Campaign Created", "Campaign Opened", "Funded"],
    holdingReturnRate: "1.4% per month",
    returnType: "Fixed",
    maximumHoldingPeriodMonths: 24,
    principalProtectionEnabled: true,
    holdingReturnExplanation: "Holding Return accrues during the holding period and is paid once during final distribution.",
    finalDistributionExplanation: "Final Distribution is calculated after sale and settlement review.",
    twentyFourMonthRuleText: ruleText,
    purchasePrice: 670000,
    salePrice: 0,
    ...settlementFor(670000, 0, 720000, 0),
    calculationStatus: "Draft",
  },
  {
    id: "CAM-000003",
    campaignId: "CAM-000003",
    campaignCode: "PP-SGR-2026-003",
    slug: "ampang-terrace-house",
    name: "Ampang Terrace House",
    campaignTitle: "Ampang Terrace House",
    status: "Open",
    campaignTarget: 560000,
    target: 560000,
    collectedAmount: 302400,
    collected: 302400,
    remainingAmount: 257600,
    progressPercentage: 54,
    minimumParticipationAmount: 500,
    maximumParticipationAmount: 60000,
    daysRemaining: 36,
    campaignOpenDate: "2026-06-18",
    campaignCloseDate: "2026-07-24",
    propertyType: "Terrace House",
    tenure: "Freehold",
    tenureAlias: "FH",
    isLaca: false,
    bumiStatus: "Open Market",
    builtUpArea: "1,780 sq ft",
    builtUp: "1,780 sq ft",
    landArea: "2,200 sq ft",
    bedrooms: 3,
    bathrooms: 2,
    auctionDate: "2026-08-05",
    reservePrice: 510000,
    state: "Selangor",
    location: "Ampang, Selangor",
    fullAddress: "Ampang Jaya, Selangor",
    yearBuilt: "2016",
    participants: 94,
    primaryImage: gallery[2],
    gallery,
    galleryCount: gallery.length,
    imageCaptions: ["Main exterior", "Side view", "Living hall"],
    documents: baseDocuments,
    aboutCampaign: "This campaign presents an Ampang terrace house with clear property benchmark information for member review.",
    importantInformation: "Participation closes when target is reached or campaign close date is reached.",
    updates,
    faqs,
    riskDisclaimer: "Campaign timelines may change based on auction and disposal conditions.",
    campaignTimeline,
    holdingReturnRate: "1.5% per month",
    returnType: "Up To",
    maximumHoldingPeriodMonths: 24,
    principalProtectionEnabled: true,
    holdingReturnExplanation: "Holding Return accrues during the holding period and is paid once during final distribution.",
    finalDistributionExplanation: "Final Distribution is completed after sale and admin payment processing.",
    twentyFourMonthRuleText: ruleText,
    purchasePrice: 510000,
    salePrice: 0,
    ...settlementFor(510000, 0, 302400, 0),
    calculationStatus: "Draft",
  },
  {
    id: "CAM-000004",
    campaignId: "CAM-000004",
    campaignCode: "PP-KL-2026-004",
    slug: "cheras-terrace-house",
    name: "Cheras Terrace House",
    campaignTitle: "Cheras Terrace House",
    status: "Distributed",
    campaignTarget: 680000,
    target: 680000,
    collectedAmount: 680000,
    collected: 680000,
    remainingAmount: 0,
    progressPercentage: 100,
    minimumParticipationAmount: 500,
    maximumParticipationAmount: 70000,
    daysRemaining: 0,
    campaignOpenDate: "2025-01-12",
    campaignCloseDate: "2025-02-20",
    propertyType: "Terrace House",
    tenure: "Leasehold",
    tenureAlias: "LH",
    isLaca: true,
    bumiStatus: "Non-Bumi",
    builtUpArea: "1,870 sq ft",
    builtUp: "1,870 sq ft",
    landArea: "2,240 sq ft",
    bedrooms: 4,
    bathrooms: 3,
    auctionDate: "2025-03-10",
    reservePrice: 630000,
    state: "Kuala Lumpur",
    location: "Cheras, Kuala Lumpur",
    fullAddress: "Taman Cheras, Kuala Lumpur",
    yearBuilt: "2013",
    participants: 172,
    primaryImage: gallery[0],
    gallery,
    galleryCount: gallery.length,
    imageCaptions: ["Street view", "Front facade", "Interior"],
    documents: baseDocuments,
    aboutCampaign: "This campaign completed its sale and final distribution process.",
    importantInformation: "Distribution records are available for admin and member review.",
    updates,
    faqs,
    riskDisclaimer: "Completed campaign records remain available for reporting and audit review.",
    campaignTimeline: ["Campaign Created", "Campaign Opened", "Funded", "Holding", "Sold", "Distributed"],
    holdingReturnRate: "1.5% per month",
    returnType: "Target",
    maximumHoldingPeriodMonths: 24,
    principalProtectionEnabled: true,
    holdingReturnExplanation: "Holding Return accrued during holding and was paid once during final distribution.",
    finalDistributionExplanation: "Final Distribution included Principal Return, Holding Return and Profit Distribution.",
    twentyFourMonthRuleText: ruleText,
    purchasePrice: 630000,
    salePrice: 810000,
    ...settlementFor(630000, 810000, 680000, 153000),
    calculationStatus: "Locked",
    holdingPeriod: "15 months",
    holdingReturnPercentage: "22.5%",
    profitDistributionPercentage: "18%",
    totalDistributionPercentage: "40.5%",
    finalDistributionAmount: 955400,
    distributionDate: "14 Jun 2026",
    distributionBatchId: "DBT-000001",
    outcomeStatus: "Distributed",
  },
];

export const participants = members.slice(0, 4).map((member, index) => ({
  participationId: `PAR-${String(index + 1).padStart(6, "0")}`,
  memberId: member.id,
  campaignId: listings[index]?.campaignId ?? `CAM-${String(index + 1).padStart(6, "0")}`,
  campaignCode: listings[index]?.campaignCode ?? "PP-SGR-2026-001",
  name: member.name,
  email: member.email,
  amount: [42500, 55000, 18000, 32000][index],
  date: ["12 Jun 2026", "10 Jun 2026", "04 Jun 2026", "28 May 2026"][index],
  paymentStatus: "Paid",
  distributionStatus: ["Pending", "Processing", "Paid", "Pending"][index],
}));

export const listingDocuments = baseDocuments.map((document) => document.fileName);

export const distributions = [
  { id: "DIS-000001", distributionBatchId: "DBT-000001", campaignId: "CAM-000004", campaignCode: "PP-KL-2026-004", participationId: "PAR-000001", memberId: "MEM-000001", paymentReference: "PAY-000001", campaign: "Cheras Terrace House", member: "Amina Rahman", participation: "RM42,500", principalReturn: "RM42,500", holdingReturn: "RM956", profitDistribution: "RM1,894", amount: "RM45,350", status: "Paid", paid: "14 Jun 2026" },
  { id: "DIS-000002", distributionBatchId: "DBT-000001", campaignId: "CAM-000005", campaignCode: "PP-NS-2026-005", participationId: "PAR-000002", memberId: "MEM-000002", paymentReference: "PAY-000002", campaign: "Seremban Semi-D", member: "Daniel Tan", participation: "RM32,000", principalReturn: "RM32,000", holdingReturn: "RM1,440", profitDistribution: "RM480", amount: "RM33,920", status: "Processing", paid: "Scheduled" },
  { id: "DIS-000003", distributionBatchId: "DBT-000002", campaignId: "CAM-000006", campaignCode: "PP-PRK-2026-006", participationId: "PAR-000003", memberId: "MEM-000003", paymentReference: "PAY-000003", campaign: "Ipoh Terrace House", member: "Nur Iman", participation: "RM18,000", principalReturn: "RM18,000", holdingReturn: "RM810", profitDistribution: "RM70", amount: "RM18,880", status: "Pending", paid: "—" },
  { id: "DIS-000004", distributionBatchId: "DBT-000003", campaignId: "CAM-000001", campaignCode: "PP-SGR-2026-001", participationId: "PAR-000004", memberId: "MEM-000004", paymentReference: "PAY-000004", campaign: "Kajang Terrace House", member: "Raj Kumar", participation: "RM55,000", principalReturn: "RM55,000", holdingReturn: "RM2,475", profitDistribution: "RM765", amount: "RM58,240", status: "Pending", paid: "—" },
];

export const announcements = [
  { id: "ann-1", title: "June distribution window", audience: "All Members", content: "Distribution processing window is open for completed campaigns.", date: "18 Jun 2026", status: "Published" },
  { id: "ann-2", title: "New auction listings", audience: "Verified Members", content: "New terrace house campaigns are being prepared for member review.", date: "20 Jun 2026", status: "Draft" },
  { id: "ann-3", title: "Kajang campaign update", audience: "Specific Campaign Participants", content: "Kajang Terrace House progress has been refreshed for participating members.", date: "25 Jun 2026", status: "Scheduled" },
];

export const adminUsers = [
  { name: "Sarah Lim", email: "sarah.lim@papaipay.test", role: "Super Admin", status: "Active", lastLogin: "18 Jun 2026, 09:12" },
  { name: "Hafiz Omar", email: "hafiz.omar@papaipay.test", role: "Admin", status: "Active", lastLogin: "17 Jun 2026, 18:04" },
  { name: "Mei Wong", email: "mei.wong@papaipay.test", role: "Manager", status: "Invited", lastLogin: "—" },
];

export const reportGroups = ["Member Reports", "Participation Reports", "Campaign Reports", "Distribution Reports", "Settlement Reports", "Campaign Outcome Reports"];

export const exportCentreItems = [
  "Export Members",
  "Export Participation",
  "Export Campaigns",
  "Export Distributions",
  "Export Settlement",
  "Export Campaign Outcomes",
];

export const activityLog = [
  { activity: "Campaign Created for Kajang Terrace House", user: "Sarah Lim", dateTime: "18 Jun 2026, 10:42", type: "Campaign Created" },
  { activity: "Campaign Edited for Ampang Terrace House", user: "Hafiz Omar", dateTime: "18 Jun 2026, 11:10", type: "Campaign Edited" },
  { activity: "Status Changed to Funded for Shah Alam Terrace House", user: "Mei Wong", dateTime: "18 Jun 2026, 12:20", type: "Status Changed" },
  { activity: "Settlement Reviewed for Cheras Terrace House", user: "Finance Admin", dateTime: "18 Jun 2026, 14:40", type: "Settlement Reviewed" },
  { activity: "Distribution Approved for DBT-000001", user: "Finance Admin", dateTime: "18 Jun 2026, 15:08", type: "Distribution Approved" },
  { activity: "Distribution Paid for Amina Rahman", user: "Finance Admin", dateTime: "18 Jun 2026, 16:18", type: "Distribution Paid" },
];
