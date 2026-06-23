export type OpportunityStatus = "open" | "closing soon" | "closed";

export type Opportunity = {
  id: string;
  campaignId: string;
  campaignCode: string;
  slug: string;
  title: string;
  status: OpportunityStatus;
  location: string;
  state: string;
  propertyType: string;
  assetCategory: string;
  occupancyStatus: string;
  estimatedYield: string;
  tenure: string;
  tenureAlias: string;
  isLaca: boolean;
  bumiStatus: string;
  builtUpArea: string;
  landArea: string;
  bedrooms: number;
  bathrooms: number;
  auctionDate: string;
  reservePrice: number;
  yearBuilt: string;
  fullAddress: string;
  minimumParticipation: number;
  maximumParticipation: number;
  targetAmount: number;
  collectedAmount: number;
  participants: number;
  closeDate: string;
  auctionPrice: number;
  marketValue: number;
  valuationDate: string;
  valuationReport: string;
  imageUrl: string;
  gallery: string[];
  galleryCount: number;
  daysRemaining: number;
  principalProtectionEnabled: boolean;
  aboutCampaign: string;
  importantInformation: string;
  updates: { title: string; date: string; body: string }[];
  faqs: { question: string; answer: string }[];
  holdingReturnRate: string;
  returnType: "Fixed" | "Target" | "Up To";
  maximumHoldingPeriodMonths: number;
  principalProtectionRule: string;
  documents: string[];
  riskSummary: string;
};

const terraceImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
];

export const memberProfile = { firstName: "Amina", lastName: "Rahman", memberNumber: "MEM-000001", memberId: "MEM-000001", email: "amina.rahman@example.com", kycStatus: "approved" };

export const memberProfileDetails = {
  memberId: "MEM-000001",
  personal: {
    fullName: "Amina Binti Rahman",
    icNumberMasked: "900812-14-••••",
    email: "amina.rahman@example.com",
    phone: "+60 12-438 9210",
    address: "No. 18, Jalan Anggerik 3, Taman Bukit Indah, 68000 Ampang, Selangor",
  },
  verification: {
    status: "Verified",
    verifiedDate: "12 June 2026",
  },
  bank: {
    bankName: "Maybank",
    accountHolderName: "Amina Binti Rahman",
    accountNumber: "5142 38•• ••9021",
  },
  nominee: {
    name: "Farid Bin Rahman",
    relationship: "Brother",
    phone: "+60 13-772 1844",
    icNumberMasked: "880421-10-••••",
  },
  security: {
    passwordStatus: "Active",
    lastLogin: "18 Jun 2026, 09:24 AM",
  },
};

export const opportunities: Opportunity[] = [
  ["opp-kajang", "kajang-terrace-house", "Kajang Terrace House", "open", "Kajang, Selangor", "Selangor", 600000, 420000, 128, "2026-07-15"],
  ["opp-shah-alam", "shah-alam-terrace-house", "Shah Alam Terrace House", "closing soon", "Shah Alam, Selangor", "Selangor", 720000, 612000, 146, "2026-06-30"],
  ["opp-ampang", "ampang-terrace-house", "Ampang Terrace House", "open", "Ampang, Selangor", "Selangor", 560000, 302400, 94, "2026-08-05"],
  ["opp-cheras", "cheras-terrace-house", "Cheras Terrace House", "closed", "Cheras, Kuala Lumpur", "Kuala Lumpur", 680000, 680000, 172, "2026-06-10"],
  ["opp-seremban", "seremban-terrace-house", "Seremban Terrace House", "open", "Seremban, Negeri Sembilan", "Negeri Sembilan", 480000, 249600, 81, "2026-08-20"],
  ["opp-ipoh", "ipoh-terrace-house", "Ipoh Terrace House", "open", "Ipoh, Perak", "Perak", 420000, 294000, 103, "2026-07-28"],
].map(([id, slug, title, status, location, state, targetAmount, collectedAmount, participants, closeDate], index) => ({
  id: `CAM-${String(index + 1).padStart(6, "0")}`,
  campaignId: `CAM-${String(index + 1).padStart(6, "0")}`,
  campaignCode: `${["PP-SGR", "PP-SGR", "PP-SGR", "PP-KL", "PP-NS", "PP-PRK"][index]}-2026-${String(index + 1).padStart(3, "0")}`,
  slug: slug as string,
  title: title as string,
  status: status as OpportunityStatus,
  location: location as string,
  state: state as string,
  propertyType: "Terrace House",
  assetCategory: "Residential Property",
  occupancyStatus: index % 2 === 0 ? "Vacant Possession Expected" : "Tenanted / To Be Verified",
  estimatedYield: "18.0% p.a.",
  tenure: index % 2 === 0 ? "Freehold" : "Leasehold",
  tenureAlias: index % 2 === 0 ? "FH" : "LH",
  isLaca: index % 2 === 1,
  bumiStatus: index % 3 === 0 ? "Non-Bumi Lot" : "Open Market",
  builtUpArea: `${1600 + index * 90} sq ft`,
  landArea: `${1400 + index * 80} sq ft`,
  bedrooms: 3 + (index % 2),
  bathrooms: 2 + (index % 2),
  auctionDate: closeDate as string,
  reservePrice: (targetAmount as number) - 50000,
  yearBuilt: `${2010 + index}`,
  fullAddress: `${12 + index}, Jalan PAPAIPAY ${index + 1}, ${location}`,
  minimumParticipation: 500,
  maximumParticipation: index % 2 === 0 ? 60000 : 75000,
  targetAmount: targetAmount as number,
  collectedAmount: collectedAmount as number,
  participants: participants as number,
  closeDate: closeDate as string,
  auctionPrice: (targetAmount as number) - 50000,
  marketValue: (targetAmount as number) + 90000,
  valuationDate: "2026-05-31",
  valuationReport: "Independent desktop valuation summary available for member review",
  imageUrl: terraceImages[index % terraceImages.length],
  gallery: terraceImages,
  galleryCount: terraceImages.length,
  daysRemaining: Math.max(0, Math.ceil((new Date(closeDate as string).getTime() - new Date("2026-06-17").getTime()) / 86400000)),
  principalProtectionEnabled: true,
  aboutCampaign: `This campaign gives members exposure to ${title}, with proceeds managed through Papaipay's property campaign operating process.`,
  importantInformation: "All participation is subject to campaign documents and terms. Please review the documents carefully before participating.",
  updates: [
    { title: "Campaign progress updated", date: "2026-06-14", body: "Collected amount and current participants were refreshed for this property." },
    { title: "Auction file reviewed", date: "2026-06-09", body: "Key auction and valuation references were checked for portal display." },
  ],
  faqs: [
    { question: "Is the holding return guaranteed monthly?", answer: "No monthly payment is made. Holding Return accrues during the holding period and is paid once during final distribution if the campaign completes within the rules." },
    { question: "How do members participate?", answer: "Members enter an RM participation amount within the campaign minimum and maximum participation range." },
  ],
  holdingReturnRate: "1.5% per month",
  returnType: index % 3 === 0 ? "Fixed" : index % 3 === 1 ? "Target" : "Up To",
  maximumHoldingPeriodMonths: 24,
  principalProtectionRule: "If the asset is not sold after 24 months, return principal / participation amount only with no Holding Return or Profit Distribution.",
  documents: ["Proclamation of Sale", "Conditions of Sale", "Title Search", "Valuation Report", "Property Photos", "Location Map", "Legal Documents"],
  riskSummary: "Auction property participation may be affected by reserve price, title review, vacancy, repairs, market liquidity, timing, and disposal conditions. Distributions are not guaranteed.",
}));

export const dashboardMetrics = [
  { label: "Total Investment", value: "RM125,000", helper: "Across all participation records", trend: "+12.4% vs previous quarter" },
  { label: "Active Campaigns", value: "4", helper: "Currently active records", trend: "+1 campaign this month" },
  { label: "Completed Properties", value: "2", helper: "Completed participation records", trend: "+1 this quarter" },
  { label: "Total Distribution", value: "RM8,500", helper: "Recorded to date", trend: "+RM850 this month" },
  { label: "Participation In Progress", value: "RM15,000", helper: "Pending completion", trend: "2 records pending" },
  { label: "Distribution Processing", value: "RM3,200", helper: "Scheduled processing", trend: "Next cycle in review" },
  { label: "This Month Distribution", value: "RM850", helper: "June distribution activity", trend: "+8.2% month over month" },
  { label: "Holding Return Preview", value: "7.8%", helper: "Accrued until final distribution", trend: "Final distribution view" },
];

export const myProperties = [
  { name: "Kajang Terrace House", location: "Kajang, Selangor", amount: "RM42,500", status: "active", latestUpdate: "Campaign progress updated" },
  { name: "Shah Alam Terrace House", location: "Shah Alam, Selangor", amount: "RM55,000", status: "closing soon", latestUpdate: "Closing date reminder posted" },
  { name: "Ipoh Terrace House", location: "Ipoh, Perak", amount: "RM27,500", status: "active", latestUpdate: "Valuation summary refreshed" },
];

export const recentUpdates = [
  { title: "Campaign progress refreshed", date: "2026-06-14", body: "Participation totals and participant counts were updated for active terrace house listings." },
  { title: "Distribution processing window posted", date: "2026-06-11", body: "Upcoming distribution processing dates are available for member review." },
  { title: "Auction document review completed", date: "2026-06-08", body: "Selected auction references were refreshed for the member portal preview." },
];

export const announcements = [
  { title: "Member portal preview", date: "2026-06-14", body: "Dashboard and auction terrace house listing screens are available in preview mode." },
  { title: "Profile reminder", date: "2026-06-03", body: "Keep profile and verification details current to avoid participation delays." },
];

export const memberSections = {
  participations: [
    { title: "Kajang Terrace House", meta: "RM42,500 participation amount", status: "under review", body: "Participation interest is being reviewed against the campaign range and member eligibility." },
    { title: "Ipoh Terrace House", meta: "RM15,000 pending participation", status: "draft", body: "Draft participation details are ready for member review before submission." },
  ],
  distributions: [
    { title: "Seremban Terrace House", meta: "RM1,240 scheduled", status: "scheduled", body: "Distribution processing is scheduled for July 12, 2026." },
    { title: "Cheras Terrace House", meta: "RM2,850 received", status: "received", body: "Distribution received was recorded with reference PP-DIST-7782." },
  ],
  reports: [
    { title: "Member participation statement", meta: "Q2 2026", status: "available", body: "Statement summarizes participation activity for member review." },
    { title: "Distribution history report", meta: "Year to date", status: "available", body: "Report record shows distribution totals and related auction property references." },
  ],
  notifications: [], announcements: [], profileKyc: [], activeProperties: [], completedProperties: []
};

export type PortfolioStatus =
  | "Campaign Opened"
  | "Property Secured"
  | "Renovation In Progress"
  | "Listed For Sale"
  | "Under Offer"
  | "Distribution Processing"
  | "Completed";

export type DistributionState = "Pending" | "Processing" | "Paid" | "Completed";

export type PortfolioRecord = {
  participationId: string;
  campaignId: string;
  campaignCode: string;
  memberId: string;
  slug: string;
  propertyName: string;
  location: string;
  participationAmount: number;
  status: PortfolioStatus;
  latestUpdate: string;
  distributionStatus: DistributionState;
  holdingPeriodMonths: number;
  accruedHoldingReturn: number;
  principalReturn: number;
  holdingReturn: number;
  profitDistribution: number;
  finalDistributionTotal: number;
  distributionId: string;
  distributionBatchId: string;
  paymentReference: string;
  adminNotes: string;
  distributionReceived?: number;
  paidDate?: string;
  updates: { date: string; title: string }[];
  property: {
    propertyType: string;
    tenure: string;
    bumiStatus: string;
    targetAmount: number;
    collectedAmount: number;
    currentParticipants: number;
  };
};

export const portfolioRecords: PortfolioRecord[] = [
  {
    memberId: "MEM-000001",
    campaignCode: "PP-SGR-2026-001",
    participationId: "PAR-000001",
    campaignId: "CAM-000001",
    slug: "kajang-terrace-house",
    propertyName: "Kajang Terrace House",
    location: "Kajang, Selangor",
    participationAmount: 10000,
    holdingPeriodMonths: 6,
    accruedHoldingReturn: 2768,
    principalReturn: 10000,
    holdingReturn: 2768,
    profitDistribution: 900,
    finalDistributionTotal: 13668,
    distributionId: "DIS-000000",
    distributionBatchId: "DBT-000000",
    paymentReference: "PAY-000000",
    adminNotes: "Calculation reviewed; manual transfer required before marking paid",
    status: "Renovation In Progress",
    latestUpdate: "Renovation 60% completed",
    distributionStatus: "Pending",
    updates: [
      { date: "12 Jun 2026", title: "Valuation report uploaded" },
      { date: "18 Jun 2026", title: "Legal review completed" },
      { date: "24 Jun 2026", title: "Renovation progress updated" },
    ],
    property: { propertyType: "Terrace House", tenure: "Freehold", bumiStatus: "Non-Bumi Lot", targetAmount: 600000, collectedAmount: 420000, currentParticipants: 128 },
  },
  {
    memberId: "MEM-000001",
    participationId: "PAR-000002",
    campaignId: "CAM-000002",
    campaignCode: "PP-SGR-2026-002",
    slug: "shah-alam-terrace-house",
    propertyName: "Shah Alam Terrace House",
    location: "Shah Alam, Selangor",
    participationAmount: 32000,
    holdingPeriodMonths: 15,
    accruedHoldingReturn: 2250,
    principalReturn: 32000,
    holdingReturn: 2250,
    profitDistribution: 750,
    finalDistributionTotal: 35000,
    distributionId: "DIS-000001",
    distributionBatchId: "DBT-000001",
    paymentReference: "PAY-000001",
    adminNotes: "Calculation reviewed; manual transfer required before marking paid",
    status: "Campaign Opened",
    latestUpdate: "Campaign collection reached 85%",
    distributionStatus: "Pending",
    updates: [
      { date: "04 Jun 2026", title: "Auction documents reviewed" },
      { date: "11 Jun 2026", title: "Campaign opened for members" },
      { date: "17 Jun 2026", title: "Collection progress refreshed" },
    ],
    property: { propertyType: "Terrace House", tenure: "Leasehold", bumiStatus: "Open Market", targetAmount: 720000, collectedAmount: 612000, currentParticipants: 146 },
  },
  {
    memberId: "MEM-000001",
    participationId: "PAR-000003",
    campaignId: "CAM-000003",
    campaignCode: "PP-SGR-2026-003",
    slug: "ampang-terrace-house",
    propertyName: "Ampang Terrace House",
    location: "Ampang, Selangor",
    participationAmount: 18000,
    holdingPeriodMonths: 2,
    accruedHoldingReturn: 0,
    principalReturn: 18000,
    holdingReturn: 0,
    profitDistribution: 0,
    finalDistributionTotal: 18000,
    distributionId: "DIS-000002",
    distributionBatchId: "DBT-000002",
    paymentReference: "PAY-000002",
    adminNotes: "Calculation reviewed; manual transfer required before marking paid",
    status: "Property Secured",
    latestUpdate: "Title search completed",
    distributionStatus: "Pending",
    updates: [
      { date: "02 Jun 2026", title: "Campaign closed after target review" },
      { date: "09 Jun 2026", title: "Auction bid confirmed" },
      { date: "16 Jun 2026", title: "Title search completed" },
    ],
    property: { propertyType: "Terrace House", tenure: "Freehold", bumiStatus: "Open Market", targetAmount: 560000, collectedAmount: 302400, currentParticipants: 94 },
  },
  {
    memberId: "MEM-000001",
    participationId: "PAR-000004",
    campaignId: "CAM-000004",
    campaignCode: "PP-KL-2026-004",
    slug: "cheras-apartment",
    propertyName: "Cheras Apartment",
    location: "Cheras, Kuala Lumpur",
    participationAmount: 12500,
    holdingPeriodMonths: 4,
    accruedHoldingReturn: 1215,
    principalReturn: 12500,
    holdingReturn: 1215,
    profitDistribution: 540,
    finalDistributionTotal: 14255,
    distributionId: "DIS-000003",
    distributionBatchId: "DBT-000003",
    paymentReference: "PAY-000003",
    adminNotes: "Calculation reviewed; manual transfer required before marking paid",
    status: "Listed For Sale",
    latestUpdate: "Sale listing published",
    distributionStatus: "Pending",
    updates: [
      { date: "28 May 2026", title: "Repair works completed" },
      { date: "06 Jun 2026", title: "Agent viewing schedule confirmed" },
      { date: "14 Jun 2026", title: "Sale listing published" },
    ],
    property: { propertyType: "Apartment", tenure: "Leasehold", bumiStatus: "Non-Bumi Lot", targetAmount: 360000, collectedAmount: 360000, currentParticipants: 88 },
  },
  {
    memberId: "MEM-000001",
    participationId: "PAR-000005",
    campaignId: "CAM-000005",
    campaignCode: "PP-NS-2026-005",
    slug: "seremban-semi-d",
    propertyName: "Seremban Semi-D",
    location: "Seremban, Negeri Sembilan",
    participationAmount: 24000,
    holdingPeriodMonths: 9,
    accruedHoldingReturn: 1406,
    principalReturn: 24000,
    holdingReturn: 1406,
    profitDistribution: 620,
    finalDistributionTotal: 26026,
    distributionId: "DIS-000004",
    distributionBatchId: "DBT-000004",
    paymentReference: "PAY-000004",
    adminNotes: "Calculation reviewed; manual transfer required before marking paid",
    status: "Distribution Processing",
    latestUpdate: "Distribution batch approved",
    distributionStatus: "Processing",
    updates: [
      { date: "25 May 2026", title: "Buyer balance payment received" },
      { date: "03 Jun 2026", title: "Completion statement prepared" },
      { date: "15 Jun 2026", title: "Distribution batch approved" },
    ],
    property: { propertyType: "Semi-D", tenure: "Freehold", bumiStatus: "Open Market", targetAmount: 820000, collectedAmount: 820000, currentParticipants: 164 },
  },
  {
    memberId: "MEM-000001",
    participationId: "PAR-000006",
    campaignId: "CAM-000006",
    campaignCode: "PP-SGR-2025-007",
    slug: "bangi-terrace-house",
    propertyName: "Bangi Terrace House",
    location: "Bangi, Selangor",
    participationAmount: 8000,
    holdingPeriodMonths: 11,
    accruedHoldingReturn: 3240,
    principalReturn: 8000,
    holdingReturn: 3240,
    profitDistribution: 1200,
    finalDistributionTotal: 12440,
    distributionId: "DIS-000005",
    distributionBatchId: "DBT-000005",
    paymentReference: "PAY-000005",
    adminNotes: "Calculation reviewed; manual transfer required before marking paid",
    status: "Completed",
    latestUpdate: "Distribution paid to member account",
    distributionStatus: "Completed",
    distributionReceived: 9600,
    paidDate: "15 Aug 2026",
    updates: [
      { date: "18 Jul 2026", title: "Sale completed" },
      { date: "05 Aug 2026", title: "Distribution processing completed" },
      { date: "15 Aug 2026", title: "Distribution paid to member account" },
    ],
    property: { propertyType: "Terrace House", tenure: "Freehold", bumiStatus: "Non-Bumi Lot", targetAmount: 540000, collectedAmount: 540000, currentParticipants: 112 },
  },
  {
    memberId: "MEM-000001",
    participationId: "PAR-000007",
    campaignId: "CAM-000007",
    campaignCode: "PP-SGR-2026-006",
    slug: "subang-condominium",
    propertyName: "Subang Condominium",
    location: "Subang Jaya, Selangor",
    participationAmount: 20500,
    holdingPeriodMonths: 25,
    accruedHoldingReturn: 960,
    principalReturn: 20500,
    holdingReturn: 960,
    profitDistribution: 640,
    finalDistributionTotal: 22100,
    distributionId: "DIS-000006",
    distributionBatchId: "DBT-000006",
    paymentReference: "PAY-000006",
    adminNotes: "Calculation reviewed; manual transfer required before marking paid",
    status: "Under Offer",
    latestUpdate: "Buyer offer accepted pending legal review",
    distributionStatus: "Pending",
    updates: [
      { date: "30 May 2026", title: "Viewing completed with shortlisted buyers" },
      { date: "10 Jun 2026", title: "Buyer offer received" },
      { date: "19 Jun 2026", title: "Buyer offer accepted pending legal review" },
    ],
    property: { propertyType: "Condominium", tenure: "Leasehold", bumiStatus: "Open Market", targetAmount: 650000, collectedAmount: 650000, currentParticipants: 139 },
  },
];

export function formatRM(amount: number) {
  return `RM ${amount.toLocaleString("en-MY")}`;
}

export type DistributionStatus = "Pending" | "Processing" | "Paid" | "Completed";

export type DistributionRecord = {
  distributionId: string;
  campaignId: string;
  campaignCode: string;
  participationId: string;
  memberId: string;
  slug: string;
  propertyName: string;
  location: string;
  participationAmount: number;
  principalReturn: number;
  holdingReturn: number;
  profitDistribution: number;
  distributionAmount: number;
  status: DistributionStatus;
  paidDate: string;
  referenceNumber: string;
  distributionBatchId: string;
  paymentReference: string;
  notes: string;
};

export const distributionRecords: DistributionRecord[] = [
  {
    distributionId: "DIS-000001",
    campaignId: "CAM-000001",
    campaignCode: "PP-SGR-2025-007",
    participationId: "PAR-000001",
    memberId: "MEM-000001",
    slug: "bangi-terrace-house-completion",
    propertyName: "Bangi Terrace House",
    location: "Bangi, Selangor",
    participationAmount: 8000,
    principalReturn: 8000,
    holdingReturn: 960,
    profitDistribution: 640,
    distributionAmount: 2200,
    status: "Completed",
    paidDate: "15 Aug 2026",
    distributionBatchId: "DBT-000001",
    referenceNumber: "PP-DIST-2026-0815",
    paymentReference: "PAY-000001",
    notes: "Distribution completed after final auction residential property records were reconciled.",
  },
  {
    distributionId: "DIS-000002",
    campaignId: "CAM-000002",
    campaignCode: "PP-NS-2026-005",
    participationId: "PAR-000002",
    memberId: "MEM-000001",
    slug: "seremban-terrace-house-processing",
    propertyName: "Seremban Terrace House",
    location: "Seremban, Negeri Sembilan",
    participationAmount: 24000,
    principalReturn: 24000,
    holdingReturn: 3240,
    profitDistribution: 1200,
    distributionAmount: 3200,
    status: "Processing",
    paidDate: "Processing",
    distributionBatchId: "DBT-000002",
    referenceNumber: "PP-DIST-2026-0712",
    paymentReference: "PAY-000002",
    notes: "Payment file is being reviewed before release to the member account.",
  },
  {
    distributionId: "DIS-000003",
    campaignId: "CAM-000003",
    campaignCode: "PP-KL-2026-004",
    participationId: "PAR-000003",
    memberId: "MEM-000001",
    slug: "cheras-terrace-house-paid",
    propertyName: "Cheras Terrace House",
    location: "Cheras, Kuala Lumpur",
    participationAmount: 12500,
    principalReturn: 12500,
    holdingReturn: 1406,
    profitDistribution: 620,
    distributionAmount: 2850,
    status: "Paid",
    paidDate: "28 May 2026",
    distributionBatchId: "DBT-000003",
    referenceNumber: "PP-DIST-2026-0528",
    paymentReference: "PAY-000003",
    notes: "Payment confirmation is available for this completed distribution record.",
  },
  {
    distributionId: "DIS-000004",
    campaignId: "CAM-000004",
    campaignCode: "PP-SGR-2026-001",
    participationId: "PAR-000004",
    memberId: "MEM-000001",
    slug: "kajang-terrace-house-pending",
    propertyName: "Kajang Terrace House",
    location: "Kajang, Selangor",
    participationAmount: 10000,
    principalReturn: 10000,
    holdingReturn: 2250,
    profitDistribution: 750,
    distributionAmount: 5000,
    status: "Pending",
    paidDate: "Pending",
    distributionBatchId: "DBT-000004",
    referenceNumber: "PP-DIST-2026-0904",
    paymentReference: "PAY-000004",
    notes: "Distribution amount is pending completion checks for the auction residential property record.",
  },
  {
    distributionId: "DIS-000005",
    campaignId: "CAM-000005",
    campaignCode: "PP-PRK-2026-006",
    participationId: "PAR-000005",
    memberId: "MEM-000001",
    slug: "ipoh-terrace-house-completed",
    propertyName: "Ipoh Terrace House",
    location: "Ipoh, Perak",
    participationAmount: 27500,
    principalReturn: 27500,
    holdingReturn: 0,
    profitDistribution: 950,
    distributionAmount: 3450,
    status: "Completed",
    paidDate: "10 Apr 2026",
    distributionBatchId: "DBT-000005",
    referenceNumber: "PP-DIST-2026-0410",
    paymentReference: "PAY-000005",
    notes: "Distribution records have been marked completed.",
  },
];

export const completedCampaigns = [
  {
    slug: "bangi-terrace-house",
    campaignId: "CAM-000007",
    campaignCode: "PP-SGR-2025-007",
    campaignName: "Bangi Terrace House",
    status: "Completed",
    holdingPeriod: "15 months",
    purchasePrice: 510000,
    salePrice: 645000,
    holdingReturn: "22.5%",
    profitDistribution: "18%",
    totalDistribution: "40.5%",
    finalDistributionAmount: 112400,
    distributionDate: "15 Aug 2026",
  },
  {
    slug: "cheras-apartment",
    campaignId: "CAM-000008",
    campaignCode: "PP-KL-2025-008",
    campaignName: "Cheras Apartment",
    status: "Completed",
    holdingPeriod: "12 months",
    purchasePrice: 360000,
    salePrice: 438000,
    holdingReturn: "18%",
    profitDistribution: "12%",
    totalDistribution: "30%",
    finalDistributionAmount: 37500,
    distributionDate: "28 May 2026",
  },
];

export type ReportStatus = "Available" | "Ready" | "Generated";

export type ReportRecord = {
  slug: string;
  reportName: string;
  reportType: string;
  period: string;
  generatedDate: string;
  status: ReportStatus;
  content: {
    participationAmount: number;
    participationRecords: number;
    distributionAmount: number;
    distributionNote: string;
    propertyRecords: string[];
  };
};

export const reportRecords: ReportRecord[] = [
  {
    slug: "participation-statement-q2-2026",
    reportName: "Participation Statement Q2 2026",
    reportType: "Participation Statements",
    period: "Apr 2026 - Jun 2026",
    generatedDate: "18 Jun 2026",
    status: "Available",
    content: {
      participationAmount: 60500,
      participationRecords: 3,
      distributionAmount: 0,
      distributionNote: "No distribution payment recorded for this period.",
      propertyRecords: ["Kajang Terrace House", "Shah Alam Terrace House", "Ipoh Terrace House"],
    },
  },
  {
    slug: "distribution-statement-may-2026",
    reportName: "Distribution Statement May 2026",
    reportType: "Distribution Statements",
    period: "May 2026",
    generatedDate: "01 Jun 2026",
    status: "Ready",
    content: {
      participationAmount: 12500,
      participationRecords: 1,
      distributionAmount: 2850,
      distributionNote: "One paid distribution record is available.",
      propertyRecords: ["Cheras Terrace House"],
    },
  },
  {
    slug: "annual-summary-2026-preview",
    reportName: "Annual Summary 2026 Preview",
    reportType: "Annual Summaries",
    period: "Jan 2026 - Jun 2026",
    generatedDate: "18 Jun 2026",
    status: "Generated",
    content: {
      participationAmount: 93000,
      participationRecords: 5,
      distributionAmount: 8500,
      distributionNote: "Distribution records include paid and completed payments only.",
      propertyRecords: ["Bangi Terrace House", "Cheras Terrace House", "Ipoh Terrace House"],
    },
  },
];
