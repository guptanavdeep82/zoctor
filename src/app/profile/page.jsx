"use client";

import { UserRound } from "lucide-react";
import { AppShell, EmergencyShortcut, PageHeader, SoftCard } from "@/components/AppShell";

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHeader
        title="Profile"
        subtitle="Parent settings and saved child care notes."
        action={<EmergencyShortcut className="px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm" />}
      />
      <SoftCard className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sky-100 text-care-blue">
          <UserRound className="h-10 w-10" />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold">Mom's Care Space</h2>
        <p className="mt-2 text-sm font-medium text-sky-600">
          Token-based API calls will use the bearer token stored in localStorage.
        </p>
      </SoftCard>
    </AppShell>
  );
}
