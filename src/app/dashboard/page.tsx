import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import AppHeader from "@/components/AppHeader";
import MobileNav from "@/components/MobileNav";
import { canAccess, getCurrentAppUser } from "@/lib/roles";

export default async function DashboardPage() {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!canAccess(user.actualRole, "floormanager")) {
    redirect("/chat");
  }

  const cards = [
    {
      href: "/dashboard/team",
      title: "Team",
      text: "Bekijk teamleden en genereer invite keys.",
      show: canAccess(user.role, "floormanager"),
    },
    {
      href: "/dashboard/filialen",
      title: "Filialen",
      text: "Beheer filialen en koppel floormanagers.",
      show: canAccess(user.role, "supervisor"),
    },
    {
      href: "/dashboard/users",
      title: "Users",
      text: "Pas rollen aan en koppel gebruikers aan filialen.",
      show: canAccess(user.role, "owner"),
    },
    {
      href: "/dashboard/documents",
      title: "Documents",
      text: "Upload en beheer kennisdocumenten.",
      show: canAccess(user.role, "owner"),
    },
  ].filter((card) => card.show);

  return (
    <>
      <AppHeader role={user.role} title="Dashboard" />
      <main className="mx-auto min-h-dvh w-full max-w-5xl bg-zinc-50 px-4 pb-28 pt-5 md:pb-8">
        <section className="motion-soft mb-5 rounded-3xl bg-white p-5 shadow-sm">
          <Image
            src="/brand/logo_kwantum.png"
            alt="Kwantum"
            width={260}
            height={120}
            className="mb-4 h-8 w-auto"
            priority
          />
          <p className="text-sm font-bold text-orange-600">Welkom terug</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-950">{user.name}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Kies een onderdeel om beheer voor jouw rol te openen.
          </p>
          <Link
            href="/profile"
            className="interactive-lift mt-4 inline-flex rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 hover:bg-orange-100"
          >
            Profiel bewerken
          </Link>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="interactive-lift motion-soft motion-soft-delay-1 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm hover:border-orange-300 hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-zinc-950">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{card.text}</p>
            </Link>
          ))}
        </section>
      </main>
      <MobileNav role={user.role} />
    </>
  );
}
