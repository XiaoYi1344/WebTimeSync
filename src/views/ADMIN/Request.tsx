"use client";

import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  FileText,
  CalendarDays,
  User,
  ChevronDown,
  X,
  AlertCircle,
  Check,
  Ban,
} from "lucide-react";

import {
  correctionRequests,
  employees,
  attendanceRecords,
  CorrectionStatus,
} from "@/@mockdata/employee.mock";

import { cn } from "@/lib/utils";

type RequestItem = (typeof correctionRequests)[number];

type ModalMode = "detail" | "reject" | null;

export default function Request() {
  /* =========================================================
     STATE
  ========================================================= */

  const [requestList, setRequestList] =
    useState<RequestItem[]>(correctionRequests);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedRequest, setSelectedRequest] =
    useState<RequestItem | null>(null);

  const [modalMode, setModalMode] =
    useState<ModalMode>(null);

  const [rejectReason, setRejectReason] = useState("");

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getEmployee = (employeeId: string) => {
    return employees.find((e) => e.id === employeeId);
  };

  const getAttendance = (attendanceId: string) => {
    return attendanceRecords.find(
      (a) => a.id === attendanceId
    );
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const requests = useMemo(() => {
    return requestList
      .map((req) => {
        const employee = getEmployee(req.employeeId);
        const attendance = getAttendance(req.attendanceId);

        return {
          ...req,
          employee,
          attendance,
        };
      })
      .filter((req) => {
        if (!req.employee) return false;

        const keyword = search.toLowerCase().trim();

        const matchSearch =
          !keyword ||
          req.employee.fullName
            .toLowerCase()
            .includes(keyword) ||
          req.employee.employeeCode
            .toLowerCase()
            .includes(keyword);

        const matchStatus =
          filterStatus === "all" ||
          req.status === filterStatus;

        return matchSearch && matchStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [requestList, search, filterStatus]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = useMemo(() => {
    return {
      total: requestList.length,

      pending: requestList.filter(
        (item) => item.status === "pending"
      ).length,

      approved: requestList.filter(
        (item) => item.status === "approved"
      ).length,

      rejected: requestList.filter(
        (item) => item.status === "rejected"
      ).length,
    };
  }, [requestList]);

  /* =========================================================
     STATUS CONFIG
  ========================================================= */

  const getStatusConfig = (
    status: CorrectionStatus
  ) => {
    switch (status) {
      case "pending":
        return {
          label: "Chờ duyệt",
          className:
            "text-amber-600 bg-amber-50 border-amber-100",
        };

      case "approved":
        return {
          label: "Đã duyệt",
          className:
            "text-emerald-600 bg-emerald-50 border-emerald-100",
        };

      case "rejected":
        return {
          label: "Từ chối",
          className:
            "text-red-600 bg-red-50 border-red-100",
        };

      default:
        return {
          label: status,
          className:
            "text-slate-500 bg-slate-50 border-slate-200",
        };
    }
  };

  /* =========================================================
     REQUEST TYPE
  ========================================================= */

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "missing_check_in":
        return "Quên Check-in";

      case "missing_check_out":
        return "Quên Check-out";

      case "wrong_time":
        return "Sai giờ";

      case "wrong_status":
        return "Sai trạng thái";

      default:
        return type;
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (value?: string | null) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
      "vi-VN"
    );
  };

  const formatTime = (value?: string | null) => {
    if (!value) return "—";

    return new Date(value).toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setModalMode(null);
    setRejectReason("");
  };

  /* =========================================================
     APPROVE
  ========================================================= */

  const handleApprove = async (
    request: RequestItem
  ) => {
    if (processingId) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn duyệt yêu cầu của ${
        getEmployee(request.employeeId)?.fullName ||
        "nhân viên"
      }?`
    );

    if (!confirmed) return;

    setProcessingId(request.id);

    // Mock API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    setRequestList((prev) =>
      prev.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "approved" as CorrectionStatus,
            }
          : item
      )
    );

    setProcessingId(null);

    if (selectedRequest?.id === request.id) {
      setSelectedRequest({
        ...request,
        status: "approved" as CorrectionStatus,
      });
    }
  };

  /* =========================================================
     OPEN REJECT
  ========================================================= */

  const handleOpenReject = (
    request: RequestItem
  ) => {
    setSelectedRequest(request);
    setRejectReason("");
    setModalMode("reject");
  };

  /* =========================================================
     REJECT
  ========================================================= */

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }

    if (processingId) return;

    setProcessingId(selectedRequest.id);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    setRequestList((prev) =>
      prev.map((item) =>
        item.id === selectedRequest.id
          ? {
              ...item,
              status: "rejected" as CorrectionStatus,
            }
          : item
      )
    );

    setProcessingId(null);

    handleCloseModal();
  };

  /* =========================================================
     DETAIL
  ========================================================= */

  const handleOpenDetail = (
    request: RequestItem
  ) => {
    setSelectedRequest(request);
    setModalMode("detail");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Yêu cầu điều chỉnh công
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Duyệt và xử lý các yêu cầu điều chỉnh thời gian
          chấm công từ nhân viên.
        </p>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Tổng yêu cầu
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
              <FileText className="h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="mt-4 text-2xl font-bold text-slate-900">
            {statistics.total}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Tất cả yêu cầu
          </div>
        </div>

        {/* Pending */}

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Chờ duyệt
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </div>

          <div className="mt-4 text-2xl font-bold text-amber-600">
            {statistics.pending}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Cần xử lý
          </div>
        </div>

        {/* Approved */}

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Đã duyệt
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </div>

          <div className="mt-4 text-2xl font-bold text-emerald-600">
            {statistics.approved}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Đã phê duyệt
          </div>
        </div>

        {/* Rejected */}

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Từ chối
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </div>

          <div className="mt-4 text-2xl font-bold text-red-600">
            {statistics.rejected}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Không được chấp thuận
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

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

        {/* Status */}

        <div className="relative w-full sm:w-52">
          <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
            className="
              w-full appearance-none rounded-xl
              border border-slate-200
              bg-white
              py-2.5 pl-10 pr-9
              text-sm text-slate-700
              shadow-sm
              outline-none
              transition-all
              focus:border-slate-300
              focus:ring-2
              focus:ring-slate-100
            "
          >
            <option value="all">
              Tất cả trạng thái
            </option>

            <option value="pending">
              Chờ duyệt
            </option>

            <option value="approved">
              Đã duyệt
            </option>

            <option value="rejected">
              Từ chối
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Mã YC / Ngày tạo
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Nhân viên
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Loại lỗi & Ca làm
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thời gian đề xuất
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Lý do
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => {
                if (!req.employee) return null;

                const conf = getStatusConfig(
                  req.status
                );

                const isProcessing =
                  processingId === req.id;

                return (
                  <tr
                    key={req.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    {/* Request ID */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-semibold text-slate-800">
                        {req.id.replace(
                          "correction-",
                          "YC"
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5" />

                        {formatDate(req.createdAt)}
                      </div>
                    </td>

                    {/* Employee */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {req.employee.avatar ? (
                            <img
                              src={req.employee.avatar}
                              alt={req.employee.fullName}
                              className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-800">
                            {req.employee.fullName}
                          </div>

                          <div className="mt-0.5 text-xs font-medium text-slate-400">
                            {req.employee.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Request Type */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">
                        {getRequestTypeLabel(
                          req.requestType
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />

                        {req.attendance
                          ? formatDate(
                              req.attendance.workDate
                            )
                          : "Chưa xác định"}
                      </div>
                    </td>

                    {/* Requested Time */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="space-y-1">
                        {req.requestedCheckIn && (
                          <div className="text-sm text-slate-600">
                            <span className="text-slate-400">
                              Vào:
                            </span>{" "}
                            <span className="font-semibold text-slate-800">
                              {formatTime(
                                req.requestedCheckIn
                              )}
                            </span>
                          </div>
                        )}

                        {req.requestedCheckOut && (
                          <div className="text-sm text-slate-600">
                            <span className="text-slate-400">
                              Ra:
                            </span>{" "}
                            <span className="font-semibold text-slate-800">
                              {formatTime(
                                req.requestedCheckOut
                              )}
                            </span>
                          </div>
                        )}

                        {!req.requestedCheckIn &&
                          !req.requestedCheckOut && (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}
                      </div>
                    </td>

                    {/* Reason */}

                    <td className="px-6 py-4">
                      <div
                        className="max-w-[220px] line-clamp-2 text-sm leading-5 text-slate-500"
                        title={req.reason}
                      >
                        {req.reason ||
                          "Không có lý do"}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                          conf.className
                        )}
                      >
                        {conf.label}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === "pending" && (
                          <>
                            {/* Approve */}

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handleApprove(req)
                              }
                              className="
                                flex h-8 w-8
                                items-center justify-center
                                rounded-lg
                                border border-emerald-100
                                bg-emerald-50
                                text-emerald-600
                                transition-colors
                                hover:bg-emerald-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              title="Duyệt"
                            >
                              {isProcessing ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>

                            {/* Reject */}

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handleOpenReject(req)
                              }
                              className="
                                flex h-8 w-8
                                items-center justify-center
                                rounded-lg
                                border border-red-100
                                bg-red-50
                                text-red-600
                                transition-colors
                                hover:bg-red-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              title="Từ chối"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {/* Detail */}

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDetail(req)
                          }
                          className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            border border-slate-200
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
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty */}

              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                        <FileText className="h-5 w-5 text-slate-400" />
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800">
                        Không tìm thấy yêu cầu
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Không có yêu cầu điều chỉnh công
                        nào phù hợp.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      {modalMode === "detail" &&
        selectedRequest && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
            onMouseDown={handleCloseModal}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >
              {/* Header */}

              <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      Chi tiết yêu cầu
                    </h2>

                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        getStatusConfig(
                          selectedRequest.status
                        ).className
                      )}
                    >
                      {
                        getStatusConfig(
                          selectedRequest.status
                        ).label
                      }
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedRequest.id.replace(
                      "correction-",
                      "YC"
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}

              <div className="space-y-5 px-6 py-6">
                {/* Employee */}

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Nhân viên
                  </div>

                  {(() => {
                    const employee = getEmployee(
                      selectedRequest.employeeId
                    );

                    if (!employee) return null;

                    return (
                      <div className="flex items-center gap-3">
                        {employee.avatar ? (
                          <img
                            src={employee.avatar}
                            alt={employee.fullName}
                            className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>
                        )}

                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {employee.fullName}
                          </div>

                          <div className="mt-0.5 text-xs text-slate-400">
                            {employee.employeeCode}
                            {employee.position
                              ? ` • ${employee.position}`
                              : ""}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Request information */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Loại yêu cầu
                    </div>

                    <div className="mt-2 text-sm font-semibold text-slate-800">
                      {getRequestTypeLabel(
                        selectedRequest.requestType
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Ngày chấm công
                    </div>

                    <div className="mt-2 text-sm font-semibold text-slate-800">
                      {getAttendance(
                        selectedRequest.attendanceId
                      )
                        ? formatDate(
                            getAttendance(
                              selectedRequest.attendanceId
                            )?.workDate
                          )
                        : "Chưa xác định"}
                    </div>
                  </div>
                </div>

                {/* Requested time */}

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Thời gian đề xuất
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-400">
                        Check-in
                      </div>

                      <div className="mt-1 text-base font-bold text-slate-800">
                        {formatTime(
                          selectedRequest.requestedCheckIn
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">
                        Check-out
                      </div>

                      <div className="mt-1 text-base font-bold text-slate-800">
                        {formatTime(
                          selectedRequest.requestedCheckOut
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason */}

                <div>
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Lý do
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {selectedRequest.reason ||
                      "Không có lý do được cung cấp."}
                  </div>
                </div>
              </div>

              {/* Footer */}

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                  Đóng
                </button>

                {selectedRequest.status ===
                  "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenReject(
                          selectedRequest
                        )
                      }
                      className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      <XCircle className="h-4 w-4" />
                      Từ chối
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleApprove(
                          selectedRequest
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Duyệt yêu cầu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* =====================================================
          REJECT MODAL
      ===================================================== */}

      {modalMode === "reject" &&
        selectedRequest && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
            onMouseDown={handleCloseModal}
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >
              {/* Header */}

              <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                      <Ban className="h-4 w-4 text-red-600" />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Từ chối yêu cầu
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {selectedRequest.id.replace(
                          "correction-",
                          "YC"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}

              <div className="space-y-4 px-6 py-5">
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <div className="flex gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                    <p className="text-xs leading-5 text-amber-700">
                      Vui lòng nhập lý do từ chối.
                      Nội dung này sẽ được lưu lại để
                      nhân viên biết nguyên nhân yêu cầu
                      không được chấp thuận.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Lý do từ chối
                  </label>

                  <textarea
                    value={rejectReason}
                    onChange={(e) =>
                      setRejectReason(
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="VD: Không đủ bằng chứng xác nhận thời gian chấm công..."
                    className="
                      w-full resize-none rounded-xl
                      border border-slate-200
                      bg-white px-4 py-3
                      text-sm text-slate-900
                      placeholder:text-slate-400
                      outline-none
                      transition-all
                      focus:border-red-300
                      focus:ring-4
                      focus:ring-red-500/10
                    "
                  />

                  <div className="mt-1.5 text-right text-[11px] text-slate-400">
                    {rejectReason.length}/500
                  </div>
                </div>
              </div>

              {/* Footer */}

              <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={processingId !== null}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  disabled={
                    !rejectReason.trim() ||
                    processingId !== null
                  }
                  className="
                    flex items-center gap-2
                    rounded-lg
                    bg-red-600
                    px-4 py-2
                    text-sm font-semibold
                    text-white
                    shadow-sm
                    transition-colors
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {processingId ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Xác nhận từ chối
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}