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
import { getRefreshToken, setAuthToken } from "@/lib/api/fetch";
import { API_ENDPOINTS, HTTP } from "@/lib/constants";
import type { ApiResponse, LoginResponse, UserProfile } from "./type";

export async function registerAction(data: RegisterInput) {
  try {
    const formData = registerSchema.parse(data);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      company_name: formData.companyName,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    const response = await apiFetch<ApiResponse<UserProfile>>(
      API_ENDPOINTS.AUTH.REGISTER,
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
      API_ENDPOINTS.AUTH.LOGIN,
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
      API_ENDPOINTS.AUTH.PASSWORD_FORGOT,
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
      API_ENDPOINTS.AUTH.PASSWORD_RESET,
      {
        method: "POST",
        body: JSON.stringify(payload),
        requireAuth: false,
        headers: {
          [HTTP.HEADER_X_RESET_TOKEN]: token,
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
      API_ENDPOINTS.AUTH.VERIFICATION_EMAIL_VERIFY,
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
      API_ENDPOINTS.AUTH.VERIFICATION_EMAIL_RESEND,
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

export async function logoutAction() {
  const refreshToken = await getRefreshToken();

  try {
    const response = await apiFetch<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.LOGOUT,
      {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
        requireAuth: true,
      }
    );

    return response;
  } catch (error) {
    return error as ApiError;
  }
}
