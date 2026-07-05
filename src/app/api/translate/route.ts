import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { translateSchema, runTranslation } from "@/lib/translate-service";

export async function POST(req: NextRequest) {
  const session = await auth();

  const body = await req.json().catch(() => null);
  const parsed = translateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  try {
    const result = await runTranslation(parsed.data, { userId: session?.user?.id });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Übersetzung fehlgeschlagen. Bitte erneut versuchen." }, { status: 502 });
  }
}
