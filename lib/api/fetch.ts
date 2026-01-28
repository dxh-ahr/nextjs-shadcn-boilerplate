import { env } from "@/lib/env";
import { cookies } from "next/headers";

export interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  token?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
  data?: unknown;
  error?: string;
}

async function getAuthToken(token?: string): Promise<string | null> {
  if (token) {
    return token;
  }

  if (globalThis.window instanceof Window) {
    return localStorage.getItem("dxh_key");
  }

  const cookieStore = await cookies();
  return cookieStore.get("dxh_key")?.value || null;
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

export async function apiFetch<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseURL = env.NEXT_PUBLIC_API_URL || "";
  const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

  const headers = await buildHeaders(options);

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  let data: unknown;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw (data as { errors?: Record<string, string[]> })?.errors;
  }

  return data as T;
}

export function setAuthToken(token: string): void {
  if (globalThis.window instanceof Window) {
    localStorage.setItem("dxh_key", token);
  }
}

export function clearAuthToken(): void {
  if (globalThis.window instanceof Window) {
    localStorage.removeItem("dxh_key");
  }
}
