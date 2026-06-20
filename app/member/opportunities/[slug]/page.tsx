import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, Info, ProgressBar, StatusBadge } from "@/components/member/Cards";
import { opportunities, formatRM } from "@/lib/memberMockData";

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

function CompactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-bold text-papaipay-ink">{value}</dd>
    </div>
  );
}

export default function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const campaign = opportunities.find((item) => item.slug === params.slug);
  if (!campaign) notFound();

  const progress = Math.round((campaign.collectedAmount / campaign.targetAmount) * 100);
  const remainingAmount = campaign.targetAmount - campaign.collectedAmount;

  return (
    <div className="space-y-5">
      <Link href="/member/opportunities" className="inline-flex items-center rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink">← Back to Listings</Link>

      <header className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{campaign.campaignId} • {campaign.campaignCode}</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">{campaign.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.location}</p>
          </div>
          <StatusBadge status={campaign.status} />
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <div className="space-y-5">
          <ContentCard className="p-0">
            <div className="snap-x snap-mandatory overflow-x-auto rounded-t-xl flex">
              {campaign.gallery.map((item, index) => (
                <div key={item} className="h-64 min-w-full snap-center bg-cover bg-center sm:h-80" style={{ backgroundImage: `url(${item})` }} aria-label={`Property photo ${index + 1}`} />
              ))}
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex gap-1.5" aria-label="Photo indicators">
                {campaign.gallery.map((item, index) => <span key={item} className={`h-2 w-2 rounded-full ${index === 0 ? "bg-papaipay-green" : "bg-slate-300"}`} />)}
              </div>
              <details className="relative">
                <summary className="cursor-pointer list-none text-sm font-bold text-papaipay-green">View All Photos</summary>
                <div className="absolute right-0 z-20 mt-3 grid w-[min(86vw,520px)] gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-soft sm:grid-cols-2">
                  {campaign.gallery.map((item) => <div key={item} className="h-32 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${item})` }} />)}
                </div>
              </details>
            </div>
          </ContentCard>

          <ContentCard>
            <h2 className="text-lg font-bold">Campaign Summary</h2>
            <div className="mt-4">
              <ProgressBar value={progress} />
              <p className="mt-2 text-sm font-bold text-slate-700">{progress}% Campaign Progress</p>
            </div>
            <dl className="mt-3 divide-y divide-slate-100">
              <CompactRow label="Campaign Target" value={formatRM(campaign.targetAmount)} />
              <CompactRow label="Collected Amount" value={formatRM(campaign.collectedAmount)} />
              <CompactRow label="Remaining Amount" value={formatRM(remainingAmount)} />
              <CompactRow label="Minimum Participation" value={formatRM(campaign.minimumParticipation)} />
              <CompactRow label="Maximum Participation" value={formatRM(campaign.maximumParticipation)} />
            </dl>
          </ContentCard>

          <ContentCard>
            <h2 className="text-lg font-bold">Property Snapshot</h2>
            <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
              <CompactRow label="Property Type" value={campaign.propertyType} />
              <CompactRow label="Tenure" value={campaign.tenureAlias} />
              <CompactRow label="LACA" value={campaign.isLaca ? "Yes" : "No"} />
              <CompactRow label="Bumi Status" value={campaign.bumiStatus} />
              <CompactRow label="Built-Up" value={campaign.builtUpArea} />
              <CompactRow label="Land Area" value={campaign.landArea} />
              <CompactRow label="Bedrooms" value={`${campaign.bedrooms}`} />
              <CompactRow label="Bathrooms" value={`${campaign.bathrooms}`} />
              <CompactRow label="Reserve Price" value={formatRM(campaign.reservePrice)} />
              <CompactRow label="Auction Date" value={campaign.auctionDate} />
              <CompactRow label="State" value={campaign.state} />
              <CompactRow label="Full Address" value={campaign.fullAddress} />
            </dl>
          </ContentCard>

          <ContentCard>
            <h2 className="text-lg font-bold">Return & Distribution Information</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="Holding Return Rate" value={campaign.holdingReturnRate} />
              <Info label="Return Type" value={campaign.returnType} />
              <Info label="Maximum Holding Period" value={`${campaign.maximumHoldingPeriodMonths} Months`} />
              <Info label="Accrued Holding Return" value="RM10,000 × 1.5% × 15 Months = RM2,250" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">Holding Return accrues during the holding period and is paid once during final distribution. If the asset is not successfully sold within 24 months, members receive Participation Amount only with no Holding Return and no Profit Distribution.</p>
          </ContentCard>

          <ContentCard>
            <h2 className="text-lg font-bold">Documents</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {campaign.documents.map((doc) => <div key={doc} className="rounded-md border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold">{doc}</div>)}
            </div>
          </ContentCard>

          <ContentCard>
            <h2 className="text-lg font-bold">FAQ</h2>
            {campaign.faqs.map((faq) => (
              <details key={faq.question} className="mt-3 rounded-md border border-slate-100 bg-slate-50/80 p-4">
                <summary className="cursor-pointer text-sm font-bold">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
            <details className="mt-3 rounded-md border border-slate-100 bg-slate-50/80 p-4">
              <summary className="cursor-pointer text-sm font-bold">What happens after 24 months?</summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">If the asset is not successfully sold within 24 months, members receive Participation Amount only. Holding Return and Profit Distribution are not paid.</p>
            </details>
          </ContentCard>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <ContentCard>
            <h2 className="text-lg font-bold">Participation Panel</h2>
            <label className="mt-4 block text-sm font-bold text-slate-600" htmlFor="participation-amount">Participation Amount</label>
            <div className="mt-2 flex rounded-md border border-slate-200 bg-white">
              <span className="px-3 py-3 text-sm font-bold text-slate-500">RM</span>
              <input id="participation-amount" className="min-h-11 flex-1 rounded-md px-2 py-3 text-sm outline-none" placeholder="10,000" />
            </div>
            <div className="mt-4 space-y-3">
              <Info label="Minimum Participation Amount" value={formatRM(campaign.minimumParticipation)} />
              <Info label="Maximum Participation Amount" value={formatRM(campaign.maximumParticipation)} />
              <Info label="Campaign Target" value={formatRM(campaign.targetAmount)} />
            </div>
            <button className="mt-5 min-h-12 w-full rounded-md bg-papaipay-green px-5 py-3 text-sm font-bold text-white transition hover:bg-papaipay-green/90">Proceed to Payment</button>
            <p className="mt-3 text-center text-xs font-semibold text-slate-500">Participation Submitted after payment confirmation.</p>
          </ContentCard>
        </aside>
      </section>
    </div>
  );
}
