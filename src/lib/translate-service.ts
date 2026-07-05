import { z } from "zod";
import { engine, Domain } from "@/lib/engine";
import { prisma } from "@/lib/prisma";

export const translateSchema = z.object({
  text: z.string().min(1, "Text darf nicht leer sein.").max(10000, "Text ist zu lang (max. 10.000 Zeichen)."),
  sourceLang: z.string().min(2).max(10),
  targetLang: z.string().min(2).max(10),
  domain: z
    .enum(["general", "medical", "legal", "technical", "business", "marketing"])
    .default("general"),
});

export type TranslateInput = z.infer<typeof translateSchema>;

export async function runTranslation(
  input: TranslateInput,
  actor: { userId?: string; apiKeyId?: string }
) {
  const result = await engine.translate({
    text: input.text,
    sourceLang: input.sourceLang,
    targetLang: input.targetLang,
    domain: input.domain as Domain,
  });

  await prisma.translation.create({
    data: {
      sourceLang: input.sourceLang,
      targetLang: input.targetLang,
      domain: input.domain,
      sourceText: input.text,
      translatedText: result.translatedText,
      charCount: input.text.length,
      userId: actor.userId,
      apiKeyId: actor.apiKeyId,
    },
  });

  return result;
}
