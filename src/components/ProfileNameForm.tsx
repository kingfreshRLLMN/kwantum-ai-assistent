"use client";

import { FormEvent, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ProfileNameForm() {
  const { isLoaded, user } = useUser();
  const initialName = useMemo(() => {
    if (!user) {
      return "";
    }

    return user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ");
  }, [user]);
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  if (!isLoaded) {
    return (
      <div className="rounded-3xl bg-white p-5 text-sm font-medium text-zinc-500 shadow-sm">
        Profiel laden...
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const cleanName = name.trim().replace(/\s+/g, " ");
    if (!cleanName) {
      setStatus("error");
      return;
    }

    const [firstName, ...lastNameParts] = cleanName.split(" ");
    setStatus("saving");

    try {
      await user.update({
        firstName,
        lastName: lastNameParts.join(" ") || undefined,
      });
      await user.reload();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="motion-soft rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-950">Profiel bewerken</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Vul hier je naam in. Je rol, filiaal en team worden via je aanmeldcode gekoppeld.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="profile-name" className="text-sm font-semibold text-zinc-900">
            Naam
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setStatus("idle");
            }}
            placeholder="Bijv. Kenneth Blanken"
            className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-base text-zinc-950 outline-none ring-orange-500 transition focus:border-orange-400 focus:ring-2"
          />
        </div>

        {status === "saved" ? (
          <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            Je naam is opgeslagen.
          </p>
        ) : null}

        {status === "error" ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Opslaan lukt niet. Controleer in Clerk of voornaam/achternaam aangepast mogen worden.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "saving"}
          className="interactive-lift h-12 w-full rounded-2xl bg-orange-500 px-5 text-base font-bold text-white shadow-sm shadow-orange-200 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
        >
          {status === "saving" ? "Opslaan..." : "Naam opslaan"}
        </button>
      </form>
    </section>
  );
}
