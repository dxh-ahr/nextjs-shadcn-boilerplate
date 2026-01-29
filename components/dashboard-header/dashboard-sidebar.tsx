"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { BarChart3, FileText, Home, Settings, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const menuItems = [
  { href: ROUTES.DASHBOARD.ROOT, labelKey: "overview", icon: Home },
  { href: ROUTES.DASHBOARD.ANALYTICS, labelKey: "analytics", icon: BarChart3 },
  { href: ROUTES.DASHBOARD.REPORTS, labelKey: "reports", icon: FileText },
  { href: ROUTES.DASHBOARD.SETTINGS, labelKey: "settings", icon: Settings },
  { href: ROUTES.DASHBOARD.PROFILE, labelKey: "profile", icon: User },
] as const;

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const t = useTranslations("dashboard.sidebar");
  const tHeader = useTranslations("header");
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD.ROOT) {
      return pathname === ROUTES.DASHBOARD.ROOT;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r border-border/50 bg-background transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          <Link
            href={ROUTES.DASHBOARD.ROOT}
            className="flex items-center gap-2 text-xl font-semibold text-foreground transition-colors hover:text-primary"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">N</span>
            </div>
            <span className="hidden sm:inline">{tHeader("brand")}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
