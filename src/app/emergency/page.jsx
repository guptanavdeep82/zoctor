"use client";

import Link from "next/link";
import { AlertTriangle, PhoneCall } from "lucide-react";
import { AppShell, SoftCard } from "@/components/AppShell";
import { DoctorAvatar } from "@/components/DoctorAvatar";

export default function EmergencyPage() {
  return (
    <AppShell className="bg-red-50">
      <div className="flex min-h-[calc(100vh-9rem)] flex-col justify-center">
        <SoftCard className="mx-auto grid max-w-5xl items-center gap-8 border border-red-100 bg-white text-center shadow-red-100 lg:grid-cols-[1fr_.9fr] lg:text-left">
          <div>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-11 w-11" />
          </div>
          <h1 className="mt-5 text-4xl font-extrabold text-red-600 lg:text-6xl">Emergency</h1>
          <p className="mt-3 text-base font-semibold text-sky-800 lg:text-lg">
            If your child has severe symptoms, trouble breathing, seizures, blue lips, or is unresponsive, seek urgent medical care now.
          </p>
          </div>

          <div>
          <div className="my-7">
            <DoctorAvatar mood="emergency" />
          </div>

          <a
            href="tel:108"
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-6 py-4 text-lg font-extrabold text-white shadow-xl shadow-red-200"
          >
            <PhoneCall className="h-6 w-6" />
            Call Helpline
          </a>
          <Link
            href="/home"
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-sky-50 px-6 py-4 font-extrabold text-sky-700"
          >
            Back to Home
          </Link>
          </div>
        </SoftCard>
      </div>
    </AppShell>
  );
}
