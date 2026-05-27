"use client";

import Link from "next/link";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell, EmergencyShortcut, SoftCard, TrustStrip } from "@/components/AppShell";
import { DoctorAvatar } from "@/components/DoctorAvatar";

export default function SplashPage() {
  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-9rem)] flex-col justify-center">
        <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} transition={{ duration: 0.45 }}>
          <SoftCard className="cloud-card grid items-center gap-8 overflow-hidden p-6 text-center lg:grid-cols-[1.05fr_.95fr] lg:p-10 lg:text-left">
            <div className="order-2 lg:order-1">
              <p className="text-base font-bold text-white drop-shadow-sm">Hello Mom</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight text-sky-950 lg:text-6xl">
                Zoctor
              </h1>
              <p className="mt-4 max-w-xl text-base font-semibold text-sky-700 lg:text-lg">
                Friendly children health AI guidance, symptom notes, voice chat, and tips for parents.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <EmergencyShortcut className="bg-red-500" />
              </div>

              <div className="mt-6 max-w-md rounded-[1.4rem] bg-white px-5 py-4 text-lg font-extrabold text-sky-950 shadow-lg">
                Hello! Talk to me :)
              </div>

              <Link
                href="/home"
                className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-care-blue px-6 py-4 text-lg font-extrabold text-white shadow-xl shadow-sky-300 transition hover:-translate-y-0.5 hover:bg-sky-500 sm:w-auto sm:min-w-64"
              >
                <Mic className="h-6 w-6" />
                Get Started
              </Link>
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-4 flex items-center justify-end text-left">
                <div className="h-16 w-24 overflow-hidden rounded-2xl bg-white/70 p-1 shadow-lg">
                  <img src="/zoctor-logo.png" alt="Zoctor logo" className="h-full w-full object-contain" />
                </div>
              </div>
              <DoctorAvatar />
            </div>
          </SoftCard>
        </motion.div>
        <div className="mt-5">
          <TrustStrip />
        </div>
      </div>
    </AppShell>
  );
}
