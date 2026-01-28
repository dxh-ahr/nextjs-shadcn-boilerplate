import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResendVerificationEmailForm } from "@/features/auth/components";
import { MailPlus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ResendVerificationEmailPage() {
  const t = useTranslations("auth.resend_verification_email");

  return (
    <Card className="auth-card">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <MailPlus className="size-7 lg:size-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center text-base md:text-lg xl:text-xl">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ResendVerificationEmailForm />
      </CardContent>
    </Card>
  );
}
