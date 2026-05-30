"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginParent } from "@/lib/api";
import { DoctorAvatar } from "@/components/DoctorAvatar";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginParent(form);
      router.push("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="soft-pattern grid min-h-screen place-items-center bg-care-bg px-4 py-8">
      <section className="grid w-full max-w-5xl items-center gap-8 rounded-[32px] bg-white/85 p-6 shadow-2xl shadow-sky-200/60 lg:grid-cols-2 lg:p-10">
        <div className="cloud-card rounded-[28px] p-6 text-center">
          <DoctorAvatar />
          <h1 className="mt-5 text-4xl font-extrabold text-sky-950">Welcome to Zoctor</h1>
          <p className="mt-2 text-sm font-semibold text-sky-700">
            Login to manage child profiles and continue health guidance.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-bold text-care-blue">Parent login</p>
            <h2 className="text-3xl font-extrabold text-sky-950">Sign in</h2>
          </div>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email address"
            className="w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 font-semibold outline-none focus:ring-4 focus:ring-care-blue/25"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Password"
            className="w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 font-semibold outline-none focus:ring-4 focus:ring-care-blue/25"
          />
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</p> : null}
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-care-blue px-5 py-4 text-lg font-extrabold text-white shadow-xl shadow-sky-300 disabled:bg-sky-200"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          <p className="text-center text-sm font-semibold text-sky-600">
            New parent?{" "}
            <Link className="font-extrabold text-care-blue" href="/register">
              Create account
            </Link>
          </p>
          <p className="text-center text-sm font-semibold">
            <Link className="font-extrabold text-care-blue" href="/forgot-password">
              Forgot password?
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
