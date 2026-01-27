"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordAction } from "@/features/auth/actions";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export function ResetPasswordForm() {
  const t = useTranslations("auth.reset_password");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await resetPasswordAction(data);

      if (result.success) {
        setSuccess(true);
        form.reset();
      } else {
        setError(result.error);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            const message = messages[0];
            if (message) {
              form.setError(field as keyof ResetPasswordInput, {
                type: "server",
                message,
              });
            }
          });
        }
      }
    });
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
          <div className="font-semibold mb-1">{t("success.title")}</div>
          <div>{t("success.description")}</div>
        </div>
        <Button asChild className="w-full">
          <Link href="/auth/login">{t("success.login_link")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <FormField name="oldPassword" label={t("fields.old_password")}>
          {(field) => (
            <Input
              id={field.name}
              type="password"
              placeholder={t("fields.old_password_placeholder")}
              {...field}
            />
          )}
        </FormField>

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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
      </div>
    </Form>
  );
}
