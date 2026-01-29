import { cookies } from "next/headers";

import { COOKIE, HTTP, TIME } from "@/lib/constants";
import { env } from "@/lib/env";

export interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  token?: string;
}

export interface ApiError {
  message: string;
  status: string;
  data: null;
  errors: null;
}

const accessTokenCookieOptions = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: TIME.ACCESS_TOKEN_COOKIE_MAX_AGE,
};

const refreshTokenCookieOptions = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: TIME.REFRESH_TOKEN_COOKIE_MAX_AGE,
};

export async function getAuthToken(
  token?: string | null | undefined
): Promise<string | null> {
  if (token) return token;
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE.ACCESS_TOKEN)?.value || null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE.REFRESH_TOKEN)?.value || null;
}

export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE.ACCESS_TOKEN, token, accessTokenCookieOptions);
  cookieStore.set(COOKIE.REFRESH_TOKEN, token, refreshTokenCookieOptions);
}

export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE.ACCESS_TOKEN);
  cookieStore.delete(COOKIE.REFRESH_TOKEN);
}

async function buildHeaders(options: FetchOptions = {}): Promise<HeadersInit> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", HTTP.CONTENT_TYPE_JSON);
  }

  if (options.requireAuth !== false) {
    const token = await getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
}

function getApiBaseUrl(): string {
  if (globalThis.window === undefined && env.API_URL) {
    return env.API_URL;
  }
  return env.NEXT_PUBLIC_API_URL || "";
}

export async function apiFetch<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseURL = getApiBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

  const headers = await buildHeaders(options);

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = !!contentType?.includes(HTTP.CONTENT_TYPE_JSON);

  const data: unknown = isJson ? await response.json() : await response.text();

  return data as T;
}
