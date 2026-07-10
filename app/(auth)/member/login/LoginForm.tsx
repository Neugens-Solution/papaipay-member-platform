"use client";

import { useFormState, useFormStatus } from "react-dom";
import { memberLoginAction } from "./actions";
type AuthFormState = { error?: string };

function SubmitButton() { const { pending } = useFormStatus(); return <button disabled={pending} className="mt-6 min-h-12 w-full rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-70">{pending ? "Signing in..." : "Sign in as member"}</button>; }
export function MemberLoginForm() { const [state, action] = useFormState<AuthFormState, FormData>(memberLoginAction, {}); return <form action={action} className="mt-8 space-y-4"><label className="block text-sm font-semibold text-slate-700">Email<input name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-papaipay-green focus:ring-4 focus:ring-emerald-50" /></label><label className="block text-sm font-semibold text-slate-700">Password<input name="password" type="password" autoComplete="current-password" required className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-papaipay-green focus:ring-4 focus:ring-emerald-50" /></label>{state.error ? <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p> : null}<SubmitButton /></form>; }
