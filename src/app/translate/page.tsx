"use client";

import { useState } from "react";
import { LANGUAGES } from "@/lib/languages";
import { DOMAINS } from "@/lib/engine/domains";

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState("de");
  const [targetLang, setTargetLang] = useState("en");
  const [domain, setDomain] = useState("general");
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTranslate() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang, domain }),
    });
    const data = await res.json();

    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Übersetzung fehlgeschlagen.");
      return;
    }
    setResult(data.translatedText);
  }

  function swapLanguages() {
    if (sourceLang === "auto") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(result ?? "");
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 w-full">
      <h1
        className="text-2xl mb-8"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}
      >
        Übersetzen
      </h1>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "var(--bg-surface)", borderColor: "var(--line)" }}
      >
        {/* Controls row */}
        <div
          className="flex flex-wrap items-center gap-3 px-5 py-3 border-b"
          style={{ borderColor: "var(--line)" }}
        >
          <LangSelect value={sourceLang} onChange={setSourceLang} includeAuto />
          <button
            onClick={swapLanguages}
            aria-label="Sprachen tauschen"
            className="p-1.5 rounded-md border transition-colors hover:border-[var(--ice)]"
            style={{ borderColor: "var(--line)", color: "var(--text-muted)" }}
          >
            ⇄
          </button>
          <LangSelect value={targetLang} onChange={setTargetLang} />

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Fachbereich
            </span>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="text-sm px-2.5 py-1.5 rounded-md border outline-none"
              style={{ background: "var(--bg-surface-2)", borderColor: "var(--line)", color: "var(--text)" }}
            >
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text areas */}
        <div className="grid md:grid-cols-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text eingeben …"
            maxLength={10000}
            rows={8}
            className="p-5 resize-none outline-none border-r md:border-r"
            style={{ background: "transparent", color: "var(--text)", borderColor: "var(--line)" }}
          />
          <div className="p-5" style={{ color: result ? "var(--text)" : "var(--text-muted)" }}>
            {loading ? "Übersetze …" : result ?? "Übersetzung erscheint hier."}
          </div>
        </div>

        {/* Signal divider */}
        <div className="px-5 py-2 border-t" style={{ borderColor: "var(--line)" }}>
          <svg className="signal-wave w-full h-6" viewBox="0 0 600 24" fill="none">
            <path
              d="M0 12 C 15 2, 30 22, 45 12 S 75 2, 90 12 S 120 22, 135 12 S 165 2, 180 12 S 210 22, 225 12 S 255 2, 270 12 S 300 22, 315 12 S 345 2, 360 12 S 390 22, 405 12 S 435 2, 450 12 S 480 22, 495 12 S 525 2, 540 12 S 570 22, 585 12"
              stroke="var(--ice)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {text.length} / 10.000 Zeichen
          </span>
          <button
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
            className="px-5 py-2 rounded-md font-medium disabled:opacity-50"
            style={{ background: "var(--action)", color: "white" }}
          >
            {loading ? "Übersetze …" : "Übersetzen"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm mt-4" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function LangSelect({
  value,
  onChange,
  includeAuto = false,
}: {
  value: string;
  onChange: (v: string) => void;
  includeAuto?: boolean;
}) {
  const options = includeAuto ? LANGUAGES : LANGUAGES.filter((l) => l.code !== "auto");
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm px-2.5 py-1.5 rounded-md border outline-none"
      style={{ background: "var(--bg-surface-2)", borderColor: "var(--line)", color: "var(--text)" }}
    >
      {options.map((l) => (
        <option key={l.code} value={l.code}>
          {l.name}
        </option>
      ))}
    </select>
  );
}
