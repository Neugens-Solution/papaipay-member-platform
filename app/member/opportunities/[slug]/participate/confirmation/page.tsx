import Link from "next/link";
import { redirect } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { formatRM } from "@/lib/memberMockData";
import { getRealMemberCampaignBySlug } from "@/lib/data/memberCampaigns";
import { ConfirmParticipationForm } from "@/components/member/ConfirmParticipationForm";

function amount(raw?: string) { const n = Number((raw ?? "").replace(/,/g, "")); return Number.isFinite(n) && n > 0 ? n : null; }
export default async function ConfirmationPage({ params, searchParams }: { params: { slug: string }; searchParams?: Record<string, string | undefined> }) {
  const opportunity = await getRealMemberCampaignBySlug(params.slug); if (!opportunity) return <ParticipationUnavailable />; const value = amount(searchParams?.amount); if (!value) redirect(`/member/opportunities/${opportunity.slug}/participate`);
  const accepted = [1,2,3,4].every((i) => searchParams?.[`declaration${i}`] === "accepted"); if (!accepted) redirect(`/member/opportunities/${opportunity.slug}/participate/declaration?amount=${value}`);
  return <div className="mx-auto max-w-3xl space-y-5"><Link href={`/member/opportunities/${opportunity.slug}/participate/declaration?amount=${value}`} className="text-sm font-bold text-papaipay-green">← Back to Declaration</Link><header><p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">Confirmation</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-3xl">Confirm Participation</h1></header><ContentCard><dl className="divide-y divide-slate-100 text-sm"><Row label="Opportunity" value={opportunity.title} /><Row label="Participation amount" value={formatRM(value)} /><Row label="Estimated yield" value={opportunity.estimatedYield} /><Row label="Asset category" value={opportunity.assetCategory} /><Row label="Declaration status" value="All acknowledgements accepted" /></dl><ConfirmParticipationForm campaignId={opportunity.id} campaignSlug={opportunity.slug} amount={value} /><p className="mt-3 text-center text-xs font-semibold text-slate-500">Confirming creates a pending manual payment record. No payment gateway or distribution is triggered.</p></ContentCard></div>;
}
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-bold text-papaipay-ink">{value}</dd></div>; }

function ParticipationUnavailable() { return <div className="mx-auto max-w-3xl space-y-5"><ContentCard><h1 className="text-2xl font-bold text-papaipay-ink">Participation unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-600">This opportunity could not be loaded from the live database, so participation is unavailable right now.</p><Link href="/member/opportunities" className="mt-5 inline-flex text-sm font-bold text-papaipay-green">Back to Opportunities</Link></ContentCard></div>; }
