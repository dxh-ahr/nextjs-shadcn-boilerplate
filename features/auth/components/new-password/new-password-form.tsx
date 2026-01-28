"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetPasswordAction } from "../../actions";

export function NewPasswordForm() {
  const t = useTranslations("auth.reset_password");

  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  if (!token) {
    redirect("/auth/login");
  }

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    const response = await resetPasswordAction(data, token);

    if (response.status !== "success") {
      toast.error(response.message || "Reset password failed");
      return;
    }

    router.push("/auth/login");
    toast.success(response.message || "Password reset successful");
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        <FormField name="newPassword" label={t("fields.new_password")}>
          {(field) => (
            <Input
              id={field.name}
              type="password"
              placeholder={t("fields.new_password_placeholder")}
              {...field}
            />
          )}
        </FormField>

        <FormField name="confirmPassword" label={t("fields.confirm_password")}>
          {(field) => (
            <Input
              id={field.name}
              type="password"
              placeholder={t("fields.confirm_password_placeholder")}
              {...field}
            />
          )}
        </FormField>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </Form>
  );
}
