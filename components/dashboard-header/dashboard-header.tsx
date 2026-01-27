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
import { LogOut, Menu, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem("dxh_key");
    } catch {
      return false;
    }
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("dxh_key");
    router.push("/auth/login");
    toast.success("Logged out successfully");
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
          <div className="flex items-center gap-2">
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
