import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { formatRM } from "@/lib/memberMockData";
import { getMemberCampaignBySlug } from "@/lib/data/memberCampaigns";
import { confirmParticipationFlowAction } from "@/lib/member/actions/participations";

function amount(raw?: string) { const n = Number((raw ?? "").replace(/,/g, "")); return Number.isFinite(n) && n > 0 ? n : null; }
export default async function ConfirmationPage({ params, searchParams }: { params: { slug: string }; searchParams?: Record<string, string | undefined> }) {
  const opportunity = await getMemberCampaignBySlug(params.slug); if (!opportunity) notFound(); const value = amount(searchParams?.amount); if (!value) redirect(`/member/opportunities/${opportunity.slug}/participate`);
  const accepted = [1,2,3,4].every((i) => searchParams?.[`declaration${i}`] === "accepted"); if (!accepted) redirect(`/member/opportunities/${opportunity.slug}/participate/declaration?amount=${value}`);
  return <div className="mx-auto max-w-3xl space-y-5"><Link href={`/member/opportunities/${opportunity.slug}/participate/declaration?amount=${value}`} className="text-sm font-bold text-papaipay-green">← Back to Declaration</Link><header><p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">Confirmation</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-3xl">Confirm Participation</h1></header><ContentCard><dl className="divide-y divide-slate-100 text-sm"><Row label="Opportunity" value={opportunity.title} /><Row label="Participation amount" value={formatRM(value)} /><Row label="Estimated yield" value={opportunity.estimatedYield} /><Row label="Asset category" value={opportunity.assetCategory} /><Row label="Declaration status" value="All acknowledgements accepted" /></dl><form action={confirmParticipationFlowAction} className="mt-6"><input type="hidden" name="campaignId" value={opportunity.id} /><input type="hidden" name="amount" value={value} /><button className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white" type="submit">Confirm Participation</button></form><p className="mt-3 text-center text-xs font-semibold text-slate-500">Confirming creates a pending manual payment record. No payment gateway or distribution is triggered.</p></ContentCard></div>;
}
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-bold text-papaipay-ink">{value}</dd></div>; }
