import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { answerQuestionWithKnowledge } from "@/lib/ai-server";
import type { ChatMessage } from "@/lib/ai";

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<ChatMessage>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string"
  );
}

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    question?: unknown;
    messages?: unknown;
  };

  if (typeof body.question !== "string" || !body.question.trim()) {
    return NextResponse.json({ error: "Vraag ontbreekt" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.filter(isChatMessage) : [];

  try {
    const result = await answerQuestionWithKnowledge(body.question.trim(), messages);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        question: body.question,
        aiEnabled: false,
        answer:
          "De AI-koppeling gaf net een fout terug. Controleer de OpenAI API key, het model en de Vercel environment variables.",
      },
      { status: 500 },
    );
  }
}
