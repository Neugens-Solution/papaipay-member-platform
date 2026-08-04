import Link from "next/link";
import { redirect } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { formatRM } from "@/lib/memberMockData";
import { getRealMemberCampaignBySlug } from "@/lib/data/memberCampaigns";
import { getMemberParticipationById } from "@/lib/data/memberParticipations";
import { decimalToNumber, formatDate } from "@/lib/utils/formatters";

export default async function SuccessPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ participationId?: string }> }) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const opportunity = await getRealMemberCampaignBySlug(slug);
  if (!opportunity) return <ParticipationUnavailable />;

  const participationId = resolvedSearchParams?.participationId;
  if (!participationId) redirect(`/member/opportunities/${opportunity.slug}`);

  const participation = await getMemberParticipationById(participationId);
  if (!participation || participation.campaign.slug !== opportunity.slug) redirect(`/member/participations/${participationId}`);

  const payment = participation.payments[0];
  if (!payment) redirect(`/member/participations/${participation.id}`);

  return <div className="mx-auto max-w-3xl space-y-5"><ContentCard className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-2xl text-kasset-green">✓</div><h1 className="mt-4 text-2xl font-bold tracking-tight text-kasset-ink sm:text-3xl">Participation reserved.</h1><div className="mt-5 rounded-xl bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600"><p><strong>Participation reference:</strong> {participation.participationRef}</p><p><strong>Payment reference:</strong> {payment.paymentRef}</p><p><strong>Payment status:</strong> {String(payment.status)}</p><p><strong>Amount:</strong> {formatRM(decimalToNumber(participation.participationAmount))}</p><p><strong>Reserved until:</strong> {formatDate(participation.reservedUntil)}</p></div><p className="mt-3 text-sm leading-6 text-slate-600">{opportunity.title}</p><div className="mt-5 rounded-xl bg-amber-50 p-4 text-left text-sm leading-6 text-amber-800"><p>Next step: make the manual bank transfer using the official PICM Sdn Bhd payment instructions, then upload your receipt for admin verification.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href={`/member/participations/${participation.id}`} className="min-h-12 rounded-xl bg-kasset-green px-5 py-3 text-sm font-bold text-white">Upload Payment Receipt</Link><Link href="/member/opportunities" className="min-h-12 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Browse More Opportunities</Link></div></ContentCard></div>;
}

function ParticipationUnavailable() { return <div className="mx-auto max-w-3xl space-y-5"><ContentCard><h1 className="text-2xl font-bold text-kasset-ink">Participation unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-600">This opportunity could not be loaded from the live database, so the participation success page cannot be shown.</p><Link href="/member/opportunities" className="mt-5 inline-flex text-sm font-bold text-kasset-green">Back to Opportunities</Link></ContentCard></div>; }
