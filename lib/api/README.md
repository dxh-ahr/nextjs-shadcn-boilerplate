# API Fetch Utility

Simple, reusable fetch utility with built-in authorization header support using native `fetch`.

## Features

- ✅ Automatic authorization header injection
- ✅ Token management (localStorage for client, cookies for server)
- ✅ Type-safe requests and responses
- ✅ Comprehensive error handling
- ✅ Field-level error extraction from API responses
- ✅ No external dependencies (uses native fetch)

## Usage

### Basic Usage

```typescript
import { apiFetch } from "@/lib/api";

// GET request
const user = await apiFetch<User>("/users/1");

// POST request
const newUser = await apiFetch<User>("/users", {
  method: "POST",
  body: JSON.stringify({
    name: "John",
    email: "john@example.com",
  }),
});

// PUT request
const updated = await apiFetch<User>("/users/1", {
  method: "PUT",
  body: JSON.stringify({ name: "Jane" }),
});

// DELETE request
await apiFetch("/users/1", {
  method: "DELETE",
});
```

### Authentication

```typescript
import { apiFetch, setAuthToken, clearAuthToken } from "@/lib/api";

// Set token (client-side only)
setAuthToken("your-token-here");

// Requests automatically include Authorization header
const data = await apiFetch("/protected-endpoint");

// Disable auth for specific request
const publicData = await apiFetch("/public/endpoint", {
  requireAuth: false,
});

// Use explicit token
const data = await apiFetch("/endpoint", {
  token: "explicit-token",
});

// Clear token
clearAuthToken();
```

### Server Actions

```typescript
"use server";

import { apiFetch } from "@/lib/api";

export async function getUserData(userId: string) {
  // Token is automatically read from cookies
  const user = await apiFetch<User>(`/users/${userId}`);
  return user;
}

// Without auth
const publicData = await apiFetch("/public", {
  requireAuth: false,
});
```

### Error Handling

The fetch utility automatically extracts error messages and field errors from API responses:

```typescript
import { apiFetch, type ApiError } from "@/lib/api";

try {
  await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
} catch (error) {
  const apiError = error as ApiError;

  console.log(apiError.message); // Main error message
  console.log(apiError.status); // HTTP status code
  console.log(apiError.fieldErrors); // Field-specific errors
  console.log(apiError.data); // Full error response
}
```

### Custom Headers

```typescript
await apiFetch("/endpoint", {
  method: "POST",
  headers: {
    "X-Custom-Header": "value",
  },
  body: JSON.stringify(data),
});
```

## Token Storage

- **Client-side**: Tokens are stored in `localStorage` under the key `auth_token`
- **Server-side**: Tokens are read from cookies under the key `auth_token`

## Configuration

The base URL is automatically set from `NEXT_PUBLIC_API_URL` environment variable.

You can use full URLs to override:

```typescript
await apiFetch("https://custom-api.com/endpoint");
```
