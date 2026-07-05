import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [translationCount, activeKeyCount] = await Promise.all([
    prisma.translation.count({ where: { userId: session.user.id } }),
    prisma.apiKey.count({ where: { userId: session.user.id, revokedAt: null } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 w-full">
      <h1
        className="text-2xl mb-1"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}
      >
        Willkommen{session.user.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        {session.user.email}
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <StatCard label="Übersetzungen gesamt" value={translationCount} />
        <StatCard label="Aktive API-Keys" value={activeKeyCount} />
      </div>

      <div className="flex gap-4">
        <Link
          href="/dashboard/keys"
          className="px-5 py-2.5 rounded-md font-medium"
          style={{ background: "var(--action)", color: "white" }}
        >
          API-Keys verwalten
        </Link>
        <Link
          href="/translate"
          className="px-5 py-2.5 rounded-md font-medium border"
          style={{ borderColor: "var(--line)", color: "var(--text)" }}
        >
          Übersetzen
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-5 rounded-lg border" style={{ background: "var(--bg-surface)", borderColor: "var(--line)" }}>
      <p className="text-3xl mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ice)" }}>
        {value}
      </p>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
