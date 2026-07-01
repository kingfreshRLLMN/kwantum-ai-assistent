import type { AppUser, Document, InviteKey, Store } from "@/types";

export const stores: Store[] = [
  {
    id: "store-hq",
    name: "Kwantum Hoofdkantoor",
    storeNumber: "HQ",
    region: "Landelijk",
    createdAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "store-rotterdam",
    name: "Kwantum Rotterdam Centrum",
    storeNumber: "010",
    region: "Zuid-Holland",
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "store-utrecht",
    name: "Kwantum Utrecht Woonboulevard",
    storeNumber: "030",
    region: "Midden-Nederland",
    createdAt: "2026-06-03T09:00:00.000Z",
  },
  {
    id: "store-eindhoven",
    name: "Kwantum Eindhoven Noord",
    storeNumber: "040",
    region: "Brabant",
    createdAt: "2026-06-05T09:00:00.000Z",
  },
];

export const appUsers: AppUser[] = [
  {
    id: "user-1",
    clerkUserId: "mock-clerk-1",
    name: "Sanne de Vries",
    email: "sanne@kwantum.local",
    role: "floormanager",
    storeId: "store-rotterdam",
    createdAt: "2026-06-10T10:00:00.000Z",
  },
  {
    id: "user-2",
    clerkUserId: "mock-clerk-2",
    name: "Milan Jansen",
    email: "milan@kwantum.local",
    role: "medewerker",
    storeId: "store-rotterdam",
    createdAt: "2026-06-11T10:00:00.000Z",
  },
  {
    id: "user-3",
    clerkUserId: "mock-clerk-3",
    name: "Noor Bakker",
    email: "noor@kwantum.local",
    role: "supervisor",
    storeId: "store-utrecht",
    createdAt: "2026-06-12T10:00:00.000Z",
  },
];

export const inviteKeys: InviteKey[] = [
  {
    id: "invite-owner-kingfresh",
    key: "951995",
    role: "owner",
    storeId: "store-hq",
    createdBy: "system",
    expiresAt: "2027-07-01T10:00:00.000Z",
    createdAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "invite-1",
    key: "104082",
    role: "medewerker",
    storeId: "store-rotterdam",
    createdBy: "user-1",
    expiresAt: "2026-08-01T10:00:00.000Z",
    createdAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "invite-2",
    key: "303949",
    role: "medewerker",
    storeId: "store-utrecht",
    createdBy: "user-3",
    expiresAt: "2026-08-01T10:00:00.000Z",
    usedBy: "user-2",
    usedAt: "2026-07-01T12:00:00.000Z",
    createdAt: "2026-06-29T10:00:00.000Z",
  },
];

export const documents: Document[] = [
  {
    id: "doc-1",
    name: "Retourbeleid winkelvloer.pdf",
    url: "#",
    uploadedBy: "Owner",
    active: true,
    createdAt: "2026-06-25T10:00:00.000Z",
  },
  {
    id: "doc-2",
    name: "Productkennis raamdecoratie.pdf",
    url: "#",
    uploadedBy: "Owner",
    active: false,
    createdAt: "2026-06-20T10:00:00.000Z",
  },
];
