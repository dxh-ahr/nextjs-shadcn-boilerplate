import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
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
          <Link href="/">
            <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
            {t("back_home")}
            <Home className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
