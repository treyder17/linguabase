"use client";

import { useEffect, useState } from "react";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  async function loadKeys() {
    setLoading(true);
    const res = await fetch("/api/keys");
    if (res.ok) {
      const data = await res.json();
      setKeys(data.keys);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);

    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const data = await res.json();
    setCreating(false);

    if (!res.ok) {
      setError(data.error ?? "Key konnte nicht erstellt werden.");
      return;
    }

    setFreshKey(data.key.plaintext);
    setNewName("");
    loadKeys();
  }

  async function handleRevoke(id: string) {
    const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
    setConfirmRevoke(null);
    if (res.ok) loadKeys();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 w-full">
      <h1
        className="text-2xl mb-1"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}
      >
        API-Keys
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Erstelle Keys, um Linguabase aus deiner eigenen Anwendung anzusprechen.
      </p>

      {freshKey && (
        <div
          className="p-4 rounded-lg border mb-8"
          style={{ background: "var(--bg-surface-2)", borderColor: "var(--ice)" }}
        >
          <p className="text-sm mb-2" style={{ color: "var(--ice)" }}>
            Dieser Key wird nur jetzt angezeigt — kopiere ihn an einen sicheren Ort.
          </p>
          <code
            className="block p-3 rounded-md text-sm break-all"
            style={{ background: "var(--bg-deep)", color: "var(--text)", fontFamily: "var(--font-mono)" }}
          >
            {freshKey}
          </code>
          <button
            onClick={() => setFreshKey(null)}
            className="text-sm mt-3"
            style={{ color: "var(--text-muted)" }}
          >
            Verstanden, ausblenden
          </button>
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-3 mb-10">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Name, z. B. „Mein Telegram-Bot“"
          className="flex-1 px-3 py-2.5 rounded-md border outline-none text-sm"
          style={{ background: "var(--bg-surface)", borderColor: "var(--line)", color: "var(--text)" }}
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="px-5 py-2.5 rounded-md font-medium disabled:opacity-50"
          style={{ background: "var(--action)", color: "white" }}
        >
          {creating ? "Erstelle …" : "Key erstellen"}
        </button>
      </form>

      {error && (
        <p className="text-sm mb-6" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Lade Keys …
        </p>
      ) : keys.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Noch keine API-Keys erstellt.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {keys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--line)",
                opacity: k.revokedAt ? 0.5 : 1,
              }}
            >
              <div>
                <p className="font-medium" style={{ color: "var(--text)" }}>
                  {k.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {k.prefix}••••••
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {k.revokedAt
                    ? `Widerrufen am ${new Date(k.revokedAt).toLocaleDateString("de-DE")}`
                    : k.lastUsedAt
                    ? `Zuletzt verwendet am ${new Date(k.lastUsedAt).toLocaleDateString("de-DE")}`
                    : "Noch nicht verwendet"}
                </p>
              </div>

              {!k.revokedAt && (
                confirmRevoke === k.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Wirklich widerrufen?
                    </span>
                    <button
                      onClick={() => handleRevoke(k.id)}
                      className="text-sm px-3 py-1.5 rounded-md"
                      style={{ background: "var(--danger)", color: "white" }}
                    >
                      Ja, widerrufen
                    </button>
                    <button
                      onClick={() => setConfirmRevoke(null)}
                      className="text-sm px-3 py-1.5 rounded-md border"
                      style={{ borderColor: "var(--line)", color: "var(--text-muted)" }}
                    >
                      Abbrechen
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRevoke(k.id)}
                    className="text-sm px-3 py-1.5 rounded-md border transition-colors hover:border-[var(--danger)]"
                    style={{ borderColor: "var(--line)", color: "var(--text-muted)" }}
                  >
                    Widerrufen
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
