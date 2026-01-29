"use client";

import type { Locale } from "@/i18n/types";
import { COOKIE, DEFAULT_LOCALE, TIME } from "@/lib/constants";
import { getCookie, setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NativeSelect, NativeSelectOption } from "./ui/native-select";

const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export const locales: readonly Locale[] = ["en", "fr"] as const;

export function LocaleSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale((getCookie(COOKIE.LOCALE) as Locale) || DEFAULT_LOCALE);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setCookie(COOKIE.LOCALE, newLocale, {
      path: "/",
      maxAge: TIME.LOCALE_COOKIE_MAX_AGE,
    });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <NativeSelect
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
      >
        {locales.map((loc) => (
          <NativeSelectOption key={loc} value={loc}>
            {localeLabels[loc]}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
