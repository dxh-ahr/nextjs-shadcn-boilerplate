"use client";

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
import type { Locale } from "@/i18n/types";
import { getCookie, setCookie } from "cookies-next/client";
import { LogOut, Menu, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DashboardHeaderProps {
  readonly onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const tHeader = useTranslations("header");
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem("dxh_key");
    } catch {
      return false;
    }
  });

  const [locale, setLocale] = useState<Locale>(() => {
    try {
      return (getCookie("locale") as Locale) || "en";
    } catch {
      return "en";
    }
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("dxh_key");
    router.push("/auth/login");
    toast.success("Logged out successfully");
  };

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setCookie("locale", newLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    router.refresh();
  };

  return (
    <header className="w-full fixed top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Menu Button & Title */}
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center">
              <LocaleSwitcher />
            </div>
            <ThemeSwitcher />
          </div>
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <User className="size-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Mobile: Language & Theme Switchers */}
                <div className="sm:hidden">
                  <div className="px-2 py-2">
                    <p className="text-xs text-muted-foreground mb-2">
                      {tHeader("language")}
                    </p>
                    <select
                      value={locale}
                      onChange={(e) =>
                        handleLocaleChange(e.target.value as Locale)
                      }
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div className="px-2 py-2">
                    <p className="text-xs text-muted-foreground mb-2">Theme</p>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                          theme === "light"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        Light
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                          theme === "dark"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("system")}
                        className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                          theme === "system"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        System
                      </button>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                </div>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="w-full cursor-pointer"
                  >
                    <User className="mr-2 size-4" />
                    {tHeader("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/settings"
                    className="w-full cursor-pointer"
                  >
                    <Settings className="mr-2 size-4" />
                    {tHeader("nav.settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full cursor-pointer text-left"
                  >
                    <LogOut className="mr-2 size-4" />
                    {tHeader("nav.logout")}
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
