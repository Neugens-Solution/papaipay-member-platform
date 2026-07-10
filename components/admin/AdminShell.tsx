"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";

const navItems = [
  ["Dashboard", "/admin/dashboard"],
  ["Members", "/admin/members"],
  ["Listing Management", "/admin/listings"],
  ["Distributions", "/admin/distributions"],
  ["Reports", "/admin/reports"],
  ["Announcements", "/admin/announcements"],
  ["Activity Log", "/admin/activity-log"],
  ["Admin Users", "/admin/admin-users"],
] as const;

const primaryMobileNavItems = [
  navItems[0],
  navItems[2],
  navItems[1],
  navItems[3],
] as const;

const secondaryMobileNavItems = [
  navItems[4],
  navItems[5],
  navItems[6],
  navItems[7],
] as const;

function activePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children, identity }: { children: React.ReactNode; identity: { name?: string | null; email: string; role?: string | null } }) {
  const pathname = usePathname();
  const displayName = identity.name || identity.email;
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AD";
  const moreActive = secondaryMobileNavItems.some(([, href]) => activePath(pathname, href));

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-papaipay-ink">
      <div className="lg:flex lg:h-screen lg:overflow-hidden">
        <aside className="hidden border-r border-slate-200/70 bg-white/90 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-60 lg:flex-none">
          <div className="px-5 py-7">
            <Link href="/admin/dashboard" className="block rounded-md focus:outline-none focus:ring-2 focus:ring-papaipay-green/30">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-papaipay-green">PAPAIPAY</p>
              <p className="mt-1.5 text-sm font-semibold tracking-tight text-papaipay-ink">Admin Portal</p>
            </Link>
          </div>
          <nav className="space-y-1.5 px-3 pb-6" aria-label="Admin navigation">
            {navItems.map(([label, href]) => {
              const active = activePath(pathname, href);
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={active ? "page" : undefined}
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
              <Link href="/admin/dashboard" className="rounded-md lg:hidden">
                <p className="text-sm font-extrabold tracking-tight text-papaipay-ink">PAPAIPAY</p>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-papaipay-green">Admin Portal</p>
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <HeaderIconLink href="/admin/activity-log" label="Activity log" icon={BellIcon} hasUnread />
                <details className="group relative">
                  <summary aria-label="Admin profile menu" className="grid min-h-10 min-w-10 cursor-pointer list-none place-items-center rounded-full bg-papaipay-ink text-xs font-semibold text-white transition hover:bg-papaipay-green">{initials}</summary>
                  <div className="absolute right-0 mt-2 w-60 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                    <div className="px-3 py-2">
                      <p className="text-sm font-bold text-papaipay-ink">{displayName}</p>
                      <p className="mt-1 text-xs text-slate-500">{identity.role || identity.email}</p>
                    </div>
                    <Link href="/admin/profile" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-papaipay-green">Admin Profile</Link>
                    <Link href="/logout" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-papaipay-green">Logout</Link>
                  </div>
                </details>
              </div>
            </div>
          </header>
          <main className="px-4 py-7 pb-28 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-sm backdrop-blur lg:hidden" aria-label="Admin mobile navigation">
        <div className="grid grid-cols-5 gap-1 py-2">
          {primaryMobileNavItems.map(([label, href]) => {
            const active = activePath(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 min-w-0 items-center justify-center rounded-xl px-1 text-center text-[0.62rem] font-semibold transition ${active ? "bg-emerald-50/80 text-papaipay-green" : "text-slate-500 hover:bg-slate-50 hover:text-papaipay-green"}`}
              >
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
          <details className={`group relative flex min-h-12 min-w-0 items-center justify-center rounded-xl px-1 text-center text-[0.62rem] font-semibold transition ${moreActive ? "bg-emerald-50/80 text-papaipay-green" : "text-slate-500 hover:bg-slate-50 hover:text-papaipay-green"}`}>
            <summary className="flex h-full w-full cursor-pointer list-none items-center justify-center rounded-xl">More</summary>
            <div className="absolute bottom-[calc(100%+0.5rem)] right-0 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-soft">
              {secondaryMobileNavItems.map(([label, href]) => {
                const active = activePath(pathname, href);
                return (
                  <Link
                    key={label}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2.5 text-sm font-semibold ${active ? "bg-emerald-50/80 text-papaipay-green" : "text-slate-600 hover:bg-slate-50 hover:text-papaipay-green"}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </details>
        </div>
      </nav>
    </div>
  );
}

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

function HeaderIconLink({ href, label, icon: Icon, hasUnread = false }: { href: string; label: string; icon: IconComponent; hasUnread?: boolean }) {
  return (
    <Link href={href} aria-label={label} className="relative grid min-h-10 min-w-10 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 transition hover:border-papaipay-green/30 hover:bg-slate-50 hover:text-papaipay-green">
      <Icon className="h-5 w-5" />
      {hasUnread ? <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-papaipay-green ring-2 ring-white" /> : null}
    </Link>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M18 9.8A6 6 0 0 0 6 9.8c0 6-2.2 6.7-2.2 6.7h16.4S18 15.8 18 9.8" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>;
}
