"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  FileText,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  {
    key: "total_users",
    icon: Users,
    value: "1,234",
    change: "+12.5%",
    trend: "up",
  },
  {
    key: "total_revenue",
    icon: DollarSign,
    value: "$45,231",
    change: "+8.2%",
    trend: "up",
  },
  {
    key: "active_projects",
    icon: FileText,
    value: "24",
    change: "+3",
    trend: "up",
  },
  {
    key: "completed_tasks",
    icon: CheckCircle2,
    value: "156",
    change: "+18",
    trend: "up",
  },
] as const;

const quickActions = [
  {
    label: "Create Project",
    icon: Plus,
    href: "/dashboard/projects/new",
  },
  {
    label: "View Reports",
    icon: FileText,
    href: "/dashboard/reports",
  },
  {
    label: "Analytics",
    icon: TrendingUp,
    href: "/dashboard/analytics",
  },
] as const;

export default function DashboardPage() {
  const t = useTranslations("dashboard.page");

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          {t("welcome")}
        </h1>
        <p className="mt-2 text-base font-light text-muted-foreground sm:text-lg">
          {t("overview")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.key}
              className="group border-border/50 transition-all duration-300 hover:border-border hover:shadow-md"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`stats.${stat.key}`)}
                </CardTitle>
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="size-3 text-primary" />
                  <span className="text-primary">{stat.change}</span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {t("quick_actions")}
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href={action.href}>
                      <Icon className="mr-2 size-4" />
                      {action.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {t("recent_activity")}
            </CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Task completed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item} hour{item > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
