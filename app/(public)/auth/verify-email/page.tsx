import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VerifyEmailForm } from "@/features/auth/components";
import { MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  const t = useTranslations("auth.verify_email");

  return (
    <Card className="auth-card">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <MailCheck className="size-7 lg:size-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center text-base md:text-lg xl:text-xl">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">{t("verifying")}</p>
            </div>
          }
        >
          <VerifyEmailForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
