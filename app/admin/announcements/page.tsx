import Link from "next/link";
import { Badge, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { announcements } from "@/lib/adminMockData";

export default function AnnouncementsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Announcements" description="Create and maintain member-facing operational announcements." action={<Link className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white" href="/admin/announcements/create">Create Announcement</Link>} />
      <TableWrap>
        <thead><tr><Th>Title</Th><Th>Audience</Th><Th>Content</Th><Th>Publish Date</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
        <tbody>{announcements.map((announcement) => <tr key={announcement.id} className="border-t border-slate-100"><Td><b>{announcement.title}</b></Td><Td>{announcement.audience}</Td><Td>{announcement.content}</Td><Td>{announcement.date}</Td><Td><Badge>{announcement.status}</Badge></Td><Td><Link className="font-bold text-papaipay-green" href={`/admin/announcements/${announcement.id}/edit`}>Edit</Link></Td></tr>)}</tbody>
      </TableWrap>
    </div>
  );
}
