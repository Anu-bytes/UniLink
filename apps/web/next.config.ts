import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // MapLibre owns imperative state and is expensive to recreate during the
  // development-only Strict Mode double mount.
  reactStrictMode: false,
  // Keep Turbopack inside this monorepo. Without an explicit root, an
  // unrelated lockfile higher in a developer's home directory can be chosen.
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.maptiler.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
