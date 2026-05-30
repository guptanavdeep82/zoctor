"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Baby, Pencil, Trash2, UserRound, X } from "lucide-react";
import {
  createChildProfile,
  deleteChildProfile,
  fetchChildProfiles,
  fetchCurrentUser,
  getSelectedChildId,
  getStoredUser,
  logoutParent,
  setSelectedChildId,
  updateChildProfile,
} from "@/lib/api";
import { AppShell, EmergencyShortcut, PageHeader, SoftCard } from "@/components/AppShell";

const initialChild = { name: "", age: "", weight: "", gender: "male" };

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState("");
  const [childForm, setChildForm] = useState(initialChild);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");
    try {
      const [currentUser, profiles] = await Promise.all([
        fetchCurrentUser().catch(() => getStoredUser()),
        fetchChildProfiles(),
      ]);
      setUser(currentUser);
      setChildren(profiles);
      const stored = getSelectedChildId();
      const nextSelected = stored && profiles.some((child) => String(child.id) === String(stored)) ? stored : profiles[0]?.id;
      if (nextSelected) {
        setSelected(String(nextSelected));
        setSelectedChildId(nextSelected);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Could not load profile data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function saveChild(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...childForm,
        age: Number(childForm.age),
        weight: childForm.weight ? Number(childForm.weight) : null,
      };
      const child = editingId ? await updateChildProfile(editingId, payload) : await createChildProfile(payload);
      setChildForm(initialChild);
      setEditingId(null);
      setChildren((current) => (editingId ? current.map((item) => (item.id === editingId ? child : item)) : [child, ...current]));
      setSelected(String(child.id));
      setSelectedChildId(child.id);
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(" ") : err?.response?.data?.message || "Could not save child profile.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(child) {
    setEditingId(child.id);
    setChildForm({
      name: child.name || "",
      age: String(child.age ?? ""),
      weight: child.weight ? String(child.weight) : "",
      gender: child.gender || "male",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setChildForm(initialChild);
  }

  async function removeChild(id) {
    await deleteChildProfile(id);
    const next = children.filter((child) => child.id !== id);
    setChildren(next);
    setSelected(next[0]?.id ? String(next[0].id) : "");
    setSelectedChildId(next[0]?.id || null);
  }

  async function logout() {
    await logoutParent();
    router.push("/login");
  }

  return (
    <AppShell>
      <PageHeader
        title="Profile"
        subtitle="Manage parent login and child profiles."
        action={<EmergencyShortcut className="px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm" />}
      />

      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <SoftCard>
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-sky-100 text-care-blue">
              <UserRound className="h-9 w-9" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">{user?.name || "Parent"}</h2>
              <p className="text-sm font-semibold text-sky-600">{user?.email || "Loading..."}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-6 w-full rounded-2xl bg-sky-50 px-5 py-4 font-extrabold text-sky-700 transition hover:bg-rose-50 hover:text-rose-600"
          >
            Logout
          </button>
        </SoftCard>

        <SoftCard>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold">{editingId ? "Edit child profile" : "Add child profile"}</h2>
            {editingId ? (
              <button onClick={cancelEdit} type="button" className="rounded-xl bg-sky-50 p-2 text-sky-500">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <form onSubmit={saveChild} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 font-semibold outline-none" placeholder="Child name" value={childForm.name} onChange={(e) => setChildForm({ ...childForm, name: e.target.value })} />
            <input className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 font-semibold outline-none" placeholder="Age" type="number" min="0" max="18" value={childForm.age} onChange={(e) => setChildForm({ ...childForm, age: e.target.value })} />
            <input className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 font-semibold outline-none" placeholder="Weight kg" type="number" step="0.1" value={childForm.weight} onChange={(e) => setChildForm({ ...childForm, weight: e.target.value })} />
            <select className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 font-semibold outline-none" value={childForm.gender} onChange={(e) => setChildForm({ ...childForm, gender: e.target.value })}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <button disabled={saving} className="rounded-2xl bg-care-blue px-5 py-4 font-extrabold text-white shadow-lg shadow-sky-200 sm:col-span-2">
              {saving ? "Saving..." : editingId ? "Update child" : "Save child"}
            </button>
          </form>
          {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</p> : null}
        </SoftCard>
      </div>

      <SoftCard className="mt-5">
        <h2 className="text-2xl font-extrabold">Child profiles</h2>
        {loading ? <p className="mt-4 text-sm font-bold text-sky-500">Loading profiles...</p> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {children.map((child) => (
            <div
              key={child.id}
              className={`rounded-2xl border p-4 shadow-sm ${String(selected) === String(child.id) ? "border-care-blue bg-sky-50" : "border-sky-100 bg-white"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelected(String(child.id));
                    setSelectedChildId(child.id);
                  }}
                  className="flex items-center gap-3 text-left"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-care-blue shadow-sm">
                    <Baby className="h-7 w-7" />
                  </span>
                  <span>
                    <span className="block font-extrabold text-sky-950">{child.name}</span>
                    <span className="block text-xs font-bold text-sky-500">
                      {child.age} yrs • {child.weight || "No"} kg • {child.gender || "not set"}
                    </span>
                  </span>
                </button>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(child)} className="rounded-xl bg-sky-50 p-2 text-care-blue">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeChild(child.id)} className="rounded-xl bg-rose-50 p-2 text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && children.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold text-sky-600">
            Add a child profile to personalize chat, symptoms, and talk mode.
          </p>
        ) : null}
      </SoftCard>
    </AppShell>
  );
}
