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
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", labelKey: "home" },
  { href: "/about-us", labelKey: "about" },
  { href: "/contact", labelKey: "contact" },
] as const;

export function Header() {
  const t = useTranslations("header");

  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(globalThis.window.scrollY > 10);
    };

    globalThis.window.addEventListener("scroll", handleScroll);
    return () => globalThis.window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold text-foreground transition-colors hover:text-primary"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">N</span>
            </div>
            <span className="hidden sm:inline">{t("brand")}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {t(`nav.${item.labelKey}`)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeSwitcher />
            <Button asChild size="sm">
              <Link href="/auth/register">{t("cta")}</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeSwitcher />
            <DropdownMenu
              open={isMobileMenuOpen}
              onOpenChange={setIsMobileMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Toggle menu">
                  {isMobileMenuOpen ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "w-full cursor-pointer",
                        isActive(item.href) && "text-primary font-medium"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(`nav.${item.labelKey}`)}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("language")}
                  </p>
                  <LocaleSwitcher />
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button asChild size="sm" className="w-full">
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("cta")}
                    </Link>
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
