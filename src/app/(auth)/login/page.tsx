"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });

    setLoading(false);
    if (res?.error) {
      setError("E-Mail oder Passwort ist falsch.");
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
        Anmelden
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Willkommen zurück bei Linguabase.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="E-Mail" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field
          label="Passwort"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
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
          {loading ? "Anmelden …" : "Anmelden"}
        </button>
      </form>

      <p className="text-sm mt-6" style={{ color: "var(--text-muted)" }}>
        Noch kein Konto?{" "}
        <Link href="/register" style={{ color: "var(--ice)" }}>
          Jetzt registrieren
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
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <input
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 rounded-md border outline-none"
        style={{ background: "var(--bg-surface)", borderColor: "var(--line)", color: "var(--text)" }}
      />
    </label>
  );
}
