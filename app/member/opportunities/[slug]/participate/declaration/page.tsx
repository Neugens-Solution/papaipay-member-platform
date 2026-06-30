import Link from "next/link";
import { redirect } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { getRealMemberCampaignBySlug } from "@/lib/data/memberCampaigns";

const declarations = ["I understand this opportunity involves risk.", "I have read the important information.", "I understand estimated yield is not guaranteed.", "I confirm the information I provided is accurate."];
function amount(raw?: string) { const n = Number((raw ?? "").replace(/,/g, "")); return Number.isFinite(n) && n > 0 ? n : null; }
export default async function DeclarationPage({ params, searchParams }: { params: { slug: string }; searchParams?: { amount?: string } }) {
  const opportunity = await getRealMemberCampaignBySlug(params.slug); if (!opportunity) return <ParticipationUnavailable />; const value = amount(searchParams?.amount); if (!value) redirect(`/member/opportunities/${opportunity.slug}/participate`);
  return <div className="mx-auto max-w-3xl space-y-5"><Link href={`/member/opportunities/${opportunity.slug}/participate/review?amount=${value}`} className="text-sm font-bold text-papaipay-green">← Back to Review</Link><header><p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">Declaration</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-3xl">Member Acknowledgements</h1></header><ContentCard><form method="get" action={`/member/opportunities/${opportunity.slug}/participate/confirmation`} className="space-y-4"><input type="hidden" name="amount" value={value} />{declarations.map((item, index) => <label key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-semibold text-slate-700"><input required type="checkbox" name={`declaration${index + 1}`} value="accepted" className="mt-1 h-4 w-4 accent-papaipay-green" />{item}</label>)}<button className="min-h-12 w-full rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white" type="submit">Continue to Confirmation</button></form></ContentCard></div>;
}

function ParticipationUnavailable() { return <div className="mx-auto max-w-3xl space-y-5"><ContentCard><h1 className="text-2xl font-bold text-papaipay-ink">Participation unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-600">This opportunity could not be loaded from the live database, so participation is unavailable right now.</p><Link href="/member/opportunities" className="mt-5 inline-flex text-sm font-bold text-papaipay-green">Back to Opportunities</Link></ContentCard></div>; }
