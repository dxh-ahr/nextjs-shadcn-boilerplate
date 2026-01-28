import type { ApiError } from "@/lib/api";

type ApiResponse<T> = {
  data: T;
  errors: ApiError | null;
  status: string;
  message: string;
};

type UserGroup = {
  id: number;
  name: string;
  code: string;
};

type UserPermissions = {
  user_permissions: string[];
  group_permissions: string[];
};

type UserProfile = {
  id: number;
  company_id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  groups: UserGroup[];
  permissions: UserPermissions;
  status: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
};

type LoginResponse = {
  tokens: {
    access: string;
    refresh: string;
  };
  user: UserProfile;
};

export type {
  ApiResponse,
  LoginResponse,
  UserGroup,
  UserPermissions,
  UserProfile,
  VerifyEmailResponse,
};
