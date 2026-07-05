import { ReferenceEngine, HttpNllbEngine } from "./reference-engine";
import { TranslationEngine } from "./types";

export * from "./types";
export * from "./domains";

function buildEngine(): TranslationEngine {
  const inferenceUrl = process.env.INFERENCE_SERVICE_URL;
  if (inferenceUrl) {
    return new HttpNllbEngine(inferenceUrl);
  }
  return new ReferenceEngine();
}

export const engine: TranslationEngine = buildEngine();
