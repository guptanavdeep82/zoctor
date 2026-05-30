"use client";

import Link from "next/link";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/api";
import { DoctorAvatar } from "@/components/DoctorAvatar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await requestPasswordReset({ email });
      setMessage(data?.message || "Password reset link sent. Please check your email.");
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(" ") : err?.response?.data?.message || "Could not send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="soft-pattern grid min-h-screen place-items-center bg-care-bg px-4 py-8">
      <section className="w-full max-w-md rounded-[32px] bg-white/90 p-6 text-center shadow-2xl shadow-sky-200/60">
        <DoctorAvatar size="md" mood="concerned" />
        <h1 className="mt-5 text-3xl font-extrabold text-sky-950">Reset password</h1>
        <p className="mt-2 text-sm font-semibold text-sky-600">Enter your parent email to receive a reset link.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 text-left">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 font-semibold outline-none focus:ring-4 focus:ring-care-blue/25"
          />
          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-2xl bg-care-blue px-5 py-4 font-extrabold text-white shadow-lg shadow-sky-200 disabled:bg-sky-200">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm font-extrabold text-care-blue">
          Back to login
        </Link>
      </section>
    </main>
  );
}
