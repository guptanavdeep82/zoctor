"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, Home, Heart, LogOut, MessageCircle, Mic, Stethoscope, UserRound } from "lucide-react";
import { fetchChildProfiles, getSelectedChildId, getStoredUser, logoutParent, setSelectedChildId } from "@/lib/api";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/tips", label: "Favorites", icon: Heart },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const topNavItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/talk", label: "Talk", icon: Mic },
  { href: "/symptoms", label: "Symptoms", icon: Stethoscope },
  { href: "/tips", label: "Tips", icon: Heart },
];

export function AppShell({ children, className = "" }) {
  return (
    <main className={`soft-pattern min-h-screen bg-care-bg px-4 pb-28 pt-5 text-sky-950 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6 ${className}`}>
      <MobileBrandBar />
      <div className="mx-auto flex w-full max-w-7xl gap-6">
        <DesktopSidebar />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="min-h-[calc(100vh-8rem)] w-full min-w-0 lg:flex-1"
        >
          {children}
        </motion.div>
      </div>
      <BottomNav />
    </main>
  );
}

export function MobileBrandBar() {
  return (
    <Link
      href="/home"
      className="mb-4 flex items-center gap-3 rounded-[24px] border border-white/80 bg-white/80 p-3 shadow-lg shadow-sky-200/50 backdrop-blur lg:hidden"
    >
      <span className="grid h-14 w-20 place-items-center overflow-hidden rounded-2xl bg-white/70 p-1">
        <img src="/zoctor-logo.png" alt="Zoctor logo" className="h-full w-full object-contain" />
      </span>
      <span>
        <span className="block text-xl font-extrabold leading-tight text-sky-950">Zoctor</span>
        <span className="block text-xs font-bold text-care-blue">Children Health AI</span>
      </span>
    </Link>
  );
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");

  useEffect(() => {
    setUser(getStoredUser());
    setSelectedChild(getSelectedChildId() || "");
    if (typeof window !== "undefined" && window.localStorage.getItem("token")) {
      fetchChildProfiles()
        .then((profiles) => {
          setChildren(profiles);
          if (!getSelectedChildId() && profiles[0]?.id) {
            setSelectedChildId(profiles[0].id);
            setSelectedChild(String(profiles[0].id));
          }
        })
        .catch(() => setChildren([]));
    }
  }, [pathname]);

  async function onLogout() {
    await logoutParent();
    router.push("/login");
  }

  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col rounded-[32px] border border-white/80 bg-white/80 p-4 shadow-2xl shadow-sky-200/55 backdrop-blur lg:flex">
      <Link href="/home" className="flex items-center gap-3 rounded-3xl bg-sky-50 p-3">
        <span className="grid h-16 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/70 p-1 shadow-lg shadow-sky-200">
          <img src="/zoctor-logo.png" alt="Zoctor logo" className="h-full w-full object-contain" />
        </span>
        <span>
          <span className="block text-xl font-extrabold leading-tight text-sky-950">Zoctor</span>
          <span className="block text-xs font-bold text-care-blue">Children Health AI</span>
        </span>
      </Link>

      <div className="mt-4 rounded-3xl bg-gradient-to-br from-sky-100 to-white p-4 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-care-blue shadow-sm">
            <UserRound className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-sky-950">Mom's Care Space</p>
            <p className="text-xs font-bold text-sky-500">{user?.name || "Ready to help today"}</p>
          </div>
        </div>
        {children.length > 0 ? (
          <select
            value={selectedChild}
            onChange={(event) => {
              setSelectedChild(event.target.value);
              setSelectedChildId(event.target.value);
            }}
            className="mt-3 w-full rounded-2xl border border-sky-100 bg-white px-3 py-3 text-xs font-extrabold text-sky-700 outline-none"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}, {child.age} yrs
              </option>
            ))}
          </select>
        ) : (
          <Link href="/profile" className="mt-3 block rounded-2xl bg-white px-3 py-3 text-center text-xs font-extrabold text-care-blue">
            Add child profile
          </Link>
        )}
      </div>

      <nav className="mt-5 grid gap-2">
        {topNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/home" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                active
                  ? "bg-care-blue text-white shadow-lg shadow-sky-200"
                  : "bg-white/70 text-sky-500 hover:bg-sky-50 hover:text-sky-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-3">
        <div className="rounded-3xl bg-sky-50 p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-care-blue">Care status</p>
          <p className="mt-2 text-sm font-extrabold text-sky-950">General guidance mode</p>
          <p className="mt-1 text-xs font-semibold text-sky-600">
            Emergency signs are checked during chat, talk, and symptom flows.
          </p>
        </div>
        <EmergencyShortcut className="w-full py-4" />
        <button
          onClick={onLogout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-sky-500 shadow-sm transition hover:text-rose-500"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function EmergencyShortcut({ className = "" }) {
  return (
    <Link
      href="/emergency"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-600 ${className}`}
    >
      <AlertTriangle className="h-4 w-4" />
      Emergency
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-[1.6rem] border border-white/80 bg-white/90 px-3 py-2 shadow-2xl shadow-sky-200/80 backdrop-blur lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/home" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition sm:flex-row sm:justify-center sm:text-sm ${
                active ? "bg-sky-100 text-care-blue" : "text-sky-300"
              }`}
              aria-label={label}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 3 : 2.4} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <header className="mb-5 flex items-center justify-between gap-3 lg:mb-8">
      <div>
        <p className="text-sm font-semibold text-care-blue">Zoctor</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-sky-950 lg:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-sky-600 lg:text-base">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function SoftCard({ children, className = "" }) {
  return (
    <section className={`rounded-[28px] bg-white/90 p-5 shadow-xl shadow-sky-200/60 lg:p-7 ${className}`}>
      {children}
    </section>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-2xl border border-sky-100 bg-white/75 px-4 py-3 text-center text-xs font-medium text-sky-700 shadow-sm">
      This is general health guidance only. Always consult a doctor.
    </p>
  );
}

export function TrustStrip() {
  const items = ["General guidance only", "Emergency signs checked", "Consult doctor when unsure"];

  return (
    <div className="grid gap-3 rounded-[24px] border border-white/80 bg-white/75 p-3 text-center shadow-lg shadow-sky-200/40 backdrop-blur sm:grid-cols-3">
      {items.map((item) => (
        <div key={item} className="rounded-2xl bg-sky-50 px-3 py-3 text-xs font-extrabold text-sky-700">
          {item}
        </div>
      ))}
    </div>
  );
}
