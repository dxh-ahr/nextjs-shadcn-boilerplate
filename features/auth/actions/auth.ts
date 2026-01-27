"use server";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@/features/auth/validations/auth";
import { apiFetch } from "@/lib/api";

export async function registerAction(data: RegisterInput) {
  try {
    const formData = registerSchema.parse(data);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: "01777335815",
      company_title: "Doxhi",
      language: 1,
      currency: 1,
      plan: 1,
      is_owner: true,
      is_editor: false,
      password1: formData.password,
      password2: formData.confirmPassword,
    };

    const response = await apiFetch<{ key: string }>(
      "/dj-rest-auth/registration/",
      {
        method: "POST",
        body: JSON.stringify(payload),
        requireAuth: false,
      }
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    if (error && typeof error === "object") {
      return {
        success: false,
        error:
          (error as { non_field_errors: string[] }).non_field_errors?.[0] ||
          "Registration failed",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function loginAction(data: LoginInput) {
  try {
    const formData = loginSchema.parse(data);

    const payload: Record<string, unknown> = {
      email: formData.email,
      password: formData.password,
    };

    const response = await apiFetch<{ key: string }>("/dj-rest-auth/login/", {
      method: "POST",
      body: JSON.stringify(payload),
      requireAuth: false,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    if (error && typeof error === "object") {
      return {
        success: false,
        error:
          (error as { non_field_errors: string[] }).non_field_errors?.[0] ||
          "Login failed",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function forgotPasswordAction(data: ForgotPasswordInput) {
  try {
    const formData = forgotPasswordSchema.parse(data);

    const payload: Record<string, unknown> = {
      email: formData.email,
    };

    const response = await apiFetch("/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify(payload),
      requireAuth: false,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    if (error && typeof error === "object") {
      return {
        success: false,
        error:
          (error as { non_field_errors: string[] }).non_field_errors?.[0] ||
          "Email verification failed",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Email verification failed",
    };
  }
}

export async function resetPasswordAction(
  data: ResetPasswordInput,
  token: string
) {
  try {
    const formData = resetPasswordSchema.parse(data);

    const payload: Record<string, unknown> = {
      password: formData.newPassword,
      confirm_password: formData.confirmPassword,
      token,
    };

    const response = await apiFetch("/auth/reset-password/", {
      method: "POST",
      body: JSON.stringify(payload),
      requireAuth: false,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    if (error && typeof error === "object") {
      return {
        success: false,
        error:
          (error as { non_field_errors: string[] }).non_field_errors?.[0] ||
          "Password reset failed",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Password reset failed",
    };
  }
}

export async function verifyEmailAction(token: string) {
  try {
    const response = await apiFetch(`/auth/verify-email?token=${token}`, {
      method: "GET",
      requireAuth: false,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    if (error && typeof error === "object") {
      return {
        success: false,
        error:
          (error as { non_field_errors: string[] }).non_field_errors?.[0] ||
          "Email verification failed",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Email verification failed",
    };
  }
}
