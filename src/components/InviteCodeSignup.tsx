"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { inviteKeys, stores } from "@/lib/mock-data";

export default function InviteCodeSignup() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const normalizedCode = code.replace(/\D/g, "").slice(0, 6);
  const invite = useMemo(
    () => inviteKeys.find((item) => item.key.toUpperCase() === normalizedCode),
    [normalizedCode],
  );
  const store = invite ? stores.find((item) => item.id === invite.storeId) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!normalizedCode || !invite || invite.usedAt) {
      setStatus("invalid");
      return;
    }

    setStatus("valid");
  }

  if (status === "valid" && invite) {
    return (
      <section className="motion-soft motion-soft-delay-1 w-full rounded-2xl border border-white/80 bg-white/90 p-6 shadow-lg shadow-orange-200/30 backdrop-blur">
        <div className="mb-4 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-900">
          <p className="font-bold">Code goedgekeurd</p>
          <p className="mt-1">
            Rol: {invite.role} {store ? `- ${store.name}` : ""}
          </p>
        </div>

        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          forceRedirectUrl="/chat"
          unsafeMetadata={{
            inviteKey: invite.key,
            role: invite.role,
            storeId: invite.storeId,
          }}
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              cardBox: "mx-auto w-full overflow-hidden rounded-2xl shadow-none",
              card: "w-full px-0 py-0 shadow-none",
              header: "hidden",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary:
                "h-12 rounded-xl bg-zinc-900 text-base font-bold hover:bg-orange-600",
              formFieldInput:
                "h-12 rounded-xl border-zinc-200 text-base focus:border-orange-500 focus:ring-orange-500",
              formFieldLabel: "text-sm font-medium text-zinc-800",
              footer: "hidden",
              footerAction: "hidden",
              footerPages: "hidden",
              footerPageLink: "hidden",
            },
          }}
        />

        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setCode("");
          }}
          className="interactive-lift mt-4 w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-center text-sm font-bold text-orange-700 hover:bg-orange-50"
        >
          Andere code gebruiken
        </button>
      </section>
    );
  }

  return (
    <section className="motion-soft motion-soft-delay-1 w-full rounded-2xl border border-white/80 bg-white/90 p-6 shadow-lg shadow-orange-200/30 backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="invite-code" className="text-sm font-semibold text-zinc-900">
            Aanmeldcode
          </label>
          <input
            id="invite-code"
            value={code}
            onChange={(event) => {
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
              setStatus("idle");
            }}
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]*"
            placeholder="Bijv. 104082"
            className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-center text-xl font-bold tracking-[0.28em] text-zinc-950 outline-none ring-orange-500 transition focus:border-orange-500 focus:ring-2"
          />
        </div>

        {status === "invalid" ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Deze code is niet geldig of is al gebruikt.
          </p>
        ) : null}

        <button
          type="submit"
          className="interactive-lift h-12 w-full rounded-xl bg-zinc-900 px-5 text-base font-bold text-white shadow-sm hover:bg-orange-600"
        >
          Aanmelden
        </button>
      </form>

      <Link
        href="/sign-in"
        className="interactive-lift mt-4 block rounded-xl border border-orange-100 bg-white px-4 py-3 text-center text-sm font-bold text-orange-700 hover:bg-orange-50"
      >
        Ik heb al een account
      </Link>
    </section>
  );
}
