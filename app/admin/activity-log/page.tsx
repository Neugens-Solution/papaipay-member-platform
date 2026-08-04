import { Badge, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { getAdminActivityLog } from "@/lib/admin/data/activity";
import { formatDate, formatEnumLabel } from "@/lib/utils/formatters";

const entityTypes = ["Member", "ManualKycSubmission", "Payment", "Participation", "Campaign", "Distribution", "DistributionBatch"];

export default async function ActivityLogPage({ searchParams }: { searchParams?: Promise<{ q?: string; entity?: string }> }) {
  const filters = await searchParams;
  const rows = await getAdminActivityLog({ query: filters?.q, entityType: filters?.entity });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Activity Log" description="The latest recorded admin and member actions, newest first." />
      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_220px_auto]">
        <input name="q" defaultValue={filters?.q || ""} className="min-h-11 min-w-0 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-kasset-green" placeholder="Search action, reference, ID or user" />
        <select name="entity" defaultValue={filters?.entity || ""} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 outline-none focus:border-kasset-green"><option value="">All record types</option>{entityTypes.map((type) => <option key={type} value={type}>{formatEnumLabel(type)}</option>)}</select>
        <button type="submit" className="min-h-11 rounded-xl bg-kasset-green px-5 text-sm font-bold text-white">Filter</button>
      </form>
      <TableWrap>
        <thead><tr><Th>Activity</Th><Th>Actor</Th><Th>Record</Th><Th>Date & Time</Th><Th>Audit Ref</Th></tr></thead>
        <tbody>{rows.map((item) => {
          const actor = item.actor?.adminProfile?.displayName || item.actor?.member?.fullName || item.actor?.email || "System";
          return <tr key={item.id} className="border-t border-slate-100"><Td><b className="text-kasset-ink">{formatEnumLabel(item.action)}</b></Td><Td>{actor}</Td><Td><Badge>{formatEnumLabel(item.entityType)}</Badge><span className="mt-1 block break-all text-xs text-slate-400">{item.entityId}</span></Td><Td>{formatDate(item.createdAt)}</Td><Td><span className="font-mono text-xs">{item.auditRef}</span></Td></tr>;
        })}</tbody>
      </TableWrap>
      {rows.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">No activity matches the current filters.</p> : null}
    </div>
  );
}
