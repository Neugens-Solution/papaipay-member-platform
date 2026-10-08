import Link from "next/link";
import { ForgotPasswordForm } from "./Form";

export default function ForgotPasswordPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#0e1726] p-5"><section className="w-full max-w-md rounded bg-[#fffdf9] p-8 text-[#172235]">
    <p className="text-sm font-semibold text-[#a47c48]">K Asset Ventures Member Portal</p><h1 className="mt-3 text-3xl">Forgot password?</h1>
    <p className="mt-4 text-sm leading-7">Enter your account email. We will send a link valid for 30 minutes.</p>
    <ForgotPasswordForm /><Link href="/member/login" className="mt-6 inline-block text-sm underline">Back to sign in</Link>
  </section></main>;
}
