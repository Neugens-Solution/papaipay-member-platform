import Link from "next/link";
import { Badge, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { getAdminDistributions } from "@/lib/admin/data/distributions";
import { decimalToNumber, formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/formatters";

export default async function DistributionsPage() {
  const distributions = await getAdminDistributions();
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Distributions" description="Review real pending, processing and completed manual distribution records." />
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-slate-600">Distribution payments are recorded from each project workspace after finance completes the transfer outside PAPAIPAY.</div>
      <TableWrap><thead><tr><Th>Distribution</Th><Th>Project</Th><Th>Member</Th><Th>Final Total</Th><Th>Status</Th><Th>Payment</Th><Th>Action</Th></tr></thead><tbody>{distributions.map((distribution) => <tr key={distribution.id} className="border-t border-slate-100 align-top"><Td><span className="font-bold text-papaipay-ink">{distribution.distributionRef}</span><span className="block text-xs text-slate-400">Batch {distribution.distributionBatch.batchRef}</span></Td><Td><span className="font-bold text-papaipay-ink">{distribution.campaign.title}</span><span className="block text-xs text-slate-400">{distribution.campaign.campaignCode}</span></Td><Td><span className="font-bold text-papaipay-ink">{distribution.member.fullName}</span><span className="block text-xs text-slate-400">{distribution.member.memberRef}</span></Td><Td>{formatCurrency(decimalToNumber(distribution.finalDistributionTotal))}</Td><Td><Badge>{formatEnumLabel(String(distribution.status))}</Badge></Td><Td><span className="block">{distribution.paymentDate ? formatDate(distribution.paymentDate) : "Not paid"}</span><span className="block text-xs text-slate-400">{distribution.paymentReference || "No reference"}</span></Td><Td><Link className="font-bold text-papaipay-green" href={`/admin/distributions/${distribution.id}`}>View details →</Link></Td></tr>)}</tbody></TableWrap>
      {distributions.length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">No distribution records yet.</p> : null}
    </div>
  );
}
