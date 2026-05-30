"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/lib/api";
import { DoctorAvatar } from "@/components/DoctorAvatar";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    token: searchParams.get("token") || "",
    email: searchParams.get("email") || "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await resetPassword(form);
      setMessage(data?.message || "Password reset successfully. You can login now.");
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(" ") : err?.response?.data?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="soft-pattern grid min-h-screen place-items-center bg-care-bg px-4 py-8">
      <section className="w-full max-w-md rounded-[32px] bg-white/90 p-6 text-center shadow-2xl shadow-sky-200/60">
        <DoctorAvatar size="md" mood="happy" />
        <h1 className="mt-5 text-3xl font-extrabold text-sky-950">Set new password</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 text-left">
          {[
            ["email", "Email address", "email"],
            ["token", "Reset token", "text"],
            ["password", "New password", "password"],
            ["password_confirmation", "Confirm password", "password"],
          ].map(([key, placeholder, type]) => (
            <input
              key={key}
              type={type}
              value={form[key]}
              onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              placeholder={placeholder}
              className="w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 font-semibold outline-none focus:ring-4 focus:ring-care-blue/25"
            />
          ))}
          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-2xl bg-care-blue px-5 py-4 font-extrabold text-white shadow-lg shadow-sky-200 disabled:bg-sky-200">
            {loading ? "Saving..." : "Reset password"}
          </button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm font-extrabold text-care-blue">
          Back to login
        </Link>
      </section>
    </main>
  );
}
