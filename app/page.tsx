"use client";

import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("HomePage");

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
    </section>
  );
}
