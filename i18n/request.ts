import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import { COOKIE, DEFAULT_LOCALE } from "@/lib/constants";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get(COOKIE.LOCALE)?.value || DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
