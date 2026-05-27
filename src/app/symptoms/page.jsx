"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { AppShell, EmergencyShortcut, PageHeader, SoftCard } from "@/components/AppShell";
import { DoctorAvatar } from "@/components/DoctorAvatar";
import { checkEmergency } from "@/lib/api";

const symptomOptions = ["Fever", "Cold", "Vomiting"];

export default function SymptomsPage() {
  const [selected, setSelected] = useState(["Fever"]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function toggleSymptom(symptom) {
    setSelected((current) =>
      current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom],
    );
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await checkEmergency({ symptoms: selected, description });
      if (data?.emergency || data?.isEmergency) {
        router.push("/emergency");
        return;
      }
      setResult(data?.message || "No emergency signs detected from this description. Keep monitoring and consult a doctor if symptoms continue.");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not check symptoms right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Symptoms"
        subtitle="Select what you notice and add a few details."
        action={
          <div className="flex items-center gap-2">
            <EmergencyShortcut className="px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm" />
            <DoctorAvatar size="sm" animated={false} />
          </div>
        }
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-4xl">
        <SoftCard>
          <div className="grid gap-3 md:grid-cols-3">
            {symptomOptions.map((symptom) => {
              const active = selected.includes(symptom);
              return (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left font-bold shadow-sm transition ${
                    active
                      ? "border-care-blue bg-sky-50 text-sky-950"
                      : "border-sky-100 bg-white text-sky-500"
                  }`}
                >
                  {symptom}
                  <CheckCircle2 className={`h-6 w-6 ${active ? "text-care-blue" : "text-sky-200"}`} />
                </button>
              );
            })}
          </div>

          <label className="mt-5 block text-sm font-bold text-sky-900" htmlFor="describe">
            Describe symptoms
          </label>
          <textarea
            id="describe"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Example: Fever since morning, drinking less milk..."
            rows={7}
            className="mt-2 w-full resize-none rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm font-medium outline-none ring-care-blue/30 placeholder:text-sky-300 focus:ring-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-2xl bg-care-blue px-5 py-4 text-lg font-extrabold text-white shadow-xl shadow-sky-300 disabled:bg-sky-200 md:w-auto md:min-w-64"
          >
            {loading ? "Checking..." : "Check Symptoms"}
          </button>

          {result ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{result}</p> : null}
          {error ? <p className="mt-4 text-center text-sm font-semibold text-rose-500">{error}</p> : null}
        </SoftCard>
      </form>
    </AppShell>
  );
}
