"use client";

import { Suspense } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Sun, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { signInAction, type LoginState } from "./actions";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-solar-500 py-3 text-sm font-semibold text-navy-900 transition hover:bg-solar-400 disabled:opacity-70"
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

function LoginForm() {
  const [state, formAction] = useFormState(signInAction, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/dashboard";
  const authError = searchParams.get("error");

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-solar-500"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-solar-500"
        />
      </div>

      {(state.error || authError) && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
          {state.error ??
            (authError === "not_authorized"
              ? "This account is not authorized for admin access."
              : "Something went wrong.")}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 bg-grid-glow px-5">
      <div className="w-full max-w-sm rounded-2xl border border-navy-700 bg-navy-800/60 p-8 shadow-glow">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-solar-500">
            <Sun size={22} className="text-navy-900" />
          </span>
          <h1 className="font-display text-xl font-semibold text-white">
            Vozaro Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage your store
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center text-sm text-slate-400">Loading...</div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
