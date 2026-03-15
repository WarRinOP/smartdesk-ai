import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These packages use CJS and have ESM resolution issues with Turbopack.
  // Mark them as external so Node.js handles them natively.
  serverExternalPackages: ["voyageai", "pdf-parse"],
};

export default nextConfig;
