import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const urlSchema = z
  .string()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL" }
  )
  .optional();

/**
 * Environment variable validation using @t3-oss/env-nextjs
 * Provides type safety and Next.js integration for environment variables
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    ENABLE_ANALYTICS: z
      .string()
      .default("false")
      .transform((val) => val === "true"),
    BUILD_STANDALONE: z
      .string()
      .default("false")
      .transform((val) => val === "true"),
    API_URL: urlSchema,
  },

  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1).optional(),
    NEXT_PUBLIC_APP_URL: urlSchema,
    NEXT_PUBLIC_API_URL: urlSchema,
  },

  runtimeEnv: {
    NODE_ENV: process.env["NODE_ENV"],
    ENABLE_ANALYTICS: process.env["ENABLE_ANALYTICS"],
    BUILD_STANDALONE: process.env["BUILD_STANDALONE"],
    API_URL: process.env["API_URL"],
    NEXT_PUBLIC_APP_NAME: process.env["NEXT_PUBLIC_APP_NAME"],
    NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
    NEXT_PUBLIC_API_URL: process.env["NEXT_PUBLIC_API_URL"],
  },

  skipValidation: !!process.env["SKIP_ENV_VALIDATION"],
  emptyStringAsUndefined: true,
});
