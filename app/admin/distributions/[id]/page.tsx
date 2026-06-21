import { BackLink, Badge, Card, InfoGrid, PageHeader } from "@/components/admin/AdminUI";
import { distributions } from "@/lib/adminMockData";

const steps = ["Pending", "Processing", "Paid"];

export default function DistributionDetailPage() {
  const distribution = distributions[0];
  const currentIndex = steps.indexOf(distribution.status);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink href="/admin/distributions" />
      <PageHeader eyebrow={distribution.id} title="Distribution Detail" description="Manual payout workflow: review calculation, check bank details, transfer outside the system, enter reference, date and notes, then mark Paid." />

      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {steps.map((step, index) => {
            const active = index <= currentIndex;
            return (
              <div key={step} className="flex flex-1 items-center gap-3">
                <div className={`grid h-11 w-11 flex-none place-items-center rounded-full text-sm font-bold ring-1 ${active ? "bg-papaipay-green text-white ring-papaipay-green" : "bg-white text-slate-400 ring-slate-200"}`}>{index + 1}</div>
                <div>
                  <p className="text-sm font-bold text-papaipay-ink">{step}</p>
                  <p className="text-xs text-slate-500">{active ? "Reached" : "Awaiting"}</p>
                </div>
                {index < steps.length - 1 ? <div className="hidden h-px flex-1 bg-slate-200 sm:block" /> : null}
              </div>
            );
          })}
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card><h2 className="font-bold">Campaign Information</h2><InfoGrid items={[{ label: "Campaign ID", value: distribution.campaignId }, { label: "Campaign Code", value: distribution.campaignCode }, { label: "Distribution Batch", value: distribution.distributionBatchId }, { label: "Campaign", value: distribution.campaign }, { label: "Participation ID", value: distribution.participationId }, { label: "Participation", value: distribution.participation }]} /></Card>
        <Card><h2 className="font-bold">Member Information</h2><InfoGrid items={[{ label: "Member", value: distribution.member }, { label: "Member ID", value: distribution.memberId }]} /></Card>
        <Card><h2 className="font-bold">Distribution Information</h2><InfoGrid items={[{ label: "Distribution ID", value: distribution.id }, { label: "Principal Return", value: distribution.principalReturn }, { label: "Holding Return", value: distribution.holdingReturn }, { label: "Profit Distribution", value: distribution.profitDistribution }, { label: "Final Distribution Total", value: distribution.amount }, { label: "Payment Date", value: distribution.paid }, { label: "Payment Reference", value: distribution.paymentReference }, { label: "Admin Notes", value: "Manual transfer pending finance confirmation" }]} /></Card>
        <Card>
          <h2 className="font-bold">Manual Payment Processing</h2>
          <div className="mt-4"><Badge>{distribution.status}</Badge></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">{steps.map((step) => <button key={step} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-papaipay-green hover:text-papaipay-green">Mark {step}</button>)}</div>
        </Card>
      </section>

      <Card><h2 className="font-bold">Manual Distribution Process</h2>{["Review final distribution calculation", "Check member bank account details", "Manually transfer payment outside the system", "Enter payment reference number", "Enter payment date", "Add notes if needed", "Mark distribution as Paid"].map((item, index) => <p key={item} className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">Step {index + 1}: {item}</p>)}</Card>
    </div>
  );
}
