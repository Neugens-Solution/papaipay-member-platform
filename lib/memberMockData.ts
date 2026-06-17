export type OpportunityStatus = "open" | "closing soon" | "completed";

export type Opportunity = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: OpportunityStatus;
  location: string;
  propertyType: string;
  tenure: string;
  minimumParticipation: number;
  maximumParticipation: number;
  targetAmount: number;
  participationAmount: number;
  openDate: string;
  closeDate: string;
  expectedProjectStartDate: string;
  eligibilitySummary: string;
  riskSummary: string;
  imageUrl: string;
  gallery: string[];
  highlights: string[];
  documents: string[];
  faqs: { question: string; answer: string }[];
};

export const memberProfile = {
  firstName: "Amina",
  lastName: "Rahman",
  memberNumber: "PPM-10482",
  email: "amina.rahman@example.com",
  kycStatus: "approved",
};

export const opportunities: Opportunity[] = [
  {
    id: "opp-damansara-auction",
    slug: "auction-condominium",
    title: "Auction Condominium",
    summary: "Auction listing for a leasehold condominium in an established Klang Valley neighbourhood.",
    category: "Auction Residential",
    status: "open",
    location: "Petaling Jaya, Selangor",
    propertyType: "Condominium",
    tenure: "Leasehold",
    minimumParticipation: 500,
    maximumParticipation: 50000,
    targetAmount: 120000,
    participationAmount: 85200,
    openDate: "2026-05-20",
    closeDate: "2026-07-15",
    expectedProjectStartDate: "2026-08-01",
    eligibilitySummary: "Open to approved members reviewing auction-based property participation records.",
    riskSummary: "Auction participation involves reserve price, title review, vacancy, market liquidity, timing, and disposal risks. Distributions are not guaranteed.",
    imageUrl: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Auction notice summary", "External facade reference", "Comparable transaction notes"],
    highlights: ["Klang Valley address", "Below recent asking range", "Clear auction timeline"],
    documents: ["Auction proclamation", "Property title summary", "Risk disclosure"],
    faqs: [
      { question: "When does participation close?", answer: "The campaign is scheduled to close on July 15, 2026, unless the participation target is reached earlier." },
      { question: "How are updates shared?", answer: "Members receive auction and property status updates through the portal announcements and property update sections." },
    ],
  },
  {
    id: "opp-shah-alam-shoplot",
    slug: "auction-shoplot",
    title: "Auction Shoplot",
    summary: "Shoplot auction listing near mature residential areas and daily retail activity.",
    category: "Auction Shoplot",
    status: "closing soon",
    location: "Shah Alam, Selangor",
    propertyType: "Shoplot",
    tenure: "Freehold",
    minimumParticipation: 1000,
    maximumParticipation: 75000,
    targetAmount: 240000,
    participationAmount: 204000,
    openDate: "2026-05-05",
    closeDate: "2026-06-30",
    expectedProjectStartDate: "2026-07-20",
    eligibilitySummary: "Open to approved members while the campaign participation range remains available.",
    riskSummary: "Auction status, occupancy, renovation cost, tenant demand, and resale liquidity conditions may affect outcomes.",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Street frontage reference", "Lot positioning notes", "Area access map"],
    highlights: ["Corner-lot visibility", "Mature township catchment", "Short participation window"],
    documents: ["Auction memo", "Comparable summary", "Disclosure package"],
    faqs: [{ question: "Is this campaign still open?", answer: "The campaign remains open with a limited participation window before the close date." }],
  },
  {
    id: "opp-kajang-terrace",
    slug: "auction-terrace-house",
    title: "Auction Terrace House",
    summary: "Terrace house auction listing with clear campaign timing and member participation details.",
    category: "Auction Residential",
    status: "open",
    location: "Kajang, Selangor",
    propertyType: "Terrace House",
    tenure: "Freehold",
    minimumParticipation: 500,
    maximumParticipation: 60000,
    targetAmount: 180000,
    participationAmount: 79200,
    openDate: "2026-06-01",
    closeDate: "2026-08-10",
    expectedProjectStartDate: "2026-09-01",
    eligibilitySummary: "Open to members with approved profile and auction participation readiness.",
    riskSummary: "Auction completion timing, reserve price, title review, vacancy, market liquidity, and disposal risks apply.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Site access reference", "Neighbourhood notes", "Planning summary"],
    highlights: ["Residential address", "Clear auction file", "Structured review period"],
    documents: ["Auction brief", "Timeline overview", "Risk disclosure"],
    faqs: [{ question: "What is the expected start date?", answer: "The expected project start date is September 1, 2026." }],
  },
];

export const dashboardMetrics = [
  { label: "Total Participation", value: "RM 125,000", helper: "Across current records" },
  { label: "Active Properties", value: "4", helper: "Currently monitored" },
  { label: "Completed Properties", value: "2", helper: "Archived summaries" },
  { label: "Distribution Received", value: "RM 8,500", helper: "Recorded distributions" },
  { label: "Participation In Progress", value: "RM 15,000", helper: "Under review" },
  { label: "Distribution Processing", value: "RM 3,200", helper: "Scheduled items" },
];

export const myProperties = [
  { name: "Auction Condominium", location: "Petaling Jaya, Selangor", amount: "RM 42,500", status: "active", latestUpdate: "Auction document review completed" },
  { name: "Auction Shoplot", location: "Shah Alam, Selangor", amount: "RM 55,000", status: "closing soon", latestUpdate: "Campaign close reminder posted" },
  { name: "Auction Terrace House", location: "Kajang, Selangor", amount: "RM 27,500", status: "active", latestUpdate: "Title review timeline updated" },
];

export const recentUpdates = [
  { title: "Condominium auction review completed", date: "2026-06-12", body: "Updated reserve price notes and comparable transaction references are now available for review." },
  { title: "Shoplot participation window narrowing", date: "2026-06-10", body: "Member participation activity increased as the auction campaign approaches its close date." },
  { title: "Distribution schedule preview posted", date: "2026-06-05", body: "Upcoming distribution processing windows were refreshed for active member property records." },
];

export const announcements = [
  { title: "Member portal preview", date: "2026-06-14", body: "Dashboard and auction listing screens are available in preview mode." },
  { title: "Profile reminder", date: "2026-06-03", body: "Keep profile and verification details current to avoid participation delays." },
];

export const memberSections = {
  participations: [
    { title: "Auction Condominium", meta: "RM 42,500 participation amount", status: "under review", body: "Participation interest is being reviewed against the campaign range and member eligibility." },
    { title: "Auction Terrace House", meta: "RM 15,000 pending participation", status: "draft", body: "Draft participation details are ready for member review before submission." },
  ],
  activeProperties: [
    { title: "Auction Apartment", meta: "Next milestone: title review", status: "on track", body: "Auction completion records and post-award documentation are progressing within the expected review timeline." },
    { title: "Auction Semi-D", meta: "Distribution preview: July 2026", status: "active", body: "Disposal planning notes and comparable market observations remain within the active monitoring plan." },
  ],
  completedProperties: [
    { title: "Auction Shoplot", meta: "Completed March 2026", status: "complete", body: "Final outcome summary and distribution history are archived for member reporting." },
    { title: "Auction Apartment", meta: "Completed January 2026", status: "complete", body: "Property lifecycle records are available for historical review." },
  ],
  distributions: [
    { title: "Auction Apartment", meta: "RM 1,240 scheduled", status: "scheduled", body: "Distribution processing is scheduled for July 12, 2026 through the member distribution channel." },
    { title: "Auction Shoplot", meta: "RM 2,850 received", status: "received", body: "Distribution received was recorded with reference PP-DIST-7782." },
  ],
  notifications: [
    { title: "Auction status update", meta: "2026-06-16", status: "unread", body: "Auction Shoplot is approaching its campaign close date with a limited participation window." },
    { title: "Profile review complete", meta: "2026-06-09", status: "read", body: "Your mock profile remains approved for available member listings." },
  ],
  announcements: [
    { title: "Member portal preview", meta: "2026-06-14", status: "published", body: "Dashboard and auction listing pages are available for member portal review." },
    { title: "Scheduled maintenance notice", meta: "2026-06-08", status: "published", body: "A future maintenance window will be announced before any production release activity." },
  ],
  profileKyc: [
    { title: "Amina Rahman", meta: "PPM-10482", status: "approved", body: "Member profile, contact details, and review status are represented with mock data only." },
    { title: "Document checklist", meta: "Identity and address", status: "complete", body: "Required verification checklist items are marked complete for prototype navigation." },
  ],
  reports: [
    { title: "Member participation statement", meta: "Q2 2026", status: "available", body: "Mock statement summarizes participation activity and can be used for UI review." },
    { title: "Distribution history report", meta: "Year to date", status: "available", body: "Mock report record shows distribution totals and related auction property references." },
  ],
  settings: [
    { title: "Communication preferences", meta: "Email enabled", status: "active", body: "Preference controls are represented as read-only mock records for this foundation." },
    { title: "Display settings", meta: "Default workspace", status: "active", body: "Member workspace display defaults are shown without persistence or backend storage." },
  ],
};
