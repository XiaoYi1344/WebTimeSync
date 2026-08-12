"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ScanFace,
  CalendarClock,
  Clock,
  FileEdit,
  Bell,
  LogOut,
  X,
  BarChart3
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getCurrentEmployee, logout, type Employee } from "@/api/auth";

interface EmployeeSidebarProps {
  collapsed?: boolean;
  mobile?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

const navigation = [
  {
    title: "CHẤM CÔNG",
    items: [
      { label: "Chấm công (Face)", href: "/face", icon: ScanFace },
      { label: "Lịch sử điểm danh", href: "/history", icon: CalendarClock },
      { label: "Đi trễ & Về sớm", href: "/late-early", icon: Clock },
      { label: "Giải trình", href: "/correction", icon: FileEdit },
      { label: "Thông báo", href: "/notifications", icon: Bell },
    ],
  },
];

export function EmployeeSidebar({
  collapsed = false,
  mobile = false,
  onToggle,
  onClose,
}: EmployeeSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    setEmployee(getCurrentEmployee());
  }, []);

  const isActive = (href: string) => {
    if (href === "") {
      return pathname === "";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      if (onClose) onClose();
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-slate-200 bg-white",
        !mobile && "fixed inset-y-0 left-0 z-50 hidden lg:flex",
        !mobile && (collapsed ? "w-[72px]" : "w-[248px]"),
        mobile && "w-full",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-[68px] shrink-0 items-center border-b border-slate-200",
          collapsed && !mobile ? "justify-center px-3" : "px-5",
        )}
      >
        <Link
          href="/face"
          onClick={onClose}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
            <ScanFace className="h-5 w-5" />
          </div>

          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <div className="truncate text-[15px] font-extrabold tracking-tight text-slate-950">
                TIME SYNC
              </div>
              <div className="truncate text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Employee Console
              </div>
            </div>
          )}
        </Link>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-6">
          {navigation.map((group) => (
            <div key={group.title}>
              {(!collapsed || mobile) && (
                <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-400">
                  {group.title}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      title={collapsed && !mobile ? item.label : undefined}
                      className={cn(
                        "group relative flex h-10 items-center gap-3 rounded-xl text-[13px] font-semibold transition-all",
                        collapsed && !mobile
                          ? "justify-center px-2"
                          : "px-3",
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-indigo-600" />
                      )}

                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0",
                          active
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-slate-700",
                        )}
                      />

                      {(!collapsed || mobile) && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom - Logout */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className={cn(
            "group flex h-10 w-full items-center gap-3 rounded-xl text-[13px] font-semibold text-slate-500 transition-all hover:bg-red-50 hover:text-red-600",
            collapsed && !mobile ? "justify-center px-2" : "px-3",
          )}
          title={collapsed && !mobile ? "Đăng xuất" : undefined}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0 text-slate-400 group-hover:text-red-600" />
          {(!collapsed || mobile) && <span className="truncate">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
