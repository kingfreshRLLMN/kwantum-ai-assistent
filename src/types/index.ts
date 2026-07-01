export type UserRole = "medewerker" | "floormanager" | "supervisor" | "owner";

export interface AppUser {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  storeNumber: string;
  region: string;
  createdAt: string;
}

export interface InviteKey {
  id: string;
  key: string;
  role: UserRole;
  storeId: string;
  createdBy: string;
  expiresAt: string;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  active: boolean;
  createdAt: string;
}
