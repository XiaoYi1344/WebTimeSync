"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ShieldAlert,
  AlertOctagon,
  Activity,
  MoreHorizontal,
  Filter,
  AlertTriangle,
  User,
  ChevronDown,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  Trash2,
  MapPin,
  Smartphone,
  Camera,
  X,
  ShieldCheck,
} from "lucide-react";

import { employees } from "@/@mockdata/employee.mock";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

type FraudSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

type FraudStatus =
  | "open"
  | "reviewing"
  | "resolved"
  | "dismissed";

type FraudType =
  | "face_mismatch"
  | "multiple_devices"
  | "unusual_location"
  | "duplicate_check_in"
  | "suspicious_pattern";

interface FraudCase {
  id: string;
  employeeId: string;
  type: FraudType;
  severity: FraudSeverity;
  status: FraudStatus;
  score: number;
  description: string;
  detectedAt: string;

  // Optional information for detail modal
  device?: string;
  location?: string;
  confidence?: number;
  ipAddress?: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const initialFraudCases: FraudCase[] = [
  {
    id: "fraud-001",
    employeeId: "emp-002",
    type: "face_mismatch",
    severity: "critical",
    status: "open",
    score: 95,
    description:
      "Nhận diện khuôn mặt không khớp với dữ liệu đăng ký. Phát hiện tại thiết bị Mobile.",
    detectedAt: "2026-08-10T08:05:00+07:00",
    device: "Mobile",
    location: "Văn phòng Quận 1",
    confidence: 0.42,
    ipAddress: "192.168.1.25",
  },

  {
    id: "fraud-002",
    employeeId: "emp-009",
    type: "multiple_devices",
    severity: "high",
    status: "reviewing",
    score: 80,
    description:
      "Chấm công trên 2 thiết bị khác nhau (Máy chấm công & Mobile) trong vòng 1 phút.",
    detectedAt: "2026-08-10T09:00:30+07:00",
    device: "Máy chấm công + Mobile",
    location: "Văn phòng Quận 3",
    ipAddress: "192.168.1.31",
  },

  {
    id: "fraud-003",
    employeeId: "emp-004",
    type: "unusual_location",
    severity: "medium",
    status: "resolved",
    score: 65,
    description:
      "Check-in qua Mobile ở vị trí cách xa văn phòng hơn 5km.",
    detectedAt: "2026-08-09T08:55:00+07:00",
    device: "Mobile",
    location: "Cách văn phòng 5.8km",
    ipAddress: "10.0.0.18",
  },

  {
    id: "fraud-004",
    employeeId: "emp-006",
    type: "duplicate_check_in",
    severity: "high",
    status: "open",
    score: 87,
    description:
      "Phát hiện nhiều yêu cầu check-in liên tiếp trong khoảng thời gian rất ngắn.",
    detectedAt: "2026-08-10T08:12:00+07:00",
    device: "Mobile",
    location: "Văn phòng Quận 1",
    ipAddress: "192.168.1.44",
  },

  {
    id: "fraud-005",
    employeeId: "emp-008",
    type: "suspicious_pattern",
    severity: "low",
    status: "dismissed",
    score: 35,
    description:
      "Phát hiện mẫu chấm công khác với hành vi thông thường của nhân viên.",
    detectedAt: "2026-08-08T08:21:00+07:00",
    device: "Mobile",
    location: "Văn phòng Quận 7",
    ipAddress: "10.0.0.24",
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function Fraud() {
  const [search, setSearch] = useState("");

  const [filterSeverity, setFilterSeverity] =
    useState<FraudSeverity | "all">("all");

  const [filterStatus, setFilterStatus] =
    useState<FraudStatus | "all">("all");

  const [fraudList, setFraudList] =
    useState<FraudCase[]>(initialFraudCases);

  const [selectedRecord, setSelectedRecord] =
    useState<FraudCase | null>(null);

  const [showDetail, setShowDetail] =
    useState(false);

  // ============================================================
  // FILTER
  // ============================================================

  const records = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return fraudList
      .map((fraud) => {
        const employee = employees.find(
          (e) => e.id === fraud.employeeId,
        );

        return {
          ...fraud,
          employee,
        };
      })
      .filter((record) => {
        if (!record.employee) {
          return false;
        }

        const matchSearch =
          !keyword ||
          record.employee.fullName
            .toLowerCase()
            .includes(keyword) ||
          record.employee.employeeCode
            .toLowerCase()
            .includes(keyword);

        const matchSeverity =
          filterSeverity === "all" ||
          record.severity === filterSeverity;

        const matchStatus =
          filterStatus === "all" ||
          record.status === filterStatus;

        return (
          matchSearch &&
          matchSeverity &&
          matchStatus
        );
      });
  }, [
    fraudList,
    search,
    filterSeverity,
    filterStatus,
  ]);

  // ============================================================
  // SUMMARY
  // ============================================================

  const summary = useMemo(() => {
    return {
      total: fraudList.length,

      critical: fraudList.filter(
        (item) => item.severity === "critical",
      ).length,

      open: fraudList.filter(
        (item) => item.status === "open",
      ).length,

      reviewing: fraudList.filter(
        (item) => item.status === "reviewing",
      ).length,

      resolved: fraudList.filter(
        (item) => item.status === "resolved",
      ).length,
    };
  }, [fraudList]);

  // ============================================================
  // CONFIG
  // ============================================================

  const getSeverityConfig = (
    severity: FraudSeverity,
  ) => {
    switch (severity) {
      case "critical":
        return {
          label: "Nghiêm trọng",
          className:
            "text-red-600 bg-red-50 border-red-100",
          icon: AlertOctagon,
        };

      case "high":
        return {
          label: "Cao",
          className:
            "text-orange-600 bg-orange-50 border-orange-100",
          icon: AlertTriangle,
        };

      case "medium":
        return {
          label: "Trung bình",
          className:
            "text-amber-600 bg-amber-50 border-amber-100",
          icon: AlertTriangle,
        };

      case "low":
        return {
          label: "Thấp",
          className:
            "text-blue-600 bg-blue-50 border-blue-100",
          icon: Activity,
        };

      default:
        return {
          label: severity,
          className:
            "text-slate-500 bg-slate-50 border-slate-200",
          icon: Activity,
        };
    }
  };

  const getTypeLabel = (
    type: FraudType,
  ) => {
    switch (type) {
      case "face_mismatch":
        return "Sai khuôn mặt";

      case "multiple_devices":
        return "Đa thiết bị";

      case "unusual_location":
        return "Sai vị trí GPS";

      case "duplicate_check_in":
        return "Trùng lặp";

      case "suspicious_pattern":
        return "Hành vi đáng ngờ";

      default:
        return type;
    }
  };

  const getStatusConfig = (
    status: FraudStatus,
  ) => {
    switch (status) {
      case "open":
        return {
          label: "Chưa xử lý",
          className:
            "text-orange-600 bg-orange-50 border-orange-100",
        };

      case "reviewing":
        return {
          label: "Đang điều tra",
          className:
            "text-indigo-600 bg-indigo-50 border-indigo-100",
        };

      case "resolved":
        return {
          label: "Đã xử lý",
          className:
            "text-emerald-600 bg-emerald-50 border-emerald-100",
        };

      case "dismissed":
        return {
          label: "Bỏ qua",
          className:
            "text-slate-500 bg-slate-50 border-slate-200",
        };

      default:
        return {
          label: status,
          className:
            "text-slate-500 bg-slate-50 border-slate-200",
        };
    }
  };

  // ============================================================
  // OPEN DETAIL
  // ============================================================

  const handleOpenDetail = (
    record: FraudCase,
  ) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

  // ============================================================
  // UPDATE STATUS
  // ============================================================

  const handleUpdateStatus = (
    id: string,
    status: FraudStatus,
  ) => {
    setFraudList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );

    setSelectedRecord((prev) =>
      prev?.id === id
        ? {
            ...prev,
            status,
          }
        : prev,
    );
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = (
    record: FraudCase,
  ) => {
    const employee = employees.find(
      (e) => e.id === record.employeeId,
    );

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa cảnh báo của ${
        employee?.fullName || "nhân viên này"
      }?`,
    );

    if (!confirmed) {
      return;
    }

    setFraudList((prev) =>
      prev.filter(
        (item) => item.id !== record.id,
      ),
    );

    if (
      selectedRecord?.id === record.id
    ) {
      setSelectedRecord(null);
      setShowDetail(false);
    }
  };

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (
    value: string,
  ) => {
    return new Date(value).toLocaleDateString(
      "vi-VN",
    );
  };

  const formatTime = (
    value: string,
  ) => {
    return new Date(value).toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <ShieldAlert className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Phát hiện gian lận
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              AI phát hiện và cảnh báo các hành vi
              chấm công bất thường.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-400">
            Tổng cảnh báo
          </div>

          <div className="mt-2 text-2xl font-bold text-slate-900">
            {summary.total}
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 shadow-sm">
          <div className="text-xs font-medium text-red-500">
            Nghiêm trọng
          </div>

          <div className="mt-2 text-2xl font-bold text-red-600">
            {summary.critical}
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 shadow-sm">
          <div className="text-xs font-medium text-orange-500">
            Chưa xử lý
          </div>

          <div className="mt-2 text-2xl font-bold text-orange-600">
            {summary.open}
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-sm">
          <div className="text-xs font-medium text-indigo-500">
            Đang điều tra
          </div>

          <div className="mt-2 text-2xl font-bold text-indigo-600">
            {summary.reviewing}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
          <div className="text-xs font-medium text-emerald-500">
            Đã xử lý
          </div>

          <div className="mt-2 text-2xl font-bold text-emerald-600">
            {summary.resolved}
          </div>
        </div>

      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        {/* Search */}

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Tìm nhân viên..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full rounded-xl
              border border-slate-200
              bg-white
              py-2.5 pl-10 pr-4
              text-sm text-slate-900
              placeholder:text-slate-400
              shadow-sm
              outline-none
              transition-all
              focus:border-slate-300
              focus:ring-2
              focus:ring-slate-100
            "
          />
        </div>

        {/* Severity */}

        <div className="relative w-full sm:w-52">
          <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filterSeverity}
            onChange={(e) =>
              setFilterSeverity(
                e.target.value as
                  | FraudSeverity
                  | "all",
              )
            }
            className="
              w-full appearance-none rounded-xl
              border border-slate-200
              bg-white
              py-2.5 pl-10 pr-9
              text-sm text-slate-700
              shadow-sm
              outline-none
              focus:border-slate-300
              focus:ring-2
              focus:ring-slate-100
            "
          >
            <option value="all">
              Mức độ cảnh báo
            </option>

            <option value="critical">
              Nghiêm trọng
            </option>

            <option value="high">
              Cao
            </option>

            <option value="medium">
              Trung bình
            </option>

            <option value="low">
              Thấp
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Status */}

        <div className="relative w-full sm:w-52">
          <Activity className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as
                  | FraudStatus
                  | "all",
              )
            }
            className="
              w-full appearance-none rounded-xl
              border border-slate-200
              bg-white
              py-2.5 pl-10 pr-9
              text-sm text-slate-700
              shadow-sm
              outline-none
              focus:border-slate-300
              focus:ring-2
              focus:ring-slate-100
            "
          >
            <option value="all">
              Tất cả trạng thái
            </option>

            <option value="open">
              Chưa xử lý
            </option>

            <option value="reviewing">
              Đang điều tra
            </option>

            <option value="resolved">
              Đã xử lý
            </option>

            <option value="dismissed">
              Bỏ qua
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full border-collapse text-left">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Mức độ
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Nhân viên
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Loại vi phạm
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thời gian
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Chi tiết
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thao tác
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {records.map((record) => {

                if (!record.employee) {
                  return null;
                }

                const severity =
                  getSeverityConfig(
                    record.severity,
                  );

                const SeverityIcon =
                  severity.icon;

                const status =
                  getStatusConfig(
                    record.status,
                  );

                return (
                  <tr
                    key={record.id}
                    className="
                      group
                      transition-colors
                      hover:bg-slate-50/70
                    "
                  >

                    {/* Severity */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                          severity.className,
                        )}
                      >
                        <SeverityIcon className="h-3.5 w-3.5" />

                        {severity.label}
                      </div>
                    </td>

                    {/* Employee */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="relative shrink-0">

                          {record.employee.avatar ? (
                            <img
                              src={
                                record.employee.avatar
                              }
                              alt={
                                record.employee
                                  .fullName
                              }
                              className="
                                h-9 w-9 rounded-full
                                border border-slate-200
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-full
                                border border-slate-200
                                bg-slate-50
                                text-slate-400
                              "
                            >
                              <User className="h-4 w-4" />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <div className="truncate text-sm font-semibold text-slate-800">
                            {
                              record.employee
                                .fullName
                            }
                          </div>

                          <div className="mt-0.5 text-xs font-medium text-slate-400">
                            {
                              record.employee
                                .employeeCode
                            }
                          </div>

                        </div>

                      </div>
                    </td>

                    {/* Violation */}

                    <td className="whitespace-nowrap px-6 py-4">

                      <div className="text-sm font-semibold text-slate-700">
                        {getTypeLabel(
                          record.type,
                        )}
                      </div>

                      <div
                        className={cn(
                          "mt-1 inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                          record.score >= 80
                            ? "bg-red-50 text-red-600"
                            : record.score >= 50
                              ? "bg-amber-50 text-amber-600"
                              : "bg-slate-50 text-slate-500",
                        )}
                      >
                        Risk Score:{" "}
                        {record.score}/100
                      </div>

                    </td>

                    {/* Detected */}

                    <td className="whitespace-nowrap px-6 py-4">

                      <div className="text-sm font-medium text-slate-700">
                        {formatTime(
                          record.detectedAt,
                        )}
                      </div>

                      <div className="mt-0.5 text-xs text-slate-400">
                        {formatDate(
                          record.detectedAt,
                        )}
                      </div>

                    </td>

                    {/* Description */}

                    <td className="px-6 py-4">

                      <div className="max-w-[280px] line-clamp-2 text-sm leading-5 text-slate-500">
                        {
                          record.description
                        }
                      </div>

                    </td>

                    {/* Status */}

                    <td className="whitespace-nowrap px-6 py-4 text-center">

                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="whitespace-nowrap px-6 py-4 text-right">

                      <div className="flex items-center justify-end gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDetail(
                              record,
                            )
                          }
                          title="Xem chi tiết"
                          className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            text-slate-400
                            opacity-0
                            transition-all
                            hover:bg-blue-50
                            hover:text-blue-600
                            group-hover:opacity-100
                            focus:opacity-100
                          "
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              record,
                            )
                          }
                          title="Xóa cảnh báo"
                          className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            text-slate-400
                            opacity-0
                            transition-all
                            hover:bg-red-50
                            hover:text-red-600
                            group-hover:opacity-100
                            focus:opacity-100
                          "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDetail(
                              record,
                            )
                          }
                          title="Thao tác"
                          className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            text-slate-400
                            opacity-0
                            transition-all
                            hover:bg-slate-100
                            hover:text-slate-700
                            group-hover:opacity-100
                            focus:opacity-100
                          "
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

              {/* Empty */}

              {records.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16"
                  >
                    <div className="flex flex-col items-center justify-center text-center">

                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                        <ShieldAlert className="h-5 w-5 text-slate-400" />
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800">
                        Không có cảnh báo gian lận
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Hệ thống chưa phát hiện
                        hành vi chấm công bất
                        thường.
                      </p>

                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* ======================================================
          DETAIL MODAL
      ====================================================== */}

      {showDetail &&
        selectedRecord && (
          <div
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-slate-900/40
              p-4
              backdrop-blur-sm
            "
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget
              ) {
                setShowDetail(false);
              }
            }}
          >

            <div
              className="
                w-full max-w-2xl
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-2xl
              "
            >

              {/* Modal Header */}

              <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">

                <div className="flex items-start gap-3">

                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border",
                      getSeverityConfig(
                        selectedRecord.severity,
                      ).className,
                    )}
                  >
                    <ShieldAlert className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Chi tiết cảnh báo
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      ID:{" "}
                      {selectedRecord.id}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDetail(false)
                  }
                  className="
                    flex h-8 w-8
                    items-center justify-center
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

              <div className="max-h-[70vh] overflow-y-auto px-6 py-6">

                {/* Employee */}

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">

                  <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Nhân viên
                  </div>

                  <div className="flex items-center gap-3">

                    {selectedRecord
                      .employeeId &&
                    employees.find(
                      (e) =>
                        e.id ===
                        selectedRecord.employeeId,
                    )?.avatar ? (
                      <img
                        src={
                          employees.find(
                            (e) =>
                              e.id ===
                              selectedRecord.employeeId,
                          )?.avatar
                        }
                        alt=""
                        className="
                          h-11 w-11
                          rounded-full
                          border border-slate-200
                          object-cover
                        "
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400">
                        <User className="h-5 w-5" />
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {
                          employees.find(
                            (e) =>
                              e.id ===
                              selectedRecord.employeeId,
                          )?.fullName
                        }
                      </div>

                      <div className="mt-0.5 text-xs text-slate-400">
                        {
                          employees.find(
                            (e) =>
                              e.id ===
                              selectedRecord.employeeId,
                          )?.employeeCode
                        }
                      </div>
                    </div>

                  </div>

                </div>

                {/* Information Grid */}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  {/* Severity */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Mức độ
                    </div>

                    <div className="mt-2">
                      {(() => {
                        const config =
                          getSeverityConfig(
                            selectedRecord.severity,
                          );

                        const Icon =
                          config.icon;

                        return (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                              config.className,
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {config.label}
                          </span>
                        );
                      })()}
                    </div>

                  </div>

                  {/* Type */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Loại cảnh báo
                    </div>

                    <div className="mt-2 text-sm font-semibold text-slate-800">
                      {getTypeLabel(
                        selectedRecord.type,
                      )}
                    </div>

                  </div>

                  {/* Time */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      Thời gian phát hiện
                    </div>

                    <div className="mt-2 text-sm font-semibold text-slate-800">
                      {formatDate(
                        selectedRecord.detectedAt,
                      )}{" "}
                      lúc{" "}
                      {formatTime(
                        selectedRecord.detectedAt,
                      )}
                    </div>

                  </div>

                  {/* Device */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Smartphone className="h-3.5 w-3.5" />
                      Thiết bị
                    </div>

                    <div className="mt-2 text-sm font-semibold text-slate-800">
                      {selectedRecord.device ||
                        "Không xác định"}
                    </div>

                  </div>

                  {/* Location */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      Vị trí
                    </div>

                    <div className="mt-2 text-sm font-semibold text-slate-800">
                      {selectedRecord.location ||
                        "Không xác định"}
                    </div>

                  </div>

                  {/* IP */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      IP Address
                    </div>

                    <div className="mt-2 font-mono text-sm font-semibold text-slate-800">
                      {selectedRecord.ipAddress ||
                        "—"}
                    </div>

                  </div>

                </div>

                {/* Risk Score */}

                <div className="mt-4 rounded-xl border border-slate-200 p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Risk Score
                      </div>

                      <div className="mt-1 text-2xl font-bold text-slate-900">
                        {
                          selectedRecord.score
                        }
                        <span className="text-sm font-medium text-slate-400">
                          /100
                        </span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold",
                        selectedRecord.score >=
                          80
                          ? "bg-red-50 text-red-600"
                          : selectedRecord.score >=
                              50
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600",
                      )}
                    >
                      {
                        selectedRecord.score
                      }
                    </div>

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        selectedRecord.score >=
                          80
                          ? "bg-red-500"
                          : selectedRecord.score >=
                              50
                            ? "bg-amber-500"
                            : "bg-blue-500",
                      )}
                      style={{
                        width: `${selectedRecord.score}%`,
                      }}
                    />

                  </div>

                </div>

                {/* AI Confidence */}

                {selectedRecord.confidence !==
                  undefined && (
                  <div className="mt-4 rounded-xl border border-slate-200 p-4">

                    <div className="flex items-center justify-between">

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          AI Confidence
                        </div>

                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {Math.round(
                            (selectedRecord.confidence ||
                              0) *
                              100,
                          )}
                          %
                        </div>
                      </div>

                      <Camera className="h-5 w-5 text-slate-300" />

                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className={cn(
                          "h-full rounded-full",
                          (selectedRecord.confidence ||
                            0) >=
                            0.9
                            ? "bg-emerald-500"
                            : "bg-red-500",
                        )}
                        style={{
                          width: `${
                            (selectedRecord.confidence ||
                              0) * 100
                          }%`,
                        }}
                      />

                    </div>

                  </div>
                )}

                {/* Description */}

                <div className="mt-4 rounded-xl border border-slate-200 p-4">

                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Chi tiết cảnh báo
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      selectedRecord.description
                    }
                  </p>

                </div>

              </div>

              {/* ==================================================
                  MODAL FOOTER
              ================================================== */}

              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      selectedRecord,
                    )
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border border-red-100
                    bg-white
                    px-4 py-2.5
                    text-sm
                    font-semibold
                    text-red-600
                    hover:bg-red-50
                  "
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa cảnh báo
                </button>

                <div className="flex flex-wrap justify-end gap-2">

                  {selectedRecord.status ===
                    "open" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          selectedRecord.id,
                          "reviewing",
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border border-indigo-100
                        bg-indigo-50
                        px-4 py-2.5
                        text-sm
                        font-semibold
                        text-indigo-600
                        hover:bg-indigo-100
                      "
                    >
                      <Activity className="h-4 w-4" />
                      Bắt đầu điều tra
                    </button>
                  )}

                  {(selectedRecord.status ===
                    "open" ||
                    selectedRecord.status ===
                      "reviewing") && (
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          selectedRecord.id,
                          "dismissed",
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border border-slate-200
                        bg-white
                        px-4 py-2.5
                        text-sm
                        font-semibold
                        text-slate-600
                        hover:bg-slate-50
                      "
                    >
                      <XCircle className="h-4 w-4" />
                      Bỏ qua
                    </button>
                  )}

                  {(selectedRecord.status ===
                    "open" ||
                    selectedRecord.status ===
                      "reviewing") && (
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          selectedRecord.id,
                          "resolved",
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-emerald-600
                        px-4 py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        hover:bg-emerald-700
                      "
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Đánh dấu đã xử lý
                    </button>
                  )}

                  {(selectedRecord.status ===
                    "resolved" ||
                    selectedRecord.status ===
                      "dismissed") && (
                    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                      {selectedRecord.status ===
                      "resolved"
                        ? "Đã xử lý"
                        : "Đã bỏ qua"}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setShowDetail(false)
                    }
                    className="
                      rounded-xl
                      border border-slate-200
                      bg-white
                      px-4 py-2.5
                      text-sm
                      font-semibold
                      text-slate-600
                      hover:bg-slate-50
                    "
                  >
                    Đóng
                  </button>

                </div>

              </div>

            </div>
          </div>
        )}
    </div>
  );
}