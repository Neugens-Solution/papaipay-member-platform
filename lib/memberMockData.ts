export type OpportunityStatus = "open" | "closing soon" | "funded";

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
  unitPrice: number;
  targetAmount: number;
  fundedAmount: number;
  availableUnits: number;
  totalUnits: number;
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
    unitPrice: 850,
    targetAmount: 120000,
    fundedAmount: 85200,
    availableUnits: 145,
    totalUnits: 500,
    openDate: "2026-05-20",
    closeDate: "2026-07-15",
    expectedProjectStartDate: "2026-08-01",
    eligibilitySummary: "Open to approved members reviewing auction-based property participation records.",
    riskSummary: "Auction participation involves reserve price, title review, vacancy, market liquidity, timing, and disposal risks. Returns are not guaranteed.",
    imageUrl: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Auction notice summary", "External facade reference", "Comparable transaction notes"],
    highlights: ["Klang Valley address", "Below recent asking range", "Clear auction timeline"],
    documents: ["Auction proclamation", "Property title summary", "Risk disclosure"],
    faqs: [
      { question: "When does participation close?", answer: "The campaign is scheduled to close on July 15, 2026, unless fully allocated earlier." },
      { question: "How are updates shared?", answer: "Members receive auction and property status updates through the portal announcements and project update sections." },
    ],
  },
  {
    id: "opp-shah-alam-shoplot",
    slug: "auction-shoplot",
    title: "Auction Shoplot",
    summary: "Shoplot auction listing near mature residential areas and daily retail activity.",
    category: "Auction Commercial",
    status: "closing soon",
    location: "Shah Alam, Selangor",
    propertyType: "Shoplot",
    tenure: "Freehold",
    unitPrice: 1200,
    targetAmount: 240000,
    fundedAmount: 204000,
    availableUnits: 54,
    totalUnits: 360,
    openDate: "2026-05-05",
    closeDate: "2026-06-30",
    expectedProjectStartDate: "2026-07-20",
    eligibilitySummary: "Open to approved members while remaining auction allocation units are available.",
    riskSummary: "Commercial auction, occupancy, renovation cost, tenant demand, and resale liquidity conditions may affect outcomes.",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Street frontage reference", "Lot positioning notes", "Area access map"],
    highlights: ["Corner-lot visibility", "Mature township catchment", "Short allocation window"],
    documents: ["Auction memo", "Comparable summary", "Disclosure package"],
    faqs: [{ question: "Is this auction fully allocated?", answer: "The campaign is not fully allocated yet and has limited units remaining." }],
  },
  {
    id: "opp-johor-bahru-industrial",
    slug: "auction-terrace-house",
    title: "Auction Terrace House",
    summary: "Terrace house auction listing with clear campaign timing and member allocation details.",
    category: "Auction Residential",
    status: "open",
    location: "Kajang, Selangor",
    propertyType: "Terrace House",
    tenure: "Freehold",
    unitPrice: 950,
    targetAmount: 180000,
    fundedAmount: 79200,
    availableUnits: 179,
    totalUnits: 320,
    openDate: "2026-06-01",
    closeDate: "2026-08-10",
    expectedProjectStartDate: "2026-09-01",
    eligibilitySummary: "Open to members with approved profile and auction participation readiness.",
    riskSummary: "Auction completion timing, reserve price, title review, vacancy, market liquidity, and disposal risks apply.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Site access reference", "Industrial corridor notes", "Planning summary"],
    highlights: ["Residential address", "Clear auction file", "Structured review period"],
    documents: ["Auction brief", "Timeline overview", "Risk disclosure"],
    faqs: [{ question: "What is the expected start date?", answer: "The expected project start date is September 1, 2026." }],
  },
];

export const recentUpdates = [
  { title: "Condominium auction review completed", date: "2026-06-12", body: "Updated reserve price notes and comparable transaction references are now available for review." },
  { title: "Shoplot allocation window narrowing", date: "2026-06-10", body: "Member participation interest accelerated as the auction campaign approaches its close date." },
  { title: "Distribution schedule preview posted", date: "2026-06-05", body: "Upcoming projected distribution windows were refreshed for active member property records." },
];

export const announcements = [
  { title: "Member portal preview", date: "2026-06-14", body: "Dashboard and auction opportunity discovery screens are available in preview mode." },
  { title: "Profile reminder", date: "2026-06-03", body: "Keep profile and verification details current to avoid participation delays." },
];

export const dashboardMetrics = [
  { label: "Total Participation", value: "RM 42,500", helper: "Across approved records" },
  { label: "Active Projects", value: "4", helper: "Currently monitored" },
  { label: "Completed Projects", value: "7", helper: "Historical outcomes" },
  { label: "Total Distribution", value: "RM 24,500", helper: "Paid and scheduled" },
];

export const memberSections = {
  participations: [
    { title: "Auction Condominium", meta: "145 units requested", status: "under review", body: "Participation interest is being reviewed against auction allocation availability and member eligibility." },
    { title: "Auction Terrace House", meta: "20 units drafted", status: "draft", body: "Draft participation details are ready for member review before submission." },
  ],
  activeProjects: [
    { title: "Auction Apartment", meta: "Next milestone: title review", status: "on track", body: "Auction completion records and post-award documentation are progressing within the expected review timeline." },
    { title: "Auction Terrace House", meta: "Distribution preview: July 2026", status: "active", body: "Exit planning notes and comparable market observations remain within the active monitoring plan." },
  ],
  completedProjects: [
    { title: "Auction Shoplot", meta: "Completed March 2026", status: "complete", body: "Final outcome summary and distribution history are archived for member reporting." },
    { title: "Auction Apartment", meta: "Completed January 2026", status: "complete", body: "Project lifecycle records are available for historical review." },
  ],
  distributions: [
    { title: "Auction Apartment", meta: "RM 1,240 scheduled", status: "scheduled", body: "Projected distribution is scheduled for July 12, 2026 through the member distribution channel." },
    { title: "Auction Shoplot", meta: "RM 2,850 paid", status: "paid", body: "Final distribution was recorded with reference PP-DIST-7782." },
  ],
  notifications: [
    { title: "Auction status update", meta: "2026-06-16", status: "unread", body: "Auction Shoplot is approaching its campaign close date with limited units remaining." },
    { title: "Profile review complete", meta: "2026-06-09", status: "read", body: "Your mock profile remains approved for available member opportunities." },
  ],
  announcements: [
    { title: "Member portal preview", meta: "2026-06-14", status: "published", body: "Dashboard and auction opportunity discovery pages are available for member portal review." },
    { title: "Scheduled maintenance notice", meta: "2026-06-08", status: "published", body: "A future maintenance window will be announced before any production release activity." },
  ],
  profileKyc: [
    { title: "Amina Rahman", meta: "PPM-10482", status: "approved", body: "Member profile, contact details, and review status are represented with mock data only." },
    { title: "Document checklist", meta: "Identity and address", status: "complete", body: "Required verification checklist items are marked complete for prototype navigation." },
  ],
  reports: [
    { title: "Member participation statement", meta: "Q2 2026", status: "available", body: "Mock statement summarizes participation activity and can be used for UI review." },
    { title: "Distribution history report", meta: "Year to date", status: "available", body: "Mock report record shows distribution totals and related project references." },
  ],
  settings: [
    { title: "Communication preferences", meta: "Email enabled", status: "active", body: "Preference controls are represented as read-only mock records for this foundation." },
    { title: "Display settings", meta: "Default workspace", status: "active", body: "Member workspace display defaults are shown without persistence or backend storage." },
  ],
};
