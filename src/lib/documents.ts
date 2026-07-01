import { documents } from "@/lib/mock-data";
import type { Document } from "@/types";

export async function listDocuments(): Promise<Document[]> {
  return documents;
}

export async function uploadDocument(file: File): Promise<Document> {
  return {
    id: `doc-${Date.now()}`,
    name: file.name,
    url: "#",
    uploadedBy: "Huidige gebruiker",
    active: false,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteDocument(documentId: string) {
  return { success: true, documentId };
}
