"use client";

import { useActionState as useFormState } from "react";
import { useFormStatus } from "react-dom";
import { adminLoginAction } from "./actions";

type AuthFormState = { error?: string };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="mt-6 min-h-12 w-full rounded-[3px] bg-[#172235] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#263653] disabled:opacity-70"
    >
      {pending ? "Signing in..." : "Sign in as admin"}
    </button>
  );
}

export function AdminLoginForm() {
  const [state, action] = useFormState<AuthFormState, FormData>(adminLoginAction, {});

  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block text-sm font-semibold text-[#374151]">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 min-h-12 w-full rounded-[3px] border border-[#172235]/15 bg-white px-4 outline-none transition focus:border-[#a47c48] focus:ring-4 focus:ring-[#eadbbf]"
        />
      </label>
      <label className="block text-sm font-semibold text-[#374151]">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 min-h-12 w-full rounded-[3px] border border-[#172235]/15 bg-white px-4 outline-none transition focus:border-[#a47c48] focus:ring-4 focus:ring-[#eadbbf]"
        />
      </label>
      {state.error ? (
        <p className="rounded-[3px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
