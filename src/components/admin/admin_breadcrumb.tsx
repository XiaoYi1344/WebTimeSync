"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  admin: "Tổng quan",

  reports: "Báo cáo & Thống kê",

  employees: "Nhân viên",
  departments: "Phòng ban",
  faces: "Khuôn mặt",

  shifts: "Ca làm việc",
  attendance: "Chấm công",
  present: "Đang có mặt",
  "late-early": "Đi trễ / Về sớm",
  absent: "Vắng mặt",

  "correction-requests": "Điều chỉnh công",

  fraud: "Cảnh báo gian lận",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      label:
        labels[segment] ??
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      href,
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-2"
    >
      <Link
        href="/admin"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Trang chủ quản trị"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.length > 0 && (
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
      )}

      <div className="flex min-w-0 items-center">
        {items.map((item, index) => (
          <div
            key={item.href}
            className="flex min-w-0 items-center"
          >
            {index > 0 && (
              <ChevronRight className="mx-2 h-3.5 w-3.5 shrink-0 text-slate-300" />
            )}

            {index === items.length - 1 ? (
              <span className="truncate text-sm font-semibold text-slate-900">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hidden truncate text-sm font-medium text-slate-400 transition hover:text-slate-700 sm:block"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}