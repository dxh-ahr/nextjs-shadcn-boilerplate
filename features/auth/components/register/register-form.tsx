"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  registerSchema,
  type RegisterInput,
} from "@/features/auth/validations";
import { ROUTES } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerAction } from "../../actions";

export function RegisterForm() {
  const t = useTranslations("auth.register");

  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    const response = await registerAction(data);

    if (response.status !== "success") {
      toast.error(response.message || "Registration failed");
      return;
    }

    router.push(ROUTES.AUTH.LOGIN);
    toast.success("User registered successfully, please verify your email.");
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="flex justify-between flex-col sm:flex-row gap-3">
          <FormField name="firstName" label={t("fields.firstName")}>
            {(field) => (
              <Input
                id={field.name}
                type="text"
                placeholder={t("fields.name_placeholder")}
                {...field}
              />
            )}
          </FormField>
          <FormField name="lastName" label={t("fields.lastName")}>
            {(field) => (
              <Input
                id={field.name}
                type="text"
                placeholder={t("fields.name_placeholder")}
                {...field}
              />
            )}
          </FormField>
        </div>

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

        <FormField name="companyName" label={t("fields.companyName")}>
          {(field) => (
            <Input
              id={field.name}
              type="text"
              placeholder={t("fields.companyName_placeholder")}
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
