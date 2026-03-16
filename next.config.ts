import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse is a CJS-only package with ESM resolution issues in Turbopack.
  // Mark it as external so Node.js handles it natively via require().
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
