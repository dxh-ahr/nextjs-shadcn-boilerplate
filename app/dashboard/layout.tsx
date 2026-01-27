"use client";

import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/dashboard-header";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader onMenuClick={toggleSidebar} />

      <div className="flex flex-1">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
