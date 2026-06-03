import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://zoctor.eventsbyan.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
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
  const childId = getSelectedChildId();
  const { data } = await api.post("/api/chat", { message, child_id: childId });
  return data;
}

export async function fetchChatHistory(childId = getSelectedChildId()) {
  const { data } = await api.get("/api/chat/history", { params: { child_id: childId, per_page: 50 } });
  return data;
}

export async function clearChatHistory(childId = getSelectedChildId()) {
  const { data } = await api.delete("/api/chat/history", { data: childId ? { child_id: childId } : {} });
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

export async function speakText(text) {
  const { data } = await api.post("/api/voice/speak", { text });
  return data;
}

export async function fetchTips() {
  const { data } = await api.get("/api/tips");
  return data;
}

export async function fetchTipsByCategory(category) {
  const { data } = await api.get(`/api/tips/${category}`);
  return data;
}

export async function checkEmergency(payload) {
  const { data } = await api.post("/api/emergency/check", payload);
  return data;
}

export async function registerParent(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  persistSession(data);
  return data;
}

export async function loginParent(payload) {
  const { data } = await api.post("/api/auth/login", payload);
  persistSession(data);
  return data;
}

export async function requestPasswordReset(payload) {
  const { data } = await api.post("/api/auth/forgot-password", payload);
  return data;
}

export async function resetPassword(payload) {
  const { data } = await api.post("/api/auth/reset-password", payload);
  return data;
}

export async function logoutParent() {
  try {
    await api.post("/api/auth/logout");
  } finally {
    clearSession();
  }
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/api/auth/user");
  if (typeof window !== "undefined") {
    window.localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
}

export async function fetchChildProfiles() {
  const { data } = await api.get("/api/profile/child");
  return data?.data || data || [];
}

export async function createChildProfile(payload) {
  const { data } = await api.post("/api/profile/child", payload);
  return data?.data || data;
}

export async function updateChildProfile(id, payload) {
  const { data } = await api.put(`/api/profile/child/${id}`, payload);
  return data?.data || data;
}

export async function deleteChildProfile(id) {
  const { data } = await api.delete(`/api/profile/child/${id}`);
  return data;
}

export async function logSymptom(payload) {
  const childId = payload.child_id || getSelectedChildId();
  const { data } = await api.post("/api/symptoms", { ...payload, child_id: childId });
  return data?.data || data;
}

export async function fetchSymptoms(childId = getSelectedChildId()) {
  const { data } = await api.get("/api/symptoms", { params: { child_id: childId } });
  return data;
}

export function persistSession(data) {
  if (typeof window === "undefined") return;
  if (data?.token) window.localStorage.setItem("token", data.token);
  if (data?.user) window.localStorage.setItem("user", JSON.stringify(data.user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("selectedChildId");
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function getSelectedChildId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("selectedChildId");
}

export function setSelectedChildId(id) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem("selectedChildId", String(id));
  else window.localStorage.removeItem("selectedChildId");
  window.dispatchEvent(new Event("zoctor-child-change"));
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
