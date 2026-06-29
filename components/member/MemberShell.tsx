"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";

const navItems = [
  ["Dashboard", "/member/dashboard"],
  ["Member Listings", "/member/opportunities"],
  ["Portfolio", "/member/portfolio"],
  ["Distributions", "/member/distributions"],
  ["Profile", "/member/profile"],
];

const bottomNavItems = [
  ["Dashboard", "/member/dashboard", HomeIcon],
  ["Member Listings", "/member/opportunities", BuildingIcon],
  ["Portfolio", "/member/portfolio", BriefcaseIcon],
  ["Distributions", "/member/distributions", WalletIcon],
  ["Profile", "/member/profile", UserCircleIcon],
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function iconClass(active: boolean) {
  return active ? "text-papaipay-green" : "text-slate-500";
}

export function MemberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-papaipay-ink">
      <div className="lg:flex lg:h-screen lg:overflow-hidden">
        <aside className="hidden border-r border-slate-200/70 bg-white/90 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-52 lg:flex-none">
          <div className="px-5 py-7">
            <Link href="/member/dashboard" className="block rounded-md focus:outline-none focus:ring-2 focus:ring-papaipay-green/30">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-papaipay-green">PAPAIPAY</p>
              <p className="mt-1.5 text-sm font-semibold tracking-tight text-papaipay-ink">Member Portal</p>
            </Link>
          </div>
          <nav className="space-y-1.5 px-3 pb-6">
            {navItems.map(([label, href]) => {
              const active = isActivePath(pathname, href);

              return (
                <Link
                  key={label}
                  href={href}
                  className={`block rounded-lg px-3 py-2.5 text-[0.86rem] font-medium transition ${active ? "bg-emerald-50/80 text-papaipay-green" : "text-slate-500 hover:bg-slate-50 hover:text-papaipay-green"}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <Link href="/member/dashboard" className="rounded-md lg:hidden">
                <p className="text-sm font-extrabold tracking-tight text-papaipay-ink">PAPAIPAY</p>
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <HeaderIconLink href="/member/notifications" label="Notifications" icon={BellIcon} hasUnread />
                <HeaderIconLink href="/member/announcements" label="Announcements" icon={NewspaperIcon} />
                <details className="group relative hidden lg:block">
                  <summary aria-label="Profile menu" className="grid min-h-10 min-w-10 cursor-pointer list-none place-items-center rounded-full bg-papaipay-ink text-xs font-semibold text-white transition hover:bg-papaipay-green">AR</summary>
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                    <Link href="/member/profile" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-papaipay-green">
                      My Profile
                    </Link>
                    <Link href="/" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-papaipay-green">
                      Logout
                    </Link>
                  </div>
                </details>
              </div>
            </div>
          </header>
          <main className="px-4 py-7 pb-24 sm:px-6 lg:px-10 lg:py-10 lg:pb-10">{children}</main>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-sm backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1 py-2">
          {bottomNavItems.map(([label, href, Icon]) => {
            const active = isActivePath(pathname, href);

            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 min-w-0 flex-col items-center justify-center rounded-xl px-1 text-[0.64rem] font-semibold transition ${active ? "bg-emerald-50/80 text-papaipay-green" : "text-slate-500 hover:bg-slate-50 hover:text-papaipay-green"}`}
              >
                <Icon className={`h-5 w-5 ${iconClass(active)}`} />
                <span className="mt-1 truncate leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function HeaderIconLink({ href, label, icon: Icon, hasUnread = false }: { href: string; label: string; icon: IconComponent; hasUnread?: boolean }) {
  return (
    <Link href={href} aria-label={label} className="relative grid min-h-10 min-w-10 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 transition hover:border-papaipay-green/30 hover:bg-slate-50 hover:text-papaipay-green">
      <Icon className="h-5 w-5" />
      {hasUnread ? <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-papaipay-green ring-2 ring-white" /> : null}
    </Link>
  );
}

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

function IconBase({ children, ...props }: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return <IconBase {...props}><path d="m3 10.5 9-7 9 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M9.5 20v-6h5v6" /></IconBase>;
}

function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return <IconBase {...props}><path d="M4 21h16" /><path d="M6 21V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V21" /><path d="M9 8h1" /><path d="M14 8h1" /><path d="M9 12h1" /><path d="M14 12h1" /><path d="M10 21v-5h4v5" /></IconBase>;
}

function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
  return <IconBase {...props}><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" /><path d="M4.5 8.5A1.5 1.5 0 0 1 6 7h12a1.5 1.5 0 0 1 1.5 1.5V18A2 2 0 0 1 17.5 20h-11a2 2 0 0 1-2-2Z" /><path d="M4.5 12.5h15" /><path d="M10 13.5h4" /></IconBase>;
}

function WalletIcon(props: SVGProps<SVGSVGElement>) {
  return <IconBase {...props}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17Z" /><path d="M4 8h14.5A1.5 1.5 0 0 1 20 9.5" /><path d="M16 13.5h.01" /></IconBase>;
}

function UserCircleIcon(props: SVGProps<SVGSVGElement>) {
  return <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="M9 10.5a3 3 0 1 0 6 0 3 3 0 0 0-6 0" /><path d="M7.5 18a5.5 5.5 0 0 1 9 0" /></IconBase>;
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return <IconBase {...props}><path d="M18 9.8A6 6 0 0 0 6 9.8c0 6-2.2 6.7-2.2 6.7h16.4S18 15.8 18 9.8" /><path d="M10 19a2 2 0 0 0 4 0" /></IconBase>;
}

function NewspaperIcon(props: SVGProps<SVGSVGElement>) {
  return <IconBase {...props}><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5Z" /><path d="M8 8h8" /><path d="M8 12h3" /><path d="M14 12h2" /><path d="M8 16h8" /></IconBase>;
}
