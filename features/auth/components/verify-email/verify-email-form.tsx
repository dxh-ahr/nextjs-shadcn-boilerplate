"use client";

import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/features/auth/actions";
import { ROUTES } from "@/lib/constants";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function VerifyEmailForm() {
  const t = useTranslations("auth.verify_email");
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasVerifiedRef = useRef(false);
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    // Prevent multiple calls
    if (hasVerifiedRef.current || isVerifyingRef.current) {
      return;
    }

    if (!code || !email) {
      setStatus("error");
      setErrorMessage(t("no_code_or_email"));
      toast.error(t("no_code_or_email"));
      return;
    }

    const verifyEmail = async () => {
      isVerifyingRef.current = true;

      try {
        const response = await verifyEmailAction(code, email);

        // Prevent state updates if component unmounted or already verified
        if (hasVerifiedRef.current) {
          return;
        }

        if (response.status !== "success") {
          setStatus("error");
          const message = response.message || t("verification_failed");
          setErrorMessage(message);
          toast.error(message);
          hasVerifiedRef.current = true;
          return;
        }

        setStatus("success");
        setErrorMessage("");
        hasVerifiedRef.current = true;
        toast.success(response.message || t("success_message"));

        // Navigate after a short delay to show success message
        setTimeout(() => {
          router.push(ROUTES.AUTH.LOGIN);
        }, 1500);
      } catch (error) {
        if (hasVerifiedRef.current) {
          return;
        }
        setStatus("error");
        const message =
          error instanceof Error ? error.message : t("verification_failed");
        setErrorMessage(message);
        toast.error(message);
        hasVerifiedRef.current = true;
      } finally {
        isVerifyingRef.current = false;
      }
    };

    verifyEmail();
  }, [code, email, router, t]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-5">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("verifying")}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-5">
        <div className="rounded-full bg-destructive/10 p-3">
          <XCircle className="size-8 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">{t("error_title")}</h3>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() =>
            router.push(
              `${ROUTES.AUTH.RESEND_VERIFICATION_EMAIL}?email=${email}`
            )
          }
        >
          {t("resend_verification_email")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-5">
      <div className="rounded-full bg-primary/10 p-3">
        <CheckCircle2 className="size-8 text-primary" />
      </div>
      <div className="text-center space-y-3">
        <h3 className="text-lg font-semibold">{t("success_title")}</h3>
        <p className="text-sm text-muted-foreground">{t("success_message")}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t("redirecting")}</p>
    </div>
  );
}
