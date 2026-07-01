import { currentUser } from "@clerk/nextjs/server";
import type { AppUser, UserRole } from "@/types";

export const roleLabels: Record<UserRole, string> = {
  medewerker: "Medewerker",
  floormanager: "Floormanager",
  supervisor: "Supervisor",
  owner: "Owner",
};

const roleRank: Record<UserRole, number> = {
  medewerker: 1,
  floormanager: 2,
  supervisor: 3,
  owner: 4,
};

export function isUserRole(value: unknown): value is UserRole {
  return (
    value === "medewerker" ||
    value === "floormanager" ||
    value === "supervisor" ||
    value === "owner"
  );
}

export function canAccess(userRole: UserRole, minimumRole: UserRole) {
  return roleRank[userRole] >= roleRank[minimumRole];
}

export function canSeeDashboard(role: UserRole) {
  return canAccess(role, "floormanager");
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const metadataRole = user.publicMetadata.role;
  const role = isUserRole(metadataRole) ? metadataRole : "medewerker";
  const storeId =
    typeof user.publicMetadata.storeId === "string"
      ? user.publicMetadata.storeId
      : undefined;

  return {
    id: user.id,
    clerkUserId: user.id,
    name:
      user.fullName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      "Kwantum medewerker",
    email: user.primaryEmailAddress?.emailAddress || "geen-email@kwantum.local",
    role,
    storeId,
    createdAt: new Date(user.createdAt || Date.now()).toISOString(),
  };
}
