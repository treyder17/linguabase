import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Linguabase — Übersetzung mit eigener Engine",
  description:
    "KI-gestützte Übersetzungsplattform mit selbst entwickelter Engine, Fachbereichs-Kontext und Entwickler-API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg-deep)" }}>
        <Providers>
          <SiteHeader />
          <main className="flex-1 flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
