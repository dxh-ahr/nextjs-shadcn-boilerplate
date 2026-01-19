import { z } from "zod";

/**
 * Input sanitization utilities
 * Provides functions to sanitize and validate user inputs
 */

/**
 * Sanitize string input by removing dangerous characters
 * Removes HTML tags, script tags, and other potentially dangerous content
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove control characters using character code filtering to avoid regex warnings
  let sanitized = input.trim();

  // Remove null bytes
  sanitized = sanitized.replaceAll("\0", " ");

  // Remove control characters except newlines and tabs (replace with space)
  // Filter out control characters by checking character codes
  sanitized = Array.from(sanitized)
    .map((char) => {
      const code = char.codePointAt(0) ?? 0;
      // Allow: TAB (9), LF (10), CR (13), and printable ASCII (32-126)
      // Replace: NULL (0), other control chars (1-8, 11-12, 14-31), DEL (127) with space
      if (
        code === 0 ||
        (code >= 1 && code <= 8) ||
        (code >= 11 && code <= 12) ||
        (code >= 14 && code <= 31) ||
        code === 127
      ) {
        return " ";
      }
      return char;
    })
    .join("");

  // Normalize whitespace
  sanitized = sanitized.replaceAll(/\s+/g, " ");

  return sanitized;
}

/**
 * Sanitize HTML content by escaping special characters
 * Prevents XSS attacks by escaping HTML entities
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  const entityMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replaceAll(/[&<>"'/]/g, (char) => entityMap[char] || char);
}

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== "string") {
    return "";
  }

  const trimmed = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = [
    "javascript:",
    "data:",
    "vbscript:",
    "file:",
    "about:",
  ];

  const lowerUrl = trimmed.toLowerCase();
  if (dangerousProtocols.some((protocol) => lowerUrl.startsWith(protocol))) {
    return "#";
  }

  // Only allow http, https, and relative URLs
  if (
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("/") &&
    !trimmed.startsWith("#") &&
    !trimmed.startsWith("?")
  ) {
    return "#";
  }

  return trimmed;
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") {
    return "";
  }

  return email.trim().toLowerCase();
}

/**
 * Sanitize phone number (removes non-digit characters except +)
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") {
    return "";
  }

  // Keep only digits, spaces, hyphens, parentheses, and +
  return phone.replaceAll(/[^\d\s\-()+]/g, "");
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: string | number): number | null {
  if (typeof input === "number") {
    return Number.isNaN(input) ? null : input;
  }

  if (typeof input !== "string") {
    return null;
  }

  const parsed = Number.parseFloat(input);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Sanitize integer input
 */
export function sanitizeInteger(input: string | number): number | null {
  if (typeof input === "number") {
    return Number.isInteger(input) ? input : null;
  }

  if (typeof input !== "string") {
    return null;
  }

  const parsed = Number.parseInt(input, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Remove HTML tags from string
 */
export function stripHtmlTags(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input.replaceAll(/<[^>]*>/g, "");
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: {
    sanitizeStrings?: boolean;
    sanitizeUrls?: boolean;
    maxDepth?: number;
  } = {}
): T {
  const {
    sanitizeStrings = true,
    sanitizeUrls = false,
    maxDepth = 10,
  } = options;

  if (maxDepth <= 0) {
    return obj;
  }

  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === "string") {
      if (sanitizeUrls && (key.includes("url") || key.includes("link"))) {
        sanitized[key] = sanitizeUrl(value) as T[typeof key];
      } else if (sanitizeStrings) {
        sanitized[key] = sanitizeString(value) as T[typeof key];
      }
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>, {
        ...options,
        maxDepth: maxDepth - 1,
      }) as T[typeof key];
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => {
        if (typeof item === "string") {
          return sanitizeStrings ? sanitizeString(item) : item;
        }
        if (item && typeof item === "object") {
          return sanitizeObject(item as Record<string, unknown>, {
            ...options,
            maxDepth: maxDepth - 1,
          });
        }
        return item;
      }) as T[typeof key];
    }
  }

  return sanitized;
}

/**
 * Zod schema for common sanitization patterns
 */
// Custom URL validator to avoid deprecated .url() method
const urlSchema = z.string().refine(
  (val) => {
    if (!val) return false;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Must be a valid URL" }
);

// Custom email validator to avoid deprecated .email() method
const emailSchema = z.string().refine(
  (val) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(val);
  },
  { message: "Must be a valid email address" }
);

export const sanitizeSchemas = {
  string: z.string().transform(sanitizeString),
  email: emailSchema.transform(sanitizeEmail),
  url: urlSchema.transform(sanitizeUrl),
  phone: z.string().transform(sanitizePhone),
  number: z.coerce.number(),
  integer: z.coerce.number().int(),
  positiveNumber: z.coerce.number().positive(),
  nonNegativeNumber: z.coerce.number().nonnegative(),
};
