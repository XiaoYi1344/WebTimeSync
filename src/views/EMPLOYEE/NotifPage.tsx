"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Info,
  FileEdit,
  Clock,
  Calendar,
  ShieldAlert,
  Sparkles,
  MoreHorizontal,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy data for notifications
const notificationsData = [
  {
    id: "notif-1",
    type: "attendance_success",
    title: "Chấm công vào ca thành công",
    message: "Bạn đã check-in thành công lúc 08:00 bằng Face ID.",
    createdAt: "2026-08-10T08:00:00+07:00",
    read: false,
  },
  {
    id: "notif-2",
    type: "system",
    title: "Bản cập nhật AI Scanner v2",
    message:
      "Hệ thống đã nâng cấp thuật toán nhận diện khuôn mặt, giúp quét nhanh hơn 30%.",
    createdAt: "2026-08-09T18:00:00+07:00",
    read: false,
  },
  {
    id: "notif-3",
    type: "attendance_failed",
    title: "Cảnh báo đi trễ",
    message:
      "Bạn đã check-in trễ 15 phút. Vui lòng gửi yêu cầu giải trình nếu có lý do chính đáng.",
    createdAt: "2026-08-09T08:15:00+07:00",
    read: true,
  },
  {
    id: "notif-4",
    type: "correction_updated",
    title: "Yêu cầu giải trình được duyệt",
    message:
      "Yêu cầu cập nhật giờ ra ca ngày 08/08 đã được Manager duyệt.",
    createdAt: "2026-08-09T14:30:00+07:00",
    read: true,
  },
  {
    id: "notif-5",
    type: "system",
    title: "Bảo trì hệ thống",
    message:
      "Hệ thống sẽ bảo trì từ 22:00 đến 23:00 tối nay. Máy chấm công vẫn hoạt động offline.",
    createdAt: "2026-08-08T10:00:00+07:00",
    read: true,
  },
  {
    id: "notif-6",
    type: "fraud_alert",
    title: "Phát hiện bất thường",
    message:
      "Hệ thống ghi nhận 2 lượt chấm công trùng lặp trong 1 phút. Vui lòng kiểm tra lại.",
    createdAt: "2026-08-07T08:01:00+07:00",
    read: true,
  },
];

export default function NotifPage() {
  const [notifications, setNotifications] = useState(notificationsData);

  const [filter, setFilter] = useState<
    "all" | "unread" | "system"
  >("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              read: true,
            }
          : n
      )
    );
  };

  const getNotifConfig = (type: string) => {
    switch (type) {
      case "attendance_success":
        return {
          icon: CheckCircle2,
          iconClass: "text-emerald-600",
          iconBg: "bg-emerald-50",
        };

      case "attendance_failed":
        return {
          icon: XCircle,
          iconClass: "text-amber-600",
          iconBg: "bg-amber-50",
        };

      case "correction_updated":
        return {
          icon: FileEdit,
          iconClass: "text-blue-600",
          iconBg: "bg-blue-50",
        };

      case "fraud_alert":
        return {
          icon: ShieldAlert,
          iconClass: "text-red-600",
          iconBg: "bg-red-50",
        };

      case "system":
        return {
          icon: Sparkles,
          iconClass: "text-violet-600",
          iconBg: "bg-violet-50",
        };

      default:
        return {
          icon: Info,
          iconClass: "text-slate-500",
          iconBg: "bg-slate-100",
        };
    }
  };

  const filteredNotifs = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "system") return notif.type === "system";

    return true;
  });

  return (
    <div className="min-h-full bg-[#f8fafc] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-[-0.02em] text-slate-950">
                    Hộp thư
                  </h1>

                  {unreadCount > 0 && (
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-violet-600 px-2 text-[11px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Cập nhật và thông báo từ hệ thống
                </p>
              </div>
            </div>

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg",
                "border border-slate-200 bg-white px-3.5",
                "text-sm font-medium text-slate-600",
                "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                "transition-all duration-200",
                "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
                "disabled:pointer-events-none disabled:opacity-40",
                "sm:self-auto"
              )}
            >
              <CheckCheck className="h-4 w-4 text-emerald-600" />
              Đánh dấu tất cả đã đọc
            </button>
          </div>

          {/* Divider */}
          <div className="mt-7 h-px bg-slate-200/80" />
        </header>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white p-1 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            {[
              {
                id: "all",
                label: "Tất cả",
              },
              {
                id: "unread",
                label: "Chưa đọc",
              },
              {
                id: "system",
                label: "Hệ thống",
              },
            ].map((f) => {
              const active = filter === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() =>
                    setFilter(
                      f.id as "all" | "unread" | "system"
                    )
                  }
                  className={cn(
                    "relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {f.label}

                  {f.id === "unread" && unreadCount > 0 && (
                    <span
                      className={cn(
                        "ml-1.5 text-[11px]",
                        active
                          ? "text-slate-300"
                          : "text-violet-600"
                      )}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs font-medium text-slate-400">
            {filteredNotifs.length} thông báo
          </p>
        </div>

        {/* Notification List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <AnimatePresence mode="popLayout">
            {filteredNotifs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Bell className="h-6 w-6 text-slate-400" />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Không có thông báo
                </p>

                <p className="mt-1 max-w-xs text-sm text-slate-400">
                  Các thông báo mới sẽ xuất hiện tại đây.
                </p>
              </motion.div>
            )}

            {filteredNotifs.map((notif, index) => {
              const conf = getNotifConfig(notif.type);
              const Icon = conf.icon;

              const date = new Date(notif.createdAt);

              return (
                <motion.div
                  layout
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  key={notif.id}
                  onClick={() =>
                    !notif.read && markAsRead(notif.id)
                  }
                  className={cn(
                    "group relative flex cursor-pointer gap-4 px-5 py-5",
                    "transition-colors duration-200 sm:px-6",
                    index !== filteredNotifs.length - 1 &&
                      "border-b border-slate-100",
                    notif.read
                      ? "bg-white hover:bg-slate-50/70"
                      : "bg-violet-50/40 hover:bg-violet-50/70"
                  )}
                >
                  {/* Unread accent */}
                  {!notif.read && (
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-violet-600" />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      conf.iconBg
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px]",
                        conf.iconClass
                      )}
                    />
                  </div>

                  {/* Main content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "text-sm font-semibold leading-5",
                            notif.read
                              ? "text-slate-700"
                              : "text-slate-950"
                          )}
                        >
                          {notif.title}
                        </h3>

                        {!notif.read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                        )}
                      </div>

                      {/* Time */}
                      <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                        <span>
                          {date.toLocaleDateString("vi-VN")}
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {date.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <p
                      className={cn(
                        "mt-1.5 max-w-3xl text-sm leading-6",
                        notif.read
                          ? "text-slate-500"
                          : "text-slate-600"
                      )}
                    >
                      {notif.message}
                    </p>

                    {!notif.read && (
                      <div className="mt-2.5 text-[11px] font-semibold uppercase tracking-wide text-violet-600">
                        Chưa đọc
                      </div>
                    )}
                  </div>

                  {/* More */}
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "hidden h-8 w-8 shrink-0 items-center justify-center",
                      "rounded-lg text-slate-300",
                      "transition-all duration-200",
                      "hover:bg-slate-100 hover:text-slate-600",
                      "sm:flex",
                      "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {filteredNotifs.length > 0 && (
          <div className="mt-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Thông báo được cập nhật theo thời gian thực</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

