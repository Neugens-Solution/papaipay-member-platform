import Link from "next/link";
import { Badge, PageHeader, SearchFilter, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { members } from "@/lib/adminMockData";

export default function MembersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader eyebrow="Members" title="Members" description="Search, filter and review complete member account activity." />
      <SearchFilter placeholder="Search members" />
      <TableWrap>
        <thead>
          <tr>
            <Th>Member ID</Th><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Verification Status</Th><Th>Active Campaigns</Th><Th>Total Participation</Th><Th>Total Distribution</Th><Th>Joined Date</Th><Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-t border-slate-100">
              <Td>{member.id}</Td><Td><b className="text-papaipay-ink">{member.name}</b></Td><Td>{member.email}</Td><Td>{member.phone}</Td><Td><Badge>{member.status}</Badge></Td><Td>{member.activeCampaigns}</Td><Td>{member.participation}</Td><Td>{member.distribution}</Td><Td>{member.joined}</Td><Td><Link className="font-bold text-papaipay-green" href={`/admin/members/${member.id}`}>View Details</Link></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
