"use client";

import Image from "next/image";
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
      className="sticky top-0 z-50 border-b border-[#c6a574]/25 bg-[#0e1726]"
      onKeyDown={(event) => {
        if (event.key === "Escape") setMobileMenuOpen(false);
      }}
    >
      <div className="mx-auto flex min-h-[4.75rem] max-w-[86rem] items-center justify-between gap-3 px-5 sm:gap-4 sm:px-8 lg:px-12">
        <HeaderWordmark homeHref={homeHref} />

        <nav aria-label={navigationLabel} className="hidden items-center gap-6 text-[0.8rem] font-medium text-[#cbd1dc] xl:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-[#c6a574]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitch locale={locale} label={languageLabel} />
          <Link href="/member/login" className="hidden text-sm font-semibold text-white transition-colors hover:text-[#c6a574] md:inline-flex">
            {login}
          </Link>
          <Link href="/member/signup" className="hidden min-h-10 items-center justify-center rounded-[3px] bg-[#c6a574] px-5 text-sm font-semibold text-[#0e1726] transition-colors hover:bg-[#dac59a] sm:inline-flex">
            {requestAccess}
          </Link>
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-mobile-navigation"
            aria-label={menuButtonLabel}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center border border-[#c6a574]/35 text-white transition-colors hover:border-[#c6a574] xl:hidden"
          >
            {mobileMenuOpen ? <X aria-hidden="true" size={19} strokeWidth={1.8} /> : <Menu aria-hidden="true" size={20} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div id="landing-mobile-navigation" className="absolute inset-x-0 top-full border-b border-[#c6a574]/25 bg-[#0e1726] shadow-[0_18px_30px_rgba(8,13,24,0.28)] xl:hidden">
          <nav aria-label={navigationLabel} className="mx-auto max-w-[86rem] px-5 py-5 sm:px-8 lg:px-12">
            <div className="border-t border-[#c6a574]/20">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between border-b border-[#c6a574]/20 text-sm font-medium text-[#dbe2ec] transition-colors hover:text-[#c6a574]"
                >
                  {item.label}
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.7} />
                </a>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 md:hidden">
              <Link href="/member/login" onClick={() => setMobileMenuOpen(false)} className="inline-flex min-h-11 items-center justify-center border border-[#c6a574]/35 px-4 text-xs font-semibold text-white">
                {login}
              </Link>
              <Link href="/member/signup" onClick={() => setMobileMenuOpen(false)} className="inline-flex min-h-11 items-center justify-center bg-[#c6a574] px-4 text-xs font-semibold text-[#0e1726]">
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
      <Image
        src="/logo-kav-02.svg"
        alt="K Asset Ventures by PICM Sdn Bhd"
        width={168}
        height={55}
        priority
        className="h-9 w-auto sm:h-11"
      />
    </Link>
  );
}

function LanguageSwitch({ locale, label }: { locale: "en" | "ms"; label: string }) {
  const base = "text-[0.68rem] font-semibold tracking-[0.06em] transition-colors sm:text-[0.7rem] sm:tracking-[0.08em]";

  return (
    <div aria-label={label} className="flex items-center gap-1.5 text-[#9aa4b2]">
      <Link href="/" lang="en" aria-current={locale === "en" ? "page" : undefined} className={`${base} ${locale === "en" ? "text-white underline decoration-[#c6a574] underline-offset-4" : "hover:text-white"}`}>
        EN
      </Link>
      <span aria-hidden="true" className="text-[#6f7b8c]">/</span>
      <Link href="/ms" lang="ms" aria-current={locale === "ms" ? "page" : undefined} className={`${base} ${locale === "ms" ? "text-white underline decoration-[#c6a574] underline-offset-4" : "hover:text-white"}`}>
        BM
      </Link>
    </div>
  );
}
