import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Custom URL validator
 */
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
 * This provides better type safety and Next.js integration
 */
export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    DATABASE_URL: urlSchema.transform((val) => (val === "" ? undefined : val)),
    API_SECRET_KEY: z.string().min(32).optional(),
    JWT_SECRET: z.string().min(32).optional(),
    JWT_EXPIRES_IN: z.string().default("7d"),
    CORS_ORIGIN: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        return val.split(",").map((origin) => origin.trim());
      }),
    ENABLE_ANALYTICS: z
      .string()
      .default("false")
      .transform((val) => val === "true"),
    BUILD_STANDALONE: z
      .string()
      .default("false")
      .transform((val) => val === "true"),
  },

  /**
   * Specify your client-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1).optional(),
    NEXT_PUBLIC_APP_URL: urlSchema,
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env["NODE_ENV"],
    DATABASE_URL: process.env["DATABASE_URL"],
    API_SECRET_KEY: process.env["API_SECRET_KEY"],
    JWT_SECRET: process.env["JWT_SECRET"],
    JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"],
    CORS_ORIGIN: process.env["CORS_ORIGIN"],
    ENABLE_ANALYTICS: process.env["ENABLE_ANALYTICS"],
    BUILD_STANDALONE: process.env["BUILD_STANDALONE"],
    NEXT_PUBLIC_APP_NAME: process.env["NEXT_PUBLIC_APP_NAME"],
    NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
  },

  /**
   * Run `build` or `dev` with SKIP_ENV_VALIDATION to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env["SKIP_ENV_VALIDATION"],

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
