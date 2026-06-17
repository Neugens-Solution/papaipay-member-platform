import { notFound } from "next/navigation";
import { ContentCard, Info, ProgressBar, StatusBadge } from "@/components/member/Cards";
import { opportunities } from "@/lib/memberMockData";

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

export default function OpportunityDetailPage({ params }: { params: { slug: string } }) {
  const opportunity = opportunities.find((item) => item.slug === params.slug);
  if (!opportunity) notFound();
  const progress = Math.round((opportunity.fundedAmount / opportunity.targetAmount) * 100);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2.5rem] bg-white shadow-soft">
        <div className="h-80 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(90deg, rgba(16,32,26,.72), rgba(16,32,26,.1)), url(${opportunity.imageUrl})` }}>
          <div className="flex h-full max-w-4xl flex-col justify-end p-8 text-white"><StatusBadge status={opportunity.status} /><h2 className="mt-4 text-5xl font-bold tracking-tight">{opportunity.title}</h2><p className="mt-3 text-lg text-white/85">{opportunity.location} · {opportunity.propertyType}</p></div>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_.9fr]">
        <div className="space-y-6">
          <ContentCard><h3 className="text-2xl font-bold">Property Information</h3><p className="mt-3 leading-7 text-slate-600">{opportunity.summary}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Info label="Property Type" value={opportunity.propertyType} /><Info label="Location" value={opportunity.location} /><Info label="Tenure" value={opportunity.tenure} /><Info label="Eligibility" value={opportunity.eligibilitySummary} /></div><div className="mt-5 grid gap-3 md:grid-cols-3">{opportunity.highlights.map((item) => <div key={item} className="rounded-2xl bg-papaipay-mint p-4 font-semibold text-papaipay-ink">{item}</div>)}</div></ContentCard>
          <ContentCard><h3 className="text-2xl font-bold">Risk Disclosure</h3><p className="mt-3 leading-7 text-slate-600">{opportunity.riskSummary}</p></ContentCard>
          <ContentCard><h3 className="text-2xl font-bold">FAQ</h3><div className="mt-4 space-y-3">{opportunity.faqs.map((faq) => <details key={faq.question} className="rounded-2xl bg-slate-50 p-4"><summary className="cursor-pointer font-bold">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}</div></ContentCard>
          <ContentCard><h3 className="text-2xl font-bold">Media Gallery</h3><div className="mt-4 grid gap-3 sm:grid-cols-3">{opportunity.gallery.map((item) => <div key={item} className="grid h-32 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-papaipay-mint p-4 text-center text-sm font-semibold text-slate-700">{item}</div>)}</div></ContentCard>
        </div>
        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <ContentCard><h3 className="text-2xl font-bold">Campaign Information</h3><div className="mt-5 space-y-3"><Info label="Unit Price" value={`$${opportunity.unitPrice.toLocaleString()}`} /><Info label="Target Amount" value={`$${opportunity.targetAmount.toLocaleString()}`} /><Info label="Available Units" value={`${opportunity.availableUnits} of ${opportunity.totalUnits}`} /><Info label="Campaign End Date" value={new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(opportunity.closeDate))} /></div></ContentCard>
          <ContentCard><h3 className="text-2xl font-bold">Funding Progress</h3><div className="mt-4 flex justify-between font-semibold"><span>${opportunity.fundedAmount.toLocaleString()} funded</span><span>{progress}%</span></div><div className="mt-3"><ProgressBar value={progress} /></div></ContentCard>
          <ContentCard className="bg-papaipay-ink text-white"><h3 className="text-2xl font-bold">Participate Section</h3><p className="mt-3 text-white/75">Mock participation call-to-action only. No payments, backend, authentication, or API routes are created.</p><button className="mt-5 w-full rounded-2xl bg-white px-5 py-3 font-bold text-papaipay-ink">Review Participation Interest</button></ContentCard>
        </aside>
      </section>
    </div>
  );
}
