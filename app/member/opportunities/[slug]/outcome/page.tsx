import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, StatusBadge } from "@/components/member/Cards";
import { completedCampaigns, formatRM } from "@/lib/memberMockData";

export function generateStaticParams() {
  return completedCampaigns.map((campaign) => ({ slug: campaign.slug }));
}

export default function CampaignOutcomePage({ params }: { params: { slug: string } }) {
  const campaign = completedCampaigns.find((item) => item.slug === params.slug);
  if (!campaign) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link href="/member/opportunities?tab=completed" className="inline-flex items-center rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink">← Back to Completed Listings</Link>
      <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{campaign.campaignId} • {campaign.campaignCode}</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-papaipay-ink">Listing Outcome</h1>
              <p className="mt-2 text-xl font-semibold text-papaipay-ink">{campaign.campaignName}</p>
            </div>
            <div className="flex gap-2"><StatusBadge status="Completed" /><StatusBadge status="Distributed" /></div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <HeroMetric label="Total Distribution" value={campaign.totalDistribution} />
            <HeroMetric label="Final Distribution Amount" value={formatRM(campaign.finalDistributionAmount)} />
            <HeroMetric label="Distribution Date" value={campaign.distributionDate} />
          </div>
        </div>
      </header>

      <ContentCard>
        <h2 className="text-lg font-bold">Outcome Breakdown</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Outcome label="Listing Target" value={formatRM(campaign.purchasePrice)} />
          <Outcome label="Purchase Price" value={formatRM(campaign.purchasePrice)} />
          <Outcome label="Sale Price" value={formatRM(campaign.salePrice)} />
          <Outcome label="Holding Period" value={campaign.holdingPeriod} />
          <Outcome label="Holding Return" value={campaign.holdingReturn} />
          <Outcome label="Profit Distribution" value={campaign.profitDistribution} />
          <Outcome label="Final Distribution" value={campaign.totalDistribution} />
          <Outcome label="Final Distribution Amount" value={formatRM(campaign.finalDistributionAmount)} />
          <Outcome label="Distribution Date" value={campaign.distributionDate} />
        </dl>
      </ContentCard>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-emerald-100 bg-white/80 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-papaipay-green">{value}</p></div>;
}

function Outcome({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-2 text-lg font-bold text-papaipay-ink">{value}</dd></div>;
}
