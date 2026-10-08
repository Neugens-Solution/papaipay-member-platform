import Link from "next/link";
import { ResetPasswordForm } from "./Form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <main className="flex min-h-screen items-center justify-center bg-[#0e1726] p-5"><section className="w-full max-w-md rounded bg-[#fffdf9] p-8 text-[#172235]">
    <p className="text-sm font-semibold text-[#a47c48]">K Asset Ventures Member Portal</p><h1 className="mt-3 text-3xl">Reset password</h1>
    {token ? <ResetPasswordForm token={token} /> : <p className="mt-6 text-sm">Missing reset link. <Link href="/member/forgot-password" className="underline">Request a new one</Link>.</p>}
  </section></main>;
}
