export type Domain =
  | "general"
  | "medical"
  | "legal"
  | "technical"
  | "business"
  | "marketing";

export interface TranslateRequest {
  text: string;
  sourceLang: string; // ISO 639-1/3 code, or "auto"
  targetLang: string; // ISO 639-1/3 code
  domain: Domain;
}

export interface TranslateResult {
  translatedText: string;
  detectedSourceLang?: string;
  engine: string;
}

/**
 * Contract every translation backend must implement.
 * Swap ReferenceEngine for a self-hosted NLLB-200 / M2M100 inference
 * service (see /src/lib/engine/README.md) without touching any route code.
 */
export interface TranslationEngine {
  readonly name: string;
  translate(req: TranslateRequest): Promise<TranslateResult>;
}
