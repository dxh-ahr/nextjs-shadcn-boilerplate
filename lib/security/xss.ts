/**
 * XSS (Cross-Site Scripting) protection utilities
 * Provides functions to prevent XSS attacks in your application
 */

/**
 * Escape HTML special characters to prevent XSS
 * This is the primary defense against XSS attacks
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== "string") {
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

  return unsafe.replaceAll(/[&<>"'/]/g, (char) => entityMap[char] || char);
}

/**
 * Escape HTML attributes to prevent XSS in attribute values
 */
export function escapeHtmlAttribute(unsafe: string): string {
  if (typeof unsafe !== "string") {
    return "";
  }

  return escapeHtml(unsafe).replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
}

/**
 * Escape JavaScript string to prevent XSS in script contexts
 */
export function escapeJavaScript(unsafe: string): string {
  if (typeof unsafe !== "string") {
    return "";
  }

  const backslash = "\\";
  const singleQuote = "'";
  const doubleQuote = '"';
  const newline = "\n";
  const carriageReturn = "\r";
  const tab = "\t";
  const lineSeparator = "\u2028";
  const paragraphSeparator = "\u2029";

  return unsafe
    .replaceAll(backslash, String.raw`\\`)
    .replaceAll(singleQuote, String.raw`\'`)
    .replaceAll(doubleQuote, String.raw`\"`)
    .replaceAll(newline, String.raw`\n`)
    .replaceAll(carriageReturn, String.raw`\r`)
    .replaceAll(tab, String.raw`\t`)
    .replaceAll(lineSeparator, String.raw`\u2028`)
    .replaceAll(paragraphSeparator, String.raw`\u2029`);
}

/**
 * Escape CSS string to prevent XSS in style contexts
 */
export function escapeCss(unsafe: string): string {
  if (typeof unsafe !== "string") {
    return "";
  }

  return unsafe.replaceAll(/[<>'"]/g, (char) => {
    const codePoint = char.codePointAt(0) ?? 0;
    return `\\${codePoint.toString(16)} `;
  });
}

/**
 * Escape URL to prevent javascript: and data: protocol attacks
 */
export function escapeUrl(unsafe: string): string {
  if (typeof unsafe !== "string") {
    return "";
  }

  const trimmed = unsafe.trim();

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

  // Only allow safe protocols
  if (
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("/") &&
    !trimmed.startsWith("#") &&
    !trimmed.startsWith("?") &&
    !trimmed.startsWith("mailto:") &&
    !trimmed.startsWith("tel:")
  ) {
    return "#";
  }

  return trimmed;
}

/**
 * Validate and sanitize user input for safe rendering
 * Combines multiple XSS prevention techniques
 */
export function sanitizeForRender(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove null bytes
  let sanitized = input.replaceAll("\0", "");

  // Remove control characters (using character code filtering to avoid regex warnings)
  // Filter out control characters by checking character codes
  sanitized = Array.from(sanitized)
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0;
      // Allow: TAB (9), LF (10), CR (13), and printable ASCII (32-126)
      // Block: NULL (0), other control chars (1-8, 11-12, 14-31), DEL (127)
      return (
        code === 9 ||
        code === 10 ||
        code === 13 ||
        (code >= 32 && code <= 126) ||
        code > 127
      );
    })
    .join("");

  // Escape HTML
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Create a safe HTML attribute value
 */
export function safeAttributeValue(value: string): string {
  return escapeHtmlAttribute(value);
}

/**
 * Create a safe HTML data attribute value
 */
export function safeDataAttribute(value: string): string {
  return escapeHtmlAttribute(JSON.stringify(value));
}

/**
 * Validate content security for inline scripts
 * Returns false if content contains potentially dangerous patterns
 */
export function isSafeForInlineScript(content: string): boolean {
  if (typeof content !== "string") {
    return false;
  }

  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /expression\s*\(/i, // CSS expressions
    /vbscript:/i,
    /data:text\/html/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(content));
}

/**
 * Content Security Policy helper
 * Generates CSP nonce for inline scripts
 */
export function generateCspNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Validate JSON string for safe parsing
 * Prevents prototype pollution and other JSON-based attacks
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    // Remove potential __proto__ and constructor properties
    const cleaned = jsonString.replaceAll(
      /"__proto__"|"constructor"/g,
      '"__removed__"'
    );

    const parsed = JSON.parse(cleaned) as T;

    // Additional validation: check for prototype pollution
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (Object.hasOwn(parsed, "__proto__") ||
        Object.hasOwn(parsed, "constructor"))
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * React-specific: Safe prop value for dangerouslySetInnerHTML
 * Use with extreme caution - prefer React's built-in escaping
 */
export function safeDangerouslySetInnerHTML(content: string): {
  __html: string;
} {
  return {
    __html: sanitizeForRender(content),
  };
}
