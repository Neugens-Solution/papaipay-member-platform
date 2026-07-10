import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ec,transparent_32rem),linear-gradient(135deg,#f8faf7_0%,#f6f1e8_100%)] px-6 py-10 text-papaipay-ink sm:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center">
        <div className="rounded-[2rem] border border-papaipay-green/10 bg-white/90 p-6 shadow-soft sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-papaipay-green">PAPAIPAY</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Choose your portal</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Select the correct portal before signing in. Member and admin access are separated so users are never routed silently across portal boundaries.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-papaipay-green">Members</p>
              <h2 className="mt-2 text-xl font-bold">Access your member portal</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Browse opportunities, track your portfolio, and review distributions.</p>
              <div className="mt-5 grid gap-3">
                <Link href="/member/login" className="rounded-xl bg-papaipay-green px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600">Member login</Link>
                <Link href="/member/signup" className="rounded-xl border border-papaipay-green/20 bg-white px-5 py-3 text-center text-sm font-bold text-papaipay-green transition hover:bg-emerald-50">Create member account</Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Admins</p>
              <h2 className="mt-2 text-xl font-bold">Restricted operations access</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Admin access is for invited and active operational users only.</p>
              <Link href="/admin/login" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-papaipay-ink px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">Admin login</Link>
              <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">No public admin registration is available.</p>
            </div>
          </div>

          <Link href="/" className="mt-6 inline-flex text-sm font-bold text-slate-500 hover:text-papaipay-green">Back to portal home</Link>
        </div>
      </section>
    </main>
  );
}
