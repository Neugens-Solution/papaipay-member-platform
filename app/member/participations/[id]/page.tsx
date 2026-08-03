import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/member/Cards";
import { PaymentReceiptForm } from "@/components/member/PaymentReceiptForm";
import { getMemberParticipationById } from "@/lib/data/memberParticipations";
import { decimalToNumber, formatDate } from "@/lib/utils/formatters";
import { formatRM } from "@/lib/memberMockData";

export default async function ParticipationConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const participation = await getMemberParticipationById(id);
  if (!participation) notFound();

  const payment = participation.payments[0];
  const paymentStatus = String(payment?.status || "Pending");
  const paymentReference = payment?.reconciliationReference || payment?.paymentRef || "Pending manual confirmation";
  const canUploadReceipt = payment && ["Pending", "Processing"].includes(paymentStatus) && String(participation.participationStatus) === "PendingPayment";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <ContentCard className="border-papaipay-green/20 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-wide text-papaipay-green">Participation Reserved</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink">Pending Payment</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Your participation has been reserved. Complete the bank transfer using the payment instructions provided by PAPAIPAY, then upload the receipt below for admin review.</p>
        <dl className="mt-5 divide-y divide-slate-100 rounded-xl bg-slate-50/70 px-4">
          <Row label="Participation ID" value={participation.participationRef} />
          <Row label="Campaign" value={`${participation.campaign.campaignRef} • ${participation.campaign.title}`} />
          <Row label="Amount" value={formatRM(decimalToNumber(participation.participationAmount))} />
          <Row label="Status" value="Pending Payment" />
          <Row label="Payment Status" value={paymentStatus} />
          <Row label="Payment Reference" value={paymentReference} />
          <Row label="Manual Payment" value={payment?.submittedAt ? `Receipt submitted ${formatDate(payment.submittedAt)}` : "Receipt not submitted yet"} />
          <Row label="Reserved Until" value={formatDate(participation.reservedUntil)} />
        </dl>
        {payment?.receiptFileAsset ? (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-left">
            <p className="text-sm font-bold text-papaipay-green">Payment receipt received</p>
            <p className="mt-1 text-sm text-slate-600">Bank reference: {payment.submittedReference || "Not provided"}</p>
            <Link href={`/files/${payment.receiptFileAsset.id}`} target="_blank" className="mt-3 inline-flex text-sm font-bold text-papaipay-green">View submitted receipt ↗</Link>
          </div>
        ) : null}
        {canUploadReceipt ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
            <h2 className="text-base font-bold text-papaipay-ink">{payment.receiptFileAsset ? "Replace Payment Receipt" : "Upload Payment Receipt"}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">This upload does not process a payment. It sends your receipt to the admin team for manual verification.</p>
            <PaymentReceiptForm participationId={participation.id} paymentId={payment.id} existingReference={payment.submittedReference} />
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/member/portfolio" className="inline-flex min-h-11 items-center justify-center rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white hover:bg-papaipay-green/90">View Portfolio</Link>
          <Link href={`/member/opportunities/${participation.campaign.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-papaipay-green hover:text-papaipay-green">Back to Listing</Link>
        </div>
      </ContentCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4"><dt className="text-sm text-slate-500">{label}</dt><dd className="min-w-0 break-words text-sm font-bold text-papaipay-ink sm:text-right">{value}</dd></div>;
}
