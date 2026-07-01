import { inviteKeys, stores } from "@/lib/mock-data";
import type { InviteKey } from "@/types";

export function generateStoreInviteCode(storeId: string) {
  const store = stores.find((item) => item.id === storeId);
  const prefix = store?.invitePrefix || "00";
  const suffix = Math.floor(1000 + Math.random() * 9000).toString();

  return `${prefix}${suffix}`;
}

export function resolveInviteCode(code: string): InviteKey | null {
  const normalizedCode = code.replace(/\D/g, "").slice(0, 6);
  const directInvite = inviteKeys.find((item) => item.key === normalizedCode);

  if (directInvite && !directInvite.usedAt) {
    return directInvite;
  }

  if (normalizedCode.length !== 6) {
    return null;
  }

  const prefix = normalizedCode.slice(0, 2);
  const store = stores.find((item) => item.invitePrefix === prefix);

  if (!store || store.id === "store-hq") {
    return null;
  }

  return {
    id: `generated-${normalizedCode}`,
    key: normalizedCode,
    role: "medewerker",
    storeId: store.id,
    createdBy: "floormanager",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    createdAt: new Date().toISOString(),
  };
}
