"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { answerQuestion } from "@/lib/ai";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Waar kan ik je mee helpen? Stel gerust een vraag over procedures, producten of winkelwerk.",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await answerQuestion(trimmedQuestion, messages);

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "Er ging iets mis met de AI-koppeling. Probeer het zo opnieuw of controleer de API instellingen.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col bg-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pb-32 pt-4">
        <section className="motion-soft rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
          <Image
            src="/brand/payoff.png"
            alt="Kwantum - Hoe leuk is dat?"
            width={600}
            height={50}
            className="h-auto w-full max-w-sm"
            priority
          />
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Stel je vraag aan de Kwantum AI Assistent. Antwoorden worden gemaakt op basis van
            gekoppelde Kwantum-kennis en documenten.
          </p>
        </section>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`motion-soft max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
              message.role === "user"
                ? "ml-auto bg-orange-500 text-white"
                : "mr-auto border border-orange-100 bg-white text-zinc-800"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading ? (
          <div className="motion-soft mr-auto rounded-3xl border border-orange-100 bg-white px-4 py-3 text-sm font-medium text-zinc-500 shadow-sm">
            Antwoord voorbereiden...
          </div>
        ) : null}
      </main>

      <form
        onSubmit={handleSubmit}
        className="motion-soft motion-soft-delay-2 fixed inset-x-0 bottom-0 z-20 border-t border-orange-100 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <label className="sr-only" htmlFor="question">
            Vraag
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Stel je vraag..."
            rows={1}
            className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-950 outline-none ring-orange-500 transition focus:border-orange-400 focus:ring-2"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="interactive-lift h-12 rounded-2xl bg-orange-500 px-5 text-base font-bold text-white shadow-sm shadow-orange-200 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            Stuur
          </button>
        </div>
      </form>
    </div>
  );
}
