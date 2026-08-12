"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  Clock3,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";

import { cn } from "@/lib/utils";

type AttendanceRecord = {
  date: string;
  present: number;
  late: number;
  absent: number;
};

type MonthOption = {
  value: string;
  label: string;
};

const monthOptions: MonthOption[] = [
  {
    value: "2026-08",
    label: "Tháng 08, 2026",
  },
  {
    value: "2026-07",
    label: "Tháng 07, 2026",
  },
  {
    value: "2026-06",
    label: "Tháng 06, 2026",
  },
  {
    value: "2026-05",
    label: "Tháng 05, 2026",
  },
];

const reportDataByMonth: Record<string, AttendanceRecord[]> = {
  "2026-08": [
    {
      date: "01/08",
      present: 95,
      late: 12,
      absent: 3,
    },
    {
      date: "02/08",
      present: 98,
      late: 8,
      absent: 2,
    },
    {
      date: "03/08",
      present: 92,
      late: 15,
      absent: 5,
    },
    {
      date: "04/08",
      present: 100,
      late: 5,
      absent: 1,
    },
    {
      date: "05/08",
      present: 94,
      late: 10,
      absent: 4,
    },
    {
      date: "06/08",
      present: 96,
      late: 7,
      absent: 3,
    },
    {
      date: "07/08",
      present: 97,
      late: 6,
      absent: 2,
    },
  ],

  "2026-07": [
    {
      date: "25/07",
      present: 91,
      late: 10,
      absent: 5,
    },
    {
      date: "26/07",
      present: 96,
      late: 7,
      absent: 3,
    },
    {
      date: "27/07",
      present: 94,
      late: 11,
      absent: 4,
    },
    {
      date: "28/07",
      present: 97,
      late: 6,
      absent: 2,
    },
    {
      date: "29/07",
      present: 95,
      late: 8,
      absent: 3,
    },
    {
      date: "30/07",
      present: 99,
      late: 4,
      absent: 1,
    },
    {
      date: "31/07",
      present: 93,
      late: 9,
      absent: 4,
    },
  ],

  "2026-06": [
    {
      date: "24/06",
      present: 90,
      late: 14,
      absent: 6,
    },
    {
      date: "25/06",
      present: 94,
      late: 10,
      absent: 4,
    },
    {
      date: "26/06",
      present: 97,
      late: 7,
      absent: 2,
    },
    {
      date: "27/06",
      present: 92,
      late: 13,
      absent: 5,
    },
    {
      date: "28/06",
      present: 96,
      late: 8,
      absent: 3,
    },
    {
      date: "29/06",
      present: 98,
      late: 5,
      absent: 2,
    },
    {
      date: "30/06",
      present: 95,
      late: 9,
      absent: 3,
    },
  ],

  "2026-05": [
    {
      date: "25/05",
      present: 88,
      late: 15,
      absent: 7,
    },
    {
      date: "26/05",
      present: 93,
      late: 11,
      absent: 5,
    },
    {
      date: "27/05",
      present: 95,
      late: 9,
      absent: 4,
    },
    {
      date: "28/05",
      present: 97,
      late: 7,
      absent: 3,
    },
    {
      date: "29/05",
      present: 94,
      late: 10,
      absent: 4,
    },
    {
      date: "30/05",
      present: 96,
      late: 8,
      absent: 2,
    },
    {
      date: "31/05",
      present: 91,
      late: 12,
      absent: 5,
    },
  ],
};

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const monthRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (monthRef.current && !monthRef.current.contains(target)) {
        setIsMonthOpen(false);
      }

      if (exportRef.current && !exportRef.current.contains(target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedMonthLabel = useMemo(() => {
    return (
      monthOptions.find((month) => month.value === selectedMonth)?.label ??
      selectedMonth
    );
  }, [selectedMonth]);

  const currentReportData = useMemo(() => {
    return reportDataByMonth[selectedMonth] ?? [];
  }, [selectedMonth]);

  const summary = useMemo(() => {
    const present = currentReportData.reduce(
      (total, item) => total + item.present,
      0,
    );

    const late = currentReportData.reduce(
      (total, item) => total + item.late,
      0,
    );

    const absent = currentReportData.reduce(
      (total, item) => total + item.absent,
      0,
    );

    const total = present + late + absent;

    const attendanceRate =
      total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    const punctualityRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      present,
      late,
      absent,
      total,
      attendanceRate,
      punctualityRate,
    };
  }, [currentReportData]);

  const chartMax = useMemo(() => {
    if (!currentReportData.length) {
      return 1;
    }

    return Math.max(
      ...currentReportData.map(
        (item) => item.present + item.late + item.absent,
      ),
    );
  }, [currentReportData]);

  const averageDaily = useMemo(() => {
    if (!currentReportData.length) {
      return 0;
    }

    return Math.round(summary.total / currentReportData.length);
  }, [currentReportData.length, summary.total]);

  const highestAttendanceDay = useMemo(() => {
    if (!currentReportData.length) {
      return null;
    }

    return [...currentReportData].sort((a, b) => b.present - a.present)[0];
  }, [currentReportData]);

  const stats = [
    {
      title: "Tổng lượt chấm công",
      value: summary.total.toLocaleString("vi-VN"),
      description: "Tổng dữ liệu trong kỳ",
      icon: Users,
      iconWrapper: "bg-blue-50 text-blue-600 border-blue-100",
      valueColor: "text-slate-900",
    },
    {
      title: "Có mặt",
      value: summary.present.toLocaleString("vi-VN"),
      description: `${summary.punctualityRate}% trên tổng lượt`,
      icon: UserCheck,
      iconWrapper: "bg-emerald-50 text-emerald-600 border-emerald-100",
      valueColor: "text-emerald-600",
    },
    {
      title: "Đi trễ / Về sớm",
      value: summary.late.toLocaleString("vi-VN"),
      description: "Cần theo dõi",
      icon: Clock3,
      iconWrapper: "bg-amber-50 text-amber-600 border-amber-100",
      valueColor: "text-amber-600",
    },
    {
      title: "Vắng mặt",
      value: summary.absent.toLocaleString("vi-VN"),
      description: "Không có chấm công",
      icon: UserX,
      iconWrapper: "bg-red-50 text-red-600 border-red-100",
      valueColor: "text-red-600",
    },
  ];

  const handleSelectMonth = (value: string) => {
    setSelectedMonth(value);
    setIsMonthOpen(false);
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      setShowExportMenu(false);

      const detailRows = currentReportData.map((item) => ({
        Ngày: item.date,
        "Có mặt": item.present,
        "Đi trễ / Về sớm": item.late,
        "Vắng mặt": item.absent,
        "Tổng lượt": item.present + item.late + item.absent,
      }));

      const summaryRows = [
        {
          "Chỉ số": "Tháng báo cáo",
          "Giá trị": selectedMonthLabel,
        },
        {
          "Chỉ số": "Tổng lượt chấm công",
          "Giá trị": summary.total,
        },
        {
          "Chỉ số": "Có mặt",
          "Giá trị": summary.present,
        },
        {
          "Chỉ số": "Đi trễ / Về sớm",
          "Giá trị": summary.late,
        },
        {
          "Chỉ số": "Vắng mặt",
          "Giá trị": summary.absent,
        },
        {
          "Chỉ số": "Tỷ lệ đi làm",
          "Giá trị": `${summary.attendanceRate}%`,
        },
        {
          "Chỉ số": "Tỷ lệ có mặt",
          "Giá trị": `${summary.punctualityRate}%`,
        },
        {
          "Chỉ số": "Trung bình lượt/ngày",
          "Giá trị": averageDaily,
        },
      ];

      const workbook = XLSX.utils.book_new();

      const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
      const detailSheet = XLSX.utils.json_to_sheet(detailRows);

      summarySheet["!cols"] = [
        {
          wch: 28,
        },
        {
          wch: 24,
        },
      ];

      detailSheet["!cols"] = [
        {
          wch: 14,
        },
        {
          wch: 16,
        },
        {
          wch: 22,
        },
        {
          wch: 16,
        },
        {
          wch: 16,
        },
      ];

      XLSX.utils.book_append_sheet(workbook, summarySheet, "Tổng quan");

      XLSX.utils.book_append_sheet(workbook, detailSheet, "Chi tiết");

      const fileName = `bao-cao-cham-cong-${selectedMonth}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Export Excel failed:", error);

      window.alert("Không thể xuất file Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    setShowExportMenu(false);
    setIsExporting(true);

    window.setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 250);
  };

  const handleExport = (type: "excel" | "pdf") => {
    if (type === "excel") {
      void handleExportExcel();
      return;
    }

    handleExportPDF();
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50/40">
      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-4 w-4" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Báo cáo & phân tích
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Báo cáo chấm công
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Theo dõi tình hình chấm công và hiệu suất nhân sự theo thời gian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month selector */}

          <div ref={monthRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMonthOpen((prev) => !prev)}
              className={cn(
                "flex h-10 items-center gap-2 rounded-xl border bg-white px-4",
                "text-sm font-medium text-slate-700 shadow-sm",
                "transition-all hover:border-slate-300 hover:bg-slate-50",
                isMonthOpen
                  ? "border-indigo-300 ring-4 ring-indigo-50"
                  : "border-slate-200",
              )}
            >
              <Calendar className="h-4 w-4 text-slate-500" />

              <span>{selectedMonthLabel}</span>

              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform",
                  isMonthOpen && "rotate-180",
                )}
              />
            </button>

            {isMonthOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60">
                {monthOptions.map((month) => {
                  const active = selectedMonth === month.value;

                  return (
                    <button
                      key={month.value}
                      type="button"
                      onClick={() => handleSelectMonth(month.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5",
                        "text-left text-sm font-medium transition-colors",
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <span>{month.label}</span>

                      {active && <Check className="h-4 w-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Export */}

          <div ref={exportRef} className="relative">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => setShowExportMenu((prev) => !prev)}
              className={cn(
                "flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4",
                "text-sm font-semibold text-white shadow-sm",
                "transition-all hover:bg-indigo-700",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              {isExporting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Download className="h-4 w-4" />
              )}

              <span>Xuất dữ liệu</span>

              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showExportMenu && "rotate-180",
                )}
              />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60">
                <button
                  type="button"
                  onClick={() => handleExport("excel")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Xuất Excel
                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-400">
                      Tải xuống file .xlsx
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleExport("pdf")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Xuất PDF
                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-400">
                      Lưu báo cáo qua trình duyệt
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className={cn(
                "group rounded-2xl border border-slate-200 bg-white p-5",
                "shadow-sm transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p
                    className={cn(
                      "mt-3 text-2xl font-bold tracking-tight",
                      stat.valueColor,
                    )}
                  >
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                    stat.iconWrapper,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview insight */}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                Tỷ lệ đi làm
              </p>

              <p className="mt-0.5 text-xl font-bold text-indigo-700">
                {summary.attendanceRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Trung bình mỗi ngày
              </p>

              <p className="mt-0.5 text-xl font-bold text-slate-800">
                {averageDaily.toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Ngày có mặt cao nhất
              </p>

              <p className="mt-0.5 truncate text-xl font-bold text-slate-800">
                {highestAttendanceDay
                  ? `${highestAttendanceDay.date} · ${highestAttendanceDay.present}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:shadow-none">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Tình hình chấm công
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Phân bổ dữ liệu theo từng ngày · {selectedMonthLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-500">Có mặt</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-slate-500">
                Đi trễ / Về sớm
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-slate-500">
                Vắng mặt
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentReportData.length > 0 ? (
            <div className="h-80">
              <div className="flex h-full items-end gap-2 sm:gap-4">
                {currentReportData.map((item, index) => {
                  const total = item.present + item.late + item.absent;

                  const presentHeight = (item.present / chartMax) * 100;

                  const lateHeight = (item.late / chartMax) * 100;

                  const absentHeight = (item.absent / chartMax) * 100;

                  return (
                    <div
                      key={`${item.date}-${index}`}
                      className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div className="relative flex h-full w-full max-w-[58px] items-end justify-center">
                        <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          {total}
                        </div>

                        <div className="flex h-full w-full flex-col justify-end overflow-hidden rounded-t-xl bg-slate-50">
                          {item.absent > 0 && (
                            <div
                              className="w-full bg-red-500 transition-all duration-300 group-hover:bg-red-600"
                              style={{
                                height: `${Math.max(absentHeight, 2)}%`,
                              }}
                            />
                          )}

                          {item.late > 0 && (
                            <div
                              className="w-full bg-amber-500 transition-all duration-300 group-hover:bg-amber-600"
                              style={{
                                height: `${Math.max(lateHeight, 2)}%`,
                              }}
                            />
                          )}

                          {item.present > 0 && (
                            <div
                              className="w-full rounded-t-sm bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-600"
                              style={{
                                height: `${Math.max(presentHeight, 2)}%`,
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] font-medium text-slate-400">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-80 flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <Calendar className="h-5 w-5" />
              </div>

              <p className="text-sm font-semibold text-slate-700">
                Không có dữ liệu
              </p>

              <p className="mt-1 max-w-sm text-xs text-slate-400">
                Chưa có dữ liệu chấm công trong khoảng thời gian đã chọn.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Detail table */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:shadow-none">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-6 py-5">
          <h2 className="text-sm font-bold text-slate-900">
            Chi tiết chấm công
          </h2>

          <p className="text-xs text-slate-400">
            Dữ liệu tổng hợp theo từng ngày trong kỳ báo cáo
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ngày
                </th>

                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Có mặt
                </th>

                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Đi trễ / Về sớm
                </th>

                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Vắng
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tổng
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {currentReportData.map((item) => {
                const total = item.present + item.late + item.absent;

                return (
                  <tr
                    key={item.date}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700">
                      {item.date}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex min-w-10 justify-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        {item.present}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex min-w-10 justify-center rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                        {item.late}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex min-w-10 justify-center rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                        {item.absent}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-800">
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {currentReportData.length > 0 && (
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/70">
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    Tổng
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                    {summary.present.toLocaleString("vi-VN")}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-amber-600">
                    {summary.late.toLocaleString("vi-VN")}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-red-600">
                    {summary.absent.toLocaleString("vi-VN")}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                    {summary.total.toLocaleString("vi-VN")}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {currentReportData.length === 0 && (
          <div className="flex flex-col items-center justify-center border-t border-slate-100 px-6 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Calendar className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              Chưa có dữ liệu chấm công
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Không tìm thấy dữ liệu cho tháng {selectedMonthLabel}.
            </p>
          </div>
        )}
      </section>

      {/* Print styles */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          body {
            background: #ffffff !important;
          }

          button,
          input,
          select {
            display: none !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
