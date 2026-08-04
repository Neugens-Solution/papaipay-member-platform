"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  ["Dashboard", "/admin/dashboard"],
  ["Members", "/admin/members"],
  ["Listing Management", "/admin/listings"],
  ["Distributions", "/admin/distributions"],
  ["Activity Log", "/admin/activity-log"],
] as const;

const primaryMobileNavItems = [navItems[0], navItems[2], navItems[1], navItems[3], navItems[4]] as const;

function activePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children, identity }: { children: React.ReactNode; identity: { name?: string | null; email: string; role?: string | null } }) {
  const pathname = usePathname();
  const displayName = identity.name || identity.email;
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AD";

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-kasset-ink">
      <div className="lg:flex lg:h-screen lg:overflow-hidden">
        <aside className="hidden border-r border-slate-200/70 bg-white/90 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-60 lg:flex-none">
          <div className="px-5 py-7">
            <Link href="/admin/dashboard" className="block rounded-md focus:outline-none focus:ring-2 focus:ring-kasset-green/30">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-kasset-green">K Asset Ventures</p>
              <p className="mt-1.5 text-sm font-semibold tracking-tight text-kasset-ink">Admin Portal</p>
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
                  className={`block rounded-lg px-3 py-2.5 text-[0.86rem] font-medium transition ${active ? "bg-emerald-50/80 text-kasset-green" : "text-slate-500 hover:bg-slate-50 hover:text-kasset-green"}`}
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
                <p className="text-sm font-extrabold tracking-tight text-kasset-ink">K Asset Ventures</p>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-kasset-green">Admin Portal</p>
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <details className="group relative">
                  <summary aria-label="Admin profile menu" className="grid min-h-10 min-w-10 cursor-pointer list-none place-items-center rounded-full bg-kasset-ink text-xs font-semibold text-white transition hover:bg-kasset-green">{initials}</summary>
                  <div className="absolute right-0 mt-2 w-60 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                    <div className="px-3 py-2">
                      <p className="text-sm font-bold text-kasset-ink">{displayName}</p>
                      <p className="mt-1 text-xs text-slate-500">{identity.role || identity.email}</p>
                    </div>
                    <Link href="/admin/profile" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-kasset-green">Admin Profile</Link>
                    <Link href="/logout" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-kasset-green">Logout</Link>
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
                className={`flex min-h-12 min-w-0 items-center justify-center rounded-xl px-1 text-center text-[0.62rem] font-semibold transition ${active ? "bg-emerald-50/80 text-kasset-green" : "text-slate-500 hover:bg-slate-50 hover:text-kasset-green"}`}
              >
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
