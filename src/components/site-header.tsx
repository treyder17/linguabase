import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: "var(--line)", background: "rgba(11,27,51,0.85)" }}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9" stroke="var(--ice)" strokeWidth="1.4" />
            <path
              d="M4 11h14M11 2c2.8 2.6 2.8 15.4 0 18M11 2c-2.8 2.6-2.8 15.4 0 18"
              stroke="var(--action)"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
          <span
            className="text-lg tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}
          >
            Linguabase
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/translate" className="hover:text-white transition-colors">
            Übersetzen
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            API-Dokumentation
          </Link>
          {session?.user && (
            <Link href="/dashboard/keys" className="hover:text-white transition-colors">
              API-Keys
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {session.user.email}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  className="text-sm px-3 py-1.5 rounded-md border transition-colors"
                  style={{ borderColor: "var(--line)", color: "var(--text-muted)" }}
                >
                  Abmelden
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded-md transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                Anmelden
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-1.5 rounded-md font-medium transition-colors"
                style={{ background: "var(--action)", color: "white" }}
              >
                Kostenlos starten
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
