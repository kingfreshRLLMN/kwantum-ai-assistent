import AppHeader from "@/components/AppHeader";
import MobileNav from "@/components/MobileNav";
import RoleGate from "@/components/RoleGate";
import { listDocuments } from "@/lib/documents";
import { getCurrentAppUser } from "@/lib/roles";

export default async function DocumentsPage() {
  const user = await getCurrentAppUser();
  const documents = await listDocuments();

  return (
    <RoleGate minimumRole="owner">
      {user ? (
        <>
          <AppHeader role={user.role} title="Documents" />
          <main className="mx-auto min-h-dvh w-full max-w-5xl bg-zinc-50 px-4 pb-28 pt-5 md:pb-8">
            <section className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-bold text-zinc-950">Documentbeheer</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Uploads gaan later naar Vercel Blob. AI-verwerking is nu nog een placeholder.
              </p>
              <button className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 text-base font-bold text-white sm:w-auto">
                Document uploaden
              </button>
            </section>

            <section className="grid gap-3">
              {documents.map((document) => (
                <article key={document.id} className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words text-lg font-bold text-zinc-950">
                        {document.name}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-600">
                        Geupload door {document.uploadedBy}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        document.active
                          ? "bg-green-50 text-green-700"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {document.active ? "Actief" : "Inactief"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600">
                    Upload datum: {new Date(document.createdAt).toLocaleDateString("nl-NL")}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">AI-verwerking: placeholder</p>
                  <button className="mt-4 w-full rounded-2xl border border-red-200 px-3 py-3 text-sm font-bold text-red-700 sm:w-auto">
                    Verwijderen
                  </button>
                </article>
              ))}
            </section>
          </main>
          <MobileNav role={user.role} />
        </>
      ) : null}
    </RoleGate>
  );
}
