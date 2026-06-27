import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { formatRM } from "@/lib/memberMockData";
import { getMemberCampaignBySlug } from "@/lib/data/memberCampaigns";
function amount(raw?: string) { const n = Number((raw ?? "").replace(/,/g, "")); return Number.isFinite(n) && n > 0 ? n : null; }
export default async function ConfirmationPage({ params, searchParams }: { params: { slug: string }; searchParams?: Record<string, string | undefined> }) {
  const opportunity = await getMemberCampaignBySlug(params.slug); if (!opportunity) notFound(); const value = amount(searchParams?.amount); if (!value) redirect(`/member/opportunities/${opportunity.slug}/participate`);
  const accepted = [1,2,3,4].every((i) => searchParams?.[`declaration${i}`] === "accepted"); if (!accepted) redirect(`/member/opportunities/${opportunity.slug}/participate/declaration?amount=${value}`);
  const successHref = `/member/opportunities/${opportunity.slug}/participate/success?amount=${value}&ref=PP-202606`;
  return <div className="mx-auto max-w-3xl space-y-5"><Link href={`/member/opportunities/${opportunity.slug}/participate/declaration?amount=${value}`} className="text-sm font-bold text-papaipay-green">← Back to Declaration</Link><header><p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">Confirmation</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-3xl">Confirm Participation</h1></header><ContentCard><dl className="divide-y divide-slate-100 text-sm"><Row label="Listing" value={opportunity.title} /><Row label="Participation amount" value={formatRM(value)} /><Row label="Holding return" value={opportunity.estimatedYield} /><Row label="Asset category" value={opportunity.assetCategory} /><Row label="Declaration status" value="All acknowledgements accepted" /></dl><Link href={successHref} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white">Confirm Participation</Link><p className="mt-3 text-center text-xs font-semibold text-slate-500">Payment gateway, backend transaction posting, and e-KYC checks are not integrated in this step.</p></ContentCard></div>;
}
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-bold text-papaipay-ink">{value}</dd></div>; }
