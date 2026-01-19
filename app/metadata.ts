import { env } from "@/lib/env";
import type { Metadata } from "next";

/**
 * Default metadata for the application
 * Can be overridden in individual pages using the Metadata API
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: env.NEXT_PUBLIC_APP_NAME ?? "Next.js Starter",
    template: `%s | ${env.NEXT_PUBLIC_APP_NAME ?? "Next.js Starter"}`,
  },
  description:
    "A modern Next.js starter template with TypeScript, security features, and best practices.",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Starter Template",
    "Web Development",
  ],
  authors: [
    {
      name: "Your Name",
      url: env.NEXT_PUBLIC_APP_URL,
    },
  ],
  creator: "Your Name",
  publisher: "Your Organization",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.NEXT_PUBLIC_APP_URL,
    siteName: env.NEXT_PUBLIC_APP_NAME ?? "Next.js Starter",
    title: env.NEXT_PUBLIC_APP_NAME ?? "Next.js Starter",
    description:
      "A modern Next.js starter template with TypeScript, security features, and best practices.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: env.NEXT_PUBLIC_APP_NAME ?? "Next.js Starter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: env.NEXT_PUBLIC_APP_NAME ?? "Next.js Starter",
    description:
      "A modern Next.js starter template with TypeScript, security features, and best practices.",
    images: ["/og-image.png"],
    creator: "@yourusername",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};
