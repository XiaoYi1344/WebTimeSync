"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Search,
  Clock,
  AlertTriangle,
  Filter,
  ChevronDown,
  CalendarDays,
  User,
  X,
  CheckCircle2,
  FileText,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Timer,
  UserCheck,
} from "lucide-react";

import {
  attendanceRecords,
  employees,
  shifts,
  AttendanceStatus,
} from "@/@mockdata/employee.mock";

import { cn } from "@/lib/utils";

type ViolationFilter = "all" | "late" | "early_leave" | "late_early";

type ProcessStatus = "pending" | "processed";

type LateRecord = {
  id: string;
  employeeId: string;
  shiftId: string;
  workDate: string;
  checkIn: string | null;
  checkOut: string | null;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  status: AttendanceStatus;
  employee: (typeof employees)[number];
  shift: (typeof shifts)[number];
};

export default function Late() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ViolationFilter>("all");

  const [filterProcess, setFilterProcess] = useState<"all" | ProcessStatus>(
    "all",
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedRecord, setSelectedRecord] = useState<LateRecord | null>(null);

  const [processedIds, setProcessedIds] = useState<string[]>([]);

  const [notes, setNotes] = useState<Record<string, string>>({});

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "minutes">(
    "newest",
  );

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  /* =====================================================
     BASE DATA
  ===================================================== */

  const lateRecords = useMemo<LateRecord[]>(() => {
    return attendanceRecords
      .filter((record) => {
        return (
          record.status === "late" ||
          record.status === "early_leave" ||
          record.status === "late_early"
        );
      })
      .map((record) => {
        const employee = employees.find(
          (employee) => employee.id === record.employeeId,
        );

        const shift = shifts.find((shift) => shift.id === record.shiftId);

        if (!employee || !shift) {
          throw new Error(
            `Missing employee or shift for attendance record ${record.id}`,
          );
        }

        return {
          ...record,
          employee,
          shift,
        };
      });
  }, []);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = lateRecords.filter((record) => {
      const matchSearch =
        !keyword ||
        record.employee.fullName.toLowerCase().includes(keyword) ||
        record.employee.employeeCode.toLowerCase().includes(keyword) ||
        record.shift.name.toLowerCase().includes(keyword);

      const matchType = filterType === "all" || record.status === filterType;

      const matchProcess =
        filterProcess === "all" ||
        (filterProcess === "processed"
          ? processedIds.includes(record.id)
          : !processedIds.includes(record.id));

      const recordDate = new Date(record.workDate).toISOString().split("T")[0];

      const matchFrom = !fromDate || recordDate >= fromDate;

      const matchTo = !toDate || recordDate <= toDate;

      return matchSearch && matchType && matchProcess && matchFrom && matchTo;
    });

    return result.sort((a, b) => {
      if (sortOrder === "minutes") {
        const aMinutes = a.lateMinutes + a.earlyLeaveMinutes;

        const bMinutes = b.lateMinutes + b.earlyLeaveMinutes;

        return bMinutes - aMinutes;
      }

      const aDate = new Date(a.workDate).getTime();

      const bDate = new Date(b.workDate).getTime();

      return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
    });
  }, [
    lateRecords,
    search,
    filterType,
    filterProcess,
    processedIds,
    fromDate,
    toDate,
    sortOrder,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedRecords = filteredRecords.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  /* =====================================================
     STATISTICS
  ===================================================== */

  const statistics = useMemo(() => {
    const total = filteredRecords.length;

    const late = filteredRecords.filter(
      (record) => record.status === "late" || record.status === "late_early",
    ).length;

    const early = filteredRecords.filter(
      (record) =>
        record.status === "early_leave" || record.status === "late_early",
    ).length;

    const totalMinutes = filteredRecords.reduce(
      (sum, record) => sum + record.lateMinutes + record.earlyLeaveMinutes,
      0,
    );

    const pending = filteredRecords.filter(
      (record) => !processedIds.includes(record.id),
    ).length;

    return {
      total,
      late,
      early,
      totalMinutes,
      pending,
    };
  }, [filteredRecords, processedIds]);

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatusConfig = (status: AttendanceStatus) => {
    switch (status) {
      case "late":
        return {
          label: "Đi trễ",
          className: "text-amber-600 bg-amber-50 border-amber-100",
        };

      case "early_leave":
        return {
          label: "Về sớm",
          className: "text-orange-600 bg-orange-50 border-orange-100",
        };

      case "late_early":
        return {
          label: "Trễ & Về sớm",
          className: "text-red-600 bg-red-50 border-red-100",
        };

      default:
        return {
          label: status,
          className: "text-slate-500 bg-slate-50 border-slate-200",
        };
    }
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "-";

    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const isProcessed = (id: string) => processedIds.includes(id);

  /* =====================================================
     ACTIONS
  ===================================================== */

  const handleProcess = (record: LateRecord) => {
    setProcessedIds((prev) => {
      if (prev.includes(record.id)) {
        return prev.filter((id) => id !== record.id);
      }

      return [...prev, record.id];
    });
  };

  const handleSaveNote = () => {
    if (!selectedRecord) return;

    setNotes((prev) => ({
      ...prev,
      [selectedRecord.id]: prev[selectedRecord.id] || "",
    }));

    setSelectedRecord(null);
  };

  const handleExport = () => {
    if (!filteredRecords.length) {
      alert("Không có dữ liệu để xuất.");
      return;
    }

    const header = [
      "Ngày",
      "Mã nhân viên",
      "Nhân viên",
      "Ca làm",
      "Check-in",
      "Check-out",
      "Đi trễ",
      "Về sớm",
      "Tổng phút",
      "Vi phạm",
      "Xử lý",
      "Ghi chú",
    ];

    const rows = filteredRecords.map((record) => {
      const config = getStatusConfig(record.status);

      return [
        formatDate(record.workDate),
        record.employee.employeeCode,
        record.employee.fullName,
        record.shift.name,
        formatTime(record.checkIn),
        formatTime(record.checkOut),
        record.lateMinutes,
        record.earlyLeaveMinutes,
        record.lateMinutes + record.earlyLeaveMinutes,
        config.label,
        isProcessed(record.id) ? "Đã xử lý" : "Chưa xử lý",
        notes[record.id] || "",
      ];
    });

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const stringValue = String(value);

            return `"${stringValue.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `bao-cao-vi-pham-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterType("all");
    setFilterProcess("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Đi trễ / Về sớm
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi và xử lý các trường hợp vi phạm thời gian làm việc.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="
            inline-flex items-center justify-center
            gap-2 rounded-xl
            border border-slate-200
            bg-white px-4 py-2.5
            text-sm font-semibold
            text-slate-700
            shadow-sm
            transition-all
            hover:border-slate-300
            hover:bg-slate-50
            active:scale-[0.98]
          "
        >
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </button>
      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tổng vi phạm"
          value={statistics.total}
          subtitle="Theo bộ lọc hiện tại"
          icon={AlertTriangle}
          iconClass="text-red-600"
          iconBg="bg-red-50"
          iconBorder="border-red-100"
        />

        <StatCard
          title="Đi trễ"
          value={statistics.late}
          subtitle="Có phát sinh check-in trễ"
          icon={Clock}
          iconClass="text-amber-600"
          iconBg="bg-amber-50"
          iconBorder="border-amber-100"
        />

        <StatCard
          title="Về sớm"
          value={statistics.early}
          subtitle="Có phát sinh check-out sớm"
          icon={Timer}
          iconClass="text-orange-600"
          iconBg="bg-orange-50"
          iconBorder="border-orange-100"
        />

        <StatCard
          title="Tổng số phút"
          value={`${statistics.totalMinutes}p`}
          subtitle={`${statistics.pending} trường hợp chưa xử lý`}
          icon={UserCheck}
          iconClass="text-violet-600"
          iconBg="bg-violet-50"
          iconBorder="border-violet-100"
        />
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          {/* Search */}

          <div className="relative w-full xl:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Tìm nhân viên, mã NV, ca..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="
                w-full rounded-xl
                border border-slate-200
                bg-white
                py-2.5 pl-10 pr-4
                text-sm text-slate-900
                placeholder:text-slate-400
                outline-none
                transition-all
                focus:border-slate-300
                focus:ring-2
                focus:ring-slate-100
              "
            />
          </div>

          {/* Violation */}

          <div className="relative w-full xl:w-52">
            <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as ViolationFilter);
                setCurrentPage(1);
              }}
              className="
                w-full appearance-none
                rounded-xl border
                border-slate-200
                bg-white py-2.5
                pl-10 pr-9
                text-sm text-slate-700
                outline-none
                transition-all
                focus:border-slate-300
                focus:ring-2
                focus:ring-slate-100
              "
            >
              <option value="all">Tất cả vi phạm</option>

              <option value="late">Đi trễ</option>

              <option value="early_leave">Về sớm</option>

              <option value="late_early">Trễ & Về sớm</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Process */}

          <div className="relative w-full xl:w-48">
            <select
              value={filterProcess}
              onChange={(e) => {
                setFilterProcess(e.target.value as "all" | ProcessStatus);

                setCurrentPage(1);
              }}
              className="
                w-full appearance-none
                rounded-xl border
                border-slate-200
                bg-white py-2.5
                px-4 pr-9
                text-sm text-slate-700
                outline-none
                transition-all
                focus:border-slate-300
                focus:ring-2
                focus:ring-slate-100
              "
            >
              <option value="all">Tất cả xử lý</option>

              <option value="pending">Chưa xử lý</option>

              <option value="processed">Đã xử lý</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* From */}

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setCurrentPage(1);
              }}
              className="
                rounded-xl
                border border-slate-200
                bg-white
                py-2.5 pl-10 pr-3
                text-sm text-slate-700
                outline-none
                focus:border-slate-300
                focus:ring-2
                focus:ring-slate-100
              "
            />
          </div>

          {/* To */}

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setCurrentPage(1);
              }}
              className="
                rounded-xl
                border border-slate-200
                bg-white
                py-2.5 pl-10 pr-3
                text-sm text-slate-700
                outline-none
                focus:border-slate-300
                focus:ring-2
                focus:ring-slate-100
              "
            />
          </div>

          {/* Sort */}

          <div className="relative xl:ml-auto">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest" | "minutes")
              }
              className="
                appearance-none
                rounded-xl
                border border-slate-200
                bg-white
                py-2.5 pl-10 pr-9
                text-sm text-slate-700
                outline-none
                focus:border-slate-300
                focus:ring-2
                focus:ring-slate-100
              "
            >
              <option value="newest">Mới nhất</option>

              <option value="oldest">Cũ nhất</option>

              <option value="minutes">Nhiều phút nhất</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Clear */}

          {(search ||
            filterType !== "all" ||
            filterProcess !== "all" ||
            fromDate ||
            toDate) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="
                inline-flex
                items-center justify-center
                gap-2 rounded-xl
                border border-slate-200
                bg-white px-3.5 py-2.5
                text-sm font-medium
                text-slate-500
                hover:bg-slate-50
                hover:text-slate-800
              "
            >
              <X className="h-4 w-4" />
              Xóa lọc
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400">
            Hiển thị{" "}
            <strong className="text-slate-600">{filteredRecords.length}</strong>{" "}
            bản ghi
          </span>

          {statistics.pending > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {statistics.pending} chưa xử lý
            </span>
          )}
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ngày
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Nhân viên
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ca làm việc
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thực tế / Quy định
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Vi phạm
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Phút
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Xử lý
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Chi tiết
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.map((record) => {
                const conf = getStatusConfig(record.status);

                const totalMinutes =
                  record.lateMinutes + record.earlyLeaveMinutes;

                const processed = isProcessed(record.id);

                return (
                  <tr
                    key={record.id}
                    className={cn(
                      "group transition-colors hover:bg-slate-50/70",
                      processed && "bg-emerald-50/20",
                    )}
                  >
                    {/* DATE */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                        </div>

                        <span className="text-sm font-semibold text-slate-700">
                          {formatDate(record.workDate)}
                        </span>
                      </div>
                    </td>

                    {/* EMPLOYEE */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        {record.employee.avatar ? (
                          <Image
                            src={record.employee.avatar}
                            alt={record.employee.fullName}
                            width={36}
                            height={36}
                            className="
                                h-9 w-9
                                rounded-full
                                border
                                border-slate-200
                                object-cover
                              "
                          />
                        ) : (
                          <div
                            className="
                                flex h-9 w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-slate-200
                                bg-slate-50
                                text-slate-400
                              "
                          >
                            <User className="h-4 w-4" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-800">
                            {record.employee.fullName}
                          </div>

                          <div className="mt-0.5 text-xs font-medium text-slate-400">
                            {record.employee.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SHIFT */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-100 bg-violet-50">
                          <Clock className="h-4 w-4 text-violet-600" />
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-slate-700">
                            {record.shift.name}
                          </div>

                          <div className="mt-0.5 text-xs font-medium text-slate-400">
                            {record.shift.startTime}{" "}
                            <span className="mx-1">-</span>{" "}
                            {record.shift.endTime}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ACTUAL */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="w-8 text-xs font-medium text-slate-400">
                            Vào:
                          </span>

                          <span
                            className={cn(
                              "font-mono font-semibold",
                              record.lateMinutes > 0
                                ? "text-amber-600"
                                : "text-slate-700",
                            )}
                          >
                            {formatTime(record.checkIn)}
                          </span>

                          {record.lateMinutes > 0 && (
                            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                              +{record.lateMinutes}p
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="w-8 text-xs font-medium text-slate-400">
                            Ra:
                          </span>

                          <span
                            className={cn(
                              "font-mono font-semibold",
                              record.earlyLeaveMinutes > 0
                                ? "text-orange-600"
                                : "text-slate-700",
                            )}
                          >
                            {formatTime(record.checkOut)}
                          </span>

                          {record.earlyLeaveMinutes > 0 && (
                            <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                              -{record.earlyLeaveMinutes}p
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* VIOLATION */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                          conf.className,
                        )}
                      >
                        {conf.label}
                      </span>
                    </td>

                    {/* MINUTES */}

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div
                        className={cn(
                          "inline-flex items-center justify-end gap-1.5 rounded-lg border px-2.5 py-1.5",
                          totalMinutes >= 30
                            ? "border-red-100 bg-red-50 text-red-600"
                            : "border-amber-100 bg-amber-50 text-amber-600",
                        )}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />

                        <span className="font-bold">{totalMinutes}p</span>
                      </div>
                    </td>

                    {/* PROCESS */}

                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleProcess(record)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                          processed
                            ? "border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "border-slate-200 bg-white text-slate-500 hover:border-emerald-100 hover:bg-emerald-50 hover:text-emerald-600",
                        )}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />

                        {processed ? "Đã xử lý" : "Xử lý"}
                      </button>
                    </td>

                    {/* DETAIL */}

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(record)}
                        className="
                            inline-flex
                            h-8 w-8
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            text-slate-400
                            shadow-sm
                            transition-colors
                            hover:bg-slate-50
                            hover:text-slate-700
                          "
                        title="Xem chi tiết"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY */}

              {paginatedRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                        <Clock className="h-5 w-5 text-slate-400" />
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800">
                        Không có dữ liệu vi phạm
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Không tìm thấy nhân viên đi trễ hoặc về sớm phù hợp.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {filteredRecords.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <span className="text-xs text-slate-400">
              Trang <strong className="text-slate-600">{safePage}</strong> /{" "}
              {totalPages}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-slate-500
                  transition-colors
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-slate-500
                  transition-colors
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          DETAIL MODAL
      ================================================= */}

      {selectedRecord && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center
            justify-center
            bg-slate-900/30
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedRecord(null);
            }
          }}
        >
          <div
            className="
              w-full max-w-xl
              overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-white
              shadow-2xl
            "
          >
            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Chi tiết vi phạm
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatDate(selectedRecord.workDate)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}

            <div className="space-y-5 px-6 py-6">
              {/* Employee */}

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                {selectedRecord.employee.avatar ? (
                  <Image
                    src={selectedRecord.employee.avatar}
                    alt={selectedRecord.employee.fullName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                )}

                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedRecord.employee.fullName}
                  </div>

                  <div className="mt-0.5 text-xs text-slate-400">
                    {selectedRecord.employee.employeeCode}
                  </div>
                </div>
              </div>

              {/* Info Grid */}

              <div className="grid grid-cols-2 gap-3">
                <DetailItem
                  label="Ca làm việc"
                  value={selectedRecord.shift.name}
                />

                <DetailItem
                  label="Khung giờ"
                  value={`${selectedRecord.shift.startTime} - ${selectedRecord.shift.endTime}`}
                />

                <DetailItem
                  label="Check-in"
                  value={formatTime(selectedRecord.checkIn)}
                  highlight={selectedRecord.lateMinutes > 0}
                />

                <DetailItem
                  label="Check-out"
                  value={formatTime(selectedRecord.checkOut)}
                  highlight={selectedRecord.earlyLeaveMinutes > 0}
                />

                <DetailItem
                  label="Đi trễ"
                  value={`${selectedRecord.lateMinutes} phút`}
                  highlight={selectedRecord.lateMinutes > 0}
                />

                <DetailItem
                  label="Về sớm"
                  value={`${selectedRecord.earlyLeaveMinutes} phút`}
                  highlight={selectedRecord.earlyLeaveMinutes > 0}
                />
              </div>

              {/* Status */}

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Trạng thái vi phạm
                </div>

                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                    getStatusConfig(selectedRecord.status).className,
                  )}
                >
                  {getStatusConfig(selectedRecord.status).label}
                </span>
              </div>

              {/* Note */}

              <div>
                <label
                  htmlFor="late-note"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  Ghi chú xử lý
                </label>

                <textarea
                  id="late-note"
                  rows={3}
                  value={notes[selectedRecord.id] || ""}
                  onChange={(e) =>
                    setNotes((prev) => ({
                      ...prev,
                      [selectedRecord.id]: e.target.value,
                    }))
                  }
                  placeholder="Nhập ghi chú về trường hợp này..."
                  className="
                    w-full resize-none
                    rounded-xl
                    border border-slate-200
                    bg-white
                    px-3.5 py-3
                    text-sm text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    focus:border-slate-300
                    focus:ring-2
                    focus:ring-slate-100
                  "
                />
              </div>
            </div>

            {/* Footer */}

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  handleProcess(selectedRecord);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  isProcessed(selectedRecord.id)
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    : "bg-slate-900 text-white hover:bg-slate-800",
                )}
              >
                <CheckCircle2 className="h-4 w-4" />

                {isProcessed(selectedRecord.id)
                  ? "Đã xử lý"
                  : "Đánh dấu đã xử lý"}
              </button>

              <button
                type="button"
                onClick={handleSaveNote}
                className="
                  rounded-xl
                  bg-indigo-600
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  hover:bg-indigo-700
                "
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  iconBg,
  iconBorder,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
  iconBg: string;
  iconBorder: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="text-sm font-medium text-slate-500">{title}</div>

        <div
          className={cn("rounded-xl border p-2", iconBg, iconBorder, iconClass)}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </div>

      <div className="mt-1 text-xs text-slate-400">{subtitle}</div>
    </div>
  );
}

/* =====================================================
   DETAIL ITEM
===================================================== */

function DetailItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div
        className={cn(
          "mt-1.5 text-sm font-bold",
          highlight ? "text-amber-600" : "text-slate-800",
        )}
      >
        {value}
      </div>
    </div>
  );
}
