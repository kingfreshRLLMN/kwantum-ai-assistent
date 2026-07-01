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

function parseEnvList(value?: string) {
  return (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function isConfiguredOwner(email?: string, username?: string | null) {
  const ownerEmails = parseEnvList(process.env.OWNER_EMAILS);
  const ownerUsernames = parseEnvList(process.env.OWNER_USERNAMES);

  return (
    (!!email && ownerEmails.includes(email.toLowerCase())) ||
    (!!username && ownerUsernames.includes(username.toLowerCase()))
  );
}

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

  const metadataRole = user.publicMetadata.role || user.unsafeMetadata.role;
  const email = user.primaryEmailAddress?.emailAddress || "geen-email@kwantum.local";
  const role = isConfiguredOwner(email, user.username)
    ? "owner"
    : isUserRole(metadataRole)
      ? metadataRole
      : "medewerker";
  const storeId =
    typeof user.publicMetadata.storeId === "string"
      ? user.publicMetadata.storeId
      : typeof user.unsafeMetadata.storeId === "string"
        ? user.unsafeMetadata.storeId
      : undefined;

  return {
    id: user.id,
    clerkUserId: user.id,
    name:
      user.fullName ||
      user.username ||
      email ||
      "Kwantum medewerker",
    email,
    role,
    storeId,
    createdAt: new Date(user.createdAt || Date.now()).toISOString(),
  };
}
