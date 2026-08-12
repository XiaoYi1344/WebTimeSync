"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  Clock,
  MapPin,
  MoreHorizontal,
} from "lucide-react";
import { attendanceRecords, employees } from "@/@mockdata/employee.mock";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "present", label: "Đúng giờ" },
  { value: "late", label: "Đi trễ" },
  { value: "early_leave", label: "Về sớm" },
  { value: "absent", label: "Vắng mặt" },
];

export default function HistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const employee = employees.find((e) => e.employeeCode === "NV001");

  // Lọc dữ liệu nâng cao
  const filteredRecords = useMemo(() => {
    return attendanceRecords
      .filter((record) => {
        if (record.employeeId !== employee?.id) return false;
        if (!record.workDate.startsWith(selectedMonth)) return false;
        if (statusFilter !== "all" && record.status !== statusFilter)
          return false;
        if (searchQuery) {
          return record.workDate.includes(searchQuery);
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.workDate).getTime() - new Date(a.workDate).getTime(),
      );
  }, [selectedMonth, statusFilter, searchQuery, employee?.id]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "present":
        return {
          color: "text-emerald-700",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: CheckCircle2,
          label: "Đúng giờ",
        };

      case "late":
        return {
          color: "text-amber-700",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: AlertCircle,
          label: "Đi trễ",
        };

      case "early_leave":
        return {
          color: "text-orange-700",
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: AlertCircle,
          label: "Về sớm",
        };

      case "absent":
        return {
          color: "text-red-700",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: XCircle,
          label: "Vắng mặt",
        };

      case "leave":
        return {
          color: "text-violet-700",
          bg: "bg-violet-50",
          border: "border-violet-200",
          icon: AlertCircle,
          label: "Nghỉ phép",
        };

      default:
        return {
          color: "text-slate-600",
          bg: "bg-slate-50",
          border: "border-slate-200",
          icon: Clock,
          label: "Khác",
        };
    }
  };
  return (
    <div className="space-y-6">
      {/* ======================================================
        HEADER
    ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Lịch sử chấm công
          </h1>

          <p className="text-sm text-slate-500 mt-1.5">
            Quản lý và tra cứu chi tiết thời gian làm việc của bạn.
          </p>
        </div>

        {/* CONTROLS */}

        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          {/* Search */}

          <div className="relative flex-1 min-w-[200px] xl:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Tìm theo ngày..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Status Filter */}

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Export */}

          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <Download className="w-4 h-4 text-slate-500" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* ======================================================
        DATA TABLE
    ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            {/* HEADER */}

            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ngày làm việc
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Giờ vào
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Giờ ra
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">
                  Tổng giờ
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
                  Trạng thái
                </th>

                <th className="w-12 px-4" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                          <Search className="w-5 h-5 text-slate-400" />
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                          Không tìm thấy dữ liệu
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Thử thay đổi từ khóa hoặc bộ lọc.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredRecords.map((record) => {
                  const conf = getStatusConfig(record.status);
                  const isExpanded = expandedRow === record.id;
                  const Icon = conf.icon;

                  const formatTime = (iso: string | null) =>
                    iso
                      ? new Date(iso).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--";

                  return (
                    <React.Fragment key={record.id}>
                      {/* MAIN ROW */}

                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "group cursor-pointer transition-colors",
                          "hover:bg-slate-50",
                          isExpanded && "bg-slate-50",
                        )}
                        onClick={() =>
                          setExpandedRow(isExpanded ? null : record.id)
                        }
                      >
                        {/* DATE */}

                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">
                            {new Date(record.workDate).toLocaleDateString(
                              "vi-VN",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </td>

                        {/* CHECK IN */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-slate-700">
                              {formatTime(record.checkIn)}
                            </span>

                            {record.lateMinutes > 0 && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                                +{record.lateMinutes}p
                              </span>
                            )}
                          </div>
                        </td>

                        {/* CHECK OUT */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-slate-700">
                              {formatTime(record.checkOut)}
                            </span>

                            {record.earlyLeaveMinutes > 0 && (
                              <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-md">
                                -{record.earlyLeaveMinutes}p
                              </span>
                            )}
                          </div>
                        </td>

                        {/* WORKED HOURS */}

                        <td className="px-6 py-4 text-right">
                          <span className="font-mono text-sm font-semibold text-slate-800">
                            {record.workedMinutes > 0
                              ? `${Math.floor(
                                  record.workedMinutes / 60,
                                )}h${record.workedMinutes % 60}p`
                              : "--"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          <div
                            className={cn(
                              "inline-flex items-center justify-center gap-1.5",
                              "px-2.5 py-1.5 rounded-lg text-xs font-semibold",
                              "border min-w-[100px]",
                              conf.bg,
                              conf.color,
                              conf.border,
                            )}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {conf.label}
                          </div>
                        </td>

                        {/* EXPAND */}

                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 transition-transform duration-200",
                                isExpanded && "rotate-180",
                              )}
                            />
                          </button>
                        </td>
                      </motion.tr>

                      {/* ==================================================
                        EXPANDED DETAIL
                    ================================================== */}

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                          >
                            <td
                              colSpan={6}
                              className="bg-slate-50 border-b border-slate-200"
                            >
                              <div className="px-8 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* DEVICE */}

                                  <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                      Thiết bị Check-in
                                    </div>

                                    <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-3">
                                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-indigo-600" />
                                      </div>

                                      <span className="text-sm font-medium text-slate-700">
                                        {record.checkInDeviceId ===
                                        "device-main-gate"
                                          ? "Máy Camera Cổng Chính"
                                          : record.checkInDeviceId || "N/A"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* SHIFT */}

                                  <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                      Ca làm việc
                                    </div>

                                    <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-3">
                                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-slate-500" />
                                      </div>

                                      <span className="text-sm font-medium text-slate-700">
                                        Hành chính{" "}
                                        <span className="text-slate-400">
                                          08:00 - 17:30
                                        </span>
                                      </span>
                                    </div>
                                  </div>

                                  {/* NOTE */}

                                  <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                      Ghi chú hệ thống
                                    </div>

                                    <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-3 min-h-[56px]">
                                      <span className="text-sm text-slate-600">
                                        {record.note || "Không có ghi chú"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ======================================================
          PAGINATION
      ====================================================== */}

        <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Hiển thị{" "}
            <span className="font-semibold text-slate-700">
              {filteredRecords.length}
            </span>{" "}
            kết quả
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              disabled
            >
              Trang trước
            </button>

            <div className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
              1
            </div>

            <button
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              disabled
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
