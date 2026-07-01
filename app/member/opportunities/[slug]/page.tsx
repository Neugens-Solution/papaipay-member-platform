import Link from "next/link";
import { notFound } from "next/navigation";
import type { SVGProps } from "react";
import { ContentCard, ProgressBar, StatusBadge } from "@/components/member/Cards";
import { ImageCarousel } from "@/components/member/ImageCarousel";
import { formatRM } from "@/lib/memberMockData";
import { getMemberCampaignBySlug, getMemberCampaigns } from "@/lib/data/memberCampaigns";

export async function generateStaticParams() {
  const opportunities = await getMemberCampaigns();

  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

type IconName = "arrow" | "map" | "calendar" | "dollar" | "file" | "shield" | "trend" | "wallet" | "check" | "chevronRight" | "chevronDown" | "image" | "building" | "home" | "clock";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common: SVGProps<SVGSVGElement> = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", className, "aria-hidden": true };
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="m15 18-6-6 6-6" /><path d="M9 12h12" /></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M4 10h16" /></>,
    dollar: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10" /><path d="M15 9.5c-.7-.6-1.7-1-3-1-1.7 0-3 .8-3 2s1.3 1.8 3 2 3 .8 3 2-1.3 2-3 2c-1.3 0-2.4-.4-3.2-1.1" /></>,
    file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /><path d="M8 13h8" /><path d="M8 17h5" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
    trend: <><path d="m3 17 6-6 4 4 7-8" /><path d="M14 7h6v6" /></>,
    wallet: <><path d="M4 7a2 2 0 0 1 2-2h13v14H6a2 2 0 0 1-2-2Z" /><path d="M4 9h15" /><path d="M16 13h.01" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5L16 9" /></>,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    image: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="10" r="1.5" /><path d="m21 16-5-5L6 19" /></>,
    building: <><path d="M4 21h16" /><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M9 8h1" /><path d="M14 8h1" /><path d="M9 12h1" /><path d="M14 12h1" /></>,
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function CompactRow({ label, value, icon, helper, wideValue = false }: { label: string; value: string; icon?: IconName; helper?: string; wideValue?: boolean }) {
  return (
    <div className={`${wideValue ? "sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(20rem,32rem)]" : "flex justify-between"} items-start gap-4 border-b border-slate-100 py-3 last:border-b-0`}>
      <dt className="flex min-w-0 items-start gap-2 text-sm text-slate-500">
        {icon ? <Icon name={icon} className="mt-0.5 h-4 w-4 flex-none text-papaipay-green" /> : null}
        <span className="min-w-0">
          <span className="block">{label}</span>
          {helper ? <span className="mt-1 block text-xs leading-5 text-slate-400">{helper}</span> : null}
        </span>
      </dt>
      <dd className={`${wideValue ? "sm:max-w-none" : "max-w-[13rem]"} text-right text-sm font-bold leading-6 text-papaipay-ink`}>{value}</dd>
    </div>
  );
}

function MobileAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-papaipay-ink">
        {title}
        <Icon name="chevronRight" className="h-4 w-4 text-slate-400" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export default async function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const campaign = await getMemberCampaignBySlug(params.slug);
  if (!campaign) notFound();

  const progress = Math.round((campaign.collectedAmount / campaign.targetAmount) * 100);
  const remainingAmount = Math.max(campaign.targetAmount - campaign.collectedAmount - campaign.reservedAmount, 0);
  const finalDistributionText = "Original Participation Amount + accumulated Holding Return + any approved project distribution";
  const protectionText = campaign.principalProtectionEnabled
    ? "Original Participation Amount Protection Applies"
    : "Original Participation Amount Protection Not Included";

  return (
    <div className="space-y-5 pb-44 md:pb-0">
      <Link href="/member/opportunities" className="inline-flex items-center gap-2 rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink"><Icon name="arrow" className="h-4 w-4" />Back to Member Listings</Link>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
        <div className="space-y-5">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Listing Reference: {campaign.campaignId} • {campaign.campaignCode}</p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-4xl">{campaign.title}</h1>
                  <p className="mt-2 flex items-center gap-2 text-sm leading-6 text-slate-600"><Icon name="map" className="h-4 w-4 text-papaipay-green" />{campaign.location}</p>
                </div>
                <StatusBadge status={campaign.status} />
              </div>
            </div>
            <div className="relative mx-3 mb-3 overflow-hidden rounded-2xl sm:mx-5 sm:mb-5">
              {campaign.gallery.length > 0 ? (
                <>
                  <ImageCarousel images={campaign.gallery} />
                </>
              ) : (
                <div className="grid h-64 place-items-center bg-slate-100 text-center sm:h-[26rem]"><div><p className="text-base font-black text-slate-500">Image pending</p><p className="mt-2 text-sm font-semibold text-slate-400">Media will be available soon</p></div></div>
              )}
            </div>
            {campaign.gallery.length > 0 ? <div className="flex items-center justify-center border-t border-slate-100 px-5 py-3">
              <details className="relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-papaipay-green"><Icon name="image" className="h-4 w-4" />View All Photos</summary>
                <div className="absolute left-1/2 z-20 mt-3 grid w-[min(86vw,640px)] -translate-x-1/2 gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-soft sm:grid-cols-2">
                  {campaign.gallery.map((item) => <div key={item} className="h-32 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${item})` }} />)}
                </div>
              </details>
            </div> : null}
          </article>

          <ContentCard className="shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-bold">Listing Summary</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div><ProgressBar value={progress} /></div>
              <p className="text-sm font-bold text-papaipay-green">{progress}%</p>
            </div>
            <dl className="mt-3 grid gap-x-6 sm:grid-cols-2">
              <CompactRow label="Listing Target" value={formatRM(campaign.targetAmount)} icon="dollar" />
              <CompactRow label="Collected Amount" value={formatRM(campaign.collectedAmount)} icon="wallet" />
              <CompactRow label="Reserved Amount" value={formatRM(campaign.reservedAmount)} icon="wallet" />
              <CompactRow label="Remaining Amount" value={formatRM(remainingAmount)} icon="trend" />
              <CompactRow label="Market Value" value={formatRM(campaign.marketValue)} icon="dollar" />
              <CompactRow label="Projected Holding Return" value={campaign.estimatedYield} icon="trend" />
              <CompactRow label="Minimum Participation" value={formatRM(campaign.minimumParticipation)} icon="check" />
              <CompactRow label="Maximum Participation" value={formatRM(campaign.maximumParticipation)} icon="check" />
            </dl>
          </ContentCard>

          <ContentCard className="shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-bold">Asset Snapshot</h2>
            <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
              <CompactRow label="Asset Category" value={campaign.assetCategory} icon="building" />
              <CompactRow label="Asset Type" value={campaign.propertyType} icon="home" />
              <CompactRow label="Tenure" value={campaign.tenure} icon="shield" />
              <CompactRow label="Occupancy Status" value={campaign.occupancyStatus} icon="building" />
              <CompactRow label="Bumi Status" value={campaign.bumiStatus} icon="shield" />
              <CompactRow label="Built-Up" value={campaign.builtUpArea} icon="building" />
              <CompactRow label="Land Area" value={campaign.landArea} icon="map" />
              <CompactRow label="Bedrooms" value={`${campaign.bedrooms}`} icon="home" />
              <CompactRow label="Bathrooms" value={`${campaign.bathrooms}`} icon="home" />
              <CompactRow label="State" value={campaign.state} icon="map" />
              <CompactRow label="Full Address" value={campaign.fullAddress} icon="map" />
            </dl>
          </ContentCard>

          <ContentCard className="shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-bold">Return & Distribution Information</h2>
            <dl className="mt-4 divide-y divide-slate-100">
              <CompactRow wideValue label="Projected Holding Return" value={campaign.holdingReturnRate} icon="trend" helper="Projected rate during the holding period." />
              <CompactRow wideValue label="Return Basis" value={campaign.returnType} icon="wallet" />
              <CompactRow wideValue label="Maximum Holding Period" value={`${campaign.maximumHoldingPeriodMonths} Months`} icon="clock" helper="The expected limit stated in the listing terms." />
              <CompactRow wideValue label="Holding Return Timing" value="Accumulated and paid after project completion" icon="dollar" helper="Not paid monthly." />
              <CompactRow wideValue label="Original Participation Amount Protection" value={protectionText} icon="shield" />
              <CompactRow wideValue label="Maximum Holding Period Protection" value="Original Participation Amount returned according to listing terms." icon="check" />
              <CompactRow wideValue label="Final Distribution at Project Completion" value={finalDistributionText} icon="wallet" />
            </dl>
            <details className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-papaipay-green">Learn More <Icon name="chevronDown" className="h-4 w-4" /></summary>
              <p className="mt-3">Holding Return is a projected return that accumulates during the project holding period. It is not paid monthly and will be distributed together with the Final Distribution after the project is completed.</p><p className="mt-3">If the property is not successfully disposed of within the maximum holding period, members will receive their original Participation Amount back according to the listing terms.</p><p className="mt-3">Actual returns may vary depending on project outcome and approved costs.</p>
            </details>
          </ContentCard>

          <div className="hidden space-y-5 md:block">
            <ContentCard><h2 className="text-lg font-bold">About This Opportunity</h2><p className="mt-3 text-sm leading-6 text-slate-600">{campaign.aboutCampaign}</p><div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm leading-6 text-slate-700">{campaign.importantInformation}</div></ContentCard>
            <ContentCard><h2 className="text-lg font-bold">Documents</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{campaign.documents.map((doc) => <DocumentLink key={typeof doc === "string" ? doc : doc.url} document={doc} />)}</div></ContentCard>
            <ContentCard><h2 className="text-lg font-bold">Updates</h2><div className="mt-4 space-y-3">{campaign.updates.map((update) => <article key={update.title} className="rounded-lg border border-slate-100 bg-slate-50/70 p-4"><p className="text-xs font-bold text-papaipay-green">{update.date}</p><h3 className="mt-1 text-sm font-bold">{update.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{update.body}</p></article>)}</div></ContentCard>
            <ContentCard><h2 className="text-lg font-bold">FAQ</h2>{campaign.faqs.map((faq) => <details key={faq.question} className="mt-3 rounded-md border border-slate-100 bg-slate-50/80 p-4"><summary className="cursor-pointer text-sm font-bold">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}<details className="mt-3 rounded-md border border-slate-100 bg-slate-50/80 p-4"><summary className="cursor-pointer text-sm font-bold">What happens after 24 months?</summary><p className="mt-3 text-sm leading-6 text-slate-600">If the property is not successfully disposed of within the maximum holding period, members receive their original Participation Amount back according to the listing terms.</p></details></ContentCard>
            <ContentCard><h2 className="text-lg font-bold">Risk Disclaimer</h2><p className="mt-3 text-sm leading-6 text-slate-600">{campaign.riskSummary}</p></ContentCard>
          </div>

          <div className="space-y-3 md:hidden">
            <MobileAccordion title="Documents"><div className="space-y-2">{campaign.documents.map((doc) => <DocumentLink key={typeof doc === "string" ? doc : doc.url} document={doc} />)}</div></MobileAccordion>
            <MobileAccordion title="About This Opportunity"><p className="text-sm leading-6 text-slate-600">{campaign.aboutCampaign}</p><div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-slate-700">{campaign.importantInformation}</div></MobileAccordion>
            <MobileAccordion title="Updates"><div className="space-y-2">{campaign.updates.map((update) => <article key={update.title} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"><p className="text-xs font-bold text-papaipay-green">{update.date}</p><h3 className="mt-1 text-sm font-bold">{update.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{update.body}</p></article>)}</div></MobileAccordion>
            <MobileAccordion title="FAQ"><div className="space-y-2">{campaign.faqs.map((faq) => <details key={faq.question} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"><summary className="cursor-pointer text-sm font-bold">{faq.question}</summary><p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}<p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">If the property is not successfully disposed of within the maximum holding period, members receive their original Participation Amount back according to the listing terms.</p></div></MobileAccordion>
            <MobileAccordion title="Risk Disclaimer"><p className="text-sm leading-6 text-slate-600">{campaign.riskSummary}</p></MobileAccordion>
          </div>
        </div>

        <aside className="hidden space-y-5 md:block xl:sticky xl:top-[120px] xl:self-start"><ParticipationPanel campaign={campaign} /></aside>
      </section>

      <details className="group fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 md:hidden">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-papaipay-green/40 bg-white p-4 shadow-soft group-open:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-papaipay-green"><Icon name="dollar" className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-papaipay-ink">Participate in this Opportunity</span><span className="block text-xs font-bold text-papaipay-green">From {formatRM(campaign.minimumParticipation)}</span></span>
          <span className="rounded-xl bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Participate Now</span>
        </summary>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" /><ParticipationPanel campaign={campaign} compact /></div>
      </details>
    </div>
  );
}

function DocumentLink({
  document,
}: {
  document: string | { title: string; filename: string; url: string };
}) {
  const title = typeof document === "string" ? document : document.title;
  const filename = typeof document === "string" ? document : document.filename;
  const url = typeof document === "string" ? "#" : document.url;

  return (
    <a
      href={url}
      download={filename}
      className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold transition hover:border-papaipay-green/30 hover:bg-emerald-50/60"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon name="file" className="h-4 w-4 flex-none text-papaipay-green" />
        <span className="min-w-0">
          <span className="block truncate">{title}</span>
          <span className="block truncate text-xs font-semibold text-slate-500">
            {filename}
          </span>
        </span>
      </span>
      <Icon name="chevronRight" className="h-4 w-4 flex-none text-slate-400" />
    </a>
  );
}

function ParticipationPanel({
  campaign,
  compact = false,
}: {
  campaign: NonNullable<Awaited<ReturnType<typeof getMemberCampaignBySlug>>>;
  compact?: boolean;
}) {
  return (
    <ContentCard className={`${compact ? "border-0 p-0 shadow-none" : "border-papaipay-green/20 shadow-[0_18px_55px_rgba(15,23,42,0.08)]"}`}>
      <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-papaipay-green"><Icon name="dollar" className="h-5 w-5" /></span><div><h2 className="text-lg font-bold">Participate</h2><p className="text-xs font-semibold text-slate-500">Start the review and declaration flow.</p></div></div>
      <div className="mt-4 divide-y divide-slate-100 rounded-xl bg-slate-50/70 px-3">
        <CompactRow label="Minimum Participation" value={formatRM(campaign.minimumParticipation)} />
        <CompactRow label="Maximum Participation" value={formatRM(campaign.maximumParticipation)} />
        <CompactRow label="Available to Participate" value={formatRM(Math.max(campaign.targetAmount - campaign.collectedAmount - campaign.reservedAmount, 0))} />
      </div>
      <Link href={`/member/opportunities/${campaign.slug}/participate`} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(34,139,76,0.24)] transition hover:bg-papaipay-green/90">Participate</Link>
      <p className="mt-3 text-center text-xs font-semibold leading-5 text-slate-500">No payment gateway is connected yet. Participation is submitted for review.</p>
    </ContentCard>
  );
}
