import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import MobileNav from "@/components/MobileNav";
import OwnerProfileControls from "@/components/OwnerProfileControls";
import ProfileNameForm from "@/components/ProfileNameForm";
import { stores } from "@/lib/mock-data";
import { getCurrentAppUser, roleLabels } from "@/lib/roles";

export default async function ProfilePage() {
  const appUser = await getCurrentAppUser();
  const clerkUser = await currentUser();

  if (!appUser || !clerkUser) {
    redirect("/sign-in");
  }

  const store = stores.find((item) => item.id === appUser.storeId);
  const inviteKey =
    typeof clerkUser.publicMetadata.inviteKey === "string"
      ? clerkUser.publicMetadata.inviteKey
      : typeof clerkUser.unsafeMetadata.inviteKey === "string"
        ? clerkUser.unsafeMetadata.inviteKey
        : undefined;

  return (
    <>
      <AppHeader role={appUser.role} title="Profiel" />
      <main className="mx-auto min-h-dvh w-full max-w-5xl bg-zinc-50 px-4 pb-28 pt-5 md:pb-8">
        <section className="motion-soft mb-4 rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-orange-600">Jouw account</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-950">{appUser.name}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{appUser.email}</p>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <ProfileNameForm />

          <section className="motion-soft motion-soft-delay-1 rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-950">Koppeling</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Deze gegevens komen normaal uit de aanmeldcode. Later wordt dit vanuit de database
              definitief opgeslagen.
            </p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-xs font-bold uppercase text-orange-700">Rol</p>
                <p className="mt-1 text-base font-bold text-zinc-950">{roleLabels[appUser.role]}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">Filiaal / team</p>
                <p className="mt-1 text-base font-bold text-zinc-950">
                  {store?.name || "Nog niet gekoppeld"}
                </p>
                {store ? (
                  <p className="mt-1 text-sm text-zinc-600">
                    Nummer {store.storeNumber} - {store.region}
                  </p>
                ) : null}
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">Aanmeldcode</p>
                <p className="mt-1 font-mono text-base font-bold text-zinc-950">
                  {inviteKey || "Niet bekend"}
                </p>
              </div>
            </div>

            <Link
              href="/chat"
              className="interactive-lift mt-4 inline-flex rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-orange-700 hover:bg-orange-50"
            >
              Terug naar chat
            </Link>
          </section>
        </div>

        {appUser.role === "owner" ? (
          <div className="mt-4">
            <OwnerProfileControls
              currentRole={appUser.role}
              currentStoreId={appUser.storeId}
              stores={stores}
            />
          </div>
        ) : null}
      </main>
      <MobileNav role={appUser.role} />
    </>
  );
}
