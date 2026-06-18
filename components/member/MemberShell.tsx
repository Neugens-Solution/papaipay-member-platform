import Link from "next/link";

const navItems = [
  ["Dashboard", "/member/dashboard"],
  ["Listings", "/member/opportunities"],
  ["Portfolio", "/member/portfolio"],
  ["Distributions", "/member/distributions"],
  ["Reports", "/member/reports"],
  ["Settings", "/member/settings"],
];

const bottomNavItems = [
  ["Dashboard", "/member/dashboard", "⌂"],
  ["Listings", "/member/opportunities", "▤"],
  ["Portfolio", "/member/portfolio", "◫"],
  ["Distributions", "/member/distributions", "RM"],
];

const profileItems = ["Personal Information", "Bank Account", "Security", "KYC"];

export function MemberShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8faf7] text-papaipay-ink">
      <div className="lg:flex lg:h-screen lg:overflow-hidden">
        <aside className="hidden border-r border-slate-200 bg-white/95 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:flex-none">
          <div className="px-5 py-6">
            <Link href="/member/dashboard" className="block rounded-md focus:outline-none focus:ring-2 focus:ring-papaipay-green/30">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-papaipay-green">PAPAIPAY</p>
              <p className="mt-1 text-base font-bold tracking-tight text-papaipay-ink">Member Portal</p>
            </Link>
          </div>
          <nav className="space-y-1 px-4 pb-6">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="block rounded-md px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-papaipay-green">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <Link href="/member/dashboard" className="rounded-md lg:hidden">
                <p className="text-sm font-extrabold tracking-tight text-papaipay-ink">PAPAIPAY</p>
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <Link href="/member/notifications" aria-label="Notifications" className="grid min-h-10 min-w-10 place-items-center rounded-md border border-slate-200 text-base text-slate-700 transition hover:border-papaipay-green/30 hover:text-papaipay-green">🔔</Link>
                <Link href="/member/announcements" aria-label="Announcements" className="grid min-h-10 min-w-10 place-items-center rounded-md border border-slate-200 text-base text-slate-700 transition hover:border-papaipay-green/30 hover:text-papaipay-green">📣</Link>
                <details className="group relative">
                  <summary aria-label="Profile menu" className="grid min-h-10 min-w-10 cursor-pointer list-none place-items-center rounded-full bg-papaipay-ink text-xs font-bold text-white transition hover:bg-papaipay-green">AR</summary>
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                    {profileItems.map((item) => (
                      <Link key={item} href="/member/profile/kyc" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-papaipay-green">
                        {item}
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </header>
          <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">{children}</main>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-sm backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1 py-2">
          {bottomNavItems.map(([label, href, icon]) => (
            <Link key={label} href={href} className="flex min-h-14 flex-col items-center justify-center rounded-md px-1 text-[0.68rem] font-bold text-slate-600 hover:bg-slate-50 hover:text-papaipay-green">
              <span className="text-base leading-none">{icon}</span><span className="mt-1">{label}</span>
            </Link>
          ))}
          <details className="relative">
            <summary className="flex min-h-14 cursor-pointer list-none flex-col items-center justify-center rounded-md px-1 text-[0.68rem] font-bold text-slate-600 hover:bg-slate-50 hover:text-papaipay-green"><span className="text-base leading-none">⋯</span><span className="mt-1">More</span></summary>
            <div className="absolute bottom-16 right-0 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
              <Link href="/member/reports" className="block rounded-md px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Reports</Link>
              <Link href="/member/settings" className="block rounded-md px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Settings</Link>
            </div>
          </details>
        </div>
      </nav>
    </div>
  );
}
