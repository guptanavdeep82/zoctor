"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square } from "lucide-react";
import { AppShell, Disclaimer, EmergencyShortcut, PageHeader, SoftCard } from "@/components/AppShell";
import { DoctorAvatar } from "@/components/DoctorAvatar";
import { checkEmergency, hasEmergencyLanguage, transcribeAudio } from "@/lib/api";

export default function TalkPage() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const router = useRouter();

  async function inspectEmergency(text) {
    try {
      const result = await checkEmergency({ text });
      if (result?.emergency || result?.isEmergency) router.push("/emergency");
    } catch {
      if (hasEmergencyLanguage(text)) router.push("/emergency");
    }
  }

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setLoading(true);
        try {
          const data = await transcribeAudio(blob);
          const text = data?.transcript || data?.text || "I heard your message. Please describe symptoms in chat for more guidance.";
          setTranscript(text);
          await inspectEmergency(text);
        } catch (err) {
          setError(err?.response?.data?.message || "Voice could not be transcribed. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone permission is needed for Talk Mode.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <AppShell>
      <PageHeader
        title="Talk Mode"
        subtitle="Tap once, speak clearly, then tap again to send."
        action={<EmergencyShortcut className="px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm" />}
      />
      <Disclaimer />

      <SoftCard className="cloud-card mt-5 grid items-center gap-8 text-center lg:grid-cols-2 lg:text-left">
        <div>
          <DoctorAvatar />
        </div>
        <div>
        <h2 className="mt-5 text-3xl font-extrabold lg:text-5xl">Tap to Speak</h2>
        <p className="mt-3 text-sm font-semibold text-sky-700 lg:text-base">
          Voice note transcribe hoga aur emergency signs milte hi alert screen khul jayegi.
        </p>

        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={loading}
          className={`pulse-ring relative mx-auto mt-8 grid h-32 w-32 place-items-center rounded-full text-white shadow-2xl transition lg:mx-0 lg:h-36 lg:w-36 ${
            recording ? "bg-rose-500 shadow-rose-200" : "bg-care-blue shadow-sky-300"
          } disabled:cursor-wait disabled:bg-sky-300`}
          aria-label={recording ? "Stop recording" : "Start recording"}
        >
          {recording ? <Square className="h-12 w-12" /> : <Mic className="h-16 w-16" />}
        </button>

        <p className="mt-6 text-lg font-bold text-sky-800">
          {loading ? "Listening carefully..." : recording ? "Recording now..." : "Tap to Speak"}
        </p>

        {transcript ? (
          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-sky-800 shadow-sm">
            {transcript}
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm font-semibold text-rose-500">{error}</p> : null}
        </div>
      </SoftCard>
    </AppShell>
  );
}
