import AppHeader from "@/components/AppHeader";
import MobileNav from "@/components/MobileNav";
import RoleGate from "@/components/RoleGate";
import TeamInviteManager from "@/components/TeamInviteManager";
import { getCurrentAppUser } from "@/lib/roles";
import { stores } from "@/lib/mock-data";

export default async function TeamPage() {
  const user = await getCurrentAppUser();
  const store = stores.find((item) => item.id === user?.storeId);

  return (
    <RoleGate minimumRole="floormanager">
      {user ? (
        <>
          <AppHeader role={user.role} title="Team" />
          <main className="mx-auto min-h-dvh w-full max-w-5xl bg-zinc-50 px-4 pb-28 pt-5 md:pb-8">
            <section className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-bold text-zinc-950">Teamleden</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Bekijk medewerkers en genereer codes voor jouw filiaal.
              </p>
              <p className="mt-3 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                Filiaal: {store?.name || "nog niet gekoppeld"}
              </p>
            </section>

            <section className="grid gap-3">
              <article className="rounded-3xl border border-dashed border-orange-200 bg-white p-6 text-center shadow-sm">
                <h2 className="text-xl font-bold text-zinc-950">Nog geen teamleden gekoppeld</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                  Zodra medewerkers zich aanmelden met een code en aan dit filiaal gekoppeld worden,
                  verschijnen ze hier.
                </p>
              </article>
            </section>

            <TeamInviteManager store={store} />
          </main>
          <MobileNav role={user.role} />
        </>
      ) : null}
    </RoleGate>
  );
}
