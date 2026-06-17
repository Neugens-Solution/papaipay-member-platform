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
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: MemberSectionItem[];
}) {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[1.7rem]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
      </header>
      <section className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <ContentCard key={item.title}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div>
                <p className="text-sm font-semibold text-papaipay-green">{item.meta}</p>
                <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{item.body}</p>
          </ContentCard>
        ))}
      </section>
    </div>
  );
}
