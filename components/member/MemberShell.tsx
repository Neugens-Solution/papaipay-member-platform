import Link from "next/link";

const navItems = [
  ["Dashboard", "/member/dashboard"],
  ["Opportunities", "/member/opportunities"],
  ["My Participations", "/member/participations"],
  ["Active Projects", "/member/projects/active"],
  ["Completed Projects", "/member/projects/completed"],
  ["Distributions", "/member/distributions"],
  ["Notifications", "/member/notifications"],
  ["Announcements", "/member/announcements"],
  ["Profile & KYC", "/member/profile/kyc"],
  ["Reports", "/member/reports"],
  ["Settings", "/member/settings"],
];

export function MemberShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8faf7] text-papaipay-ink">
      <div className="lg:flex">
        <aside className="border-b border-slate-200/80 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-slate-200/80 lg:bg-white">
          <div className="px-4 py-4 sm:px-6 lg:px-5 lg:py-6">
            <div className="flex items-center justify-between gap-4 lg:block">
              <Link href="/member/dashboard" className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-papaipay-green/30">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.32em] text-papaipay-green">PAPAIPAY</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-papaipay-ink sm:text-xl">Member Portal</p>
              </Link>
            </div>

            <details className="group mt-4 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-white">
                Member navigation
                <span className="text-papaipay-green transition group-open:rotate-180">⌄</span>
              </summary>
              <nav className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                {navItems.map(([label, href]) => (
                  <Link key={label} href={href} className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-papaipay-green">
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>

          <nav className="hidden px-4 pb-6 lg:block lg:space-y-1">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-papaipay-green">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-papaipay-green">Member Workspace</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Property Investment Portal</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link href="/member/notifications" className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-papaipay-green/30 hover:text-papaipay-green">Notifications</Link>
                <Link href="/member/announcements" className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-papaipay-green/30 hover:text-papaipay-green">Announcements</Link>
              </div>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
