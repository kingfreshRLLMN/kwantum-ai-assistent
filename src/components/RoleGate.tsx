import { redirect } from "next/navigation";
import { canAccess, getCurrentAppUser } from "@/lib/roles";
import type { UserRole } from "@/types";

type RoleGateProps = {
  minimumRole: UserRole;
  children: React.ReactNode;
};

export default async function RoleGate({ minimumRole, children }: RoleGateProps) {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!canAccess(user.role, minimumRole)) {
    redirect("/chat");
  }

  return <>{children}</>;
}
