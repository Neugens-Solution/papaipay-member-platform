import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { getMemberParticipationById } from "@/lib/data/memberParticipations";
import { decimalToNumber, formatDate } from "@/lib/utils/formatters";
import { formatRM } from "@/lib/memberMockData";

export default async function ParticipationConfirmationPage({ params }: { params: { id: string } }) {
  const participation = await getMemberParticipationById(params.id);
  if (!participation) notFound();

  const paymentStatus = participation.payments[0]?.status || "Pending";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <ContentCard className="border-papaipay-green/20 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-wide text-papaipay-green">Participation Reserved</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink">Pending Payment</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Your participation has been recorded and reserved. Payment gateway integration is not enabled yet, so no payment was collected and this is not a confirmed participation.</p>
        <dl className="mt-5 divide-y divide-slate-100 rounded-xl bg-slate-50/70 px-4">
          <Row label="Participation ID" value={participation.participationRef} />
          <Row label="Campaign" value={`${participation.campaign.campaignRef} • ${participation.campaign.title}`} />
          <Row label="Amount" value={formatRM(decimalToNumber(participation.participationAmount))} />
          <Row label="Status" value="Pending Payment" />
          <Row label="Payment Status" value={paymentStatus} />
          <Row label="Reserved Until" value={formatDate(participation.reservedUntil)} />
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/member/portfolio" className="inline-flex min-h-11 items-center justify-center rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white hover:bg-papaipay-green/90">View Portfolio</Link>
          <Link href={`/member/opportunities/${participation.campaign.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-papaipay-green hover:text-papaipay-green">Back to Listing</Link>
        </div>
      </ContentCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-slate-500">{label}</dt><dd className="text-right text-sm font-bold text-papaipay-ink">{value}</dd></div>;
}
