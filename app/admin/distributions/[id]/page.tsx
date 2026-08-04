import { notFound } from "next/navigation";
import { BackLink, Badge, Card, InfoGrid, PageHeader } from "@/components/admin/AdminUI";
import { getAdminDistributionById } from "@/lib/admin/data/distributions";
import { decimalToNumber, formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/formatters";

const steps = ["Pending", "Processing", "Paid"];

export default async function DistributionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const distribution = await getAdminDistributionById(id);
  if (!distribution) notFound();
  const currentIndex = Math.max(steps.indexOf(String(distribution.status)), 0);
  const bank = distribution.member.bankAccounts[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink href="/admin/distributions" label="Back to Distributions" />
      <PageHeader eyebrow={distribution.distributionRef} title="Distribution Detail" description="Read-only audit view of the manual distribution record." />

      <Card><div className="grid gap-3 sm:grid-cols-3">{steps.map((step, index) => <div key={step} className={`rounded-xl border p-4 ${index <= currentIndex ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}><span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${index <= currentIndex ? "bg-kasset-green text-white" : "bg-slate-200 text-slate-500"}`}>{index + 1}</span><p className="mt-3 text-sm font-bold text-kasset-ink">{step}</p></div>)}</div></Card>

      <section className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card><h2 className="font-bold">Project & Member</h2><InfoGrid items={[{ label: "Project", value: distribution.campaign.title }, { label: "Campaign ID", value: distribution.campaign.campaignRef }, { label: "Campaign Code", value: distribution.campaign.campaignCode }, { label: "Batch", value: distribution.distributionBatch.batchRef }, { label: "Member", value: distribution.member.fullName }, { label: "Member ID", value: distribution.member.memberRef }, { label: "Bank", value: bank?.bankName || "Not provided" }, { label: "Account", value: bank?.accountNumberLast4 ? `•••• ${bank.accountNumberLast4}` : "Not provided" }]} /></Card>
        <Card><h2 className="font-bold">Distribution Breakdown</h2><InfoGrid items={[{ label: "Participation", value: distribution.participation.participationRef }, { label: "Participation Amount", value: formatCurrency(decimalToNumber(distribution.participation.participationAmount)) }, { label: "Principal Return", value: formatCurrency(decimalToNumber(distribution.principalReturn)) }, { label: "Holding Return", value: formatCurrency(decimalToNumber(distribution.holdingReturn)) }, { label: "Profit Distribution", value: formatCurrency(decimalToNumber(distribution.profitDistribution)) }, { label: "Final Distribution", value: formatCurrency(decimalToNumber(distribution.finalDistributionTotal)) }]} /></Card>
        <Card><h2 className="font-bold">Payment Record</h2><div className="mt-4"><Badge>{formatEnumLabel(String(distribution.status))}</Badge></div><InfoGrid items={[{ label: "Payment Date", value: distribution.paymentDate ? formatDate(distribution.paymentDate) : "Not paid" }, { label: "Payment Reference", value: distribution.paymentReference || "Not recorded" }, { label: "Paid By", value: distribution.markedPaidBy?.email || "Not recorded" }, { label: "Notes", value: distribution.adminNotes || "No notes" }]} /></Card>
        <Card><h2 className="font-bold">Process Note</h2><p className="mt-4 text-sm leading-7 text-slate-600">The actual bank transfer is completed outside the platform. This page records the reviewed distribution amount, payment date, reference and responsible admin for audit purposes.</p></Card>
      </section>
    </div>
  );
}
