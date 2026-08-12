"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileClock,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  X,
  ScanFace,
  UserCheck,
  Clock,
  UserX,
  FileEdit,
  ShieldAlert
} from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  collapsed?: boolean;
  mobile?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

const navigation = [
  {
    title: "TỔNG QUAN",
    items: [
      { label: "Báo cáo & Thống kê", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "NHÂN SỰ",
    items: [
      { label: "Nhân viên", href: "/employees", icon: Users },
      { label: "Phòng ban", href: "/departments", icon: LayoutDashboard },
      { label: "Khuôn mặt", href: "/faces", icon: ScanFace },
    ],
  },
  {
    title: "CHẤM CÔNG",
    items: [
      { label: "Ca làm việc", href: "/shifts", icon: FileClock },
      { label: "Đang có mặt", href: "/attendance/present", icon: UserCheck },
      { label: "Đi trễ/Về sớm", href: "/attendance/late-early", icon: Clock },
      { label: "Vắng mặt", href: "/attendance/absent", icon: UserX },
      { label: "Điều chỉnh công", href: "/correction-requests", icon: FileEdit },
    ],
  },
  {
    title: "HỆ THỐNG",
    items: [
      { label: "Cảnh báo gian lận", href: "/fraud", icon: ShieldAlert },
    ],
  },
];

export function AdminSidebar({
  collapsed = false,
  mobile = false,
  onToggle,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "") {
      return pathname === "";
    }
    return pathname.startsWith(href);
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
          href=""
          onClick={onClose}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
            <BarChart3 className="h-[18px] w-[18px]" />
          </div>

          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <div className="truncate text-[15px] font-extrabold tracking-tight text-slate-950">
                TIME SYNC
              </div>
              <div className="truncate text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Admin Console
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

      {/* Bottom */}
      <div className="border-t border-slate-400 p-4">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-medium text-neutral-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </Link>
        </div>
    </aside>
  );
}
