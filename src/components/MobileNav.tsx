import Link from "next/link";
import { canAccess } from "@/lib/roles";
import type { UserRole } from "@/types";

const navItems: Array<{ href: string; label: string; minimumRole: UserRole }> = [
  { href: "/chat", label: "Chat", minimumRole: "medewerker" },
  { href: "/dashboard/team", label: "Team", minimumRole: "floormanager" },
  { href: "/dashboard/filialen", label: "Filialen", minimumRole: "supervisor" },
  { href: "/dashboard/users", label: "Users", minimumRole: "owner" },
  { href: "/dashboard/documents", label: "Docs", minimumRole: "owner" },
];

type MobileNavProps = {
  role: UserRole;
};

export default function MobileNav({ role }: MobileNavProps) {
  const items = navItems.filter((item) => canAccess(role, item.minimumRole));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-orange-100 bg-white/95 px-3 py-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-flow-col auto-cols-fr gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="interactive-lift rounded-2xl px-3 py-3 text-center text-sm font-bold text-zinc-700 hover:bg-orange-50 hover:text-orange-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
