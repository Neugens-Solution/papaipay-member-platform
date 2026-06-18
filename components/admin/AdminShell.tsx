"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  ["Dashboard", "/admin/dashboard"],
  ["Members", "/admin/members"],
  ["Listings", "/admin/listings"],
  ["Distributions", "/admin/distributions"],
  ["Reports", "/admin/reports"],
  ["Announcements", "/admin/announcements"],
  ["Admin Users", "/admin/admin-users"],
] as const;

function activePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
          <nav className="space-y-1.5 px-3 pb-6">
            {navItems.map(([label, href]) => {
              const active = activePath(pathname, href);
              return <Link key={label} href={href} className={`block rounded-lg px-3 py-2.5 text-[0.86rem] font-medium transition ${active ? "bg-emerald-50/80 text-papaipay-green" : "text-slate-500 hover:bg-slate-50 hover:text-papaipay-green"}`}>{label}</Link>;
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <Link href="/admin/dashboard" className="rounded-md lg:hidden"><p className="text-sm font-extrabold tracking-tight text-papaipay-ink">PAPAIPAY Admin</p></Link>
              <div className="hidden min-w-0 overflow-x-auto lg:block">
                <div className="flex gap-2">
                  {navItems.map(([label, href]) => <Link key={label} href={href} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${activePath(pathname, href) ? "bg-papaipay-ink text-white" : "text-slate-500 hover:bg-slate-100"}`}>{label}</Link>)}
                </div>
              </div>
              <div className="ml-auto grid min-h-10 min-w-10 place-items-center rounded-full bg-papaipay-ink text-xs font-semibold text-white">SA</div>
            </div>
          </header>
          <main className="px-4 py-7 pb-28 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-sm backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-1 py-2 sm:grid-cols-7">
          {navItems.map(([label, href]) => <Link key={label} href={href} className={`flex min-h-12 items-center justify-center rounded-xl px-1 text-center text-[0.62rem] font-semibold ${activePath(pathname, href) ? "bg-emerald-50/80 text-papaipay-green" : "text-slate-500"}`}>{label}</Link>)}
        </div>
      </nav>
    </div>
  );
}
