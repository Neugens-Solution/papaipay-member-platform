import { notFound } from "next/navigation";
import { ContentCard, Info, ProgressBar, StatusBadge } from "@/components/member/Cards";
import { opportunities } from "@/lib/memberMockData";

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

export default function OpportunityDetailPage({ params }: { params: { slug: string } }) {
  const opportunity = opportunities.find((item) => item.slug === params.slug);
  if (!opportunity) notFound();
  const progress = Math.round((opportunity.participationAmount / opportunity.targetAmount) * 100);

  return (
    <div className="space-y-8">
      <header className="grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-end">
        <div>
          <StatusBadge status={opportunity.status} />
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-[1.7rem]">{opportunity.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{opportunity.location} · {opportunity.propertyType}</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white"><div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${opportunity.imageUrl})` }} /></div>
      </header>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_.9fr]">
        <div className="space-y-5">
          <ContentCard><h2 className="text-xl font-bold">Auction Information</h2><p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{opportunity.summary}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Info label="Auction Type" value={opportunity.propertyType} /><Info label="Location" value={opportunity.location} /><Info label="Tenure" value={opportunity.tenure} /><Info label="Eligibility" value={opportunity.eligibilitySummary} /></div><div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">{opportunity.highlights.map((item) => <div key={item} className="rounded-md border border-slate-100 bg-slate-50/80 p-4 text-sm font-semibold text-papaipay-ink">{item}</div>)}</div></ContentCard>
          <ContentCard><h2 className="text-xl font-bold">Risk Disclosure</h2><p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{opportunity.riskSummary}</p></ContentCard>
          <ContentCard><h2 className="text-xl font-bold">FAQ</h2><div className="mt-4 space-y-3">{opportunity.faqs.map((faq) => <details key={faq.question} className="rounded-md border border-slate-100 bg-slate-50/80 p-4"><summary className="cursor-pointer text-sm font-bold">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}</div></ContentCard>
          <ContentCard><h2 className="text-xl font-bold">Media Gallery</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{opportunity.gallery.map((item) => <div key={item} className="grid h-28 place-items-center rounded-md border border-slate-100 bg-slate-50 p-4 text-center text-sm font-semibold text-slate-700">{item}</div>)}</div></ContentCard>
        </div>
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <ContentCard><h2 className="text-xl font-bold">Campaign Information</h2><div className="mt-5 space-y-3"><Info label="Minimum Participation" value={`RM ${opportunity.minimumParticipation.toLocaleString()}`} /><Info label="Maximum Participation" value={`RM ${opportunity.maximumParticipation.toLocaleString()}`} /><Info label="Total Participation" value={`RM ${opportunity.targetAmount.toLocaleString()}`} /><Info label="Campaign End Date" value={new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(opportunity.closeDate))} /></div></ContentCard>
          <ContentCard><h2 className="text-xl font-bold">Campaign Progress</h2><div className="mt-4 flex justify-between text-sm font-semibold"><span>RM {opportunity.participationAmount.toLocaleString()} participating</span><span>{progress}%</span></div><div className="mt-3"><ProgressBar value={progress} /></div></ContentCard>
          <ContentCard className="border-papaipay-ink bg-papaipay-ink text-white"><h2 className="text-xl font-bold">Participation Interest</h2><p className="mt-3 text-sm leading-6 text-white/75">Mock participation call-to-action only. No payments, backend, authentication, or API routes are created.</p><button className="mt-5 min-h-12 w-full rounded-md bg-white px-5 py-3 text-sm font-bold text-papaipay-ink transition hover:bg-slate-50">Review Participation Interest</button></ContentCard>
        </aside>
      </section>
    </div>
  );
}
