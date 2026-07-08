import { findRelevantKnowledge } from "@/lib/knowledge";
import type { ChatMessage } from "@/lib/ai";

type OpenAIVectorStore = {
  id: string;
  name?: string;
};

type OpenAIFile = {
  id: string;
  filename: string;
  bytes: number;
  created_at: number;
};

type OpenAITextOutput = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
};

const OPENAI_URL = "https://api.openai.com/v1/responses";
const OPENAI_API_BASE = "https://api.openai.com/v1";
const VECTOR_STORE_NAME = "Kwantum AI Assistent Knowledge";

function extractOutputText(data: OpenAITextOutput) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const contentText = data.output
    ?.flatMap((item) => item.content || [])
    .map((content) => content.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  return contentText || "";
}

export async function answerQuestionWithKnowledge(question: string, messages: ChatMessage[] = []) {
  const relevantKnowledge = findRelevantKnowledge(question);
  const sources = relevantKnowledge.map((item) => item.title);
  const context = relevantKnowledge
    .map((item, index) => `[${index + 1}] ${item.title}\n${item.content}`)
    .join("\n\n");

  if (!process.env.OPENAI_API_KEY) {
    return {
      question,
      aiEnabled: false,
      sources,
      answer:
        "AI is nog niet gekoppeld. Voeg OPENAI_API_KEY toe in Vercel en lokaal in .env.local om echte antwoorden op basis van Kwantum-kennis te krijgen.",
    };
  }

  const vectorStoreId = await getKnowledgeVectorStoreId();

  const recentMessages = messages.slice(-6).map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "developer",
          content:
            "Je bent de Kwantum AI Assistent voor winkelmedewerkers. Antwoord in het Nederlands, kort en praktisch. Gebruik alleen de meegegeven Kwantum-kennis. Als het antwoord niet in de kennis staat, zeg eerlijk dat je het nog niet zeker weet en verwijs naar een floormanager.",
        },
        {
          role: "developer",
          content: `Beschikbare Kwantum-kennis:\n\n${context}`,
        },
        ...recentMessages,
        {
          role: "user",
          content: question,
        },
      ],
      tools: vectorStoreId
        ? [
            {
              type: "file_search",
              vector_store_ids: [vectorStoreId],
              max_num_results: 5,
            },
          ]
        : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as OpenAITextOutput;
  const answer = extractOutputText(data);

  return {
    question,
    aiEnabled: true,
    sources,
    answer:
      answer ||
      "Ik kon hier nog geen duidelijk antwoord op maken. Controleer of er voldoende Kwantum-kennis is toegevoegd.",
  };
}

async function openAIRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY ontbreekt.");
  }

  const response = await fetch(`${OPENAI_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export async function getKnowledgeVectorStoreId() {
  if (!process.env.OPENAI_API_KEY) {
    return undefined;
  }

  if (process.env.OPENAI_VECTOR_STORE_ID) {
    return process.env.OPENAI_VECTOR_STORE_ID;
  }

  const stores = await openAIRequest<{ data: OpenAIVectorStore[] }>("/vector_stores?limit=100");
  const existingStore = stores.data.find((store) => store.name === VECTOR_STORE_NAME);

  if (existingStore) {
    return existingStore.id;
  }

  const createdStore = await openAIRequest<OpenAIVectorStore>("/vector_stores", {
    method: "POST",
    body: JSON.stringify({ name: VECTOR_STORE_NAME }),
  });

  return createdStore.id;
}

export async function uploadPdfToKnowledge(file: File, uploadedBy: string) {
  if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Alleen PDF-bestanden worden nu ondersteund.");
  }

  const vectorStoreId = await getKnowledgeVectorStoreId();

  if (!vectorStoreId) {
    throw new Error("Geen vector store beschikbaar.");
  }

  const formData = new FormData();
  formData.append("purpose", "assistants");
  formData.append("file", file, file.name);

  const uploadedFile = await openAIRequest<OpenAIFile>("/files", {
    method: "POST",
    body: formData,
  });

  await openAIRequest(`/vector_stores/${vectorStoreId}/files`, {
    method: "POST",
    body: JSON.stringify({
      file_id: uploadedFile.id,
      attributes: {
        uploadedBy,
        source: "kwantum-app",
        active: true,
      },
    }),
  });

  return {
    id: uploadedFile.id,
    name: uploadedFile.filename,
    bytes: uploadedFile.bytes,
    vectorStoreId,
    createdAt: new Date(uploadedFile.created_at * 1000).toISOString(),
  };
}

export async function deleteKnowledgeFile(fileId: string) {
  const vectorStoreId = await getKnowledgeVectorStoreId();

  if (vectorStoreId) {
    await openAIRequest(`/vector_stores/${vectorStoreId}/files/${fileId}`, {
      method: "DELETE",
    }).catch(() => undefined);
  }

  await openAIRequest(`/files/${fileId}`, {
    method: "DELETE",
  }).catch(() => undefined);

  return { success: true };
}
