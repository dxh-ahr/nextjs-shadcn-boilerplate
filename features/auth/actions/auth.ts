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
import { apiFetch, type ApiError } from "@/lib/api";
import { setAuthToken } from "@/lib/api/fetch";
import type { ApiResponse, LoginResponse, UserProfile } from "./type";

export async function registerAction(data: RegisterInput) {
  try {
    const formData = registerSchema.parse(data);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      company_name: "test",
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    const response = await apiFetch<ApiResponse<UserProfile>>(
      "/api/auth/v1/register/",
      {
        method: "POST",
        body: JSON.stringify(payload),
        requireAuth: false,
      }
    );

    return response;
  } catch (error) {
    return error as ApiError;
  }
}

export async function loginAction(data: LoginInput) {
  try {
    const formData = loginSchema.parse(data);

    const payload: Record<string, unknown> = {
      email: formData.email,
      password: formData.password,
    };

    const response = await apiFetch<ApiResponse<LoginResponse>>(
      "/api/auth/v1/login/",
      {
        method: "POST",
        body: JSON.stringify(payload),
        requireAuth: false,
      }
    );

    if (response.status === "success") {
      await setAuthToken(response.data.tokens.access);
    }

    return response;
  } catch (error) {
    return error as ApiError;
  }
}

export async function forgotPasswordAction(data: ForgotPasswordInput) {
  try {
    const formData = forgotPasswordSchema.parse(data);

    const payload: Record<string, unknown> = {
      email: formData.email,
    };

    const response = await apiFetch<ApiResponse<null>>(
      "/api/auth/v1/password/forgot/",
      {
        method: "POST",
        body: JSON.stringify(payload),
        requireAuth: false,
      }
    );

    return response;
  } catch (error) {
    return error as ApiError;
  }
}

export async function resetPasswordAction(
  data: ResetPasswordInput,
  token: string
) {
  try {
    const formData = resetPasswordSchema.parse(data);

    const payload: Record<string, unknown> = {
      new_password: formData.newPassword,
      confirm_password: formData.confirmPassword,
      token,
    };

    const response = await apiFetch<ApiResponse<null>>(
      "/api/auth/v1/password/reset/",
      {
        method: "POST",
        body: JSON.stringify(payload),
        requireAuth: false,
        headers: {
          "X-Reset-Token": token,
        },
      }
    );

    return response;
  } catch (error) {
    return error as ApiError;
  }
}

export async function verifyEmailAction(code: string, email: string) {
  try {
    const response = await apiFetch<ApiResponse<null>>(
      `/api/auth/v1/verification/email/verify/`,
      {
        method: "POST",
        body: JSON.stringify({ code, email, type: "email_otp" }),
        requireAuth: false,
      }
    );

    return response;
  } catch (error) {
    return error as ApiError;
  }
}

export async function resendVerificationEmailAction(email: string) {
  try {
    const response = await apiFetch<ApiResponse<null>>(
      `/api/auth/v1/verification/email/resend/`,
      {
        method: "POST",
        body: JSON.stringify({ email, type: "email_otp" }),
        requireAuth: false,
      }
    );

    return response;
  } catch (error) {
    return error as ApiError;
  }
}
