import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashApiKey, isWellFormedApiKey } from "@/lib/api-keys";
import { translateSchema, runTranslation } from "@/lib/translate-service";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";

  if (!token || !isWellFormedApiKey(token)) {
    return NextResponse.json(
      { error: "Fehlender oder ungültiger API-Key. Erwartet: Authorization: Bearer <key>" },
      { status: 401 }
    );
  }

  const apiKey = await prisma.apiKey.findUnique({ where: { keyHash: hashApiKey(token) } });
  if (!apiKey || apiKey.revokedAt) {
    return NextResponse.json({ error: "API-Key ist ungültig oder wurde widerrufen." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = translateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  try {
    const result = await runTranslation(parsed.data, { userId: apiKey.userId, apiKeyId: apiKey.id });

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return NextResponse.json({
      translatedText: result.translatedText,
      detectedSourceLang: result.detectedSourceLang,
      engine: result.engine,
    });
  } catch {
    return NextResponse.json({ error: "Übersetzung fehlgeschlagen. Bitte erneut versuchen." }, { status: 502 });
  }
}
