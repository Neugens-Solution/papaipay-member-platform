import Link from "next/link";

const navItems = [
  ["Dashboard", "/member/dashboard"],
  ["Listings", "/member/opportunities"],
  ["My Participations", "/member/participations"],
  ["Distributions", "/member/distributions"],
  ["Reports", "/member/reports"],
  ["Settings", "/member/settings"],
];

const profileItems = ["Personal Information", "Bank Account", "Security", "KYC"];

export function MemberShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8faf7] text-papaipay-ink">
      <div className="lg:flex">
        <aside className="border-b border-slate-200 bg-white/95 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="px-4 py-4 sm:px-6 lg:px-5 lg:py-6">
            <div className="flex items-center justify-between gap-4 lg:block">
              <Link href="/member/dashboard" className="block rounded-md focus:outline-none focus:ring-2 focus:ring-papaipay-green/30">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-papaipay-green">PAPAIPAY</p>
                <p className="mt-1 text-base font-bold tracking-tight text-papaipay-ink">Member Portal</p>
              </Link>
            </div>

            <details className="group mt-4 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                Menu
                <span className="text-papaipay-green transition group-open:rotate-180">⌄</span>
              </summary>
              <nav className="mt-3 grid gap-1 rounded-lg border border-slate-200 bg-white p-2">
                {navItems.map(([label, href]) => (
                  <Link key={label} href={href} className="rounded-md px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-papaipay-green">
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>

          <nav className="hidden px-4 pb-6 lg:block lg:space-y-1">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="block rounded-md px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-papaipay-green">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-end gap-2">
              <Link href="/member/notifications" aria-label="Notifications" className="grid min-h-11 min-w-11 place-items-center rounded-md border border-slate-200 text-lg text-slate-700 transition hover:border-papaipay-green/30 hover:text-papaipay-green">🔔</Link>
              <Link href="/member/announcements" aria-label="Announcements" className="grid min-h-11 min-w-11 place-items-center rounded-md border border-slate-200 text-lg text-slate-700 transition hover:border-papaipay-green/30 hover:text-papaipay-green">📣</Link>
              <details className="group relative">
                <summary aria-label="Profile menu" className="grid min-h-11 min-w-11 cursor-pointer list-none place-items-center rounded-full bg-papaipay-ink text-sm font-bold text-white transition hover:bg-papaipay-green">AR</summary>
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                  {profileItems.map((item) => (
                    <Link key={item} href="/member/profile/kyc" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-papaipay-green">
                      {item}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
