export const mutationKeys = {
  auth: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    forgotPassword: ["auth", "forgot-password"] as const,
    resetPassword: ["auth", "reset-password"] as const,
  },
} as const;
