import { NextResponse } from "next/server";
import { deleteKnowledgeFile } from "@/lib/ai-server";
import { getCurrentAppUser } from "@/lib/roles";

export async function POST(request: Request) {
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  if (user.actualRole !== "owner") {
    return NextResponse.json({ error: "Alleen owners kunnen kennis verwijderen." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { fileId?: unknown };

  if (typeof body.fileId !== "string" || !body.fileId) {
    return NextResponse.json({ error: "Bestand ontbreekt." }, { status: 400 });
  }

  await deleteKnowledgeFile(body.fileId);

  return NextResponse.json({ success: true });
}
