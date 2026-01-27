import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function LoginPage() {
  const t = useTranslations("auth.login");

  return (
    <Card className="auth-card">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <LogIn className="size-7 lg:size-8 text-primary" />
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
        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {t("dont_have_account")}{" "}
          </span>
          <Link href="/auth/register" className="text-primary hover:underline">
            {t("register_link")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
