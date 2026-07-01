import AppHeader from "@/components/AppHeader";
import MobileNav from "@/components/MobileNav";
import RoleGate from "@/components/RoleGate";
import { getCurrentAppUser } from "@/lib/roles";

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

            <section className="rounded-3xl border border-dashed border-orange-200 bg-white p-6 text-center shadow-sm">
              <h2 className="text-xl font-bold text-zinc-950">Nog geen gebruikers gekoppeld</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                Zodra echte medewerkers via Clerk en de database worden gekoppeld, verschijnen ze
                hier. Voor nu zijn de voorbeeldgebruikers weggehaald.
              </p>
            </section>
          </main>
          <MobileNav role={user.role} />
        </>
      ) : null}
    </RoleGate>
  );
}
