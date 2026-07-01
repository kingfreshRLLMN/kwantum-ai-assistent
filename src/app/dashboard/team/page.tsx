import AppHeader from "@/components/AppHeader";
import MobileNav from "@/components/MobileNav";
import RoleGate from "@/components/RoleGate";
import { getCurrentAppUser } from "@/lib/roles";
import { appUsers, inviteKeys, stores } from "@/lib/mock-data";

export default async function TeamPage() {
  const user = await getCurrentAppUser();
  const teamMembers =
    user?.role === "floormanager" && user.storeId
      ? appUsers.filter((member) => member.storeId === user.storeId)
      : appUsers;

  return (
    <RoleGate minimumRole="floormanager">
      {user ? (
        <>
          <AppHeader role={user.role} title="Team" />
          <main className="mx-auto min-h-dvh w-full max-w-5xl bg-zinc-50 px-4 pb-28 pt-5 md:pb-8">
            <section className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-bold text-zinc-950">Teamleden</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Bekijk medewerkers en maak later direct invite keys aan voor jouw filiaal.
              </p>
              <button className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 text-base font-bold text-white sm:w-auto">
                Invite key genereren
              </button>
            </section>

            <section className="grid gap-3">
              {teamMembers.map((member) => {
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
                  </article>
                );
              })}
            </section>

            <section className="mt-5">
              <h2 className="mb-3 text-xl font-bold text-zinc-950">Invite keys</h2>
              <div className="grid gap-3">
                {inviteKeys.map((invite) => {
                  const store = stores.find((item) => item.id === invite.storeId);
                  return (
                    <article key={invite.id} className="rounded-3xl bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-base font-bold text-zinc-950">{invite.key}</p>
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
                          {invite.usedAt ? "Gebruikt" : "Open"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-zinc-600">{store?.name}</p>
                      <p className="mt-1 text-sm text-zinc-600">
                        Verloopt: {new Date(invite.expiresAt).toLocaleDateString("nl-NL")}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          </main>
          <MobileNav role={user.role} />
        </>
      ) : null}
    </RoleGate>
  );
}
