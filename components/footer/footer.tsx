import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-light text-muted-foreground">
            {t("copyright", { year: currentYear })}
          </p>
          <p className="text-xs font-light text-muted-foreground/80">
            {t("credit")}
          </p>
        </div>
      </div>
    </footer>
  );
}
