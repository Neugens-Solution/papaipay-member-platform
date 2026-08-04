import Link from "next/link";
import { Badge, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { getAdminMemberSummaries } from "@/lib/admin/data/members";
import { formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/formatters";

const statusOptions = ["", "NotStarted", "Pending", "Approved", "Rejected", "ManualReview"];

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const filters = await searchParams;
  const members = await getAdminMemberSummaries({ query: filters.q, status: filters.status });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Members" description="Review member accounts, manual identity verification, participation and distributions." />
      <form method="get" className="grid min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
        <input name="q" defaultValue={filters.q || ""} className="min-h-11 min-w-0 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-kasset-green" placeholder="Search name, email or member ID" />
        <select name="status" defaultValue={filters.status || ""} className="min-h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-kasset-green">
          {statusOptions.map((status) => <option key={status || "all"} value={status}>{status ? formatEnumLabel(status) : "All verification statuses"}</option>)}
        </select>
        <button className="min-h-11 rounded-xl bg-kasset-green px-5 text-sm font-bold text-white" type="submit">Filter</button>
      </form>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-slate-600">
        Showing {members.length} member{members.length === 1 ? "" : "s"}. Open a member to review IC documents or payment receipts.
      </div>

      <TableWrap>
        <thead><tr><Th>Member</Th><Th>Contact</Th><Th>Verification</Th><Th>Participation</Th><Th>Distribution</Th><Th>Joined</Th><Th>Action</Th></tr></thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-t border-slate-100 align-top">
              <Td><span className="block font-bold text-kasset-ink">{member.fullName}</span><span className="mt-1 block text-xs font-semibold text-slate-400">{member.memberRef}</span></Td>
              <Td><span className="block break-all">{member.user.email}</span><span className="mt-1 block text-xs text-slate-400">{member.user.phone || "No phone"}</span></Td>
              <Td><Badge>{formatEnumLabel(String(member.displayVerificationStatus))}</Badge></Td>
              <Td><span className="block font-bold text-kasset-ink">{formatCurrency(member.totalParticipation)}</span><span className="mt-1 block text-xs text-slate-400">{member.activeCampaigns} active • {member._count.participations} records</span></Td>
              <Td>{formatCurrency(member.totalDistribution)}</Td>
              <Td>{formatDate(member.createdAt)}</Td>
              <Td><Link className="font-bold text-kasset-green" href={`/admin/members/${member.id}`}>Review member →</Link></Td>
            </tr>
          ))}
          {members.length === 0 ? <tr><Td><span className="text-slate-500">No members match these filters.</span></Td></tr> : null}
        </tbody>
      </TableWrap>
    </div>
  );
}
