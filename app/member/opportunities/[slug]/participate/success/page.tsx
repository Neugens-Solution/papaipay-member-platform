import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { formatRM } from "@/lib/memberMockData";
import { getMemberCampaignBySlug } from "@/lib/data/memberCampaigns";
import { getMemberParticipationById } from "@/lib/data/memberParticipations";
import { decimalToNumber, formatDate } from "@/lib/utils/formatters";

export default async function SuccessPage({ params, searchParams }: { params: { slug: string }; searchParams?: { participationId?: string } }) {
  const opportunity = await getMemberCampaignBySlug(params.slug);
  if (!opportunity) notFound();

  const participationId = searchParams?.participationId;
  if (!participationId) redirect(`/member/opportunities/${opportunity.slug}`);

  const participation = await getMemberParticipationById(participationId);
  if (!participation || participation.campaign.slug !== opportunity.slug) redirect(`/member/participations/${participationId}`);

  const payment = participation.payments[0];
  if (!payment) redirect(`/member/participations/${participation.id}`);

  return <div className="mx-auto max-w-3xl space-y-5"><ContentCard className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-2xl text-papaipay-green">✓</div><h1 className="mt-4 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-3xl">Participation submitted successfully.</h1><div className="mt-5 rounded-xl bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600"><p><strong>Participation reference:</strong> {participation.participationRef}</p><p><strong>Payment reference:</strong> {payment.paymentRef}</p><p><strong>Payment status:</strong> {String(payment.status)}</p><p><strong>Amount:</strong> {formatRM(decimalToNumber(participation.participationAmount))}</p><p><strong>Reserved until:</strong> {formatDate(participation.reservedUntil)}</p></div><p className="mt-3 text-sm leading-6 text-slate-600">{opportunity.title}</p><div className="mt-5 rounded-xl bg-amber-50 p-4 text-left text-sm leading-6 text-amber-800"><p>Your participation is pending manual payment confirmation. PAPAIPAY admins will confirm the payment after it is received; no payout or distribution is created by this step.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href={`/member/participations/${participation.id}`} className="min-h-12 rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white">View Participation</Link><Link href="/member/opportunities" className="min-h-12 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Browse More Opportunities</Link></div></ContentCard></div>;
}
