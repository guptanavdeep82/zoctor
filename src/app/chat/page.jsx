"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SendHorizonal } from "lucide-react";
import { AppShell, Disclaimer, EmergencyShortcut, PageHeader } from "@/components/AppShell";
import { DoctorAvatar } from "@/components/DoctorAvatar";
import { checkEmergency, hasEmergencyLanguage, sendChatMessage } from "@/lib/api";

const starterMessages = [
  { role: "ai", text: "Hi Mom, tell me what symptoms your child has today." },
];

const quickPrompts = [
  "My child has a fever",
  "Cough and runny nose",
  "Not eating well",
  "Vomiting since morning",
];

export default function ChatPage() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const router = useRouter();

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function evaluateEmergency(text) {
    try {
      const result = await checkEmergency({ text });
      if (result?.emergency || result?.isEmergency) {
        router.push("/emergency");
      }
    } catch {
      if (hasEmergencyLanguage(text)) {
        router.push("/emergency");
      }
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!canSend) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    setMessages((current) => [...current, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const data = await sendChatMessage(userMessage);
      const reply = data?.reply || data?.message || "Dress the child lightly and give them water.";
      setMessages((current) => [...current, { role: "ai", text: reply }]);
      await evaluateEmergency(reply);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not reach the AI doctor. Please try again.");
      const fallback = "Dress the child lightly, offer fluids, and monitor symptoms closely.";
      setMessages((current) => [...current, { role: "ai", text: fallback }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Chat"
        subtitle="Ask simple questions and get gentle next steps."
        action={
          <div className="flex items-center gap-2">
            <EmergencyShortcut className="px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm" />
            <DoctorAvatar size="sm" animated={false} />
          </div>
        }
      />

      <Disclaimer />

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setInput(prompt)}
            className="shrink-0 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-extrabold text-sky-700 shadow-sm transition hover:bg-sky-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <section className="mt-4 flex min-h-[62vh] flex-col gap-3 rounded-[28px] bg-white/70 p-4 shadow-xl shadow-sky-200/60 lg:min-h-[65vh] lg:p-6">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "ai" ? <DoctorAvatar size="sm" animated={false} /> : null}
              <p
                className={`max-w-[78%] rounded-[22px] px-4 py-3 text-sm font-medium shadow-sm lg:max-w-[62%] lg:text-base ${
                  message.role === "user"
                    ? "rounded-br-md bg-care-blue text-white"
                    : "rounded-bl-md bg-white text-sky-950"
                }`}
              >
                {message.text}
              </p>
            </div>
          ))}
          {loading ? (
            <div className="flex items-center gap-2">
              <DoctorAvatar size="sm" animated={false} />
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="mb-2 text-xs font-extrabold text-sky-500">Doctor is thinking...</p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-2 w-2 rounded-full bg-care-blue"
                      style={{ animation: `blink 1.2s ${dot * 0.15}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {error ? <p className="text-center text-xs font-semibold text-rose-500">{error}</p> : null}

        <form ref={formRef} onSubmit={onSubmit} className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-inner">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a message..."
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-medium outline-none placeholder:text-sky-300"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="grid h-11 w-11 place-items-center rounded-full bg-care-blue text-white shadow-lg shadow-sky-200 disabled:cursor-not-allowed disabled:bg-sky-200"
            aria-label="Send message"
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </form>
      </section>
    </AppShell>
  );
}
