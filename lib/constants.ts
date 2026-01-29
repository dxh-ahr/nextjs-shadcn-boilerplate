/** Time durations in seconds (for cookies, cache TTL, etc.) */
export const TIME = {
  ACCESS_TOKEN_COOKIE_MAX_AGE: 15 * 60, // 15 minutes
  REFRESH_TOKEN_COOKIE_MAX_AGE: 7 * 24 * 60 * 60, // 7 days
  LOCALE_COOKIE_MAX_AGE: 60 * 60 * 24 * 30, // 30 days
  IMAGE_CACHE_TTL_DEV: 60 * 60 * 24, // 1 day
  IMAGE_CACHE_TTL_PROD: 60 * 60 * 24 * 365, // 1 year
  HSTS_MAX_AGE: 63_072_000, // HSTS max-age: 2 years
  STATIC_CACHE_MAX_AGE: 31_536_000, // Static asset cache: 1 year
} as const;

/** Durations in milliseconds (for React Query, animations, timeouts) */
export const TIME_MS = {
  QUERY_STALE_TIME: 60 * 1000, // 1 minute
  PLAYWRIGHT_WEBSERVER_TIMEOUT: 120 * 1000, // 2 minutes
  ANIMATION_DELAY_SUBTITLE: 100, // 100 milliseconds
  ANIMATION_DELAY_CTA: 200, // 200 milliseconds
  ANIMATION_DELAY_STAGGER: 50, // 50 milliseconds
  ANIMATION_DURATION_CARD: 300, // 300milliseconds
} as const;

/** Cookie names */
export const COOKIE = {
  ACCESS_TOKEN: "dxh_access_token",
  REFRESH_TOKEN: "dxh_refresh_token",
  LOCALE: "dxh_locale",
} as const;

/** App route paths */
export const ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    NEW_PASSWORD: "/auth/new-password",
    VERIFY_EMAIL: "/auth/verify-email",
    VERIFY_EMAIL_OTP: "/auth/verify-email-otp",
    RESEND_VERIFICATION_EMAIL: "/auth/resend-verification-email",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
    ANALYTICS: "/dashboard/analytics",
    REPORTS: "/dashboard/reports",
    PROJECTS_NEW: "/dashboard/projects/new",
  },
  HOME: "/",
  CONTACT: "/contact",
  ABOUT_US: "/about-us",
} as const;

/** Routes that require authentication */
export const PROTECTED_ROUTES: readonly string[] = [ROUTES.DASHBOARD.ROOT];

/** Routes only for unauthenticated users (redirect to dashboard when logged in) */
export const AUTH_ROUTES: readonly string[] = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.NEW_PASSWORD,
  ROUTES.AUTH.VERIFY_EMAIL,
  ROUTES.AUTH.VERIFY_EMAIL_OTP,
  ROUTES.AUTH.RESEND_VERIFICATION_EMAIL,
];

/** API endpoint paths (relative to base URL) */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/v1/register/",
    LOGIN: "/api/auth/v1/login/",
    LOGOUT: "/api/auth/v1/logout/",
    PASSWORD_FORGOT: "/api/auth/v1/password/forgot/",
    PASSWORD_RESET: "/api/auth/v1/password/reset/",
    VERIFICATION_EMAIL_VERIFY: "/api/auth/v1/verification/email/verify/",
    VERIFICATION_EMAIL_RESEND: "/api/auth/v1/verification/email/resend/",
  },
  /** Client-side auth check (Next.js API route) */
  AUTH_CHECK: "/api/check-auth",
  CLEAR_AUTH: "/api/clear-auth",
} as const;

/** HTTP / headers */
export const HTTP = {
  CONTENT_TYPE_JSON: "application/json",
  HEADER_X_RESET_TOKEN: "X-Reset-Token",
} as const;

/** React Query default options */
export const QUERY = {
  STALE_TIME_MS: TIME_MS.QUERY_STALE_TIME,
  MUTATION_RETRY_COUNT: 1,
} as const;

/** Next.js image config */
export const IMAGE = {
  QUALITIES: [75, 90, 100] as readonly number[],
  MAX_REDIRECTS: 3,
} as const;

/** Default locale */
export const DEFAULT_LOCALE = "en" as const;
