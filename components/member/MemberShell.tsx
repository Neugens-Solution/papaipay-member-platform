import Link from "next/link";
import { memberProfile } from "@/lib/memberMockData";

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
    <div className="min-h-screen bg-[#f6f8f4] text-papaipay-ink">
      <div className="lg:flex">
        <aside className="border-b border-emerald-950/10 bg-papaipay-ink text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0">
          <div className="flex items-center justify-between px-6 py-5 lg:block">
            <Link href="/member/dashboard" className="block">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">PAPAIPAY</p>
              <p className="mt-1 text-xl font-bold">Member Portal</p>
            </Link>
            <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100 lg:mt-6 lg:inline-block">KYC Approved</div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-5 lg:block lg:space-y-1 lg:overflow-visible">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white lg:block">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 px-5 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-papaipay-green">Member Workspace</p>
                <h1 className="text-2xl font-bold">Welcome back, {memberProfile.firstName}</h1>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/member/notifications" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Notifications</Link>
                <Link href="/member/announcements" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Announcements</Link>
                <div className="flex items-center gap-3 rounded-full bg-papaipay-mint px-3 py-2">
                  <div className="grid size-9 place-items-center rounded-full bg-papaipay-green text-sm font-bold text-white">AR</div>
                  <div className="hidden text-sm sm:block"><p className="font-semibold">{memberProfile.firstName} {memberProfile.lastName}</p><p className="text-slate-600">{memberProfile.memberNumber}</p></div>
                </div>
              </div>
            </div>
          </header>
          <main className="px-5 py-8 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
