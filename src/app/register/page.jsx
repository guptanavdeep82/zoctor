"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerParent } from "@/lib/api";
import { DoctorAvatar } from "@/components/DoctorAvatar";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerParent(form);
      router.push("/profile");
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(" ") : err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="soft-pattern grid min-h-screen place-items-center bg-care-bg px-4 py-8">
      <section className="grid w-full max-w-5xl items-center gap-8 rounded-[32px] bg-white/85 p-6 shadow-2xl shadow-sky-200/60 lg:grid-cols-2 lg:p-10">
        <div className="cloud-card rounded-[28px] p-6 text-center">
          <DoctorAvatar mood="talking" />
          <h1 className="mt-5 text-4xl font-extrabold text-sky-950">Create Zoctor Account</h1>
          <p className="mt-2 text-sm font-semibold text-sky-700">
            Save child profiles, chat history, and symptom logs securely.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-bold text-care-blue">Parent registration</p>
            <h2 className="text-3xl font-extrabold text-sky-950">Get started</h2>
          </div>
          {[
            ["name", "Parent name", "text"],
            ["email", "Email address", "email"],
            ["phone", "Phone number", "tel"],
            ["password", "Password", "password"],
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
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</p> : null}
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-care-blue px-5 py-4 text-lg font-extrabold text-white shadow-xl shadow-sky-300 disabled:bg-sky-200"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
          <p className="text-center text-sm font-semibold text-sky-600">
            Already have an account?{" "}
            <Link className="font-extrabold text-care-blue" href="/login">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
