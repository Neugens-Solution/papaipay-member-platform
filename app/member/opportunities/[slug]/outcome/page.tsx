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
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/member/opportunities" className="inline-flex items-center rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink">← Back to Listings</Link>
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{campaign.campaignId} • {campaign.campaignCode}</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Campaign Outcome</h1>
            <p className="mt-1 text-lg font-semibold text-papaipay-ink">{campaign.campaignName}</p>
          </div>
          <div className="flex gap-2"><StatusBadge status="Completed" /><StatusBadge status="Distributed" /></div>
        </div>
      </header>
      <ContentCard>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Outcome label="Campaign Target" value={formatRM(campaign.purchasePrice)} />
          <Outcome label="Purchase Price" value={formatRM(campaign.purchasePrice)} />
          <Outcome label="Sale Price" value={formatRM(campaign.salePrice)} />
          <Outcome label="Holding Period" value={campaign.holdingPeriod} />
          <Outcome label="Holding Return" value={campaign.holdingReturn} />
          <Outcome label="Profit Distribution" value={campaign.profitDistribution} />
          <Outcome label="Total Distribution" value={campaign.totalDistribution} />
          <Outcome label="Distribution Date" value={campaign.distributionDate} />
          <Outcome label="Campaign Status" value="Completed" />
          <Outcome label="Distribution Status" value="Distributed" />
        </dl>
      </ContentCard>
    </div>
  );
}

function Outcome({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-2 text-lg font-bold text-papaipay-ink">{value}</dd></div>;
}
