import Link from "next/link";
import { Badge, PageHeader, SearchFilter, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { distributions } from "@/lib/adminMockData";

export default function DistributionsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Distributions" description="View pending, processing and completed member distributions." />
      <SearchFilter placeholder="Search distributions" />
      <TableWrap><thead><tr><Th>Campaign</Th><Th>Member</Th><Th>Participation Amount</Th><Th>Distribution Amount</Th><Th>Status</Th><Th>Paid Date</Th><Th>Actions</Th></tr></thead><tbody>{distributions.map((distribution) => <tr key={distribution.id} className="border-t border-slate-100"><Td>{distribution.campaign}</Td><Td>{distribution.member}</Td><Td>{distribution.participation}</Td><Td>{distribution.amount}</Td><Td><Badge>{distribution.status}</Badge></Td><Td>{distribution.paid}</Td><Td><Link className="font-bold text-papaipay-green" href={`/admin/distributions/${distribution.id}`}>View</Link></Td></tr>)}</tbody></TableWrap>
    </div>
  );
}
