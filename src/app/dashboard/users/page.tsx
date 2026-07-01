import AppHeader from "@/components/AppHeader";
import MobileNav from "@/components/MobileNav";
import RoleGate from "@/components/RoleGate";
import { getCurrentAppUser } from "@/lib/roles";
import { appUsers, stores } from "@/lib/mock-data";

export default async function UsersPage() {
  const user = await getCurrentAppUser();

  return (
    <RoleGate minimumRole="owner">
      {user ? (
        <>
          <AppHeader role={user.role} title="Users" />
          <main className="mx-auto min-h-dvh w-full max-w-5xl bg-zinc-50 px-4 pb-28 pt-5 md:pb-8">
            <section className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-bold text-zinc-950">Gebruikersbeheer</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Owner-only overzicht voor rollen en filiaalkoppelingen.
              </p>
            </section>

            <section className="grid gap-3">
              {appUsers.map((member) => {
                const store = stores.find((item) => item.id === member.storeId);
                return (
                  <article key={member.id} className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-zinc-950">{member.name}</h2>
                        <p className="text-sm text-zinc-600">{member.email}</p>
                      </div>
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                        {member.role}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-zinc-600">{store?.name || "Geen filiaal"}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button className="rounded-2xl border border-orange-200 px-3 py-3 text-sm font-bold text-orange-700">
                        Rol aanpassen
                      </button>
                      <button className="rounded-2xl border border-zinc-200 px-3 py-3 text-sm font-bold text-zinc-700">
                        Filiaal koppelen
                      </button>
                    </div>
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
