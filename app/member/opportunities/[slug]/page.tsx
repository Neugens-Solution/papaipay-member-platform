import Link from "next/link";
import { notFound } from "next/navigation";
import type { SVGProps } from "react";
import { ContentCard, ProgressBar, StatusBadge } from "@/components/member/Cards";
import { opportunities, formatRM } from "@/lib/memberMockData";

export function generateStaticParams() {
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

function CompactRow({ label, value, icon }: { label: string; value: string; icon?: IconName }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <dt className="flex min-w-0 items-center gap-2 text-sm text-slate-500">{icon ? <Icon name={icon} className="h-4 w-4 flex-none text-papaipay-green" /> : null}<span>{label}</span></dt>
      <dd className="max-w-[12rem] text-right text-sm font-bold text-papaipay-ink">{value}</dd>
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

export default function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const campaign = opportunities.find((item) => item.slug === params.slug);
  if (!campaign) notFound();

  const progress = Math.round((campaign.collectedAmount / campaign.targetAmount) * 100);
  const remainingAmount = campaign.targetAmount - campaign.collectedAmount;
  const finalDistributionText = "Principal Return + Holding Return + Profit Distribution, paid once during final distribution";

  return (
    <div className="space-y-5 pb-44 md:pb-0">
      <Link href="/member/opportunities" className="inline-flex items-center gap-2 rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink"><Icon name="arrow" className="h-4 w-4" />Back to Listings</Link>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
        <div className="space-y-5">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{campaign.campaignId} • {campaign.campaignCode}</p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink sm:text-4xl">{campaign.title}</h1>
                  <p className="mt-2 flex items-center gap-2 text-sm leading-6 text-slate-600"><Icon name="map" className="h-4 w-4 text-papaipay-green" />{campaign.location}</p>
                </div>
                <StatusBadge status={campaign.status} />
              </div>
            </div>
            <div className="relative mx-3 mb-3 overflow-hidden rounded-2xl sm:mx-5 sm:mb-5">
              <div className="flex snap-x snap-mandatory overflow-x-auto bg-slate-100">
                {campaign.gallery.map((item, index) => (
                  <div key={item} id={`photo-${index + 1}`} className="h-64 min-w-full snap-center bg-cover bg-center sm:h-[26rem]" style={{ backgroundImage: `url(${item})` }} aria-label={`Property photo ${index + 1}`} />
                ))}
              </div>
              <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-bold text-white">1 / {campaign.galleryCount}</span>
              <a href="#photo-1" aria-label="Previous photo" className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl font-bold text-papaipay-ink shadow-md md:grid">‹</a>
              <a href="#photo-2" aria-label="Next photo" className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl font-bold text-papaipay-ink shadow-md md:grid">›</a>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/80 px-2 py-1 backdrop-blur" aria-label="Photo indicators">
                {campaign.gallery.map((item, index) => <span key={item} className={`h-2 w-2 rounded-full ${index === 0 ? "bg-papaipay-green" : "bg-slate-300"}`} />)}
              </div>
            </div>
            <div className="flex items-center justify-center border-t border-slate-100 px-5 py-3">
              <details className="relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-papaipay-green"><Icon name="image" className="h-4 w-4" />View All Photos</summary>
                <div className="absolute left-1/2 z-20 mt-3 grid w-[min(86vw,640px)] -translate-x-1/2 gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-soft sm:grid-cols-2">
                  {campaign.gallery.map((item) => <div key={item} className="h-32 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${item})` }} />)}
                </div>
              </details>
            </div>
          </article>

          <ContentCard className="shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-bold">Campaign Summary</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div><ProgressBar value={progress} /></div>
              <p className="text-sm font-bold text-papaipay-green">{progress}%</p>
            </div>
            <dl className="mt-3 divide-y divide-slate-100">
              <CompactRow label="Campaign Target" value={formatRM(campaign.targetAmount)} icon="dollar" />
              <CompactRow label="Collected Amount" value={formatRM(campaign.collectedAmount)} icon="wallet" />
              <CompactRow label="Remaining Amount" value={formatRM(remainingAmount)} icon="trend" />
              <CompactRow label="Minimum Participation" value={formatRM(campaign.minimumParticipation)} icon="check" />
              <CompactRow label="Maximum Participation" value={formatRM(campaign.maximumParticipation)} icon="check" />
            </dl>
          </ContentCard>

          <ContentCard className="shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-bold">Property Snapshot</h2>
            <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
              <CompactRow label="Property Type" value={campaign.propertyType} icon="home" />
              <CompactRow label="Tenure" value={campaign.tenure} icon="shield" />
              <CompactRow label="LACA" value={campaign.isLaca ? "Yes" : "No"} icon="building" />
              <CompactRow label="Bumi Status" value={campaign.bumiStatus} icon="shield" />
              <CompactRow label="Built-Up" value={campaign.builtUpArea} icon="building" />
              <CompactRow label="Land Area" value={campaign.landArea} icon="map" />
              <CompactRow label="Bedrooms" value={`${campaign.bedrooms}`} icon="home" />
              <CompactRow label="Bathrooms" value={`${campaign.bathrooms}`} icon="home" />
              <CompactRow label="Reserve Price" value={formatRM(campaign.reservePrice)} icon="dollar" />
              <CompactRow label="Auction Date" value={campaign.auctionDate} icon="calendar" />
              <CompactRow label="State" value={campaign.state} icon="map" />
              <CompactRow label="Full Address" value={campaign.fullAddress} icon="map" />
            </dl>
          </ContentCard>

          <ContentCard className="shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <h2 className="text-lg font-bold">Return & Distribution Information</h2>
            <dl className="mt-4 divide-y divide-slate-100">
              <CompactRow label="Holding Return Rate" value={campaign.holdingReturnRate} icon="trend" />
              <CompactRow label="Return Type" value={campaign.returnType} icon="wallet" />
              <CompactRow label="Maximum Holding Period" value={`${campaign.maximumHoldingPeriodMonths} Months`} icon="clock" />
              <CompactRow label="Holding Return" value="Accrues during holding period; paid at final distribution" icon="dollar" />
              <CompactRow label="Principal Protection" value={campaign.principalProtectionEnabled ? "Enabled" : "Disabled"} icon="shield" />
              <CompactRow label="24-Month Rule" value="If not sold within 24 months, Participation Amount only will be returned." icon="check" />
              <CompactRow label="Final Distribution" value={finalDistributionText} icon="wallet" />
            </dl>
            <details className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-papaipay-green">Learn More <Icon name="chevronDown" className="h-4 w-4" /></summary>
              <p className="mt-3">Example: Participation Amount RM10,000 at 1.5% per month for 15 months accrues RM2,250 Holding Return. Holding Return is not paid monthly and is paid once during final distribution.</p>
            </details>
          </ContentCard>

          <div className="hidden space-y-5 md:block">
            <ContentCard><h2 className="text-lg font-bold">About This Campaign</h2><p className="mt-3 text-sm leading-6 text-slate-600">{campaign.aboutCampaign}</p><div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm leading-6 text-slate-700">{campaign.importantInformation}</div></ContentCard>
            <ContentCard><h2 className="text-lg font-bold">Documents</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{campaign.documents.map((doc) => <div key={doc} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold"><span className="flex items-center gap-2"><Icon name="file" className="h-4 w-4 text-papaipay-green" />{doc}</span><Icon name="chevronRight" className="h-4 w-4 text-slate-400" /></div>)}</div></ContentCard>
            <ContentCard><h2 className="text-lg font-bold">Updates</h2><div className="mt-4 space-y-3">{campaign.updates.map((update) => <article key={update.title} className="rounded-lg border border-slate-100 bg-slate-50/70 p-4"><p className="text-xs font-bold text-papaipay-green">{update.date}</p><h3 className="mt-1 text-sm font-bold">{update.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{update.body}</p></article>)}</div></ContentCard>
            <ContentCard><h2 className="text-lg font-bold">FAQ</h2>{campaign.faqs.map((faq) => <details key={faq.question} className="mt-3 rounded-md border border-slate-100 bg-slate-50/80 p-4"><summary className="cursor-pointer text-sm font-bold">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}<details className="mt-3 rounded-md border border-slate-100 bg-slate-50/80 p-4"><summary className="cursor-pointer text-sm font-bold">What happens after 24 months?</summary><p className="mt-3 text-sm leading-6 text-slate-600">If the asset is not successfully sold within 24 months, members receive Participation Amount only. Holding Return and Profit Distribution are not paid.</p></details></ContentCard>
          </div>

          <div className="space-y-3 md:hidden">
            <MobileAccordion title="Documents"><div className="space-y-2">{campaign.documents.map((doc) => <div key={doc} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold"><span className="flex items-center gap-2"><Icon name="file" className="h-4 w-4 text-papaipay-green" />{doc}</span><Icon name="chevronRight" className="h-4 w-4 text-slate-400" /></div>)}</div></MobileAccordion>
            <MobileAccordion title="About This Campaign"><p className="text-sm leading-6 text-slate-600">{campaign.aboutCampaign}</p><div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-slate-700">{campaign.importantInformation}</div></MobileAccordion>
            <MobileAccordion title="Updates"><div className="space-y-2">{campaign.updates.map((update) => <article key={update.title} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"><p className="text-xs font-bold text-papaipay-green">{update.date}</p><h3 className="mt-1 text-sm font-bold">{update.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{update.body}</p></article>)}</div></MobileAccordion>
            <MobileAccordion title="FAQ"><div className="space-y-2">{campaign.faqs.map((faq) => <details key={faq.question} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"><summary className="cursor-pointer text-sm font-bold">{faq.question}</summary><p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}<p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">If not sold within 24 months, Participation Amount only will be returned.</p></div></MobileAccordion>
          </div>
        </div>

        <aside className="hidden space-y-5 md:block xl:sticky xl:top-6 xl:self-start"><ParticipationPanel campaign={campaign} /></aside>
      </section>

      <details className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 md:hidden">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-papaipay-green/40 bg-white p-4 shadow-soft">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-papaipay-green"><Icon name="dollar" className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-papaipay-ink">Participate in this Campaign</span><span className="block text-xs font-bold text-papaipay-green">From {formatRM(campaign.minimumParticipation)}</span></span>
          <span className="rounded-xl bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Participate Now</span>
        </summary>
        <div className="mb-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" /><ParticipationPanel campaign={campaign} compact /></div>
      </details>
    </div>
  );
}

function ParticipationPanel({ campaign, compact = false }: { campaign: NonNullable<(typeof opportunities)[number]>; compact?: boolean }) {
  return (
    <ContentCard className={`${compact ? "border-0 p-0 shadow-none" : "border-papaipay-green/20 shadow-[0_18px_55px_rgba(15,23,42,0.08)]"}`}>
      <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-papaipay-green"><Icon name="dollar" className="h-5 w-5" /></span><div><h2 className="text-lg font-bold">Participation Panel</h2><p className="text-xs font-semibold text-slate-500">You will be redirected to secure payment gateway.</p></div></div>
      <label className="mt-5 block text-sm font-bold text-slate-600" htmlFor={compact ? "mobile-participation-amount" : "participation-amount"}>Participation Amount</label>
      <div className="mt-2 flex rounded-xl border border-slate-200 bg-white shadow-inner"><span className="px-3 py-3 text-sm font-bold text-slate-500">RM</span><input id={compact ? "mobile-participation-amount" : "participation-amount"} className="min-h-11 flex-1 rounded-xl px-2 py-3 text-sm outline-none" placeholder="10,000" /></div>
      <div className="mt-4 divide-y divide-slate-100 rounded-xl bg-slate-50/70 px-3"><CompactRow label="Minimum Participation Amount" value={formatRM(campaign.minimumParticipation)} /><CompactRow label="Maximum Participation Amount" value={formatRM(campaign.maximumParticipation)} /><CompactRow label="Campaign Target" value={formatRM(campaign.targetAmount)} /></div>
      <button className="mt-5 min-h-12 w-full rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(34,139,76,0.24)] transition hover:bg-papaipay-green/90">Proceed to Payment</button>
      <p className="mt-3 text-center text-xs font-semibold leading-5 text-slate-500">Participation will be confirmed after successful payment.</p>
    </ContentCard>
  );
}
