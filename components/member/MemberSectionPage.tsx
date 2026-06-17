import Link from "next/link";
import { ContentCard, StatusBadge } from "@/components/member/Cards";

export type MemberSectionItem = {
  title: string;
  meta: string;
  status: string;
  body: string;
};

export function MemberSectionPage({
  eyebrow,
  title,
  description,
  items,
  actionHref = "/member/dashboard",
  actionLabel = "Back to dashboard",
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: MemberSectionItem[];
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-papaipay-green">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight">{title}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">{description}</p>
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-2xl bg-papaipay-ink px-5 py-3 text-sm font-bold text-white"
        >
          {actionLabel}
        </Link>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <ContentCard key={item.title}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-papaipay-green">{item.meta}</p>
                <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-4 leading-7 text-slate-600">{item.body}</p>
          </ContentCard>
        ))}
      </section>
    </div>
  );
}
