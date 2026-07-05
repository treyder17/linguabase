import { TranslateRequest, TranslateResult, TranslationEngine } from "./types";
import { domainGlossary } from "./domains";

/**
 * ReferenceEngine is a placeholder that lets the whole platform (auth, API
 * keys, quotas, UI, logging) be built and tested end-to-end without a GPU
 * inference server running yet.
 *
 * To go live with a real self-hosted engine (no GPT/Claude/Gemini involved):
 *   1. Stand up a small inference service (FastAPI/Python) that loads
 *      facebook/nllb-200-distilled-600M (or larger) via Hugging Face
 *      Transformers or CTranslate2, exposing POST /translate.
 *   2. Implement HttpNllbEngine below (stubbed) pointing at that service.
 *   3. Swap the export in ./index.ts — no other file needs to change.
 */
export class ReferenceEngine implements TranslationEngine {
  readonly name = "reference-passthrough";

  async translate(req: TranslateRequest): Promise<TranslateResult> {
    const glossary = domainGlossary(req.domain);
    let text = req.text;

    for (const [term, replacement] of Object.entries(glossary)) {
      text = text.replaceAll(term, replacement);
    }

    return {
      translatedText: `[${req.targetLang}] ${text}`,
      detectedSourceLang: req.sourceLang === "auto" ? "de" : undefined,
      engine: this.name,
    };
  }
}

/**
 * Real backend target: a self-hosted NLLB-200 service you control.
 * Fill in INFERENCE_SERVICE_URL and un-comment once that service exists.
 */
export class HttpNllbEngine implements TranslationEngine {
  readonly name = "nllb-200-self-hosted";

  constructor(private readonly serviceUrl: string) {}

  async translate(req: TranslateRequest): Promise<TranslateResult> {
    const res = await fetch(`${this.serviceUrl}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`Inference service error: ${res.status}`);
    }

    const data = await res.json();
    return { translatedText: data.translatedText, detectedSourceLang: data.detectedSourceLang, engine: this.name };
  }
}
