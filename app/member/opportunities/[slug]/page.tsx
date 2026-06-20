import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, ProgressBar, StatusBadge } from "@/components/member/Cards";
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

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-sm text-papaipay-green">{icon}</span>
      <dt className="text-sm font-semibold text-slate-600">{label}</dt>
      <dd className="max-w-[11rem] text-right text-sm font-bold text-papaipay-ink">{value}</dd>
    </div>
  );
}

function MobileAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-papaipay-ink">
        {title}
        <span className="text-slate-400">›</span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export default function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const campaign = opportunities.find((item) => item.slug === params.slug);
  if (!campaign) notFound();

  const progress = Math.round((campaign.collectedAmount / campaign.targetAmount) * 100);
  const remainingAmount = campaign.targetAmount - campaign.collectedAmount;
  const finalDistributionText = "Principal Return + Holding Return + Profit Distribution, paid once during final distribution";

  return (
    <div className="space-y-5 pb-28 md:pb-0">
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
          <ContentCard className="overflow-hidden p-0">
            <div className="relative">
              <div className="flex snap-x snap-mandatory overflow-x-auto rounded-t-xl">
                {campaign.gallery.map((item, index) => (
                  <div key={item} id={`photo-${index + 1}`} className="h-64 min-w-full snap-center bg-cover bg-center sm:h-80" style={{ backgroundImage: `url(${item})` }} aria-label={`Property photo ${index + 1}`} />
                ))}
              </div>
              <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-bold text-white">1 / {campaign.galleryCount}</span>
              <a href="#photo-1" aria-label="Previous photo" className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl font-bold text-papaipay-ink shadow-sm md:grid">‹</a>
              <a href="#photo-2" aria-label="Next photo" className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl font-bold text-papaipay-ink shadow-sm md:grid">›</a>
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
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div><ProgressBar value={progress} /></div>
              <p className="text-sm font-bold text-slate-700">{progress}% Campaign Progress</p>
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
            <dl className="mt-4 divide-y divide-slate-100">
              <DetailRow icon="↻" label="Holding Return Rate" value={campaign.holdingReturnRate} />
              <DetailRow icon="⌁" label="Return Type" value={campaign.returnType} />
              <DetailRow icon="◷" label="Maximum Holding Period" value={`${campaign.maximumHoldingPeriodMonths} Months`} />
              <DetailRow icon="RM" label="Holding Return" value="Accrues during holding period; paid at final distribution" />
              <DetailRow icon="✓" label="Principal Protection" value={campaign.principalProtectionEnabled ? "Enabled" : "Disabled"} />
              <DetailRow icon="24" label="24-Month Rule" value="If not sold within 24 months, Participation Amount only will be returned." />
              <DetailRow icon="＝" label="Final Distribution" value={finalDistributionText} />
            </dl>
            <details className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <summary className="cursor-pointer font-bold text-papaipay-green">Learn More</summary>
              <p className="mt-3">Example: Participation Amount RM10,000 at 1.5% per month for 15 months accrues RM2,250 Holding Return. Holding Return is not paid monthly and is paid once during final distribution.</p>
            </details>
          </ContentCard>

          <div className="hidden space-y-5 md:block">
            <ContentCard>
              <h2 className="text-lg font-bold">About This Campaign</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{campaign.aboutCampaign}</p>
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm leading-6 text-slate-700">{campaign.importantInformation}</div>
            </ContentCard>
            <ContentCard>
              <h2 className="text-lg font-bold">Documents</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {campaign.documents.map((doc) => <div key={doc} className="rounded-md border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold">{doc}</div>)}
              </div>
            </ContentCard>
            <ContentCard>
              <h2 className="text-lg font-bold">Updates</h2>
              <div className="mt-4 space-y-3">{campaign.updates.map((update) => <article key={update.title} className="rounded-lg border border-slate-100 bg-slate-50/70 p-4"><p className="text-xs font-bold text-papaipay-green">{update.date}</p><h3 className="mt-1 text-sm font-bold">{update.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{update.body}</p></article>)}</div>
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

          <div className="space-y-3 md:hidden">
            <MobileAccordion title="Documents"><div className="space-y-2">{campaign.documents.map((doc) => <div key={doc} className="rounded-md border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold">{doc}</div>)}</div></MobileAccordion>
            <MobileAccordion title="About This Campaign"><p className="text-sm leading-6 text-slate-600">{campaign.aboutCampaign}</p><div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-slate-700">{campaign.importantInformation}</div></MobileAccordion>
            <MobileAccordion title="Updates"><div className="space-y-2">{campaign.updates.map((update) => <article key={update.title} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"><p className="text-xs font-bold text-papaipay-green">{update.date}</p><h3 className="mt-1 text-sm font-bold">{update.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{update.body}</p></article>)}</div></MobileAccordion>
            <MobileAccordion title="FAQ"><div className="space-y-2">{campaign.faqs.map((faq) => <details key={faq.question} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"><summary className="cursor-pointer text-sm font-bold">{faq.question}</summary><p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}<p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">If not sold within 24 months, Participation Amount only will be returned.</p></div></MobileAccordion>
          </div>
        </div>

        <aside className="hidden space-y-5 md:block xl:sticky xl:top-6 xl:self-start">
          <ParticipationPanel campaign={campaign} />
        </aside>
      </section>

      <details className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-papaipay-green/40 bg-white p-4 shadow-soft">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-papaipay-green">RM</span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-papaipay-ink">Participate in this Campaign</span><span className="block text-xs font-bold text-papaipay-green">From {formatRM(campaign.minimumParticipation)}</span></span>
          <span className="rounded-xl bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Participate Now</span>
        </summary>
        <div className="mb-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
          <ParticipationPanel campaign={campaign} compact />
        </div>
      </details>
    </div>
  );
}

function ParticipationPanel({ campaign, compact = false }: { campaign: NonNullable<(typeof opportunities)[number]>; compact?: boolean }) {
  return (
    <ContentCard className={compact ? "border-0 p-0 shadow-none" : ""}>
      <h2 className="text-lg font-bold">Participation Panel</h2>
      <label className="mt-4 block text-sm font-bold text-slate-600" htmlFor={compact ? "mobile-participation-amount" : "participation-amount"}>Participation Amount</label>
      <div className="mt-2 flex rounded-md border border-slate-200 bg-white">
        <span className="px-3 py-3 text-sm font-bold text-slate-500">RM</span>
        <input id={compact ? "mobile-participation-amount" : "participation-amount"} className="min-h-11 flex-1 rounded-md px-2 py-3 text-sm outline-none" placeholder="10,000" />
      </div>
      <div className="mt-4 space-y-3">
        <CompactRow label="Minimum Participation Amount" value={formatRM(campaign.minimumParticipation)} />
        <CompactRow label="Maximum Participation Amount" value={formatRM(campaign.maximumParticipation)} />
        <CompactRow label="Campaign Target" value={formatRM(campaign.targetAmount)} />
      </div>
      <button className="mt-5 min-h-12 w-full rounded-md bg-papaipay-green px-5 py-3 text-sm font-bold text-white transition hover:bg-papaipay-green/90">Proceed to Payment</button>
    </ContentCard>
  );
}
