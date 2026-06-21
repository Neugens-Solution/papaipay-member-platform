import Link from "next/link";
import { Badge, PageHeader, SearchFilter, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { distributions } from "@/lib/adminMockData";

export default function DistributionsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Distributions" description="View pending, processing and completed member distributions." />
      <SearchFilter placeholder="Search distributions" />
      <TableWrap><thead><tr><Th>Distribution ID</Th><Th>Batch ID</Th><Th>Campaign ID</Th><Th>Campaign Code</Th><Th>Participation ID</Th><Th>Campaign</Th><Th>Member</Th><Th>Principal Return</Th><Th>Holding Return</Th><Th>Profit Distribution</Th><Th>Final Distribution Total</Th><Th>Status</Th><Th>Paid Date</Th><Th>Actions</Th></tr></thead><tbody>{distributions.map((distribution) => <tr key={distribution.id} className="border-t border-slate-100"><Td>{distribution.id}</Td><Td>{distribution.distributionBatchId}</Td><Td>{distribution.campaignId}</Td><Td>{distribution.campaignCode}</Td><Td>{distribution.participationId}</Td><Td>{distribution.campaign}</Td><Td>{distribution.member}</Td><Td>{distribution.principalReturn}</Td><Td>{distribution.holdingReturn}</Td><Td>{distribution.profitDistribution}</Td><Td>{distribution.amount}</Td><Td><Badge>{distribution.status}</Badge></Td><Td>{distribution.paid}</Td><Td><Link className="font-bold text-papaipay-green" href={`/admin/distributions/${distribution.id}`}>View</Link></Td></tr>)}</tbody></TableWrap>
    </div>
  );
}
