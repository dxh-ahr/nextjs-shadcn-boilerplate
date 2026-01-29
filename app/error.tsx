"use client";

import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/dashboard-header";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ErrorWithDigest = Error & { digest?: string };

interface ErrorPageProps {
  readonly error: ErrorWithDigest;
  readonly reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("Error");
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDashboardRoute = pathname?.startsWith(ROUTES.DASHBOARD.ROOT) ?? false;

  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const errorContent = (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          {/* Error Icon */}
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-8" />
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-md text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
        </div>

        {/* Error Details Card (Development only) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="mb-8 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-destructive">
                {t("error_details")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-mono text-xs">
                {error.message}
                {error.digest && (
                  <span className="mt-2 block text-muted-foreground">
                    Error ID: {error.digest}
                  </span>
                )}
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={reset}
            size="lg"
            variant="outline"
            className="group min-w-[160px]"
          >
            <RefreshCw className="mr-2 size-4 transition-transform group-hover:rotate-180" />
            {t("try_again")}
          </Button>
          <Button asChild size="lg" className="group min-w-[160px]">
            <Link href={isDashboardRoute ? ROUTES.DASHBOARD.ROOT : ROUTES.HOME}>
              <Home className="mr-2 size-4" />
              {isDashboardRoute ? t("back_dashboard") : t("back_home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  if (isDashboardRoute) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader onMenuClick={toggleSidebar} />

        <div className="flex flex-1">
          <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          <main className="flex-1 lg:ml-64">
            <div className="p-4 sm:p-6 lg:p-8">{errorContent}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {errorContent}
    </>
  );
}
