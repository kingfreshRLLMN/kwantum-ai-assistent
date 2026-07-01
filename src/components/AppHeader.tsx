import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import BrandMark from "@/components/BrandMark";
import { canSeeDashboard, roleLabels } from "@/lib/roles";
import type { UserRole } from "@/types";

type AppHeaderProps = {
  role: UserRole;
  title?: string;
};

export default function AppHeader({ role, title = "Kwantum AI Assistent" }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-5xl items-center gap-3 px-4 py-3">
        <Link href="/chat" className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <BrandMark variant="compact" />
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-zinc-950">{title}</p>
              <p className="text-xs font-medium text-orange-700">{roleLabels[role]}</p>
            </div>
          </div>
        </Link>
        {canSeeDashboard(role) ? (
          <Link
            href="/dashboard"
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-orange-200"
          >
            Dashboard
          </Link>
        ) : null}
        <UserButton />
      </div>
    </header>
  );
}
