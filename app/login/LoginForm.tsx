"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="mt-6 min-h-12 w-full rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">{pending ? "Signing in..." : "Sign in"}</button>;
}

export function LoginForm() {
  const [state, action] = useFormState<LoginState, FormData>(loginAction, {});
  return <form action={action} className="mt-8 space-y-4">
    <label className="block text-sm font-semibold text-slate-700">Email<input name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-papaipay-ink outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-emerald-50" /></label>
    <label className="block text-sm font-semibold text-slate-700">Password<input name="password" type="password" autoComplete="current-password" required className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-papaipay-ink outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-emerald-50" /></label>
    {state.error ? <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p> : null}
    <SubmitButton />
  </form>;
}
