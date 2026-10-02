"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/browser";

const supabase = createClient();

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  console.log("1. Login button clicked");

  setError("");
  setLoading(true);

  try {
    console.log("2. Calling Supabase...");

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("3. Supabase response:", result);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    console.log("4. Login successful");

    router.push("/admin");
    router.refresh();
  } catch (err) {
    console.error("5. Login exception:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong while signing in."
    );
  } finally {
    console.log("6. Login finished");
    setLoading(false);
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Polar Science Portal
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Admin Login
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to manage polar science content and resources.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}