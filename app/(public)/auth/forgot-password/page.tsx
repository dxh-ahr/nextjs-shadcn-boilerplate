import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/components";
import { ROUTES } from "@/lib/constants";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgot_password");

  return (
    <Card className="auth-card">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="size-7 lg:size-8 text-primary" />
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
        <ForgotPasswordForm />

        <div className="text-center text-sm">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="text-primary hover:underline"
          >
            {t("back_to_login")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
