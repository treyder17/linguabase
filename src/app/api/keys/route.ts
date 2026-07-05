import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/api-keys";

const createSchema = z.object({
  name: z.string().min(1).max(60),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      prefix: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bitte einen Namen für den Key angeben." }, { status: 400 });
  }

  const activeCount = await prisma.apiKey.count({
    where: { userId: session.user.id, revokedAt: null },
  });
  if (activeCount >= 20) {
    return NextResponse.json(
      { error: "Limit erreicht: maximal 20 aktive API-Keys pro Konto." },
      { status: 422 }
    );
  }

  const { plaintext, keyHash, prefix } = generateApiKey();

  const key = await prisma.apiKey.create({
    data: {
      name: parsed.data.name,
      keyHash,
      prefix,
      userId: session.user.id,
    },
    select: { id: true, name: true, prefix: true, createdAt: true },
  });

  // The plaintext key is returned exactly once and never persisted or logged.
  return NextResponse.json({ key: { ...key, plaintext } }, { status: 201 });
}
