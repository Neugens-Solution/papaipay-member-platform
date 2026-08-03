import Link from "next/link";
import { Badge, Card, PageHeader, ProgressBar } from "@/components/admin/AdminUI";
import { getAdminDashboardData } from "@/lib/admin/data/dashboard";
import { decimalToNumber, formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/formatters";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  const priorities = [
    { label: "KYC submissions to review", value: data.pendingKycCount, href: "/admin/members?status=Pending", tone: "amber" },
    { label: "Payment receipts to verify", value: data.pendingReceiptCount, href: "#payment-receipts", tone: "green" },
    { label: "Open listings", value: data.openListingCount, href: "/admin/listings", tone: "slate" },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <PageHeader title="Dashboard" description="A focused view of work that needs attention and the latest portal activity." />

      <section aria-label="Portal totals" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Members" value={String(data.memberCount)} helper="Registered member accounts" />
        <Metric label="Total Listings" value={String(data.listingCount)} helper={`${data.openListingCount} currently open`} />
        <Metric label="Confirmed Participation" value={formatCurrency(data.totalConfirmedParticipation)} helper="Confirmed payment records" />
        <Metric label="Paid Distributions" value={formatCurrency(data.totalPaidDistribution)} helper="Completed manual distributions" />
      </section>

      <Card>
        <div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold tracking-tight">Needs Attention</h2><p className="mt-1 text-sm text-slate-500">Start here during daily administration.</p></div></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {priorities.map((item) => (
            <Link key={item.label} href={item.href} className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${item.tone === "amber" ? "border-amber-200 bg-amber-50/70" : item.tone === "green" ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-slate-50"}`}>
              <p className="text-3xl font-semibold tracking-tight text-papaipay-ink">{item.value}</p>
              <p className="mt-2 text-sm font-bold text-slate-700">{item.label}</p>
              <span className="mt-4 inline-flex text-xs font-bold text-papaipay-green">Open queue →</span>
            </Link>
          ))}
        </div>
      </Card>

      <Card id="payment-receipts">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-lg font-bold tracking-tight">Payment Receipt Review</h2><p className="mt-1 text-sm text-slate-500">Oldest member submissions appear first.</p></div><span className="text-xs font-bold text-slate-400">{data.pendingReceiptCount} pending</span></div>
        <div className="mt-5 divide-y divide-slate-100">
          {data.pendingReceipts.map((payment) => (
            <Link key={payment.id} href={`/admin/projects/${payment.campaign.slug}#participants`} className="flex min-w-0 flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><p className="truncate font-bold text-papaipay-ink">{payment.member.fullName || payment.member.memberRef}</p><p className="mt-1 truncate text-xs text-slate-500">{payment.campaign.title} • {payment.participation?.participationRef || payment.paymentRef}</p><p className="mt-1 text-xs text-slate-400">Submitted {payment.submittedAt ? formatDate(payment.submittedAt) : "date unavailable"} • Ref {payment.submittedReference || "not provided"}</p></div>
              <div className="flex flex-none items-center gap-3"><span className="text-sm font-bold text-papaipay-ink">{formatCurrency(decimalToNumber(payment.amount))}</span><span className="text-xs font-bold text-papaipay-green">Review →</span></div>
            </Link>
          ))}
          {data.pendingReceipts.length === 0 ? <p className="py-2 text-sm text-slate-500">No payment receipts are waiting for review.</p> : null}
        </div>
      </Card>

      <section className="grid min-w-0 gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold tracking-tight">Recent Listings</h2><Link href="/admin/listings" className="text-sm font-bold text-papaipay-green">View all</Link></div>
          <div className="mt-5 space-y-4">
            {data.recentListings.map((listing) => {
              const target = decimalToNumber(listing.campaignTarget);
              const collected = decimalToNumber(listing.collectedAmountSnapshot);
              const progress = target > 0 ? (collected / target) * 100 : 0;
              return <Link key={listing.id} href={`/admin/projects/${listing.slug}`} className="block rounded-xl border border-slate-100 p-4 hover:border-papaipay-green/30"><div className="flex min-w-0 items-start justify-between gap-4"><div className="min-w-0"><p className="truncate font-bold text-papaipay-ink">{listing.title}</p><p className="mt-1 text-xs text-slate-500">{listing._count.participations} participants • {formatCurrency(collected)} collected</p></div><Badge>{formatEnumLabel(String(listing.lifecycleStatus))}</Badge></div><div className="mt-3"><ProgressBar value={progress} /></div></Link>;
            })}
            {data.recentListings.length === 0 ? <p className="text-sm text-slate-500">No listings yet.</p> : null}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold tracking-tight">Recent Members</h2><Link href="/admin/members" className="text-sm font-bold text-papaipay-green">View all</Link></div>
          <div className="mt-5 divide-y divide-slate-100">
            {data.recentMembers.map((member) => (
              <Link key={member.id} href={`/admin/members/${member.id}`} className="flex min-w-0 items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0"><p className="truncate font-bold text-papaipay-ink">{member.fullName}</p><p className="mt-1 truncate text-xs text-slate-500">{member.memberRef} • {member.user.email}</p><p className="mt-1 text-xs text-slate-400">Joined {formatDate(member.createdAt)}</p></div>
                <Badge>{formatEnumLabel(String(member.manualKycSubmissions[0]?.status || member.verificationStatus))}</Badge>
              </Link>
            ))}
            {data.recentMembers.length === 0 ? <p className="text-sm text-slate-500">No members yet.</p> : null}
          </div>
        </Card>
      </section>
    </div>
  );
}

function Metric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return <article className="min-w-0 rounded-2xl border border-slate-200/70 bg-white p-5"><p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p><p className="mt-3 min-w-0 break-words text-2xl font-semibold tracking-[-0.04em] text-papaipay-ink">{value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p></article>;
}
