"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

const publicPaths = new Set(["/", "/login", "/register", "/forgot-password", "/reset-password", "/emergency"]);

export function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token && !publicPaths.has(pathname)) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready && !publicPaths.has(pathname)) {
    return (
      <main className="grid min-h-screen place-items-center bg-care-bg px-6 text-center">
        <div className="rounded-[28px] bg-white px-8 py-6 text-sm font-extrabold text-sky-700 shadow-xl shadow-sky-200/60">
          Checking your Zoctor session...
        </div>
      </main>
    );
  }

  return children;
}
