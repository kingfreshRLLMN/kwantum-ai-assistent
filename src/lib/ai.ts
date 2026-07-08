export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AiAnswer = {
  question: string;
  answer: string;
  sources?: string[];
  aiEnabled?: boolean;
};

export async function answerQuestion(
  question: string,
  messages: ChatMessage[] = [],
): Promise<AiAnswer> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, messages }),
  });

  if (!response.ok) {
    throw new Error("Chat antwoord kon niet worden opgehaald.");
  }

  return response.json() as Promise<AiAnswer>;
}
