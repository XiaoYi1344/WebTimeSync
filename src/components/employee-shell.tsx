"use client";

import { useState } from "react";
import { EmployeeSidebar } from "./employee/employee-sidebar";
import { EmployeeTopbar } from "./employee/employee-topbar";

interface EmployeeShellProps {
  children: React.ReactNode;
}

export function EmployeeShell({ children }: EmployeeShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <EmployeeSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 w-[280px] transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <EmployeeSidebar
          mobile
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Main */}
      <div
        className={[
          "min-h-screen transition-[padding-left] duration-300",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[248px]",
        ].join(" ")}
      >
        <EmployeeTopbar
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="min-h-[calc(100vh-68px)]">
          <div className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
