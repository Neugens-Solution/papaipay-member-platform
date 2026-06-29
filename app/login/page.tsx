import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ec,transparent_32rem),linear-gradient(135deg,#f8faf7_0%,#f6f1e8_100%)] px-6 py-10 text-papaipay-ink sm:px-10">
    <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
      <div className="rounded-[2rem] border border-papaipay-green/10 bg-white/90 p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-papaipay-green">PAPAIPAY</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Sign in to your portal</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Use your PAPAIPAY member or admin credentials. Access is routed automatically after sign-in.</p>
        <LoginForm />
        <Link href="/" className="mt-6 inline-flex text-sm font-bold text-papaipay-green">Back to portal home</Link>
      </div>
    </section>
  </main>;
}
