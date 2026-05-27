import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export async function sendChatMessage(message) {
  const { data } = await api.post("/api/chat", { message });
  return data;
}

export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "parent-voice.webm");

  const { data } = await api.post("/api/voice/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

export async function fetchTips() {
  const { data } = await api.get("/api/tips");
  return data;
}

export async function checkEmergency(payload) {
  const { data } = await api.post("/api/emergency/check", payload);
  return data;
}

export function hasEmergencyLanguage(text = "") {
  const keywords = [
    "emergency",
    "call ambulance",
    "difficulty breathing",
    "trouble breathing",
    "blue lips",
    "seizure",
    "unconscious",
    "severe dehydration",
    "chest pain",
    "high fever",
  ];

  return keywords.some((keyword) => text.toLowerCase().includes(keyword));
}
