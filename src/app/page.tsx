import Link from "next/link";
import { DOMAINS } from "@/lib/engine/domains";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="text-sm mb-4 tracking-wide uppercase"
              style={{ color: "var(--ice)", fontFamily: "var(--font-mono)" }}
            >
              Eigene Engine · kein GPT · kein Claude · kein Gemini
            </p>
            <h1
              className="text-4xl md:text-5xl leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)" }}
            >
              Übersetzung, die weiß,
              <br />
              in welcher Welt sie steht.
            </h1>
            <p className="text-lg mb-8 max-w-md" style={{ color: "var(--text-muted)" }}>
              Medizin, Recht oder Technik — Linguabase passt jede Übersetzung an
              den Fachbereich an. Direkt im Browser oder per API in deiner
              eigenen Anwendung.
            </p>
            <div className="flex gap-4">
              <Link
                href="/translate"
                className="px-5 py-3 rounded-md font-medium transition-transform hover:scale-[1.02]"
                style={{ background: "var(--action)", color: "white" }}
              >
                Jetzt übersetzen
              </Link>
              <Link
                href="/docs"
                className="px-5 py-3 rounded-md font-medium border transition-colors hover:border-[var(--ice)]"
                style={{ borderColor: "var(--line)", color: "var(--text)" }}
              >
                API-Dokumentation
              </Link>
            </div>
          </div>

          <SignalHero />
        </div>
      </section>

      {/* Domains */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t" style={{ borderColor: "var(--line)" }}>
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}
        >
          Fachbereiche, keine Rateversuche
        </h2>
        <p className="mb-10 max-w-xl" style={{ color: "var(--text-muted)" }}>
          Jede Übersetzung wird mit fachspezifischer Terminologie und Kontext
          gesteuert — statt einer generischen Übersetzung, die im Zweifel danebenliegt.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {DOMAINS.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-lg border"
              style={{ background: "var(--bg-surface)", borderColor: "var(--line)" }}
            >
              <h3 className="font-medium mb-1" style={{ color: "var(--text)" }}>
                {d.label}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {d.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* API */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t" style={{ borderColor: "var(--line)" }}>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2
              className="text-2xl mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}
            >
              Für Entwickler gebaut
            </h2>
            <p className="mb-6 max-w-md" style={{ color: "var(--text-muted)" }}>
              Erstelle API-Keys in deinem Konto und binde Übersetzung direkt in
              deine eigene Anwendung ein. Ein Endpunkt, alle Sprachen, alle
              Fachbereiche.
            </p>
            <Link
              href="/register"
              className="inline-block px-5 py-3 rounded-md font-medium"
              style={{ background: "var(--action)", color: "white" }}
            >
              Konto erstellen
            </Link>
          </div>
          <pre
            className="rounded-lg border p-5 text-sm overflow-x-auto"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--line)",
              color: "var(--ice)",
              fontFamily: "var(--font-mono)",
            }}
          >
{`curl https://linguabase.app/api/v1/translate \\
  -H "Authorization: Bearer tpk_dein_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Der Patient zeigt keine Nebenwirkungen.",
    "sourceLang": "de",
    "targetLang": "en",
    "domain": "medical"
  }'`}
          </pre>
        </div>
      </section>
    </div>
  );
}

function SignalHero() {
  return (
    <div
      className="rounded-xl border p-8 relative overflow-hidden"
      style={{ background: "var(--bg-surface)", borderColor: "var(--line)" }}
    >
      <div className="flex items-center justify-between text-sm mb-6" style={{ fontFamily: "var(--font-mono)" }}>
        <span style={{ color: "var(--text-muted)" }}>DE</span>
        <span style={{ color: "var(--ice)" }}>Medizin</span>
        <span style={{ color: "var(--text-muted)" }}>EN</span>
      </div>
      <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
        Der Wirkstoff zeigt eine gute Verträglichkeit.
      </p>
      <svg className="signal-wave w-full h-12 my-3" viewBox="0 0 300 48" fill="none">
        <path
          d="M0 24 C 20 4, 40 44, 60 24 S 100 4, 120 24 S 160 44, 180 24 S 220 4, 240 24 S 280 44, 300 24"
          stroke="var(--action)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>
      <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
        The active ingredient shows good tolerability.
      </p>
    </div>
  );
}
