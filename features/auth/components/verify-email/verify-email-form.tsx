"use client";

import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/features/auth/actions";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function VerifyEmailForm() {
  const t = useTranslations("auth.verify_email");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error(t("no_token"));
        return;
      }

      const response = await verifyEmailAction(token);

      if (!response.success || "error" in response) {
        setStatus("error");
        setErrorMessage(
          (response as { error: string }).error || t("verification_failed")
        );
        toast.error(
          (response as { error: string }).error || t("verification_failed")
        );
      }

      setStatus("success");
      setErrorMessage("");
      router.push("/auth/login");
      toast.success(t("success_message"));
    };

    verifyEmail();
  }, [token, router, t]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("verifying")}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="rounded-full bg-destructive/10 p-3">
          <XCircle className="size-8 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">{t("error_title")}</h3>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <Button
          onClick={() => router.push("/auth/login")}
          className="w-full sm:w-auto"
        >
          {t("back_to_login")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
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
