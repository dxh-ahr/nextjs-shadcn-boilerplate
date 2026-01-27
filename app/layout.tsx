import { Toaster } from "@/components/ui/sonner";
import { QueryProvider, ThemeProvider } from "@/providers";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { defaultMetadata } from "./metadata";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense
                fallback={
                  <section className="grid h-screen w-screen place-content-center">
                    <Loader2 className="size-12 animate-spin text-primary" />
                    <span className="sr-only">Loading...</span>
                  </section>
                }
              >
                <main className="pt-16">{children}</main>
              </Suspense>
              <Toaster position="top-center" richColors />
            </ThemeProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
