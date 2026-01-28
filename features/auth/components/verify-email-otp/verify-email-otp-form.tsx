"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, useForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyEmailAction } from "@/features/auth/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import z from "zod";

export function VerifyEmailOtpForm() {
  const t = useTranslations("auth.verify_email_otp");
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const email = searchParams.get("email") || "";

  const verifyEmailOtpSchema = z.object({
    code: z
      .string()
      .min(6, t("fields.code_min"))
      .max(6, t("fields.code_max"))
      .regex(/^\d{6}$/, t("fields.code_invalid")),
    email: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("fields.email_invalid")),
  });

  const form = useForm<{ code: string; email: string }>({
    resolver: zodResolver(verifyEmailOtpSchema),
    mode: "onSubmit",
    defaultValues: {
      code: "",
      email: email || "",
    },
  });

  const onSubmit = async (data: { code: string; email: string }) => {
    const response = await verifyEmailAction(data.code, data.email);

    if (response.status !== "success") {
      const message = response.message || t("error_message");
      toast.error(message);
      return;
    }

    router.push(`/auth/verify-email?code=${data.code}&email=${data.email}`);
    toast.success(response.message || t("success_message"));
  };

  const isSubmitting = form.formState.isSubmitting;

  let buttonLabel = t("submit");
  if (isSubmitting) {
    buttonLabel = t("submitting");
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        <FormField name="code" label={t("fields.code")}>
          {(field) => {
            const value = field.value || "";

            const digits = Array.from(
              { length: 6 },
              (_, index) => value[index] ?? ""
            );

            const focusInput = (index: number) => {
              const input = codeInputsRef.current[index];
              if (input) {
                input.focus();
                input.select();
              }
            };

            const handleChange = (
              index: number,
              event: React.ChangeEvent<HTMLInputElement>
            ) => {
              const raw = event.target.value;

              // Handle paste-like input (multiple characters)
              if (raw.length > 1) {
                const numericOnly = raw.replaceAll(/\D/g, "");
                if (numericOnly.length === 0) {
                  event.target.value = digits[index] ?? "";
                  return;
                }

                // Fill from current index onwards
                const digitsToFill = numericOnly.slice(0, 6 - index);
                const nextDigits = [...digits];

                for (let i = 0; i < digitsToFill.length && index + i < 6; i++) {
                  nextDigits[index + i] = digitsToFill[i] ?? "";
                }

                const newCode = nextDigits.join("");
                field.onChange(newCode);

                // Focus the last filled box
                const lastFilledIndex = Math.min(
                  index + digitsToFill.length - 1,
                  5
                );
                focusInput(lastFilledIndex);
                return;
              }

              // Handle single character input
              const lastChar = raw.slice(-1);

              if (!/^\d$/.test(lastChar)) {
                // Revert to previous digit if non-numeric input
                event.target.value = digits[index] ?? "";
                return;
              }

              const inputValue = lastChar;

              const nextDigits = [...digits];
              nextDigits[index] = inputValue;
              const nextCode = nextDigits.join("");
              field.onChange(nextCode);

              if (inputValue && index < 5) {
                focusInput(index + 1);
              }
            };

            const handleKeyDown = (
              index: number,
              event: React.KeyboardEvent<HTMLInputElement>
            ) => {
              if (event.key === "Backspace" && !digits[index] && index > 0) {
                event.preventDefault();
                const prevIndex = index - 1;
                const nextDigits = [...digits];
                nextDigits[prevIndex] = "";
                field.onChange(nextDigits.join(""));
                focusInput(prevIndex);
              }

              if (event.key === "ArrowLeft" && index > 0) {
                event.preventDefault();
                focusInput(index - 1);
              }

              if (event.key === "ArrowRight" && index < 5) {
                event.preventDefault();
                focusInput(index + 1);
              }
            };

            const handlePaste = (
              index: number,
              event: React.ClipboardEvent<HTMLInputElement>
            ) => {
              event.preventDefault();
              const pastedData = event.clipboardData.getData("text");
              const numericOnly = pastedData.replaceAll(/\D/g, "");

              if (numericOnly.length === 0) {
                return;
              }

              // Take up to 6 digits starting from the current index
              const digitsToFill = numericOnly.slice(0, 6 - index);
              const nextDigits = [...digits];

              for (let i = 0; i < digitsToFill.length && index + i < 6; i++) {
                nextDigits[index + i] = digitsToFill[i] ?? "";
              }

              const newCode = nextDigits.join("");
              field.onChange(newCode);

              // Focus the last filled box or the last box if all filled
              const lastFilledIndex = Math.min(
                index + digitsToFill.length - 1,
                5
              );
              focusInput(lastFilledIndex);
            };

            return (
              <div className="flex items-center justify-between gap-2">
                {["0", "1", "2", "3", "4", "5"].map((slot, index) => (
                  <Input
                    key={`otp-${slot}`}
                    ref={(el) => {
                      codeInputsRef.current[index] = el;
                    }}
                    id={index === 0 ? field.name : `${field.name}-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="h-11 w-10 text-center text-lg tracking-widest"
                    value={digits[index]}
                    onChange={(event) => handleChange(index, event)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={(event) => handlePaste(index, event)}
                  />
                ))}
              </div>
            );
          }}
        </FormField>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {buttonLabel}
        </Button>
      </div>
    </Form>
  );
}
