export type OpportunityStatus = "open" | "closing soon" | "closed";

export type Opportunity = {
  id: string;
  slug: string;
  title: string;
  status: OpportunityStatus;
  location: string;
  state: string;
  propertyType: string;
  tenure: string;
  bumiStatus: string;
  builtUpArea: string;
  landArea: string;
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
  updates: { title: string; date: string; body: string }[];
  faqs: { question: string; answer: string }[];
  riskSummary: string;
};

const terraceImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
];

export const memberProfile = { firstName: "Amina", lastName: "Rahman", memberNumber: "PPM-10482", email: "amina.rahman@example.com", kycStatus: "approved" };

export const opportunities: Opportunity[] = [
  ["opp-kajang", "kajang-terrace-house", "Kajang Terrace House", "open", "Kajang, Selangor", "Selangor", 600000, 420000, 128, "2026-07-15"],
  ["opp-shah-alam", "shah-alam-terrace-house", "Shah Alam Terrace House", "closing soon", "Shah Alam, Selangor", "Selangor", 720000, 612000, 146, "2026-06-30"],
  ["opp-ampang", "ampang-terrace-house", "Ampang Terrace House", "open", "Ampang, Selangor", "Selangor", 560000, 302400, 94, "2026-08-05"],
  ["opp-cheras", "cheras-terrace-house", "Cheras Terrace House", "closed", "Cheras, Kuala Lumpur", "Kuala Lumpur", 680000, 680000, 172, "2026-06-10"],
  ["opp-seremban", "seremban-terrace-house", "Seremban Terrace House", "open", "Seremban, Negeri Sembilan", "Negeri Sembilan", 480000, 249600, 81, "2026-08-20"],
  ["opp-ipoh", "ipoh-terrace-house", "Ipoh Terrace House", "open", "Ipoh, Perak", "Perak", 420000, 294000, 103, "2026-07-28"],
].map(([id, slug, title, status, location, state, targetAmount, collectedAmount, participants, closeDate], index) => ({
  id: id as string,
  slug: slug as string,
  title: title as string,
  status: status as OpportunityStatus,
  location: location as string,
  state: state as string,
  propertyType: "Terrace House",
  tenure: index % 2 === 0 ? "Freehold" : "Leasehold",
  bumiStatus: index % 3 === 0 ? "Non-Bumi Lot" : "Open Market",
  builtUpArea: `${1600 + index * 90} sq ft`,
  landArea: `${1400 + index * 80} sq ft`,
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
  updates: [
    { title: "Campaign progress updated", date: "2026-06-14", body: "Collected amount and current participants were refreshed for this property." },
    { title: "Auction file reviewed", date: "2026-06-09", body: "Key auction and valuation references were checked for portal display." },
  ],
  faqs: [
    { question: "Is the estimated outcome guaranteed?", answer: "No. The estimated outcome is illustrative and depends on auction, market, timing, cost, and disposal conditions." },
    { question: "How do members participate?", answer: "Members enter an RM participation amount within the campaign minimum and maximum participation range." },
  ],
  riskSummary: "Auction property participation may be affected by reserve price, title review, vacancy, repairs, market liquidity, timing, and disposal conditions. Distributions are not guaranteed.",
}));

export const dashboardMetrics = [
  { label: "Total Participation", value: "RM125,000", helper: "Across member records" },
  { label: "Active Properties", value: "4", helper: "Open or in progress" },
  { label: "Completed Properties", value: "2", helper: "Completed records" },
  { label: "Distribution Received", value: "RM8,500", helper: "Recorded to date" },
  { label: "Participation In Progress", value: "RM15,000", helper: "Pending completion" },
  { label: "Distribution Processing", value: "RM3,200", helper: "Scheduled processing" },
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
    { title: "Member participation statement", meta: "Q2 2026", status: "available", body: "Mock statement summarizes participation activity and can be used for UI review." },
    { title: "Distribution history report", meta: "Year to date", status: "available", body: "Mock report record shows distribution totals and related auction property references." },
  ],
  settings: [
    { title: "Communication preferences", meta: "Email enabled", status: "active", body: "Preference controls are represented as read-only mock records for this foundation." },
    { title: "Display settings", meta: "Default workspace", status: "active", body: "Member workspace display defaults are shown without persistence or backend storage." },
  ],
  notifications: [], announcements: [], profileKyc: [], activeProperties: [], completedProperties: []
};
