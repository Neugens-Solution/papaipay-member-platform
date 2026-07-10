import Link from "next/link";
import { AdminLoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ec,transparent_32rem),linear-gradient(135deg,#f8faf7_0%,#f6f1e8_100%)] px-6 py-10 text-papaipay-ink sm:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="rounded-[2rem] border border-papaipay-green/10 bg-white/90 p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-papaipay-green">PAPAIPAY Admin</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Restricted admin login</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Authorized operational users only. Admin accounts must be invited and active before sign-in.
          </p>
          <AdminLoginForm />
          <div className="mt-6 flex flex-col gap-3 text-sm font-bold sm:flex-row sm:items-center sm:justify-between">
            <Link href="/login" className="text-slate-500 hover:text-papaipay-green">Choose another portal</Link>
            <Link href="/" className="text-slate-500 hover:text-papaipay-green">Portal home</Link>
          </div>
          <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold leading-5 text-slate-500">
            No public admin registration is available. New admin access must be handled through a protected invite flow.
          </p>
        </div>
      </section>
    </main>
  );
}
