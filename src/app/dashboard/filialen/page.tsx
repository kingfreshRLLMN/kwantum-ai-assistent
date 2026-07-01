import AppHeader from "@/components/AppHeader";
import MobileNav from "@/components/MobileNav";
import RoleGate from "@/components/RoleGate";
import { getCurrentAppUser } from "@/lib/roles";
import { appUsers, stores } from "@/lib/mock-data";

export default async function FilialenPage() {
  const user = await getCurrentAppUser();

  return (
    <RoleGate minimumRole="supervisor">
      {user ? (
        <>
          <AppHeader role={user.role} title="Filialen" />
          <main className="mx-auto min-h-dvh w-full max-w-5xl bg-zinc-50 px-4 pb-28 pt-5 md:pb-8">
            <section className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-bold text-zinc-950">Filialen beheren</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Maak filialen aan, bewerk gegevens en koppel floormanagers.
              </p>
              <button className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 text-base font-bold text-white sm:w-auto">
                Filiaal aanmaken
              </button>
            </section>

            <section className="grid gap-3">
              {stores.map((store) => {
                const managers = appUsers.filter(
                  (member) => member.storeId === store.id && member.role === "floormanager",
                );
                return (
                  <article key={store.id} className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-zinc-950">{store.name}</h2>
                        <p className="text-sm text-zinc-600">
                          Nummer {store.storeNumber} - {store.region}
                        </p>
                      </div>
                      <button className="rounded-2xl border border-orange-200 px-3 py-2 text-sm font-bold text-orange-700">
                        Bewerken
                      </button>
                    </div>
                    <p className="mt-4 text-sm font-bold text-zinc-950">Floormanagers</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {managers.length > 0
                        ? managers.map((manager) => manager.name).join(", ")
                        : "Nog niemand gekoppeld"}
                    </p>
                  </article>
                );
              })}
            </section>
          </main>
          <MobileNav role={user.role} />
        </>
      ) : null}
    </RoleGate>
  );
}
