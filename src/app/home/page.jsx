"use client";

import Link from "next/link";
import { Apple, Moon, Stethoscope, ThermometerSun } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell, EmergencyShortcut, PageHeader, SoftCard, TrustStrip } from "@/components/AppShell";
import { DoctorAvatar } from "@/components/DoctorAvatar";

const cards = [
  { title: "Talk Now", subtitle: "Ask by voice", href: "/talk", icon: ThermometerSun, color: "bg-orange-100 text-orange-600" },
  { title: "Cold Cough", subtitle: "Quick symptom check", href: "/symptoms", icon: Stethoscope, color: "bg-emerald-100 text-emerald-600" },
  { title: "Nutrition Tips", subtitle: "Feeding reminders", href: "/tips", icon: Apple, color: "bg-amber-100 text-amber-600" },
  { title: "Sleep Guide", subtitle: "Calmer bedtime", href: "/tips", icon: Moon, color: "bg-indigo-100 text-indigo-600" },
];

export default function HomePage() {
  return (
    <AppShell>
      <PageHeader
        title="Home"
        subtitle="Friendly health help for your little one."
        action={<EmergencyShortcut className="px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm" />}
      />

      <div className="grid gap-5 lg:grid-cols-[.95fr_1.05fr] lg:items-stretch">
        <SoftCard className="cloud-card text-center lg:flex lg:flex-col lg:justify-center">
          <DoctorAvatar />
          <div className="mx-auto mt-4 max-w-xs rounded-[1.4rem] bg-white px-5 py-3 text-lg font-extrabold shadow-lg">
            Hello! Talk to me :)
          </div>
          <p className="mx-auto mt-4 max-w-sm text-sm font-semibold text-sky-700">
            Choose a care mode below. I can help organize symptoms, tips, and next-step guidance.
          </p>
        </SoftCard>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Link
              href={card.href}
              className={`${card.color} flex min-h-32 flex-col justify-between rounded-[24px] p-4 shadow-xl shadow-sky-200/60 transition hover:-translate-y-1 lg:min-h-44 lg:p-6`}
            >
              <card.icon className="h-10 w-10 lg:h-12 lg:w-12" />
              <span>
                <span className="block text-xl font-extrabold leading-tight text-sky-950 lg:text-3xl">{card.title}</span>
                <span className="mt-1 block text-xs font-extrabold text-sky-600 lg:text-sm">{card.subtitle}</span>
              </span>
            </Link>
          </motion.div>
        ))}
        </div>
      </div>

      <div className="mt-5">
        <TrustStrip />
      </div>
    </AppShell>
  );
}
