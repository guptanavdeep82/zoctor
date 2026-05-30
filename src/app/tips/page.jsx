"use client";

import { useEffect, useState } from "react";
import { Baby, MoonStar, Pill } from "lucide-react";
import { AppShell, EmergencyShortcut, PageHeader, SoftCard } from "@/components/AppShell";
import { fetchTips, fetchTipsByCategory } from "@/lib/api";

const fallbackTips = [
  { title: "Baby Feeding Tips", body: "Offer small, frequent feeds and watch wet diapers.", icon: Baby, color: "bg-emerald-100 text-emerald-600" },
  { title: "Sleep Guide", body: "Keep bedtime calm, dim, and consistent.", icon: MoonStar, color: "bg-indigo-100 text-indigo-600" },
  { title: "Medicine Reminder", body: "Use only doctor-approved doses and timing.", icon: Pill, color: "bg-orange-100 text-orange-600" },
];

export default function TipsPage() {
  const [tips, setTips] = useState(fallbackTips);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTips() {
      try {
        const data = category === "all" ? await fetchTips() : await fetchTipsByCategory(category);
        const list = Array.isArray(data) ? data : data?.tips;
        if (mounted && Array.isArray(list) && list.length > 0) {
          setTips(
            list.map((tip, index) => ({
              title: tip.title || tip.name || fallbackTips[index % fallbackTips.length].title,
              body: tip.body || tip.description || tip.content || fallbackTips[index % fallbackTips.length].body,
              icon: fallbackTips[index % fallbackTips.length].icon,
              color: fallbackTips[index % fallbackTips.length].color,
            })),
          );
        }
      } catch {
        if (mounted) setError("Showing starter tips because the tips API is unavailable.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTips();
    return () => {
      mounted = false;
    };
  }, [category]);

  return (
    <AppShell>
      <PageHeader
        title="Tips"
        subtitle="Simple care ideas for everyday routines."
        action={<EmergencyShortcut className="px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm" />}
      />

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {["all", "nutrition", "sleep", "cold", "medicine"].map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold shadow-sm ${
              category === item ? "bg-care-blue text-white" : "bg-white text-sky-600"
            }`}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-[24px] bg-white/70 shadow-xl shadow-sky-200/40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip) => (
            <SoftCard key={tip.title} className="flex items-center gap-4 md:flex-col md:items-start">
              <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${tip.color}`}>
                <tip.icon className="h-9 w-9" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold lg:text-2xl">{tip.title}</h2>
                <p className="mt-1 text-sm font-medium text-sky-600">{tip.body}</p>
              </div>
            </SoftCard>
          ))}
        </div>
      )}

      {error ? <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-center text-xs font-semibold text-amber-600">{error}</p> : null}
    </AppShell>
  );
}
