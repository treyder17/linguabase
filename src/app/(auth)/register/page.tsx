"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || undefined, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registrierung fehlgeschlagen.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-20 w-full">
      <h1
        className="text-2xl mb-1"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}
      >
        Konto erstellen
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Übersetze im Browser oder per API — kostenlos starten.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name (optional)" type="text" value={name} onChange={setName} required={false} />
        <Field label="E-Mail" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field
          label="Passwort (mind. 8 Zeichen)"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />

        {error && (
          <p className="text-sm" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-2.5 rounded-md font-medium disabled:opacity-60"
          style={{ background: "var(--action)", color: "white" }}
        >
          {loading ? "Konto wird erstellt …" : "Konto erstellen"}
        </button>
      </form>

      <p className="text-sm mt-6" style={{ color: "var(--text-muted)" }}>
        Schon registriert?{" "}
        <Link href="/login" style={{ color: "var(--ice)" }}>
          Anmelden
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required = true,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 rounded-md border outline-none"
        style={{ background: "var(--bg-surface)", borderColor: "var(--line)", color: "var(--text)" }}
      />
    </label>
  );
}
