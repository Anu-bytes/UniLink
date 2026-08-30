import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Next's dev server needs 'unsafe-eval' for webpack HMR and a websocket
// connection for its live-reload socket; neither is needed once built, so
// both are dropped from the production policy.
const isDev = process.env.NODE_ENV !== "production";

// No nonces: large parts of the UI (Tailwind's arbitrary-value utilities,
// React's `style` prop) render as inline style attributes, which only
// 'unsafe-inline' (not a nonce) can authorise for style-src. script-src still
// meaningfully restricts to same-origin + inline — no loading a remote
// script, which is the more common exfiltration path.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Avatar/logo URLs come from Supabase Storage and other admin-entered
  // hosts, rendered as plain <img>, not next/image — so this can't be
  // narrowed to next.config's images.remotePatterns without breaking them.
  "img-src 'self' https: data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  // The only <iframe> on the site is the campus map embed on a university's
  // Location tab (tab-location.tsx). No frame-src falls back to
  // default-src 'self', which blocks it.
  "frame-src https://www.openstreetmap.org",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Stop the browser guessing content types on user-uploaded avatars/etc.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No embedding in a third-party frame (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Don't leak the full URL (which can carry query params) to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on this site needs the camera/mic/geolocation APIs.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS: force HTTPS on repeat visits once served over it.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
