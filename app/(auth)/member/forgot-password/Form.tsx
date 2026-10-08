"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "./actions";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, { sent: false });
  if (state.sent) return <p className="mt-6 text-sm leading-7">If this email belongs to an active member account, a reset link has been sent. Check your inbox and spam folder.</p>;
  return <form action={action} className="mt-6 space-y-4">
    <label className="block text-sm font-semibold">Email<input type="email" name="email" required autoComplete="email" className="mt-2 min-h-12 w-full rounded border px-4" /></label>
    <button disabled={pending} className="min-h-12 w-full rounded bg-[#172235] px-5 text-white disabled:opacity-70">{pending ? "Sending..." : "Send reset link"}</button>
  </form>;
}
