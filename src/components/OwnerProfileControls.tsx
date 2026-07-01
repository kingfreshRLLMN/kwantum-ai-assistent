"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { Store, UserRole } from "@/types";

const editableRoles: UserRole[] = ["medewerker", "floormanager", "supervisor", "owner"];
const editableRoleLabels: Record<UserRole, string> = {
  medewerker: "Medewerker",
  floormanager: "Floormanager",
  supervisor: "Supervisor",
  owner: "Owner",
};

type OwnerProfileControlsProps = {
  currentRole: UserRole;
  currentStoreId?: string;
  stores: Store[];
};

export default function OwnerProfileControls({
  currentRole,
  currentStoreId,
  stores,
}: OwnerProfileControlsProps) {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [role, setRole] = useState<UserRole>(currentRole);
  const [storeId, setStoreId] = useState(currentStoreId || "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  if (!isLoaded) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setStatus("saving");

    try {
      await user.updateMetadata({
        unsafeMetadata: {
          role,
          storeId: storeId || null,
        },
      });
      await user.reload();
      router.refresh();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="motion-soft motion-soft-delay-2 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-orange-600">Owner beheer</p>
      <h2 className="mt-1 text-xl font-bold text-zinc-950">Eigen koppeling aanpassen</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Als owner mag je je eigen rol en filiaal/team corrigeren. Dit wordt nu opgeslagen in
        Clerk metadata; later verhuist dit naar de database.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <div>
          <label htmlFor="profile-role" className="text-sm font-semibold text-zinc-900">
            Rol
          </label>
          <select
            id="profile-role"
            value={role}
            onChange={(event) => {
              setRole(event.target.value as UserRole);
              setStatus("idle");
            }}
            className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-base font-semibold text-zinc-950 outline-none ring-orange-500 transition focus:border-orange-400 focus:ring-2"
          >
            {editableRoles.map((item) => (
              <option key={item} value={item}>
                {editableRoleLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="profile-store" className="text-sm font-semibold text-zinc-900">
            Filiaal / team
          </label>
          <select
            id="profile-store"
            value={storeId}
            onChange={(event) => {
              setStoreId(event.target.value);
              setStatus("idle");
            }}
            className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-base font-semibold text-zinc-950 outline-none ring-orange-500 transition focus:border-orange-400 focus:ring-2"
          >
            <option value="">Geen filiaal</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {status === "saved" ? (
          <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            Koppeling opgeslagen.
          </p>
        ) : null}

        {status === "error" ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Opslaan lukt niet. Probeer opnieuw of controleer Clerk permissies.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "saving"}
          className="interactive-lift h-12 w-full rounded-2xl bg-zinc-900 px-5 text-base font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
        >
          {status === "saving" ? "Opslaan..." : "Koppeling opslaan"}
        </button>
      </form>
    </section>
  );
}
