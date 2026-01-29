import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components";
import { ROUTES } from "@/lib/constants";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function RegisterPage() {
  const t = useTranslations("auth.register");

  return (
    <Card className="auth-card">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <UserPlus className="size-7 lg:size-8 text-primary" />
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
        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {t("already_have_account")}{" "}
          </span>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="text-primary hover:underline"
          >
            {t("login_link")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
