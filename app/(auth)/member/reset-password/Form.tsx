"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction } from "./actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, {});
  if (state.success) return <p className="mt-6 text-sm">Password updated. <Link href="/member/login" className="underline">Sign in</Link>.</p>;
  return <form action={action} className="mt-6 space-y-4"><input type="hidden" name="token" value={token} />
    <label className="block text-sm font-semibold">New password<input type="password" name="password" required autoComplete="new-password" minLength={12} className="mt-2 min-h-12 w-full rounded border px-4" /></label>
    <label className="block text-sm font-semibold">Confirm password<input type="password" name="confirm" required autoComplete="new-password" minLength={12} className="mt-2 min-h-12 w-full rounded border px-4" /></label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="min-h-12 w-full rounded bg-[#172235] px-5 text-white disabled:opacity-70">{pending ? "Updating..." : "Update password"}</button>
  </form>;
}
