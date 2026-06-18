import { Badge, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { activityLog } from "@/lib/adminMockData";

const activityRows = [
  { activity: "Member Created", user: "Hafiz Omar", dateTime: "18 Jun 2026, 10:42", type: "Member" },
  { activity: "Member Updated", user: "Sarah Lim", dateTime: "18 Jun 2026, 10:05", type: "Member" },
  { activity: "Listing Created", user: "Mei Wong", dateTime: "17 Jun 2026, 18:20", type: "Listing" },
  { activity: "Listing Updated", user: "Mei Wong", dateTime: "17 Jun 2026, 16:48", type: "Listing" },
  { activity: "Distribution Completed", user: "Finance Admin", dateTime: "17 Jun 2026, 14:12", type: "Distribution" },
  { activity: "Announcement Published", user: "Sarah Lim", dateTime: "17 Jun 2026, 11:24", type: "Announcement" },
  ...activityLog,
];

export default function ActivityLogPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Activity Log" description="Recent system activity across members, campaigns, distributions and announcements." />
      <div className="grid gap-3 sm:grid-cols-3">
        <input className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-papaipay-green" placeholder="Date Range" />
        <input className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-papaipay-green" placeholder="User" />
        <select className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-papaipay-green"><option>Action Type</option><option>Member</option><option>Listing</option><option>Distribution</option><option>Announcement</option></select>
      </div>
      <TableWrap>
        <thead><tr><Th>Activity</Th><Th>User</Th><Th>Date & Time</Th><Th>Type</Th></tr></thead>
        <tbody>{activityRows.map((item, index) => <tr key={`${item.activity}-${index}`} className="border-t border-slate-100"><Td><b className="text-papaipay-ink">{item.activity}</b></Td><Td>{item.user}</Td><Td>{item.dateTime}</Td><Td><Badge>{item.type}</Badge></Td></tr>)}</tbody>
      </TableWrap>
    </div>
  );
}
