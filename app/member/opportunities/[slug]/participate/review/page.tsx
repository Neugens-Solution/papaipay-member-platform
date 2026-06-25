import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { formatRM } from "@/lib/memberMockData";
import { getMemberCampaignBySlug } from "@/lib/data/memberCampaigns";

function validAmount(raw: string | undefined, min: number, max: number) { const amount = Number((raw ?? "").replace(/,/g, "")); return Number.isFinite(amount) && amount > 0 && amount >= min && amount <= max ? amount : null; }

export default async function ReviewPage({ params, searchParams }: { params: { slug: string }; searchParams?: { amount?: string } }) {
  const opportunity = await getMemberCampaignBySlug(params.slug); if (!opportunity) notFound();
  const amount = validAmount(searchParams?.amount, opportunity.minimumParticipation, opportunity.maximumParticipation); if (!amount) redirect(`/member/opportunities/${opportunity.slug}/participate`);
  const next = `/member/opportunities/${opportunity.slug}/participate/declaration?amount=${amount}`;
  return <Step title="Review Participation" kicker="Review" backHref={`/member/opportunities/${opportunity.slug}/participate?amount=${amount}`} backLabel="Back to Participate"><ContentCard><dl className="divide-y divide-slate-100 text-sm"><Row label="Opportunity title" value={opportunity.title} /><Row label="Participation amount" value={formatRM(amount)} /><Row label="Estimated yield" value={opportunity.estimatedYield} /><Row label="Asset category" value={opportunity.assetCategory} /><Row label="Occupancy status" value={opportunity.occupancyStatus} /><Row label="Total amount" value={formatRM(amount)} strong /></dl><Link href={next} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white">Continue to Declaration</Link></ContentCard></Step>;
}
function Step({ title, kicker, backHref, backLabel, children }: { title: string; kicker: string; backHref: string; backLabel: string; children: React.ReactNode }) { return <div className="mx-auto max-w-3xl space-y-5"><Link href={backHref} className="text-sm font-bold text-papaipay-green">← {backLabel}</Link><header><p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">{kicker}</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-3xl">{title}</h1></header>{children}</div>; }
function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">{label}</dt><dd className={`text-right font-bold ${strong ? "text-lg text-papaipay-green" : "text-papaipay-ink"}`}>{value}</dd></div>; }
