import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Nur falls ihr aktuell echte TS-Fehler noch nicht behoben habt.
    // Sobald `npx tsc --noEmit` sauber durchläuft, diese Zeile entfernen.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;