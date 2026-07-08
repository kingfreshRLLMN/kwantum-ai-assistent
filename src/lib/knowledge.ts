import { documents } from "@/lib/mock-data";

export type KnowledgeItem = {
  id: string;
  title: string;
  content: string;
};

const baseKnowledge: KnowledgeItem[] = [
  {
    id: "app-purpose",
    title: "Kwantum AI Assistent",
    content:
      "De Kwantum AI Assistent helpt winkelmedewerkers met vragen over procedures, producten, documentatie en winkelwerk. Antwoorden moeten praktisch, kort en duidelijk zijn.",
  },
  {
    id: "document-workflow",
    title: "Documentbeheer",
    content:
      "Owners kunnen documenten en foto's toevoegen bij Documents. Uploads worden later gekoppeld aan Vercel Blob, OCR en AI-verwerking. Nu gebruikt de chat alleen voorbereide kennis en voorbeelddocumenten.",
  },
  {
    id: "roles",
    title: "Rollen en toegang",
    content:
      "Medewerkers kunnen chatten. Floormanagers kunnen team en invite codes beheren. Supervisors kunnen filialen beheren. Owners kunnen gebruikers, filialen, documenten en kennis beheren.",
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function scoreItem(questionWords: string[], item: KnowledgeItem) {
  const haystack = normalize(`${item.title} ${item.content}`);
  return questionWords.reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0);
}

export function listKnowledgeItems(): KnowledgeItem[] {
  const documentKnowledge = documents.map((document) => ({
    id: document.id,
    title: document.name,
    content: `Document: ${document.name}. Status: ${
      document.active ? "actief" : "inactief"
    }. Geupload door ${document.uploadedBy}.`,
  }));

  return [...baseKnowledge, ...documentKnowledge];
}

export function findRelevantKnowledge(question: string, limit = 4) {
  const questionWords = normalize(question);

  if (questionWords.length === 0) {
    return listKnowledgeItems().slice(0, limit);
  }

  const ranked = listKnowledgeItems()
    .map((item) => ({ item, score: scoreItem(questionWords, item) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  return (ranked.length > 0 ? ranked : listKnowledgeItems()).slice(0, limit);
}
