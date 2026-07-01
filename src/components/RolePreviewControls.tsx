"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { UserRole } from "@/types";

const previewRoles: UserRole[] = ["medewerker", "floormanager", "supervisor", "owner"];
const previewRoleLabels: Record<UserRole, string> = {
  medewerker: "Medewerker",
  floormanager: "Floormanager",
  supervisor: "Supervisor",
  owner: "Owner",
};

type RolePreviewControlsProps = {
  currentRole: UserRole;
  previewRole?: UserRole;
};

export default function RolePreviewControls({
  currentRole,
  previewRole,
}: RolePreviewControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setPreview(role: UserRole) {
    startTransition(async () => {
      await fetch("/api/role-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      router.refresh();
    });
  }

  function clearPreview() {
    startTransition(async () => {
      await fetch("/api/role-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: null }),
      });
      router.refresh();
    });
  }

  return (
    <section className="motion-soft motion-soft-delay-2 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-orange-600">Owner preview</p>
      <h2 className="mt-1 text-xl font-bold text-zinc-950">Bekijken als</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Preview tijdelijk hoe de app eruitziet voor een rol. Dit past je echte rol niet aan; jouw
        account blijft owner.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {previewRoles.map((role) => {
          const isActive = currentRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setPreview(role)}
              disabled={isPending}
              className={`interactive-lift rounded-2xl px-3 py-3 text-sm font-bold ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                  : "border border-orange-100 bg-white text-orange-700"
              }`}
            >
              {previewRoleLabels[role]}
            </button>
          );
        })}
      </div>

      {previewRole ? (
        <button
          type="button"
          onClick={clearPreview}
          disabled={isPending}
          className="interactive-lift mt-4 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700 sm:w-auto"
        >
          Preview uitzetten
        </button>
      ) : null}
    </section>
  );
}
