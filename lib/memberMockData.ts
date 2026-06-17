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
    id: "opp-greenview",
    slug: "greenview-residences",
    title: "Greenview Residences",
    summary: "A stabilized garden-style residential community near transit, schools, and everyday retail corridors.",
    category: "Residential",
    status: "open",
    location: "Austin, Texas",
    propertyType: "Multifamily",
    tenure: "36 months",
    unitPrice: 2500,
    targetAmount: 1250000,
    fundedAmount: 887500,
    availableUnits: 145,
    totalUnits: 500,
    openDate: "2026-05-20",
    closeDate: "2026-07-15",
    expectedProjectStartDate: "2026-08-01",
    eligibilitySummary: "Open to approved members with completed profile and KYC status.",
    riskSummary: "Participation involves real estate market, occupancy, liquidity, timing, and distribution risks. Returns are not guaranteed.",
    imageUrl: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Courtyard amenity plan", "Renovated model unit", "Neighborhood retail corridor"],
    highlights: ["92% current occupancy", "Value-add interior upgrade plan", "Five minutes from commuter rail"],
    documents: ["Offering summary", "Property overview", "Risk disclosure"],
    faqs: [
      { question: "When does participation close?", answer: "The campaign is scheduled to close on July 15, 2026, unless fully allocated earlier." },
      { question: "How are updates shared?", answer: "Members receive project updates through the portal announcements and project update sections." },
    ],
  },
  {
    id: "opp-harbor",
    slug: "harbor-point-logistics",
    title: "Harbor Point Logistics",
    summary: "Last-mile logistics facility positioned near port access and regional distribution routes.",
    category: "Industrial",
    status: "closing soon",
    location: "Savannah, Georgia",
    propertyType: "Logistics",
    tenure: "30 months",
    unitPrice: 5000,
    targetAmount: 1800000,
    fundedAmount: 1530000,
    availableUnits: 54,
    totalUnits: 360,
    openDate: "2026-05-05",
    closeDate: "2026-06-30",
    expectedProjectStartDate: "2026-07-20",
    eligibilitySummary: "Open to approved members while remaining units are available.",
    riskSummary: "Industrial demand, tenant renewal, operating cost, and market liquidity conditions may affect outcomes.",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Loading bay frontage", "Warehouse interior", "Regional access map"],
    highlights: ["Near port logistics corridor", "Flexible loading configuration", "Short-duration campaign"],
    documents: ["Campaign memo", "Tenant summary", "Disclosure package"],
    faqs: [{ question: "Is this project funded?", answer: "The campaign is not fully funded yet and has limited units remaining." }],
  },
  {
    id: "opp-summit",
    slug: "summit-medical-plaza",
    title: "Summit Medical Plaza",
    summary: "Healthcare-oriented commercial property anchored by outpatient services and specialty practices.",
    category: "Healthcare",
    status: "open",
    location: "Raleigh, North Carolina",
    propertyType: "Medical Office",
    tenure: "48 months",
    unitPrice: 3000,
    targetAmount: 960000,
    fundedAmount: 422400,
    availableUnits: 179,
    totalUnits: 320,
    openDate: "2026-06-01",
    closeDate: "2026-08-10",
    expectedProjectStartDate: "2026-09-01",
    eligibilitySummary: "Open to members with approved KYC and minimum participation readiness.",
    riskSummary: "Healthcare tenancy, lease rollover, financing, and regional market risks apply.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    gallery: ["Main entry", "Clinical suite corridor", "Parking and access view"],
    highlights: ["Healthcare services corridor", "Diversified tenant mix", "Longer planned hold period"],
    documents: ["Property brief", "Timeline overview", "Risk disclosure"],
    faqs: [{ question: "What is the expected start date?", answer: "The expected project start date is September 1, 2026." }],
  },
];

export const recentUpdates = [
  { title: "Greenview diligence refresh completed", date: "2026-06-12", body: "Updated rent roll and renovation sequencing notes are now available for review." },
  { title: "Harbor Point allocation pace increased", date: "2026-06-10", body: "Member participation interest accelerated as the campaign approaches its close date." },
  { title: "Distribution schedule preview posted", date: "2026-06-05", body: "Upcoming projected distribution windows were refreshed for active member projects." },
];

export const announcements = [
  { title: "Member portal preview", date: "2026-06-14", body: "New dashboard and opportunity discovery screens are available in preview mode." },
  { title: "KYC reminder", date: "2026-06-03", body: "Keep profile and verification details current to avoid participation delays." },
];

export const dashboardMetrics = [
  { label: "Total Participation", value: "$42,500", helper: "Across approved records" },
  { label: "Active Projects", value: "4", helper: "Currently monitored" },
  { label: "Completed Projects", value: "7", helper: "Historical outcomes" },
  { label: "Total Distribution", value: "$6,840", helper: "Paid and scheduled" },
];

export const memberSections = {
  participations: [
    { title: "Greenview Residences", meta: "145 units requested", status: "under review", body: "Participation interest is being reviewed against campaign availability and member eligibility." },
    { title: "Summit Medical Plaza", meta: "20 units drafted", status: "draft", body: "Draft participation details are ready for member review before submission." },
  ],
  activeProjects: [
    { title: "Cedar Row Townhomes", meta: "Next milestone: exterior upgrades", status: "on track", body: "Renovation sequencing continues with monthly project commentary available to members." },
    { title: "Northline Retail Center", meta: "Distribution preview: July 2026", status: "active", body: "Tenant improvement work is complete and lease-up progress remains within plan." },
  ],
  completedProjects: [
    { title: "Lakeside Storage Portfolio", meta: "Completed March 2026", status: "complete", body: "Final outcome summary and distribution history are archived for member reporting." },
    { title: "West Park Flats", meta: "Completed January 2026", status: "complete", body: "Project lifecycle records are available for historical review." },
  ],
  distributions: [
    { title: "Cedar Row Townhomes", meta: "$1,240 scheduled", status: "scheduled", body: "Projected distribution is scheduled for July 12, 2026 through the member distribution channel." },
    { title: "Lakeside Storage Portfolio", meta: "$2,850 paid", status: "paid", body: "Final distribution was recorded with reference PP-DIST-7782." },
  ],
  notifications: [
    { title: "Opportunity status update", meta: "2026-06-16", status: "unread", body: "Harbor Point Logistics is approaching its campaign close date with limited units remaining." },
    { title: "Profile review complete", meta: "2026-06-09", status: "read", body: "Your mock KYC profile remains approved for available member opportunities." },
  ],
  announcements: [
    { title: "Member portal preview", meta: "2026-06-14", status: "published", body: "Dashboard and opportunity discovery pages are available for member portal review." },
    { title: "Scheduled maintenance notice", meta: "2026-06-08", status: "published", body: "A future maintenance window will be announced before any production release activity." },
  ],
  profileKyc: [
    { title: "Amina Rahman", meta: "PPM-10482", status: "approved", body: "Member profile, contact details, and KYC status are represented with mock data only." },
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
