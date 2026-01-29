"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resendVerificationEmailAction } from "@/features/auth/actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/validations";
import { ROUTES } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ResendVerificationEmailForm() {
  const t = useTranslations("auth.resend_verification_email");

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const router = useRouter();

  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: { email: email || "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    const response = await resendVerificationEmailAction(data.email);

    if (response.status !== "success") {
      toast.error(response.message || t("error_generic"));
      return;
    }

    setCooldownSeconds(120);
    router.push(`${ROUTES.AUTH.VERIFY_EMAIL_OTP}?email=${data.email}`);
    toast.success(response.message || t("success_toast"));
  };

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const isSubmitting = form.formState.isSubmitting;
  const isDisabled = isSubmitting || cooldownSeconds > 0;

  let buttonLabel = t("submit");

  if (cooldownSeconds > 0) {
    const minutes = Math.floor(cooldownSeconds / 60);
    const seconds = cooldownSeconds % 60;
    const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    buttonLabel = t("cooldown_label", { time: formatted });
  } else if (isSubmitting) {
    buttonLabel = t("submitting");
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        <FormField name="email" label={t("fields.email")}>
          {(field) => (
            <Input
              id={field.name}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t("fields.email_placeholder")}
              {...field}
            />
          )}
        </FormField>

        <Button type="submit" className="w-full" disabled={isDisabled}>
          {buttonLabel}
        </Button>
      </div>
    </Form>
  );
}
