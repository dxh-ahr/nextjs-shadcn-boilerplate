import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Shield, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

const values = [
  {
    key: "quality",
    icon: CheckCircle2,
  },
  {
    key: "security",
    icon: Shield,
  },
  {
    key: "innovation",
    icon: Sparkles,
  },
] as const;

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h1 className="mb-6 animate-fade-in-up text-5xl font-light tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          <p
            className="mx-auto mb-12 max-w-2xl animate-fade-in-up text-lg font-light leading-relaxed text-muted-foreground sm:text-xl"
            style={{ animationDelay: "100ms" }}
          >
            {t("subtitle")}
          </p>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      {/* Mission Section */}
      <section className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            {t("mission.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
            {t("mission.description")}
          </p>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      {/* Values Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            {t("values.title")}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.key}
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
                    {t(`values.${value.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {t(`values.${value.key}.description`)}
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
