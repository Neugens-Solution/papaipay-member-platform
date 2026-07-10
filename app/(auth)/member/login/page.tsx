import Link from "next/link";
import { MemberLoginForm } from "./LoginForm";

export default function MemberLoginPage() {
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ec,transparent_32rem),linear-gradient(135deg,#f8faf7_0%,#f6f1e8_100%)] px-6 py-10 text-papaipay-ink sm:px-10"><section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center"><div className="rounded-[2rem] border border-papaipay-green/10 bg-white/90 p-8 shadow-soft"><p className="text-sm font-semibold uppercase tracking-[0.32em] text-papaipay-green">PAPAIPAY Member</p><h1 className="mt-4 text-3xl font-bold tracking-tight">Member login</h1><p className="mt-3 text-sm leading-6 text-slate-600">Sign in for member-facing access only. Admin access must use the dedicated admin login.</p><MemberLoginForm /><div className="mt-6 flex items-center justify-between text-sm font-bold"><Link href="/member/signup" className="text-papaipay-green">Create member account</Link><Link href="/admin/login" className="text-slate-500">Admin login</Link></div></div></section></main>;
}
