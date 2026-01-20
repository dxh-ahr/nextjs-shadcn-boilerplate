import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { env } from "./lib/env";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // React strict mode for better development experience and catching bugs
  reactStrictMode: true,

  // Enable React Compiler for automatic memoization and optimization
  reactCompiler: true,

  // Disable source maps in production to prevent source code exposure
  productionBrowserSourceMaps: false,

  // Compiler optimizations
  compiler: {
    // Remove console statements in production (except errors)
    removeConsole: isProduction
      ? {
          exclude: ["error"],
        }
      : false,
  },

  // Image optimization configuration
  images: {
    // Restrict allowed quality values to prevent abuse
    qualities: [75, 90, 100],

    // Custom cache TTL (1 year for production, default is 4 hours)
    minimumCacheTTL: isProduction ? 60 * 60 * 24 * 365 : 60 * 60 * 24,

    // Security limits (default is 3, but explicit for clarity)
    maximumRedirects: 3,

    // SVG handling with security
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    contentDispositionType: "attachment",

    // Allowed remote image sources
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Add your image domains here
    ],
  },

  // Experimental features
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Security and performance headers
  async headers() {
    const securityHeaders = [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          // Scripts: Allow self, but prefer nonce-based approach in production
          isProduction
            ? "script-src 'self'"
            : "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https: blob:",
          "font-src 'self' data:",
          "connect-src 'self' https:",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
          "media-src 'self'",
          "worker-src 'self'",
          "manifest-src 'self'",
          isProduction ? "upgrade-insecure-requests" : "",
        ]
          .filter(Boolean)
          .join("; "),
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      {
        key: "X-Permitted-Cross-Domain-Policies",
        value: "none",
      },
      {
        key: "Cross-Origin-Embedder-Policy",
        value: isProduction ? "require-corp" : "unsafe-none",
      },
      {
        key: "Cross-Origin-Resource-Policy",
        value: "same-origin",
      },
    ];

    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Aggressive caching for Next.js static assets
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache static files
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache optimized images
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Output configuration for standalone deployments (Docker, serverless)
  ...(env.BUILD_STANDALONE && {
    output: "standalone" as const,
  }),

  // Compression enabled (default but explicit for clarity)
  compress: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
