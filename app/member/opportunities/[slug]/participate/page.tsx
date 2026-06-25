import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { formatRM } from "@/lib/memberMockData";
import { getMemberCampaignBySlug } from "@/lib/data/memberCampaigns";

function parseAmount(value?: string) {
  if (!value) return 0;
  return Number(value.replace(/,/g, ""));
}

export default async function ParticipatePage({ params, searchParams }: { params: { slug: string }; searchParams?: { amount?: string } }) {
  const opportunity = await getMemberCampaignBySlug(params.slug);
  if (!opportunity) notFound();
  const amount = parseAmount(searchParams?.amount);
  const hasAmount = typeof searchParams?.amount === "string";
  const error = hasAmount && (!Number.isFinite(amount) || amount <= 0)
    ? "Amount must be greater than zero."
    : hasAmount && amount < opportunity.minimumParticipation
      ? `Amount must be at least ${formatRM(opportunity.minimumParticipation)}.`
      : hasAmount && amount > opportunity.maximumParticipation
        ? `Amount must not exceed ${formatRM(opportunity.maximumParticipation)}.`
        : null;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link href={`/member/opportunities/${opportunity.slug}`} className="text-sm font-bold text-papaipay-green">← Back to Opportunity Detail</Link>
      <header className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">Participate</p>
        <h1 className="text-2xl font-bold tracking-tight text-papaipay-ink sm:text-3xl">Start Participation</h1>
        <p className="text-sm leading-6 text-slate-600">Enter the participation amount for this opportunity before reviewing your declaration and final confirmation.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <ContentCard>
          <h2 className="text-lg font-bold">Participation Amount</h2>
          <form className="mt-5 space-y-4" method="get" action={`/member/opportunities/${opportunity.slug}/participate/review`}>
            <label className="block text-sm font-bold text-slate-600" htmlFor="amount">Amount is required</label>
            <div className="flex rounded-xl border border-slate-200 bg-white shadow-inner"><span className="px-3 py-3 text-sm font-bold text-slate-500">RM</span><input id="amount" name="amount" inputMode="decimal" required min={opportunity.minimumParticipation} max={opportunity.maximumParticipation} step="1" defaultValue={searchParams?.amount ?? ""} className="min-h-12 flex-1 rounded-xl px-2 py-3 text-sm outline-none" placeholder="10,000" /></div>
            {error ? <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</p> : null}
            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <p><strong>Minimum:</strong> {formatRM(opportunity.minimumParticipation)}</p>
              <p><strong>Maximum:</strong> {formatRM(opportunity.maximumParticipation)}</p>
              <p><strong>Calculated participation summary:</strong> total amount equals the participation amount entered. No payment gateway is connected yet.</p>
            </div>
            <button className="min-h-12 w-full rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white" type="submit">Continue to Review</button>
          </form>
        </ContentCard>
        <Summary opportunity={opportunity} />
      </div>
    </div>
  );
}

function Summary({ opportunity }: { opportunity: NonNullable<Awaited<ReturnType<typeof getMemberCampaignBySlug>>> }) {
  return <ContentCard><h2 className="text-lg font-bold">Opportunity Summary</h2><dl className="mt-4 divide-y divide-slate-100 text-sm"><Row label="Opportunity" value={opportunity.title} /><Row label="Location" value={opportunity.location} /><Row label="Market Value" value={formatRM(opportunity.marketValue)} /><Row label="Estimated Yield" value={opportunity.estimatedYield} /><Row label="Asset Category" value={opportunity.assetCategory} /><Row label="Occupancy Status" value={opportunity.occupancyStatus} /></dl></ContentCard>;
}
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-bold text-papaipay-ink">{value}</dd></div>; }
