import { NextResponse } from "next/server";
import { uploadPdfToKnowledge } from "@/lib/ai-server";
import { getCurrentAppUser } from "@/lib/roles";

export async function POST(request: Request) {
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  if (user.actualRole !== "owner") {
    return NextResponse.json({ error: "Alleen owners kunnen kennis uploaden." }, { status: 403 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY ontbreekt. Voeg deze toe in Vercel." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Geen bestand ontvangen." }, { status: 400 });
  }

  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json(
      { error: "PDF is te groot. Gebruik voorlopig maximaal 25 MB." },
      { status: 400 },
    );
  }

  try {
    const document = await uploadPdfToKnowledge(file, user.name);
    return NextResponse.json({ document });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "PDF uploaden naar de AI-kennis is niet gelukt." },
      { status: 500 },
    );
  }
}
