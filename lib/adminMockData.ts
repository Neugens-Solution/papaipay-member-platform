export const adminKpis = [
  { label: "Total Members", value: "8,420", helper: "Registered member accounts", trend: "+6.8% MoM" },
  { label: "Verified Members", value: "6,984", helper: "Completed verification", trend: "83% verified" },
  { label: "Active Listings", value: "18", helper: "Open or closing campaigns", trend: "+3 this month" },
  { label: "Completed Listings", value: "42", helper: "Closed lifecycle records", trend: "+5 this quarter" },
  { label: "Total Participation", value: "RM18.6M", helper: "Confirmed participation value", trend: "+14.2% QoQ" },
  { label: "Total Distribution", value: "RM2.84M", helper: "Completed distributions", trend: "+RM420K MoM" },
  { label: "Pending Distribution", value: "RM386K", helper: "Awaiting processing", trend: "126 records" },
  { label: "Monthly Participation", value: "RM1.92M", helper: "June 2026 activity", trend: "+9.4% vs May" },
];

export const operationalSummary = [
  { label: "Pending Verifications", value: "12", tone: "slate" },
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
  { listing: "Kajang Terrace House", date: "12 Jun 2026", amount: "RM42,500", status: "Confirmed" },
  { listing: "Shah Alam Terrace House", date: "02 Jun 2026", amount: "RM55,000", status: "Confirmed" },
  { listing: "Ipoh Terrace House", date: "20 May 2026", amount: "RM27,500", status: "Confirmed" },
];

export const distributionHistory = [
  { listing: "Cheras Terrace House", principalReturn: "RM42,500", holdingReturn: "RM956", profitDistribution: "RM1,894", amount: "RM45,350", status: "Completed", paid: "14 Jun 2026", ref: "PAY-000001" },
  { listing: "Seremban Semi-D", amount: "RM1,240", status: "Processing", paid: "Scheduled", ref: "PAY-000002" },
];

export const listings = [
  { id: "CAM-000001", campaignCode: "PP-SGR-2026-001", slug: "kajang-terrace-house", name: "Kajang Terrace House", location: "Kajang, Selangor", state: "Selangor", status: "Open", target: 600000, collected: 420000, participants: 128, propertyType: "Terrace House", tenureAlias: "FH", bumiStatus: "Non-Bumi", isLaca: false, builtUp: "1,600 sq ft", bedrooms: 4, bathrooms: 3, reservePrice: 550000, auctionDate: "2026-07-15" },
  { id: "CAM-000002", campaignCode: "PP-SGR-2026-002", slug: "shah-alam-terrace-house", name: "Shah Alam Terrace House", location: "Shah Alam, Selangor", state: "Selangor", status: "Closing Soon", target: 720000, collected: 612000, participants: 146, propertyType: "Terrace House", tenureAlias: "LH", bumiStatus: "Open Market", isLaca: true, builtUp: "1,690 sq ft", bedrooms: 4, bathrooms: 3, reservePrice: 670000, auctionDate: "2026-06-30" },
  { id: "CAM-000003", campaignCode: "PP-SGR-2026-003", slug: "ampang-terrace-house", name: "Ampang Terrace House", location: "Ampang, Selangor", state: "Selangor", status: "Open", target: 560000, collected: 302400, participants: 94, propertyType: "Terrace House", tenureAlias: "FH", bumiStatus: "Open Market", isLaca: false, builtUp: "1,780 sq ft", bedrooms: 3, bathrooms: 2, reservePrice: 510000, auctionDate: "2026-08-05" },
  { id: "CAM-000004", campaignCode: "PP-KL-2026-004", slug: "cheras-terrace-house", name: "Cheras Terrace House", location: "Cheras, Kuala Lumpur", state: "Kuala Lumpur", status: "Completed", target: 680000, collected: 680000, participants: 172, propertyType: "Terrace House", tenureAlias: "LH", bumiStatus: "Non-Bumi", isLaca: true, builtUp: "1,870 sq ft", bedrooms: 4, bathrooms: 3, reservePrice: 630000, auctionDate: "2026-06-10" },
];

export const participants = members.slice(0, 4).map((member, index) => ({
  participationId: `PAR-${String(index + 1).padStart(6, "0")}`,
  memberId: member.id,
  campaignId: `CAM-${String(index + 1).padStart(6, "0")}`,
  campaignCode: ["PP-SGR-2026-001", "PP-SGR-2026-002", "PP-SGR-2026-003", "PP-KL-2026-004"][index],
  name: member.name,
  email: member.email,
  amount: [42500, 55000, 18000, 32000][index],
  date: ["12 Jun 2026", "10 Jun 2026", "04 Jun 2026", "28 May 2026"][index],
  paymentStatus: "Paid",
  distributionStatus: ["Pending", "Processing", "Completed", "Pending"][index],
}));

export const listingDocuments = [
  "Auction Proclamation.pdf",
  "Valuation Report.pdf",
  "Title Search.pdf",
  "Sales & Purchase Agreement.pdf",
  "Renovation Progress Photos.pdf",
];

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

export const reportGroups = ["Member Reports", "Participation Reports", "Listing Reports", "Distribution Reports"];

export const exportCentreItems = [
  "Export Members",
  "Export Participation",
  "Export Listings",
  "Export Distributions",
  "Export Campaign Performance",
  "Export Monthly Summary",
];

export const activityLog = [
  { activity: "Amina Rahman joined Kajang Terrace House", user: "Amina Rahman", dateTime: "18 Jun 2026, 10:42", type: "Participation" },
  { activity: "Distribution completed for Daniel Tan", user: "Finance Admin", dateTime: "18 Jun 2026, 09:58", type: "Distribution" },
  { activity: "Manager updated campaign progress", user: "Mei Wong", dateTime: "17 Jun 2026, 18:20", type: "Listing" },
  { activity: "New announcement published", user: "Sarah Lim", dateTime: "17 Jun 2026, 16:05", type: "Announcement" },
  { activity: "New member verified", user: "Hafiz Omar", dateTime: "17 Jun 2026, 11:24", type: "Verification" },
];
