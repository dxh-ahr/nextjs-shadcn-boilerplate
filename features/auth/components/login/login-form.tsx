"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/features/auth/actions";
import { loginSchema, type LoginInput } from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const t = useTranslations("auth.login");

  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);

    const result = await loginAction(data);

    console.log(result);

    if (result.success) {
      form.reset();
    } else {
      setError(result.error);
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          const message = messages[0];
          if (message) {
            form.setError(field as keyof LoginInput, {
              type: "server",
              message,
            });
          }
        });
      }
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

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

        <FormField name="password" label={t("fields.password")}>
          {(field) => (
            <Input
              id={field.name}
              type="password"
              placeholder={t("fields.password_placeholder")}
              {...field}
            />
          )}
        </FormField>

        <div className="flex items-center justify-between gap-3 sm:gap-0 flex-wrap sm:flex-nowrap">
          <FormField
            name="rememberMe"
            label=""
            className="w-full min-[400px]:w-1/2"
          >
            {(field) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <label
                  htmlFor={field.name}
                  className="text-sm font-normal cursor-pointer"
                >
                  {t("remember_me")}
                </label>
              </div>
            )}
          </FormField>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline base-1/2"
          >
            {t("forgot_password")}
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={false}>
          {false ? t("submitting") : t("submit")}
        </Button>
      </div>
    </Form>
  );
}
