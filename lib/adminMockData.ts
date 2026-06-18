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
export const members = [
  { id: "PPM-10482", name: "Amina Rahman", email: "amina.rahman@example.com", phone: "+60 12-438 9210", status: "Verified", participation: "RM125,000", distribution: "RM8,500", joined: "12 Jan 2026" },
  { id: "PPM-10483", name: "Daniel Tan", email: "daniel.tan@example.com", phone: "+60 16-229 1840", status: "Verified", participation: "RM86,000", distribution: "RM5,920", joined: "28 Jan 2026" },
  { id: "PPM-10484", name: "Nur Iman", email: "nur.iman@example.com", phone: "+60 13-776 2019", status: "Pending", participation: "RM42,000", distribution: "RM1,250", joined: "04 Feb 2026" },
  { id: "PPM-10485", name: "Raj Kumar", email: "raj.kumar@example.com", phone: "+60 17-552 9004", status: "Verified", participation: "RM151,500", distribution: "RM12,430", joined: "16 Feb 2026" },
  { id: "PPM-10486", name: "Siti Aisyah", email: "siti.aisyah@example.com", phone: "+60 18-314 2280", status: "Review", participation: "RM63,000", distribution: "RM3,840", joined: "22 Mar 2026" },
];
export const memberDetail = { bank: "Maybank ••••9021", nominee: "Farid Rahman (Brother)", address: "No. 18, Jalan Anggerik 3, Ampang, Selangor", ic: "900812-14-••••", verified: "12 June 2026" };
export const participationHistory = [
  { listing: "Kajang Terrace House", date: "12 Jun 2026", amount: "RM42,500", status: "Confirmed" },
  { listing: "Shah Alam Terrace House", date: "02 Jun 2026", amount: "RM55,000", status: "Confirmed" },
  { listing: "Ipoh Terrace House", date: "20 May 2026", amount: "RM27,500", status: "Confirmed" },
];
export const distributionHistory = [
  { listing: "Cheras Terrace House", amount: "RM2,850", status: "Completed", paid: "14 Jun 2026", ref: "PP-DIST-7782" },
  { listing: "Seremban Semi-D", amount: "RM1,240", status: "Processing", paid: "Scheduled", ref: "PP-DIST-7814" },
];
export const listings = [
  { slug: "kajang-terrace-house", name: "Kajang Terrace House", location: "Kajang, Selangor", status: "Open", target: 600000, collected: 420000, participants: 128 },
  { slug: "shah-alam-terrace-house", name: "Shah Alam Terrace House", location: "Shah Alam, Selangor", status: "Closing Soon", target: 720000, collected: 612000, participants: 146 },
  { slug: "ampang-terrace-house", name: "Ampang Terrace House", location: "Ampang, Selangor", status: "Open", target: 560000, collected: 302400, participants: 94 },
  { slug: "cheras-terrace-house", name: "Cheras Terrace House", location: "Cheras, Kuala Lumpur", status: "Completed", target: 680000, collected: 680000, participants: 172 },
];
export const participants = members.slice(0,4).map((m, i) => ({ name: m.name, email: m.email, amount: [42500, 55000, 18000, 32000][i], date: ["12 Jun 2026", "10 Jun 2026", "04 Jun 2026", "28 May 2026"][i], status: "Paid" }));
export const distributions = [
  { id: "DIST-1001", campaign: "Cheras Terrace House", member: "Amina Rahman", participation: "RM42,500", amount: "RM2,850", status: "Completed", paid: "14 Jun 2026" },
  { id: "DIST-1002", campaign: "Seremban Semi-D", member: "Daniel Tan", participation: "RM32,000", amount: "RM1,920", status: "Processing", paid: "Scheduled" },
  { id: "DIST-1003", campaign: "Ipoh Terrace House", member: "Nur Iman", participation: "RM18,000", amount: "RM880", status: "Pending", paid: "—" },
  { id: "DIST-1004", campaign: "Kajang Terrace House", member: "Raj Kumar", participation: "RM55,000", amount: "RM3,240", status: "Pending", paid: "—" },
];
export const announcements = [
  { id: "ann-1", title: "June distribution window", content: "Distribution processing window is open for completed campaigns.", date: "18 Jun 2026", status: "Published" },
  { id: "ann-2", title: "New auction listings", content: "New terrace house opportunities are being prepared for member review.", date: "20 Jun 2026", status: "Draft" },
];
export const adminUsers = [
  { name: "Sarah Lim", email: "sarah.lim@papaipay.test", role: "Super Admin", status: "Active", lastLogin: "18 Jun 2026, 09:12" },
  { name: "Hafiz Omar", email: "hafiz.omar@papaipay.test", role: "Admin", status: "Active", lastLogin: "17 Jun 2026, 18:04" },
  { name: "Mei Wong", email: "mei.wong@papaipay.test", role: "Manager", status: "Invited", lastLogin: "—" },
];
export const reportGroups = ["Member Reports", "Participation Reports", "Listing Reports", "Distribution Reports"];
