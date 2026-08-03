import Link from "next/link";
import type { SVGProps } from "react";

const features = [
  { title: "Browse Opportunities", body: "Review property details, campaign terms, documents, FAQs and important information in one place.", icon: BuildingIcon },
  { title: "Participate Clearly", body: "Follow a guided review, declaration and confirmation flow with the amount and key terms visible at every step.", icon: StepsIcon },
  { title: "Submit Payment Proof", body: "Upload your bank transfer receipt securely for manual verification by the administration team.", icon: ReceiptIcon },
  { title: "Track Your Portfolio", body: "See confirmed participation records, project progress and important updates from your member dashboard.", icon: PortfolioIcon },
  { title: "View Distributions", body: "Review completed distribution records, payment dates and references once they are confirmed by the admin team.", icon: WalletIcon },
  { title: "Manage Verification", body: "Submit IC front and back through a private manual KYC flow and follow the review status from your profile.", icon: ShieldIcon },
];

const steps = [
  ["01", "Create your account", "Register and sign in to your private member workspace."],
  ["02", "Complete verification", "Upload IC front and back for manual review."],
  ["03", "Review and participate", "Choose an open opportunity and complete the guided declaration."],
  ["04", "Upload your receipt", "Submit payment proof and track admin confirmation in the portal."],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f4] text-papaipay-ink">
      <header className="relative z-20 border-b border-white/10 bg-[#0d2b21] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="min-w-0">
            <span className="block text-lg font-extrabold tracking-[-0.03em]">PAPAIPAY</span>
            <span className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-emerald-200">Kasset Ventures Member Portal</span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Public navigation">
            <Link href="/member/login" className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-bold text-white hover:bg-white/10 sm:px-4">Member Login</Link>
            <Link href="/member/signup" className="hidden min-h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-bold text-[#0d2b21] hover:bg-emerald-50 sm:inline-flex">Create Account</Link>
          </nav>
        </div>
      </header>

      <section className="relative isolate bg-[#0d2b21] text-white">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#d6b66c]/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#133a2d] to-transparent" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-emerald-200/20 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Private member access</p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl">A clearer way to follow your property participation journey.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">Explore available opportunities, complete verification, submit participation and keep every important update organised in one secure member portal.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/member/login" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 text-sm font-extrabold text-[#08251b] shadow-[0_16px_40px_rgba(52,211,153,0.2)] transition hover:-translate-y-0.5 hover:bg-emerald-300">Access Member Portal</Link>
              <Link href="/member/signup" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10">Create Member Account</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-2"><CheckIcon /> Private document storage</span>
              <span className="inline-flex items-center gap-2"><CheckIcon /> Manual payment verification</span>
              <span className="inline-flex items-center gap-2"><CheckIcon /> Mobile-friendly access</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-300/15 to-transparent blur-xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur sm:p-5">
              <div className="rounded-[1.35rem] bg-[#f8faf7] p-4 text-papaipay-ink sm:p-6">
                <div className="flex items-center justify-between gap-3"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-papaipay-green">Member Overview</p><p className="mt-1 text-lg font-bold">Your journey at a glance</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-sm font-extrabold text-papaipay-green">KV</span></div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <PreviewMetric label="Verification" value="Approved" />
                  <PreviewMetric label="Active Portfolio" value="2 records" />
                </div>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Latest Opportunity</p><p className="mt-1 font-bold">Property participation campaign</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-bold text-papaipay-green">Open</span></div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/3 rounded-full bg-papaipay-green" /></div>
                  <div className="mt-2 flex justify-between text-[0.68rem] font-semibold text-slate-400"><span>Campaign progress</span><span>67%</span></div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {[["1", "Review"], ["2", "Participate"], ["3", "Track"]].map(([number, label]) => <div key={label} className="rounded-xl bg-emerald-50/70 px-3 py-3"><span className="text-xs font-extrabold text-papaipay-green">{number}</span><p className="mt-1 text-xs font-bold text-slate-700">{label}</p></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-papaipay-green">Everything in one place</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-papaipay-ink sm:text-4xl">Built around the complete member flow.</h2><p className="mt-4 text-base leading-7 text-slate-600">From identity review to completed distribution records, each step is connected and easy to follow.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ title, body, icon: Icon }) => <article key={title} className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-papaipay-green"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold tracking-tight">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-papaipay-green">How it works</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Four clear steps from access to confirmation.</h2></div>
          <ol className="mt-10 grid gap-4 lg:grid-cols-4">
            {steps.map(([number, title, body]) => <li key={number} className="relative rounded-2xl border border-slate-200 bg-[#f8faf7] p-5"><span className="text-sm font-extrabold text-papaipay-green">{number}</span><h3 className="mt-7 font-bold text-papaipay-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#12372b] text-white lg:grid-cols-[1fr_.7fr]">
          <div className="p-7 sm:p-10 lg:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Ready to begin?</p><h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Your member workspace is ready when you are.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">Sign in to review opportunities and your existing records, or create an account to start the manual verification process.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/member/login" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 text-sm font-extrabold text-[#08251b]">Member Login</Link><Link href="/member/signup" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-bold">Create Account</Link></div></div>
          <div className="grid min-h-64 place-items-center bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.22),transparent_60%)] p-8"><ShieldIcon className="h-24 w-24 text-emerald-300/70" /></div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-extrabold text-papaipay-ink">PAPAIPAY</p><p className="mt-1 text-xs">Kasset Ventures Member Portal</p></div><p className="max-w-xl text-xs leading-5">The portal records manual payment and distribution outcomes. It does not execute bank transfers or provide a payment gateway.</p><Link href="/admin/login" className="text-xs font-bold text-slate-400 hover:text-papaipay-green">Admin access</Link></div>
      </footer>
    </main>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-sm font-extrabold text-papaipay-ink">{value}</p></div>; }
function CheckIcon() { return <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/20 text-[0.65rem] font-black text-emerald-300">✓</span>; }
function IconBase({ children, ...props }: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>; }
function BuildingIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M4 21h16"/><path d="M6 21V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V21"/><path d="M9 8h1m4 0h1m-6 4h1m4 0h1"/><path d="M10 21v-5h4v5"/></IconBase>; }
function StepsIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><path d="M8 6h4a4 4 0 0 1 4 4M16 14a4 4 0 0 1-4 4H8"/></IconBase>; }
function ReceiptIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z"/><path d="M9 8h6M9 12h6M9 16h3"/></IconBase>; }
function PortfolioIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7"/><path d="M4.5 8.5A1.5 1.5 0 0 1 6 7h12a1.5 1.5 0 0 1 1.5 1.5V18A2 2 0 0 1 17.5 20h-11a2 2 0 0 1-2-2Z"/><path d="M4.5 12.5h15"/></IconBase>; }
function WalletIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17Z"/><path d="M4 8h14.5A1.5 1.5 0 0 1 20 9.5"/><path d="M16 13.5h.01"/></IconBase>; }
function ShieldIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6Z"/><path d="m9 12 2 2 4-4"/></IconBase>; }
