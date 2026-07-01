import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isConfiguredOwner, isUserRole } from "@/lib/roles";

export async function POST(request: Request) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!user || !isConfiguredOwner(email, user.username)) {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { role?: unknown };
  const response = NextResponse.json({ ok: true });

  if (body.role === null || body.role === undefined || body.role === "") {
    response.cookies.delete("kwantum_preview_role");
    return response;
  }

  if (!isUserRole(body.role)) {
    return NextResponse.json({ error: "Onbekende rol" }, { status: 400 });
  }

  response.cookies.set("kwantum_preview_role", body.role, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
