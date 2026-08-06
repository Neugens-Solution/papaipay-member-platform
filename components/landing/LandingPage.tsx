import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import type { LandingCopy } from "@/lib/landing-copy";
import { LandingHeader } from "@/components/landing/LandingHeader";

export function LandingPage({ copy }: { copy: LandingCopy }) {
  return (
    <main lang={copy.locale} className="min-h-screen bg-[#f6f3ed] text-[#25282d]">
      <LandingHeader
        locale={copy.locale}
        navigationLabel={copy.navigationLabel}
        nav={copy.nav}
        languageLabel={copy.languageLabel}
        login={copy.login}
        requestAccess={copy.requestAccess}
      />

      <section className="border-b border-[#172235]/15 bg-[#f6f3ed]">
        <div className="mx-auto grid max-w-[86rem] lg:min-h-[46rem] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
            <div className="max-w-[39rem]">
              <Kicker>{copy.hero.kicker}</Kicker>
              <h1 className="font-editorial mt-7 text-[2.25rem] font-medium leading-[1.06] tracking-[-0.035em] text-[#0e1726] sm:text-[2.85rem] lg:text-[3.7rem]">
                {copy.hero.title}
              </h1>
              <p className="mt-7 max-w-[35rem] text-base leading-8 text-[#5d6470] sm:text-lg">
                {copy.hero.body}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link href="/member/opportunities" className="inline-flex min-h-12 items-center justify-center rounded-[3px] bg-[#172235] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#263653] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172235]">
                  {copy.hero.primary}
                </Link>
                <Link href="/member/login" className="group inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#172235] underline decoration-[#a47c48]/60 underline-offset-8 transition-colors hover:text-[#8f693b]">
                  {copy.hero.secondary}<ArrowRight aria-hidden="true" size={16} strokeWidth={1.7} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-6 border-l border-[#a47c48] pl-4 text-xs leading-6 text-[#68707a]">
                {copy.hero.note}
              </p>
            </div>
          </div>

          <figure className="relative min-h-[26rem] border-t border-[#172235]/15 bg-[#dce0e6] lg:min-h-full lg:border-l lg:border-t-0">
            <Image
              src="/landing/k-asset-property-hero.webp"
              alt={copy.hero.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/35 bg-[#0e1726]/90 px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-[#f6e8cb] sm:px-8">
              {copy.hero.imageCaption}
            </div>
          </figure>
        </div>
      </section>

      <section aria-label="Key opportunity information" className="border-b border-[#172235]/15 bg-[#fffdf9]">
        <div className="mx-auto grid max-w-[86rem] sm:grid-cols-3 sm:divide-x sm:divide-[#172235]/15">
          {copy.facts.map((fact) => (
            <article key={fact.label} className="grid grid-cols-[5.5rem_1fr] items-start gap-5 border-b border-[#172235]/15 px-5 py-7 last:border-b-0 sm:block sm:border-b-0 sm:px-8 lg:px-12">
              <p className="font-editorial text-4xl font-semibold leading-none tracking-[-0.04em] text-[#0e1726]">{fact.value}</p>
              <div className="sm:mt-4">
                <h2 className="text-sm font-semibold text-[#2b313b]">{fact.label}</h2>
                <p className="mt-1 text-xs leading-5 text-[#727984]">{fact.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="model" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[86rem]">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
            <SectionIntro kicker={copy.model.kicker} title={copy.model.title} />
            <p className="max-w-[42rem] text-base leading-8 text-[#5f6670] lg:pt-9 lg:text-lg">{copy.model.intro}</p>
          </div>
          <ol className="mt-14 grid border-y border-[#172235]/20 md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#172235]/15">
            {copy.model.steps.map((step, index) => (
              <li key={step.title} className="border-b border-[#172235]/15 px-0 py-8 last:border-b-0 md:px-7 md:[&:nth-child(odd)]:border-r lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:pr-0 lg:[&:nth-child(odd)]:border-r-0">
                <span className="font-editorial text-3xl text-[#a47c48]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 text-lg font-semibold text-[#172235]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#68707c]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#0e1726] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[86rem] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <Kicker dark>{copy.risk.kicker}</Kicker>
            <h2 className="font-editorial mt-6 max-w-[38rem] text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.4rem] lg:text-[2.75rem]">
              {copy.risk.title}
            </h2>
            <p className="mt-7 max-w-[35rem] text-base leading-8 text-[#cbd1dc]">{copy.risk.body}</p>
            <div className="mt-10 border-l-2 border-[#b48a52] pl-5">
              <h3 className="text-sm font-semibold text-[#e3c998]">{copy.risk.disclosureTitle}</h3>
              <p className="mt-2 max-w-[35rem] text-sm leading-7 text-[#b8c0cc]">{copy.risk.disclosure}</p>
            </div>
          </div>
          <div className="border-t border-white/25">
            {copy.risk.points.map((point, index) => (
              <article key={point.title} className="grid grid-cols-[2.5rem_1fr] gap-5 border-b border-white/20 py-6 sm:grid-cols-[3.5rem_1fr] sm:py-7">
                <span className="font-editorial text-2xl text-[#c19a62]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-base font-semibold text-white sm:text-lg">{point.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#b9c1cd]">{point.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="returns" className="scroll-mt-24 bg-[#fffdf9] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[86rem]">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <SectionIntro kicker={copy.returns.kicker} title={copy.returns.title} />
            <p className="max-w-[43rem] text-base leading-8 text-[#5f6670] lg:pt-9 lg:text-lg">{copy.returns.body}</p>
          </div>
          <div className="mt-14 grid border-y border-[#172235]/20 lg:grid-cols-2 lg:divide-x lg:divide-[#172235]/20">
            <ReturnColumn
              label={copy.returns.holdingLabel}
              value={copy.returns.holdingValue}
              title={copy.returns.holdingTitle}
              body={copy.returns.holdingBody}
            />
            <ReturnColumn
              label={copy.returns.profitLabel}
              value={copy.returns.profitValue}
              title={copy.returns.profitTitle}
              body={copy.returns.profitBody}
              second
            />
          </div>
          <p className="mt-5 max-w-4xl text-xs leading-6 text-[#747b85]">{copy.returns.terms}</p>
        </div>
      </section>

      <section id="protection" className="scroll-mt-24 border-y border-[#172235]/15 bg-[#ece8e0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[86rem] gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-center lg:gap-20">
          <div className="border-b border-[#172235]/20 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-16">
            <Kicker>{copy.protection.label}</Kicker>
            <div className="mt-6 flex items-end gap-4 text-[#0e1726]">
              <span className="font-editorial text-[5.5rem] font-semibold leading-[0.76] tracking-[-0.06em] sm:text-[7.5rem]">{copy.protection.value}</span>
              <span className="pb-1 text-sm font-semibold uppercase tracking-[0.14em] sm:pb-2">{copy.protection.unit}</span>
            </div>
          </div>
          <div>
            <h2 className="font-editorial max-w-[46rem] text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-[#0e1726] sm:text-[2.4rem] lg:text-[2.75rem]">{copy.protection.title}</h2>
            <p className="mt-6 max-w-[47rem] text-base leading-8 text-[#555c67] sm:text-lg">{copy.protection.body}</p>
            <p className="mt-6 max-w-[44rem] border-l border-[#a47c48] pl-4 text-xs leading-6 text-[#6d737d]">{copy.protection.note}</p>
          </div>
        </div>
      </section>

      <section id="opportunities" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[86rem]">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <SectionIntro kicker={copy.opportunities.kicker} title={copy.opportunities.title} />
            <div className="max-w-[43rem] lg:pt-9">
              <p className="text-base leading-8 text-[#5f6670] lg:text-lg">{copy.opportunities.body}</p>
              <p className="mt-5 text-sm leading-7 text-[#68707a]">{copy.opportunities.detail}</p>
            </div>
          </div>
          <div className="mt-14 border-t border-[#172235]/20">
            {copy.opportunities.types.map((type, index) => (
              <article key={type.title} className="grid gap-3 border-b border-[#172235]/15 py-6 sm:grid-cols-[5rem_0.8fr_1.2fr] sm:items-baseline sm:gap-8 sm:py-7">
                <span className="font-editorial text-2xl text-[#a47c48]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-semibold text-[#172235] sm:text-lg">{type.title}</h3>
                <p className="text-sm leading-7 text-[#68707c]">{type.body}</p>
              </article>
            ))}
          </div>
          <Link href="/member/opportunities" className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-[3px] border border-[#172235] px-6 text-sm font-semibold text-[#172235] transition-colors hover:bg-[#172235] hover:text-white">
            {copy.opportunities.cta}<ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
          </Link>
        </div>
      </section>

      <section className="border-y border-[#172235]/15 bg-[#fffdf9] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[86rem]">
          <SectionIntro kicker={copy.journey.kicker} title={copy.journey.title} />
          <ol className="mt-12 grid gap-0 border-t border-[#172235]/20 md:grid-cols-5 md:divide-x md:divide-[#172235]/15">
            {copy.journey.steps.map((step, index) => (
              <li key={step.title} className="border-b border-[#172235]/15 py-6 md:border-b-0 md:px-5 md:py-8 md:first:pl-0 md:last:pr-0">
                <span className="font-editorial text-2xl text-[#a47c48]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-sm font-semibold text-[#172235] sm:text-base">{step.title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#68707c] sm:text-sm">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[86rem] gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-24">
          <SectionIntro kicker={copy.faq.kicker} title={copy.faq.title} />
          <div className="border-t border-[#172235]/25">
            {copy.faq.items.map((item, index) => (
              <details key={item.question} className="group border-b border-[#172235]/20 py-5 sm:py-6" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-semibold leading-7 text-[#172235] marker:content-none sm:text-lg">
                  {item.question}
                  <Plus aria-hidden="true" size={20} strokeWidth={1.5} className="mt-1 flex-none text-[#a47c48] transition-transform group-open:rotate-45" />
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-7 text-[#626a75] sm:text-base sm:leading-8">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0e1726] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[86rem] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <Kicker dark>{copy.finalCta.kicker}</Kicker>
            <h2 className="font-editorial mt-6 max-w-[50rem] text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.4rem] lg:text-[2.75rem]">{copy.finalCta.title}</h2>
            <p className="mt-5 max-w-[42rem] text-base leading-8 text-[#bec5d0]">{copy.finalCta.body}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:flex-none">
            <Link href="/member/signup" className="inline-flex min-h-12 items-center justify-center rounded-[3px] bg-[#c6a574] px-6 text-sm font-semibold text-[#0e1726] transition-colors hover:bg-[#dac59a]">{copy.finalCta.primary}</Link>
            <Link href="/member/login" className="inline-flex min-h-12 items-center justify-center rounded-[3px] border border-white/35 px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#0e1726]">{copy.finalCta.secondary}</Link>
          </div>
        </div>
      </section>

      <SiteFooter copy={copy} />
    </main>
  );
}

function Wordmark({ homeHref = "/" }: { homeHref?: string }) {
  return (
    <Link href={homeHref} aria-label="K Asset Ventures home" className="block flex-none leading-none">
      <span className="block text-[0.73rem] font-bold tracking-[0.14em] text-[#172235] sm:text-[0.86rem]">K ASSET VENTURES</span>
      <span className="mt-1.5 block text-[0.51rem] font-medium uppercase tracking-[0.15em] text-[#7a6a55] sm:text-[0.58rem]">by PICM Sdn Bhd</span>
    </Link>
  );
}

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${dark ? "text-[#d1b47d]" : "text-[#a47c48]"}`}>
      <span className={`h-px w-8 ${dark ? "bg-[#d1b47d]" : "bg-[#a47c48]"}`} />
      {children}
    </p>
  );
}

function SectionIntro({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <Kicker>{kicker}</Kicker>
      <h2 className="font-editorial mt-6 max-w-[43rem] text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-[#0e1726] sm:text-[2.4rem] lg:text-[2.75rem]">{title}</h2>
    </div>
  );
}

function ReturnColumn({ label, value, title, body, second = false }: { label: string; value: string; title: string; body: string; second?: boolean }) {
  return (
    <article className={`py-9 lg:py-11 ${second ? "border-t border-[#172235]/20 lg:border-t-0 lg:pl-12" : "lg:pr-12"}`}>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#a47c48]">{label}</p>
      <div className="mt-6 grid grid-cols-[6.5rem_1fr] gap-6 sm:grid-cols-[9rem_1fr] sm:gap-10">
        <span className="font-editorial text-6xl font-semibold leading-none tracking-[-0.055em] text-[#0e1726] sm:text-7xl">{value}</span>
        <div>
          <h3 className="text-lg font-semibold text-[#172235] sm:text-xl">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#626a75]">{body}</p>
        </div>
      </div>
    </article>
  );
}

function SiteFooter({ copy }: { copy: LandingCopy }) {
  return (
    <footer className="border-t border-[#172235]/15 bg-[#f6f3ed] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[86rem]">
        <div className="grid gap-7 sm:grid-cols-[0.34fr_0.66fr] sm:gap-12">
          <div>
            <Wordmark homeHref={copy.locale === "ms" ? "/ms" : "/"} />
            <p className="mt-4 text-xs font-medium text-[#666d77]">{copy.footer.description}</p>
          </div>
          <p className="max-w-3xl text-xs leading-6 text-[#6d747e] sm:justify-self-end">{copy.footer.disclosure}</p>
        </div>
        <div className="mt-8 flex items-center justify-between gap-5 border-t border-[#172235]/15 pt-6 text-xs text-[#747b85]">
          <p>© {new Date().getFullYear()} K Asset Ventures. {copy.footer.rights}</p>
          <Link href="/admin/login" className="transition-colors hover:text-[#172235]">{copy.footer.admin}</Link>
        </div>
      </div>
    </footer>
  );
}
