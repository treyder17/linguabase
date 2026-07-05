import { Domain } from "./types";

export const DOMAINS: { id: Domain; label: string; description: string }[] = [
  { id: "general", label: "Allgemein", description: "Alltagssprache, keine Fachterminologie" },
  { id: "medical", label: "Medizin", description: "Klinische und pharmazeutische Terminologie" },
  { id: "legal", label: "Recht", description: "Vertrags- und Gesetzessprache" },
  { id: "technical", label: "Technik", description: "Technische Dokumentation, Ingenieurwesen" },
  { id: "business", label: "Wirtschaft", description: "Geschäftskorrespondenz, Finanzen" },
  { id: "marketing", label: "Marketing", description: "Werbetexte, markengerechter Ton" },
];

/**
 * Domain-specific terminology overrides. In production this would be backed
 * by a real bilingual glossary table (per domain + language pair), injected
 * into the engine as constrained decoding / terminology forcing.
 */
export function domainGlossary(domain: Domain): Record<string, string> {
  switch (domain) {
    case "medical":
      return { "Nebenwirkung": "adverse effect", "Wirkstoff": "active ingredient" };
    case "legal":
      return { "Vertragspartei": "contracting party", "Haftung": "liability" };
    case "technical":
      return { "Bauteil": "component", "Toleranz": "tolerance" };
    default:
      return {};
  }
}
