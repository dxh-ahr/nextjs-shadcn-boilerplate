import { cookies } from "next/headers";

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
  maxAge: 15 * 60, // 15 minutes
};

const refreshTokenCookieOptions = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

async function getAuthToken(token?: string): Promise<string | null> {
  if (token) return token;
  const cookieStore = await cookies();
  return cookieStore.get("dxh_access_token")?.value || null;
}

export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("dxh_access_token", token, accessTokenCookieOptions);
  cookieStore.set("dxh_refresh_token", token, refreshTokenCookieOptions);
}

export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("dxh_access_token");
  cookieStore.delete("dxh_refresh_token");
}

async function buildHeaders(options: FetchOptions = {}): Promise<HeadersInit> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.requireAuth !== false) {
    const token = await getAuthToken(options.token);
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
  const isJson = !!contentType?.includes("application/json");

  const data: unknown = isJson ? await response.json() : await response.text();

  return data as T;
}
