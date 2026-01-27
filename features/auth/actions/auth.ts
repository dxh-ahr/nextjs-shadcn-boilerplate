"use server";

import {
  forgotPasswordSchema,
  ForgotPasswordInput,
  LoginInput,
  loginSchema,
  registerSchema,
  RegisterInput,
  resetPasswordSchema,
  ResetPasswordInput,
} from "@/features/auth/validations/auth";
import { z } from "zod";
import type { ActionResult } from "./type";

export async function registerAction(
  data: RegisterInput
): Promise<ActionResult<{ email: string; name: string }>> {
  try {
    const validated = registerSchema.parse(data);

    // TODO: Implement actual registration logic
    // Example: await createUser(validated);

    return {
      success: true,
      data: { email: validated.email, name: validated.name },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] ??= [];
        fieldErrors[path].push(issue.message);
      });

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function loginAction(
  data: LoginInput
): Promise<ActionResult<{ email: string }>> {
  try {
    const validatedData = loginSchema.parse(data);

    // TODO: Implement login api call

    return {
      success: true,
      data: { email: validatedData.email },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] ??= [];
        fieldErrors[path].push(issue.message);
      });

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function forgotPasswordAction(
  data: ForgotPasswordInput
): Promise<ActionResult<{ email: string }>> {
  try {
    const validated = forgotPasswordSchema.parse(data);

    // TODO: Implement actual forgot password logic
    // Example: await sendPasswordResetEmail(validated.email);

    return {
      success: true,
      data: { email: validated.email },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] ??= [];
        fieldErrors[path].push(issue.message);
      });

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

export async function resetPasswordAction(
  data: ResetPasswordInput
): Promise<ActionResult<{ success: boolean }>> {
  try {
    resetPasswordSchema.parse(data);

    // TODO: Implement actual password reset logic
    // Example: await updatePassword(validated);

    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] ??= [];
        fieldErrors[path].push(issue.message);
      });

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Password reset failed",
    };
  }
}
