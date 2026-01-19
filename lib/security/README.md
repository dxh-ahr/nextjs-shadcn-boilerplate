# Security Utilities

This directory contains security utilities for input sanitization and XSS protection.

## Input Sanitization (`sanitize.ts`)

Provides functions to sanitize and validate user inputs before processing or storing them.

### Usage Examples

```typescript
import {
  sanitizeString,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeObject,
} from "@/lib/security";

// Sanitize string input
const cleanInput = sanitizeString(userInput);

// Sanitize URL
const safeUrl = sanitizeUrl(userProvidedUrl);

// Sanitize email
const cleanEmail = sanitizeEmail(userEmail);

// Sanitize entire object
const cleanData = sanitizeObject(userData, {
  sanitizeStrings: true,
  sanitizeUrls: true,
  maxDepth: 10,
});
```

### Available Functions

- `sanitizeString(input)` - Removes dangerous characters and normalizes whitespace
- `sanitizeHtml(input)` - Escapes HTML entities
- `sanitizeUrl(url)` - Validates and sanitizes URLs, blocks dangerous protocols
- `sanitizeEmail(email)` - Normalizes email addresses
- `sanitizePhone(phone)` - Cleans phone numbers
- `sanitizeNumber(input)` - Parses and validates numbers
- `sanitizeInteger(input)` - Parses and validates integers
- `stripHtmlTags(input)` - Removes HTML tags from strings
- `sanitizeObject(obj, options)` - Recursively sanitizes object properties

## XSS Protection (`xss.ts`)

Provides functions to prevent Cross-Site Scripting (XSS) attacks.

### Usage Examples

```typescript
import { escapeHtml, escapeUrl, sanitizeForRender } from "@/lib/security";

// Escape HTML content
const safeHtml = escapeHtml(userContent);

// Escape URL
const safeUrl = escapeUrl(userProvidedUrl);

// Comprehensive sanitization for rendering
const safeContent = sanitizeForRender(userInput);
```

### Available Functions

- `escapeHtml(unsafe)` - Escapes HTML special characters
- `escapeHtmlAttribute(unsafe)` - Escapes HTML attribute values
- `escapeJavaScript(unsafe)` - Escapes JavaScript strings
- `escapeCss(unsafe)` - Escapes CSS strings
- `escapeUrl(unsafe)` - Validates and escapes URLs
- `sanitizeForRender(input)` - Comprehensive sanitization for safe rendering
- `safeAttributeValue(value)` - Creates safe HTML attribute values
- `safeDataAttribute(value)` - Creates safe HTML data attributes
- `isSafeForInlineScript(content)` - Validates content for inline scripts
- `generateCspNonce()` - Generates CSP nonce for Content Security Policy
- `safeJsonParse(jsonString)` - Safely parses JSON with prototype pollution protection

## Best Practices

1. **Always sanitize user input** before storing in database or rendering
2. **Use escapeHtml** when rendering user content in HTML
3. **Use escapeUrl** when using user-provided URLs
4. **Validate on both client and server** - client validation for UX, server validation for security
5. **Use Content Security Policy** headers to add an additional layer of protection
6. **Never trust user input** - always validate and sanitize

## Integration with Forms

```typescript
import { sanitizeString, sanitizeEmail } from "@/lib/security";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().transform(sanitizeString),
  email: z.string().email().transform(sanitizeEmail),
  website: z.string().url().transform(sanitizeUrl),
});
```

## React Component Example

```typescript
import { escapeHtml } from "@/lib/security";

function UserComment({ content }: { content: string }) {
  // Always escape user content before rendering
  const safeContent = escapeHtml(content);

  return <div dangerouslySetInnerHTML={{ __html: safeContent }} />;
}
```
