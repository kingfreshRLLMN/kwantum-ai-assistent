import { findRelevantKnowledge } from "@/lib/knowledge";
import type { ChatMessage } from "@/lib/ai";

type OpenAITextOutput = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
};

const OPENAI_URL = "https://api.openai.com/v1/responses";

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
