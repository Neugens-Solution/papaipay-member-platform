"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

type LandingHeaderProps = {
  locale: "en" | "ms";
  navigationLabel: string;
  nav: Array<{ href: string; label: string }>;
  languageLabel: string;
  login: string;
  requestAccess: string;
};

export function LandingHeader({
  locale,
  navigationLabel,
  nav,
  languageLabel,
  login,
  requestAccess,
}: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const homeHref = locale === "ms" ? "/ms" : "/";
  const menuButtonLabel = locale === "ms"
    ? (mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi")
    : (mobileMenuOpen ? "Close navigation" : "Open navigation");

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#173d30]/15 bg-[#f7f4ee]"
      onKeyDown={(event) => {
        if (event.key === "Escape") setMobileMenuOpen(false);
      }}
    >
      <div className="mx-auto flex min-h-[4.75rem] max-w-[86rem] items-center justify-between gap-3 px-5 sm:gap-4 sm:px-8 lg:px-12">
        <HeaderWordmark homeHref={homeHref} />

        <nav aria-label={navigationLabel} className="hidden items-center gap-6 text-[0.8rem] font-medium text-[#43554d] xl:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-[#9a783d]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitch locale={locale} label={languageLabel} />
          <Link href="/member/login" className="hidden text-sm font-semibold text-[#173d30] transition-colors hover:text-[#9a783d] md:inline-flex">
            {login}
          </Link>
          <Link href="/member/signup" className="hidden min-h-10 items-center justify-center rounded-[3px] bg-[#173d30] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#245441] sm:inline-flex">
            {requestAccess}
          </Link>
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-mobile-navigation"
            aria-label={menuButtonLabel}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center border border-[#173d30]/25 text-[#173d30] transition-colors hover:border-[#173d30] xl:hidden"
          >
            {mobileMenuOpen ? <X aria-hidden="true" size={19} strokeWidth={1.8} /> : <Menu aria-hidden="true" size={20} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div id="landing-mobile-navigation" className="absolute inset-x-0 top-full border-b border-[#173d30]/15 bg-[#f7f4ee] shadow-[0_18px_30px_rgba(23,61,48,0.08)] xl:hidden">
          <nav aria-label={navigationLabel} className="mx-auto max-w-[86rem] px-5 py-5 sm:px-8 lg:px-12">
            <div className="border-t border-[#173d30]/15">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between border-b border-[#173d30]/15 text-sm font-medium text-[#2f463c] transition-colors hover:text-[#9a783d]"
                >
                  {item.label}
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.7} />
                </a>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 md:hidden">
              <Link href="/member/login" onClick={() => setMobileMenuOpen(false)} className="inline-flex min-h-11 items-center justify-center border border-[#173d30]/25 px-4 text-xs font-semibold text-[#173d30]">
                {login}
              </Link>
              <Link href="/member/signup" onClick={() => setMobileMenuOpen(false)} className="inline-flex min-h-11 items-center justify-center bg-[#173d30] px-4 text-xs font-semibold text-white">
                {requestAccess}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function HeaderWordmark({ homeHref }: { homeHref: string }) {
  return (
    <Link href={homeHref} aria-label="K Asset Ventures home" className="block flex-none leading-none">
      <span className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#173d30] min-[360px]:text-[0.73rem] sm:text-[0.86rem] sm:tracking-[0.14em]">
        K ASSET VENTURES
      </span>
      <span className="mt-1.5 block text-[0.49rem] font-medium uppercase tracking-[0.12em] text-[#847555] min-[360px]:text-[0.51rem] sm:text-[0.58rem] sm:tracking-[0.15em]">
        by PICM Sdn Bhd
      </span>
    </Link>
  );
}

function LanguageSwitch({ locale, label }: { locale: "en" | "ms"; label: string }) {
  const base = "text-[0.68rem] font-semibold tracking-[0.06em] transition-colors sm:text-[0.7rem] sm:tracking-[0.08em]";

  return (
    <div aria-label={label} className="flex items-center gap-1.5 text-[#849088]">
      <Link href="/" lang="en" aria-current={locale === "en" ? "page" : undefined} className={`${base} ${locale === "en" ? "text-[#173d30] underline decoration-[#a68649] underline-offset-4" : "hover:text-[#173d30]"}`}>
        EN
      </Link>
      <span aria-hidden="true" className="text-[#aab2ad]">/</span>
      <Link href="/ms" lang="ms" aria-current={locale === "ms" ? "page" : undefined} className={`${base} ${locale === "ms" ? "text-[#173d30] underline decoration-[#a68649] underline-offset-4" : "hover:text-[#173d30]"}`}>
        BM
      </Link>
    </div>
  );
}
