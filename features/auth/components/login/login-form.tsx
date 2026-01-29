"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/features/auth/actions";
import { loginSchema, type LoginInput } from "@/features/auth/validations";
import { ROUTES } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function LoginForm() {
  const t = useTranslations("auth.login");

  const router = useRouter();

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
    const response = await loginAction(data);

    if (response.status !== "success") {
      toast.error(response.message || "Login failed");
      return;
    }

    router.push(ROUTES.DASHBOARD.ROOT);
    toast.success("Login successful");
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
            href={ROUTES.AUTH.FORGOT_PASSWORD}
            className="text-sm text-primary hover:underline base-1/2"
          >
            {t("forgot_password")}
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </Form>
  );
}
