"use client";

import { useMemo, useState } from "react";
import { generateStoreInviteCode } from "@/lib/invite-codes";
import type { Store } from "@/types";

const STORAGE_KEY = "kwantum-ai-generated-invites-v1";

type GeneratedInvite = {
  code: string;
  storeId: string;
  createdAt: string;
};

type TeamInviteManagerProps = {
  store?: Store;
};

function loadGeneratedInvites(storeId?: string) {
  if (!storeId || typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((invite) => invite.storeId === storeId).slice(0, 5)
      : [];
  } catch {
    return [];
  }
}

function saveGeneratedInvites(invites: GeneratedInvite[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
}

export default function TeamInviteManager({ store }: TeamInviteManagerProps) {
  const [generatedInvites, setGeneratedInvites] = useState<GeneratedInvite[]>(() =>
    loadGeneratedInvites(store?.id),
  );
  const [copiedCode, setCopiedCode] = useState("");

  const latestInvite = useMemo(() => generatedInvites[0], [generatedInvites]);

  function handleGenerate() {
    if (!store) {
      return;
    }

    const code = generateStoreInviteCode(store.id);
    const nextInvite = {
      code,
      storeId: store.id,
      createdAt: new Date().toISOString(),
    };
    const allInvites = [nextInvite, ...generatedInvites].slice(0, 5);

    saveGeneratedInvites(allInvites);
    setGeneratedInvites(allInvites);
    setCopiedCode("");
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
  }

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-xl font-bold text-zinc-950">Invite key</h2>
      <article className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-zinc-600">
          Genereer een 6-cijferige code voor nieuwe medewerkers. Wie deze code gebruikt, wordt
          automatisch gekoppeld aan {store?.name || "het filiaal van de floormanager"}.
        </p>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!store}
          className="interactive-lift mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 text-base font-bold text-white shadow-sm shadow-orange-200 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
        >
          Invite key genereren
        </button>

        {!store ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Koppel eerst jezelf aan een filiaal via Profiel.
          </p>
        ) : null}

        {latestInvite ? (
          <div className="mt-4 rounded-2xl bg-orange-50 p-4">
            <p className="text-xs font-bold uppercase text-orange-700">Nieuwe code</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-[0.22em] text-zinc-950">
              {latestInvite.code}
            </p>
            <button
              type="button"
              onClick={() => copyCode(latestInvite.code)}
              className="interactive-lift mt-3 rounded-2xl border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-orange-700"
            >
              {copiedCode === latestInvite.code ? "Gekopieerd" : "Code kopieren"}
            </button>
          </div>
        ) : null}

        {generatedInvites.length > 1 ? (
          <div className="mt-4 grid gap-2">
            <p className="text-sm font-bold text-zinc-950">Recent gegenereerd</p>
            {generatedInvites.slice(1).map((invite) => (
              <div
                key={`${invite.code}-${invite.createdAt}`}
                className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3"
              >
                <span className="font-mono text-base font-bold tracking-[0.16em] text-zinc-950">
                  {invite.code}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(invite.code)}
                  className="text-sm font-bold text-orange-700"
                >
                  Kopieer
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </article>
    </section>
  );
}
