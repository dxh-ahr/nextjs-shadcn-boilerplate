"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  CheckCircle2,
  Code,
  Container,
  Palette,
  Shield,
  TestTube,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";

const features = [
  {
    key: "security",
    icon: Shield,
  },
  {
    key: "testing",
    icon: TestTube,
  },
  {
    key: "ui",
    icon: Palette,
  },
  {
    key: "docker",
    icon: Container,
  },
  {
    key: "typescript",
    icon: Code,
  },
  {
    key: "quality",
    icon: CheckCircle2,
  },
] as const;

export default function Page() {
  const t = useTranslations("home_page");

  const isAuthenticated = useMemo(() => {
    return !!localStorage.getItem("dxh_key");
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* Main Heading */}
          <h1 className="mb-6 animate-fade-in-up text-5xl font-light tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto mb-12 max-w-2xl animate-fade-in-up text-lg font-light leading-relaxed text-muted-foreground sm:text-xl"
            style={{ animationDelay: "100ms" }}
          >
            {t("subtitle")}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "200ms" }}
          >
            {isAuthenticated ? (
              <Button
                asChild
                size="lg"
                className="group min-w-[160px] animate-fade-in-up"
              >
                <Link href="/dashboard">
                  {t("cta_primary")}
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="group min-w-[160px] animate-fade-in-up"
              >
                <Link href="/auth/register">
                  {t("cta_primary")}
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[160px] animate-fade-in-up"
            >
              <Link href="/about-us">{t("cta_secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      {/* Features Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light text-muted-foreground sm:text-lg">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.key}
                className="group animate-fade-in-up border-border/50 transition-all duration-300 hover:border-border hover:shadow-md"
                style={{
                  animationDelay: `${index * 50}ms`,
                  opacity: 0,
                }}
              >
                <CardHeader>
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="size-6" />
                  </div>
                  <CardTitle className="text-xl font-medium">
                    {t(`features.${feature.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
