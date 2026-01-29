"use client";

import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/dashboard-header";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { ArrowLeft, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDashboardRoute = pathname?.startsWith(ROUTES.DASHBOARD.ROOT) ?? false;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const notFoundContent = (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* 404 Number */}
        <h1 className="mb-6 text-8xl font-light tracking-tight text-foreground sm:text-9xl">
          {t("title")}
        </h1>

        {/* Heading */}
        <h2 className="mb-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          {t("heading")}
        </h2>

        {/* Description */}
        <p className="mx-auto mb-12 max-w-md text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
          {t("description")}
        </p>

        {/* CTA Button */}
        <Button asChild size="lg" className="group">
          <Link href={isDashboardRoute ? ROUTES.DASHBOARD.ROOT : ROUTES.HOME}>
            <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
            {isDashboardRoute ? t("back_dashboard") : t("back_home")}
            <Home className="ml-2 size-4" />
          </Link>
        </Button>
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
            <div className="p-4 sm:p-6 lg:p-8">{notFoundContent}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {notFoundContent}
    </>
  );
}
