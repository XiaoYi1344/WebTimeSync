"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { EmployeeBreadcrumb } from "./employee_breadcrumb";
import { getCurrentEmployee, type Employee } from "@/api/auth";

interface EmployeeTopbarProps {
  onOpenMobile: () => void;
}

export function EmployeeTopbar({
  onOpenMobile,
}: EmployeeTopbarProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    setEmployee(getCurrentEmployee());
  }, []);

  return (
    <header className="sticky top-0 z-30 h-[68px] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <EmployeeBreadcrumb />
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Search */}
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:flex"
            aria-label="Tìm kiếm"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* System status */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="text-[11px] font-bold text-emerald-700">
              Hệ thống hoạt động
            </span>
          </div>

          {/* Notification */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Thông báo"
          >
            <Bell className="h-[18px] w-[18px]" />

            <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />

          {/* Account */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
          >
            {employee?.avatarUrl ? (
              <img
                src={employee.avatarUrl}
                alt="Avatar"
                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                {employee?.fullname ? employee.fullname.substring(0, 2).toUpperCase() : "EE"}
              </div>
            )}

            <div className="hidden text-left xl:block">
              <div className="text-xs font-bold text-slate-900">
                {employee?.fullname || "Nhân viên"}
              </div>

              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                {employee ? `${employee.role} - ${employee.departmentName}` : "TimeSync Employee"}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
