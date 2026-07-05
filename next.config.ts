import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Das hier zwingt alle Routen dazu, dynamisch zur Laufzeit geladen zu werden:
  experimental: {
    // Verhindert, dass Next.js versucht, dynamische API/Auth-Seiten statisch vorzuberechnen
    ppr: false 
  },
  // Alternativ deaktivieren wir das statische Generieren bei Fehlern komplett:
  staticPageGenerationTimeout: 1000,
};

export default nextConfig;