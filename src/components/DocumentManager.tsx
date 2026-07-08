"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import type { Document } from "@/types";

const STORAGE_KEY = "kwantum-ai-documents-v1";

type StoredDocument = Document & {
  kind: "mock" | "photo" | "pdf";
};

type UploadResponse = {
  document?: {
    id: string;
    name: string;
    createdAt: string;
  };
  error?: string;
};

type DocumentManagerProps = {
  initialDocuments: Document[];
  uploaderName: string;
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadStoredDocuments(): StoredDocument[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredDocuments(documents: StoredDocument[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export default function DocumentManager({
  initialDocuments,
  uploaderName,
}: DocumentManagerProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mockDocuments = useMemo(
    () => initialDocuments.map((document) => ({ ...document, kind: "mock" as const })),
    [initialDocuments],
  );
  const [storedDocuments, setStoredDocuments] = useState<StoredDocument[]>(() =>
    typeof window === "undefined" ? [] : loadStoredDocuments(),
  );
  const documents = [...storedDocuments, ...mockDocuments];
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statusText, setStatusText] = useState("");

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    setStatus("saving");
    setStatusText("Upload verwerken...");

    try {
      const newDocuments = await Promise.all(
        files.map(async (file) => {
          if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const response = await fetch("/api/documents/upload", {
              method: "POST",
              body: uploadFormData,
            });
            const result = (await response.json()) as UploadResponse;

            if (!response.ok || !result.document) {
              throw new Error(result.error || "PDF uploaden is niet gelukt.");
            }

            return {
              id: result.document.id,
              name: result.document.name,
              url: "#",
              uploadedBy: uploaderName,
              active: true,
              createdAt: result.document.createdAt,
              kind: "pdf" as const,
            };
          }

          const url = await readFileAsDataUrl(file);
          return {
            id: `photo-${Date.now()}-${crypto.randomUUID()}`,
            name: file.name || `Foto ${new Date().toLocaleDateString("nl-NL")}`,
            url,
            uploadedBy: uploaderName,
            active: true,
            createdAt: new Date().toISOString(),
            kind: "photo" as const,
          };
        }),
      );

      const existingStored = loadStoredDocuments();
      const nextStored = [...newDocuments, ...existingStored];
      saveStoredDocuments(nextStored);
      setStoredDocuments(nextStored);
      setStatus("saved");
      setStatusText(
        newDocuments.some((document) => document.kind === "pdf")
          ? "PDF opgeslagen in de AI-kennis en beschikbaar voor de chat."
          : "Upload opgeslagen en lokaal onthouden.",
      );
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Upload opslaan is niet gelukt.");
      setStatus("error");
    } finally {
      event.target.value = "";
    }
  }

  async function deleteDocument(document: StoredDocument) {
    setStatus("saving");
    setStatusText("Document verwijderen...");

    if (document.kind === "pdf") {
      await fetch("/api/documents/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: document.id }),
      });
    }

    const stored = loadStoredDocuments().filter((item) => item.id !== document.id);
    saveStoredDocuments(stored);
    setStoredDocuments(stored);
    setStatus("saved");
    setStatusText(
      document.kind === "pdf"
        ? "PDF verwijderd uit de AI-kennis."
        : "Document verwijderd uit dit overzicht.",
    );
  }

  return (
    <>
      <section className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-950">Documentbeheer</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Upload PDF&apos;s met Kwantum-informatie zodat de AI die kennis kan gebruiken voor
          iedereen. Foto&apos;s worden nu nog lokaal onthouden.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="interactive-lift h-12 rounded-2xl bg-orange-500 px-4 text-base font-bold text-white shadow-sm shadow-orange-200"
          >
            Camera openen
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="interactive-lift h-12 rounded-2xl border border-orange-200 bg-white px-4 text-base font-bold text-orange-700"
          >
            Bestand uploaden
          </button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFiles}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          multiple
          onChange={handleFiles}
          className="hidden"
        />

        {status === "saving" ? (
          <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            {statusText || "Upload opslaan..."}
          </p>
        ) : null}
        {status === "saved" ? (
          <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {statusText || "Upload opgeslagen."}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {statusText || "Upload opslaan is niet gelukt. Probeer een kleinere foto of bestand."}
          </p>
        ) : null}
      </section>

      <section className="grid gap-3">
        {documents.map((document) => (
          <article key={document.id} className="rounded-3xl bg-white p-5 shadow-sm">
            {document.url.startsWith("data:image/") ? (
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
                <Image src={document.url} alt={document.name} fill className="object-cover" />
              </div>
            ) : null}

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="break-words text-lg font-bold text-zinc-950">{document.name}</h2>
                <p className="mt-1 text-sm text-zinc-600">Geupload door {document.uploadedBy}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  document.active ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {document.active ? "Actief" : "Inactief"}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600">
              Upload datum: {new Date(document.createdAt).toLocaleDateString("nl-NL")}
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              AI-verwerking:{" "}
              {document.kind === "pdf"
                ? "beschikbaar voor de chat"
                : document.kind === "photo"
                  ? "klaar voor latere verwerking"
                  : "placeholder"}
            </p>

            {document.kind === "photo" || document.kind === "pdf" ? (
              <button
                type="button"
                onClick={() => deleteDocument(document)}
                className="interactive-lift mt-4 w-full rounded-2xl border border-red-200 px-3 py-3 text-sm font-bold text-red-700 sm:w-auto"
              >
                Verwijderen
              </button>
            ) : (
              <button
                type="button"
                className="mt-4 w-full rounded-2xl border border-zinc-200 px-3 py-3 text-sm font-bold text-zinc-400 sm:w-auto"
              >
                Voorbeelddata
              </button>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
