"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { AppShell, EmergencyShortcut, PageHeader, SoftCard } from "@/components/AppShell";
import { DoctorAvatar } from "@/components/DoctorAvatar";
import { checkEmergency, fetchSymptoms, getSelectedChildId, logSymptom } from "@/lib/api";

const symptomOptions = ["Fever", "Cold", "Vomiting"];

export default function SymptomsPage() {
  const [selected, setSelected] = useState(["Fever"]);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const router = useRouter();

  async function loadHistory() {
    const childId = getSelectedChildId();
    if (!childId) return setHistory([]);
    try {
      const data = await fetchSymptoms(childId);
      setHistory(data?.data || []);
    } catch {
      setHistory([]);
    }
  }

  useEffect(() => {
    loadHistory();
    window.addEventListener("zoctor-child-change", loadHistory);
    return () => window.removeEventListener("zoctor-child-change", loadHistory);
  }, []);

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
      const text = `${selected.join(", ")}. ${description}`;
      const data = await checkEmergency({ text });
      if (data?.emergency || data?.isEmergency) {
        router.push("/emergency");
        return;
      }
      const childId = getSelectedChildId();
      if (!childId) {
        setError("Please add/select a child profile first from Profile.");
        return;
      }
      await logSymptom({
        child_id: childId,
        type: selected.join(", "),
        severity,
        notes: description,
      });
      await loadHistory();
      setResult(data?.message || "Symptom logged. No emergency signs detected from this description.");
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(" ") : err?.response?.data?.message || "Could not check symptoms right now.");
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
            <DoctorAvatar size="sm" mood="concerned" animated={false} />
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
      <form onSubmit={onSubmit}>
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
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm font-bold text-sky-700 outline-none ring-care-blue/30 focus:ring-4"
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
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

      <SoftCard>
        <h2 className="text-2xl font-extrabold">Symptom history</h2>
        <div className="mt-4 space-y-3">
          {history.map((item) => (
            <div key={item.id} className="rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-extrabold text-sky-950">{item.type}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    item.severity === "severe"
                      ? "bg-rose-50 text-rose-600"
                      : item.severity === "moderate"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              {item.notes ? <p className="mt-1 text-sm font-semibold text-sky-600">{item.notes}</p> : null}
              <p className="mt-2 text-xs font-bold text-sky-400">
                {item.logged_at ? new Date(item.logged_at).toLocaleString() : "Just now"}
              </p>
            </div>
          ))}
          {history.length === 0 ? (
            <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold text-sky-600">
              No symptoms logged yet for the selected child.
            </p>
          ) : null}
        </div>
      </SoftCard>
      </div>
    </AppShell>
  );
}
