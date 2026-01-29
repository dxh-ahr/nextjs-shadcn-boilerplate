"use client";

import { LogOut, Menu, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiResponse } from "@/features/auth/actions/type";
import { useIsAuthenticated } from "@/hooks/use-authenticated";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";

interface DashboardHeaderProps {
  readonly onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const t = useTranslations("header");

  const router = useRouter();

  const { isAuthenticated } = useIsAuthenticated();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // TODO: Uncomment this when the logout endpoint works properly
      // const response = await logoutAction();

      const result = await fetch(API_ENDPOINTS.CLEAR_AUTH);
      const response = (await result.json()) as ApiResponse<null>;

      if (response.status !== "success") {
        toast.error(response.message || "Logout failed");
        return;
      }

      router.push(ROUTES.AUTH.LOGIN);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full fixed top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <LocaleSwitcher />
            </div>
            <ThemeSwitcher />
          </div>

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-9">
                  <User className="size-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    href={ROUTES.DASHBOARD.PROFILE}
                    className="w-full cursor-pointer"
                  >
                    <User className="mr-2 size-4" />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={ROUTES.DASHBOARD.SETTINGS}
                    className="w-full cursor-pointer"
                  >
                    <Settings className="mr-2 size-4" />
                    {t("nav.settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild disabled={isLoggingOut}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut className="mr-2 size-4" />
                    {isLoggingOut ? "Logging out..." : t("nav.logout")}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
