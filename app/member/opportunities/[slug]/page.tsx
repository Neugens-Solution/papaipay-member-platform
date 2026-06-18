import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, Info, ProgressBar, StatusBadge } from "@/components/member/Cards";
import { opportunities } from "@/lib/memberMockData";

export function generateStaticParams() { return opportunities.map((opportunity) => ({ slug: opportunity.slug })); }

const timeline = ["Campaign Opened", "Fully Allocated", "Property Secured", "Renovation In Progress", "Listed For Sale", "Under Offer", "Sold", "Distribution Processing", "Completed"];

export default function OpportunityDetailPage({ params }: { params: { slug: string } }) {
  const opportunity = opportunities.find((item) => item.slug === params.slug);
  if (!opportunity) notFound();
  const progress = Math.round((opportunity.collectedAmount / opportunity.targetAmount) * 100);
  const daysRemaining = Math.max(0, Math.ceil((new Date(opportunity.closeDate).getTime() - new Date("2026-06-17").getTime()) / 86400000));

  return (
    <div className="space-y-6">
      <Link href="/member/opportunities" className="inline-flex items-center rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink">← Back to Listings</Link>
      <header className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <div><h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">{opportunity.title}</h1><p className="mt-2 text-sm leading-6 text-slate-600">{opportunity.location}</p><div className="mt-3"><StatusBadge status={opportunity.status} /></div></div>
        <div className="mt-5"><ProgressBar value={progress} /></div>
        <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600 sm:grid-cols-3"><p>{progress}% Campaign Progress</p><p>{opportunity.participants} Participants</p><p>{daysRemaining} Days Remaining</p></div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
        <div className="space-y-5">
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">Campaign Information</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Info label="Minimum Participation" value={`RM${opportunity.minimumParticipation.toLocaleString()}`} /><Info label="Maximum Participation" value={`RM${opportunity.maximumParticipation.toLocaleString()}`} /><Info label="Target Amount" value={`RM${opportunity.targetAmount.toLocaleString()}`} /><Info label="Collected Amount" value={`RM${opportunity.collectedAmount.toLocaleString()}`} /><Info label="Campaign Progress" value={`${progress}%`} /><Info label="Current Participants" value={`${opportunity.participants}`} /><Info label="Closing Date" value={new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(opportunity.closeDate))} /></div></ContentCard>
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">Estimated Outcome</h2><p className="mt-3 text-sm leading-6 text-slate-600">Illustrative outcome only. Actual distribution depends on auction completion, costs, resale conditions, timing, and market demand.</p></ContentCard>
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">Property Information</h2><dl className="mt-4 divide-y divide-slate-100 text-sm"><PropertyRow label="Property Type" value={opportunity.propertyType} /><PropertyRow label="Full Address" value={opportunity.fullAddress} /><PropertyRow label="Tenure" value={opportunity.tenure} /><PropertyRow label="Bumi Status" value={opportunity.bumiStatus} /><PropertyRow label="Built-up Area" value={opportunity.builtUpArea} /><PropertyRow label="Land Area" value={opportunity.landArea} /><PropertyRow label="Year Built" value={opportunity.yearBuilt} /></dl></ContentCard>
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">Valuation Information</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Info label="Auction Price" value={`RM${opportunity.auctionPrice.toLocaleString()}`} /><Info label="Market Value" value={`RM${opportunity.marketValue.toLocaleString()}`} /><Info label="Valuation Date" value={opportunity.valuationDate} /><Info label="Valuation Report" value={opportunity.valuationReport} /></div></ContentCard>
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">Gallery</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{opportunity.gallery.map((item) => <div key={item} className="h-28 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${item})` }} />)}</div></ContentCard>
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">Project Timeline</h2><ol className="mt-4 grid gap-2 sm:grid-cols-2">{timeline.map((item, index) => <li key={item} className={`flex items-center justify-between rounded-md border p-3 text-sm font-semibold ${index === 0 ? "border-papaipay-green/30 bg-emerald-50 text-papaipay-green ring-1 ring-papaipay-green/10" : "border-slate-100 bg-slate-50/80 text-slate-500"}`}><span>{item}</span>{index === 0 ? <span aria-hidden="true">•</span> : null}</li>)}</ol></ContentCard>
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">Recent Updates</h2><div className="mt-4 space-y-3">{opportunity.updates.map((item) => <article key={item.title} className="rounded-md border border-slate-100 bg-slate-50/70 p-4"><p className="text-sm font-semibold text-papaipay-green">{item.date}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p></article>)}</div></ContentCard>
          <ContentCard><details><summary className="cursor-pointer text-lg font-bold sm:text-xl">Risk Disclosure</summary><p className="mt-3 text-sm leading-6 text-slate-600">{opportunity.riskSummary}</p></details></ContentCard>
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">FAQ</h2><div className="mt-4 space-y-3">{opportunity.faqs.map((faq) => <details key={faq.question} className="rounded-md border border-slate-100 bg-slate-50/80 p-4"><summary className="cursor-pointer text-sm font-bold">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}</div></ContentCard>
        </div>
        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <ContentCard><h2 className="text-lg font-bold sm:text-xl">Participation Panel</h2><label className="mt-4 block text-sm font-bold text-slate-600" htmlFor="participation-amount">Participation Amount</label><div className="mt-2 flex rounded-md border border-slate-200 bg-white"><span className="px-3 py-3 text-sm font-bold text-slate-500">RM</span><input id="participation-amount" className="min-h-11 flex-1 rounded-md px-2 py-3 text-sm outline-none" placeholder="0" /></div><div className="mt-4 space-y-3"><Info label="Minimum Participation" value={`RM${opportunity.minimumParticipation.toLocaleString()}`} /><Info label="Maximum Participation" value={`RM${opportunity.maximumParticipation.toLocaleString()}`} /><Info label="Campaign Projection" value={`${progress}% of target`} /><Info label="Estimated Outcome" value="Illustrative only" /><Info label="Current Participants" value={`${opportunity.participants}`} /><Info label="Campaign Progress" value={`${progress}%`} /><Info label="Days Remaining" value={`${daysRemaining}`} /></div><button className="mt-5 min-h-12 w-full rounded-md bg-papaipay-green px-5 py-3 text-sm font-bold text-white transition hover:bg-papaipay-green/90">Participate Now</button></ContentCard>
        </aside>
      </section>
    </div>
  );
}
function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-800">{value}</dd>
    </div>
  );
}
