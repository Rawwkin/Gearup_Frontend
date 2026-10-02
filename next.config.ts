import type { NextConfig } from "next";

// Base URL of the GearUp Express API (no trailing slash, no "/api" suffix).
const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:5000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    // The browser only ever talks to this app (same origin). Next forwards /api/*
    // to the backend, so the httpOnly auth cookies work without any CORS setup.
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
