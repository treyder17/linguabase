import { DOMAINS } from "@/lib/engine/domains";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 w-full">
      <h1
        className="text-2xl mb-2"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}
      >
        API-Dokumentation
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        Ein Endpunkt, Authentifizierung per API-Key. Keys erstellst du unter{" "}
        <code style={{ fontFamily: "var(--font-mono)", color: "var(--ice)" }}>/dashboard/keys</code>.
      </p>

      <Section title="Anfrage">
        <pre className="code-block">
{`POST /api/v1/translate
Authorization: Bearer tpk_dein_key
Content-Type: application/json

{
  "text": "Der Vertrag tritt am 1. Januar in Kraft.",
  "sourceLang": "de",
  "targetLang": "en",
  "domain": "legal"
}`}
        </pre>
      </Section>

      <Section title="Antwort">
        <pre className="code-block">
{`{
  "translatedText": "The contract takes effect on January 1.",
  "detectedSourceLang": null,
  "engine": "nllb-200-self-hosted"
}`}
        </pre>
      </Section>

      <Section title="Parameter">
        <ul className="text-sm flex flex-col gap-2" style={{ color: "var(--text-muted)" }}>
          <li><code style={{ color: "var(--text)" }}>text</code> — zu übersetzender Text, max. 10.000 Zeichen</li>
          <li><code style={{ color: "var(--text)" }}>sourceLang</code> — Quellsprache als Code, z. B. <code>de</code>, oder <code>auto</code></li>
          <li><code style={{ color: "var(--text)" }}>targetLang</code> — Zielsprache als Code, z. B. <code>en</code></li>
          <li><code style={{ color: "var(--text)" }}>domain</code> — Fachbereich, siehe unten (Standard: <code>general</code>)</li>
        </ul>
      </Section>

      <Section title="Fachbereiche">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {DOMAINS.map((d) => (
            <div key={d.id} style={{ color: "var(--text-muted)" }}>
              <code style={{ color: "var(--ice)", fontFamily: "var(--font-mono)" }}>{d.id}</code> — {d.label}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Fehler">
        <ul className="text-sm flex flex-col gap-2" style={{ color: "var(--text-muted)" }}>
          <li><code style={{ color: "var(--text)" }}>401</code> — API-Key fehlt, ist ungültig oder wurde widerrufen</li>
          <li><code style={{ color: "var(--text)" }}>400</code> — Anfrage fehlerhaft, siehe <code>error</code>-Feld</li>
          <li><code style={{ color: "var(--text)" }}>502</code> — Übersetzung ist fehlgeschlagen, erneut versuchen</li>
        </ul>
      </Section>

      <style>{`
        .code-block {
          background: var(--bg-surface);
          border: 1px solid var(--line);
          color: var(--ice);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          padding: 1.25rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
