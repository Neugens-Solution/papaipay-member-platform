import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import type { LandingCopy } from "@/lib/landing-copy";
import { LandingHeader } from "@/components/landing/LandingHeader";

export function LandingPage({ copy }: { copy: LandingCopy }) {
  return (
    <main lang={copy.locale} className="min-h-screen bg-[#f7f4ee] text-[#17231e]">
      <LandingHeader
        locale={copy.locale}
        navigationLabel={copy.navigationLabel}
        nav={copy.nav}
        languageLabel={copy.languageLabel}
        login={copy.login}
        requestAccess={copy.requestAccess}
      />

      <section className="border-b border-[#173d30]/15 bg-[#f7f4ee]">
        <div className="mx-auto grid max-w-[86rem] lg:min-h-[46rem] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
            <div className="max-w-[39rem]">
              <Kicker>{copy.hero.kicker}</Kicker>
              <h1 className="font-editorial mt-7 text-[2.8rem] font-medium leading-[1.02] tracking-[-0.045em] text-[#143c2e] sm:text-6xl lg:text-[4.25rem]">
                {copy.hero.title}
              </h1>
              <p className="mt-7 max-w-[35rem] text-base leading-8 text-[#55635d] sm:text-lg">
                {copy.hero.body}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link href="/member/opportunities" className="inline-flex min-h-12 items-center justify-center rounded-[3px] bg-[#143c2e] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#205541] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143c2e]">
                  {copy.hero.primary}
                </Link>
                <Link href="/member/login" className="group inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#173d30] underline decoration-[#aa8b4f]/60 underline-offset-8 transition-colors hover:text-[#8a6b31]">
                  {copy.hero.secondary}<ArrowRight aria-hidden="true" size={16} strokeWidth={1.7} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-6 border-l border-[#aa8b4f] pl-4 text-xs leading-6 text-[#6f7b75]">
                {copy.hero.note}
              </p>
            </div>
          </div>

          <figure className="relative min-h-[26rem] border-t border-[#173d30]/15 bg-[#d9ddd7] lg:min-h-full lg:border-l lg:border-t-0">
            <Image
              src="/landing/k-asset-property-hero.webp"
              alt={copy.hero.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/35 bg-[#102b22]/90 px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-[#f4ead2] sm:px-8">
              {copy.hero.imageCaption}
            </div>
          </figure>
        </div>
      </section>

      <section aria-label="Key opportunity information" className="border-b border-[#173d30]/15 bg-[#fffdf9]">
        <div className="mx-auto grid max-w-[86rem] sm:grid-cols-3 sm:divide-x sm:divide-[#173d30]/15">
          {copy.facts.map((fact) => (
            <article key={fact.label} className="grid grid-cols-[5.5rem_1fr] items-start gap-5 border-b border-[#173d30]/15 px-5 py-7 last:border-b-0 sm:block sm:border-b-0 sm:px-8 lg:px-12">
              <p className="font-editorial text-4xl font-semibold leading-none tracking-[-0.04em] text-[#143c2e]">{fact.value}</p>
              <div className="sm:mt-4">
                <h2 className="text-sm font-semibold text-[#263a32]">{fact.label}</h2>
                <p className="mt-1 text-xs leading-5 text-[#748079]">{fact.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="model" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[86rem]">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
            <SectionIntro kicker={copy.model.kicker} title={copy.model.title} />
            <p className="max-w-[42rem] text-base leading-8 text-[#58665f] lg:pt-9 lg:text-lg">{copy.model.intro}</p>
          </div>
          <ol className="mt-14 grid border-y border-[#173d30]/20 md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#173d30]/15">
            {copy.model.steps.map((step, index) => (
              <li key={step.title} className="border-b border-[#173d30]/15 px-0 py-8 last:border-b-0 md:px-7 md:[&:nth-child(odd)]:border-r lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:pr-0 lg:[&:nth-child(odd)]:border-r-0">
                <span className="font-editorial text-3xl text-[#a68649]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 text-lg font-semibold text-[#16392d]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64716a]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#12372b] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[86rem] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <Kicker dark>{copy.risk.kicker}</Kicker>
            <h2 className="font-editorial mt-6 max-w-[38rem] text-4xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-[3.7rem]">
              {copy.risk.title}
            </h2>
            <p className="mt-7 max-w-[35rem] text-base leading-8 text-[#cad4cf]">{copy.risk.body}</p>
            <div className="mt-10 border-l-2 border-[#c4a564] pl-5">
              <h3 className="text-sm font-semibold text-[#f1dfb9]">{copy.risk.disclosureTitle}</h3>
              <p className="mt-2 max-w-[35rem] text-sm leading-7 text-[#b8c7c0]">{copy.risk.disclosure}</p>
            </div>
          </div>
          <div className="border-t border-white/25">
            {copy.risk.points.map((point, index) => (
              <article key={point.title} className="grid grid-cols-[2.5rem_1fr] gap-5 border-b border-white/20 py-6 sm:grid-cols-[3.5rem_1fr] sm:py-7">
                <span className="font-editorial text-2xl text-[#c9aa69]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-base font-semibold text-white sm:text-lg">{point.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#bdcac4]">{point.body}</p>
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
            <p className="max-w-[43rem] text-base leading-8 text-[#58665f] lg:pt-9 lg:text-lg">{copy.returns.body}</p>
          </div>
          <div className="mt-14 grid border-y border-[#173d30]/20 lg:grid-cols-2 lg:divide-x lg:divide-[#173d30]/20">
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
          <p className="mt-5 max-w-4xl text-xs leading-6 text-[#77817c]">{copy.returns.terms}</p>
        </div>
      </section>

      <section id="protection" className="scroll-mt-24 border-y border-[#173d30]/15 bg-[#e9e4d8] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[86rem] gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-center lg:gap-20">
          <div className="border-b border-[#173d30]/20 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-16">
            <Kicker>{copy.protection.label}</Kicker>
            <div className="mt-6 flex items-end gap-4 text-[#143c2e]">
              <span className="font-editorial text-[7rem] font-semibold leading-[0.72] tracking-[-0.07em] sm:text-[9rem]">{copy.protection.value}</span>
              <span className="pb-1 text-sm font-semibold uppercase tracking-[0.14em] sm:pb-2">{copy.protection.unit}</span>
            </div>
          </div>
          <div>
            <h2 className="font-editorial max-w-[46rem] text-4xl font-medium leading-[1.08] tracking-[-0.035em] text-[#143c2e] sm:text-5xl">{copy.protection.title}</h2>
            <p className="mt-6 max-w-[47rem] text-base leading-8 text-[#4f5f57] sm:text-lg">{copy.protection.body}</p>
            <p className="mt-6 max-w-[44rem] border-l border-[#9b7b3f] pl-4 text-xs leading-6 text-[#6c756f]">{copy.protection.note}</p>
          </div>
        </div>
      </section>

      <section id="opportunities" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[86rem]">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <SectionIntro kicker={copy.opportunities.kicker} title={copy.opportunities.title} />
            <div className="max-w-[43rem] lg:pt-9">
              <p className="text-base leading-8 text-[#58665f] lg:text-lg">{copy.opportunities.body}</p>
              <p className="mt-5 text-sm leading-7 text-[#6d7973]">{copy.opportunities.detail}</p>
            </div>
          </div>
          <div className="mt-14 border-t border-[#173d30]/20">
            {copy.opportunities.types.map((type, index) => (
              <article key={type.title} className="grid gap-3 border-b border-[#173d30]/15 py-6 sm:grid-cols-[5rem_0.8fr_1.2fr] sm:items-baseline sm:gap-8 sm:py-7">
                <span className="font-editorial text-2xl text-[#a68649]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-semibold text-[#173a2e] sm:text-lg">{type.title}</h3>
                <p className="text-sm leading-7 text-[#65726c]">{type.body}</p>
              </article>
            ))}
          </div>
          <Link href="/member/opportunities" className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-[3px] border border-[#173d30] px-6 text-sm font-semibold text-[#173d30] transition-colors hover:bg-[#173d30] hover:text-white">
            {copy.opportunities.cta}<ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
          </Link>
        </div>
      </section>

      <section className="border-y border-[#173d30]/15 bg-[#fffdf9] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[86rem]">
          <SectionIntro kicker={copy.journey.kicker} title={copy.journey.title} />
          <ol className="mt-12 grid gap-0 border-t border-[#173d30]/20 md:grid-cols-5 md:divide-x md:divide-[#173d30]/15">
            {copy.journey.steps.map((step, index) => (
              <li key={step.title} className="border-b border-[#173d30]/15 py-6 md:border-b-0 md:px-5 md:py-8 md:first:pl-0 md:last:pr-0">
                <span className="font-editorial text-2xl text-[#a68649]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-sm font-semibold text-[#173a2e] sm:text-base">{step.title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#68746e] sm:text-sm">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[86rem] gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-24">
          <SectionIntro kicker={copy.faq.kicker} title={copy.faq.title} />
          <div className="border-t border-[#173d30]/25">
            {copy.faq.items.map((item, index) => (
              <details key={item.question} className="group border-b border-[#173d30]/20 py-5 sm:py-6" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-semibold leading-7 text-[#173a2e] marker:content-none sm:text-lg">
                  {item.question}
                  <Plus aria-hidden="true" size={20} strokeWidth={1.5} className="mt-1 flex-none text-[#9a783d] transition-transform group-open:rotate-45" />
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-7 text-[#637069] sm:text-base sm:leading-8">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#12372b] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[86rem] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <Kicker dark>{copy.finalCta.kicker}</Kicker>
            <h2 className="font-editorial mt-6 max-w-[50rem] text-4xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-5xl">{copy.finalCta.title}</h2>
            <p className="mt-5 max-w-[42rem] text-base leading-8 text-[#c2cfca]">{copy.finalCta.body}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:flex-none">
            <Link href="/member/signup" className="inline-flex min-h-12 items-center justify-center rounded-[3px] bg-[#d6bf87] px-6 text-sm font-semibold text-[#15372c] transition-colors hover:bg-[#ead9b0]">{copy.finalCta.primary}</Link>
            <Link href="/member/login" className="inline-flex min-h-12 items-center justify-center rounded-[3px] border border-white/35 px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#15372c]">{copy.finalCta.secondary}</Link>
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
      <span className="block text-[0.73rem] font-bold tracking-[0.14em] text-[#173d30] sm:text-[0.86rem]">K ASSET VENTURES</span>
      <span className="mt-1.5 block text-[0.51rem] font-medium uppercase tracking-[0.15em] text-[#847555] sm:text-[0.58rem]">by PICM Sdn Bhd</span>
    </Link>
  );
}

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${dark ? "text-[#d4bb82]" : "text-[#92733b]"}`}>
      <span className={`h-px w-8 ${dark ? "bg-[#d4bb82]" : "bg-[#a68649]"}`} />
      {children}
    </p>
  );
}

function SectionIntro({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <Kicker>{kicker}</Kicker>
      <h2 className="font-editorial mt-6 max-w-[43rem] text-4xl font-medium leading-[1.08] tracking-[-0.035em] text-[#143c2e] sm:text-5xl lg:text-[3.55rem]">{title}</h2>
    </div>
  );
}

function ReturnColumn({ label, value, title, body, second = false }: { label: string; value: string; title: string; body: string; second?: boolean }) {
  return (
    <article className={`py-9 lg:py-11 ${second ? "border-t border-[#173d30]/20 lg:border-t-0 lg:pl-12" : "lg:pr-12"}`}>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#92733b]">{label}</p>
      <div className="mt-6 grid grid-cols-[6.5rem_1fr] gap-6 sm:grid-cols-[9rem_1fr] sm:gap-10">
        <span className="font-editorial text-6xl font-semibold leading-none tracking-[-0.055em] text-[#143c2e] sm:text-7xl">{value}</span>
        <div>
          <h3 className="text-lg font-semibold text-[#173a2e] sm:text-xl">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#637069]">{body}</p>
        </div>
      </div>
    </article>
  );
}

function SiteFooter({ copy }: { copy: LandingCopy }) {
  return (
    <footer className="border-t border-[#173d30]/15 bg-[#f7f4ee] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[86rem]">
        <div className="grid gap-7 sm:grid-cols-[0.34fr_0.66fr] sm:gap-12">
          <div>
            <Wordmark homeHref={copy.locale === "ms" ? "/ms" : "/"} />
            <p className="mt-4 text-xs font-medium text-[#6c776f]">{copy.footer.description}</p>
          </div>
          <p className="max-w-3xl text-xs leading-6 text-[#707a74] sm:justify-self-end">{copy.footer.disclosure}</p>
        </div>
        <div className="mt-8 flex items-center justify-between gap-5 border-t border-[#173d30]/15 pt-6 text-xs text-[#7c867f]">
          <p>© {new Date().getFullYear()} K Asset Ventures. {copy.footer.rights}</p>
          <Link href="/admin/login" className="transition-colors hover:text-[#173d30]">{copy.footer.admin}</Link>
        </div>
      </div>
    </footer>
  );
}
