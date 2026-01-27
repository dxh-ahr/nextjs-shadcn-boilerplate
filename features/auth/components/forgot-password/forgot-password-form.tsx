"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { forgotPasswordAction } from "../../actions";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgot_password");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    const response = await forgotPasswordAction(data);

    if (!response.success || "error" in response) {
      toast.error(
        (response as { error: string }).error || "Invalid email address"
      );
      return;
    }

    toast.success("Password reset link sent to your email address");
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        <FormField name="email" label={t("fields.email")}>
          {(field) => (
            <Input
              id={field.name}
              type="email"
              placeholder={t("fields.email_placeholder")}
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
