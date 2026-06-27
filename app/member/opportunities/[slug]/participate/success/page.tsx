import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { formatRM } from "@/lib/memberMockData";
import { getMemberCampaignBySlug } from "@/lib/data/memberCampaigns";
export default async function SuccessPage({ params, searchParams }: { params: { slug: string }; searchParams?: { amount?: string; ref?: string } }) {
  const opportunity = await getMemberCampaignBySlug(params.slug); if (!opportunity) notFound(); const amount = Number((searchParams?.amount ?? "0").replace(/,/g, "")); const ref = searchParams?.ref ?? "PP-202606";
  return <div className="mx-auto max-w-3xl space-y-5"><ContentCard className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-2xl text-papaipay-green">✓</div><h1 className="mt-4 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-3xl">Participation submitted successfully.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Reference number: <strong>{ref}</strong></p><p className="mt-1 text-sm leading-6 text-slate-600">{opportunity.title}{amount > 0 ? ` • ${formatRM(amount)}` : ""}</p><div className="mt-5 rounded-xl bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600"><p>PAPAIPAY will review or process the participation. Member can track this in Portfolio.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/member/portfolio" className="min-h-12 rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white">View Portfolio</Link><Link href="/member/opportunities" className="min-h-12 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Browse More Listings</Link></div></ContentCard></div>;
}
