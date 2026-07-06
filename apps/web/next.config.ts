import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MapLibre maps hold imperative state across mount; React Strict Mode's
  // dev-only double-invoke tears the map down and rebuilds it, which is
  // wasteful and noisy. Disable the double render in dev.
  reactStrictMode: false,
};

export default nextConfig;
