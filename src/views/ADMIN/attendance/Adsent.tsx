"use client";

import { useMemo, useState } from "react";
import {
  Search,
  UserX,
  Phone,
  MessageSquare,
  Filter,
  CalendarCheck,
  CalendarDays,
  User,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

import {
  attendanceRecords,
  employees,
  departments,
  AttendanceStatus,
} from "@/@mockdata/employee.mock";

import { cn } from "@/lib/utils";

type AbsenceStatus = "absent" | "leave";

type AbsenceRecord = {
  id: string;
  employeeId: string;
  workDate: string;
  status: AbsenceStatus;
  note?: string | null;
};

type EditForm = {
  status: AbsenceStatus;
  note: string;
};

export default function Absent() {
  /* =========================================================
     STATE
  ========================================================= */

  const [records, setRecords] = useState<AbsenceRecord[]>(
    attendanceRecords
      .filter(
        (record) => record.status === "absent" || record.status === "leave",
      )
      .map((record) => ({
        id: record.id,
        employeeId: record.employeeId,
        workDate: record.workDate,
        status: record.status as AbsenceStatus,
        note: record.note ?? "",
      })),
  );

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | AbsenceStatus>("all");
  const [filterDate, setFilterDate] = useState("");

  const [selectedRecord, setSelectedRecord] = useState<AbsenceRecord | null>(
    null,
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editForm, setEditForm] = useState<EditForm>({
    status: "absent",
    note: "",
  });

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const enrichedRecords = useMemo(() => {
    return records
      .map((record) => {
        const employee = employees.find(
          (employee) => employee.id === record.employeeId,
        );

        if (!employee) {
          return null;
        }

        const department = departments.find(
          (department) => department.id === employee.departmentId,
        );

        return {
          ...record,
          employee,
          department,
        };
      })
      .filter(
        (
          record,
        ): record is AbsenceRecord & {
          employee: (typeof employees)[number];
          department: (typeof departments)[number] | undefined;
        } => record !== null,
      )
      .filter((record) => {
        const keyword = search.trim().toLowerCase();

        const matchSearch =
          !keyword ||
          record.employee.fullName.toLowerCase().includes(keyword) ||
          record.employee.employeeCode.toLowerCase().includes(keyword);

        const matchType = filterType === "all" || record.status === filterType;

        const matchDate =
          !filterDate || record.workDate.slice(0, 10) === filterDate;

        return matchSearch && matchType && matchDate;
      })
      .sort(
        (a, b) =>
          new Date(b.workDate).getTime() - new Date(a.workDate).getTime(),
      );
  }, [records, search, filterType, filterDate]);

  const totalCount = records.length;

  const absentCount = records.filter(
    (record) => record.status === "absent",
  ).length;

  const leaveCount = records.filter(
    (record) => record.status === "leave",
  ).length;

  /* =========================================================
     STATUS CONFIG
  ========================================================= */

  const getStatusConfig = (status: AttendanceStatus) => {
    switch (status) {
      case "absent":
        return {
          label: "Vắng không phép",
          className: "text-red-600 bg-red-50 border-red-100",
          icon: AlertCircle,
        };

      case "leave":
        return {
          label: "Nghỉ có phép",
          className: "text-emerald-600 bg-emerald-50 border-emerald-100",
          icon: CheckCircle2,
        };

      default:
        return {
          label: status,
          className: "text-slate-500 bg-slate-50 border-slate-200",
          icon: AlertCircle,
        };
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openEditModal = (record: AbsenceRecord) => {
    setSelectedRecord(record);

    setEditForm({
      status: record.status,
      note: record.note ?? "",
    });

    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedRecord(null);
  };

  /* =========================================================
     UPDATE
  ========================================================= */

  const handleSave = () => {
    if (!selectedRecord) return;

    setRecords((prev) =>
      prev.map((record) =>
        record.id === selectedRecord.id
          ? {
              ...record,
              status: editForm.status,
              note: editForm.note.trim(),
            }
          : record,
      ),
    );

    closeEditModal();
  };

  /* =========================================================
     QUICK STATUS
  ========================================================= */

  const handleToggleStatus = (record: AbsenceRecord) => {
    const nextStatus: AbsenceStatus =
      record.status === "absent" ? "leave" : "absent";

    setRecords((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item,
      ),
    );
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const openDeleteModal = (record: AbsenceRecord) => {
    setSelectedRecord(record);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRecord(null);
  };

  const handleDelete = () => {
    if (!selectedRecord) return;

    setRecords((prev) =>
      prev.filter((record) => record.id !== selectedRecord.id),
    );

    closeDeleteModal();
  };

  /* =========================================================
     CONTACT
  ========================================================= */

  const handleCall = (phone?: string | null) => {
    if (!phone) {
      alert("Nhân viên chưa có số điện thoại.");
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  const handleMessage = (phone?: string | null) => {
    if (!phone) {
      alert("Nhân viên chưa có số điện thoại.");
      return;
    }

    window.location.href = `sms:${phone}`;
  };

  /* =========================================================
     RESET FILTER
  ========================================================= */

  const handleResetFilter = () => {
    setSearch("");
    setFilterType("all");
    setFilterDate("");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <UserX className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Quản lý vắng mặt
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Quản lý các trường hợp nghỉ phép và vắng mặt không phép.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Tổng trường hợp
              </div>

              <div className="mt-2 text-2xl font-bold text-slate-900">
                {totalCount}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                Tất cả bản ghi vắng
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <CalendarCheck className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Absent */}
        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Vắng không phép
              </div>

              <div className="mt-2 text-2xl font-bold text-red-600">
                {absentCount}
              </div>

              <div className="mt-1 text-xs text-slate-400">Cần theo dõi</div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>

        {/* Leave */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Nghỉ có phép
              </div>

              <div className="mt-2 text-2xl font-bold text-emerald-600">
                {leaveCount}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                Đã được xác nhận
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Tìm nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Type */}
          <div className="relative w-full sm:w-52">
            <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | AbsenceStatus)
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
              <option value="all">Tất cả loại vắng</option>

              <option value="absent">Vắng không phép</option>

              <option value="leave">Nghỉ có phép</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Date */}
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="
                rounded-xl
                border border-slate-200
                bg-white
                py-2.5 pl-10 pr-3
                text-sm text-slate-700
                shadow-sm
                outline-none
                transition-all
                focus:border-slate-300
                focus:ring-2
                focus:ring-slate-100
              "
            />
          </div>
        </div>

        {(search || filterType !== "all" || filterDate) && (
          <button
            type="button"
            onClick={handleResetFilter}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl
              border border-slate-200
              bg-white
              px-3.5 py-2.5
              text-sm font-medium
              text-slate-600
              shadow-sm
              transition-colors
              hover:bg-slate-50
              hover:text-slate-900
            "
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </button>
        )}
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
                  Ngày
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Nhân viên
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Phòng ban
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ghi chú
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {enrichedRecords.map((record) => {
                const conf = getStatusConfig(record.status);

                const StatusIcon = conf.icon;

                return (
                  <tr
                    key={record?.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                        </div>

                        <span className="text-sm font-semibold text-slate-700">
                          {formatDate(record?.workDate)}
                        </span>
                      </div>
                    </td>

                    {/* Employee */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        {record?.employee.avatar ? (
                          <img
                            src={record.employee.avatar}
                            alt={record.employee.fullName}
                            className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                            <User className="h-4 w-4" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-800">
                            {record?.employee.fullName}
                          </div>

                          <div className="mt-0.5 text-xs font-medium text-slate-400">
                            {record?.employee.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        {record?.department?.name || "Chưa phân phòng ban"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                          conf.className,
                        )}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {conf.label}
                      </span>
                    </td>

                    {/* Note */}
                    <td className="px-6 py-4">
                      <div
                        className="max-w-[260px] truncate text-sm text-slate-500"
                        title={record?.note || undefined}
                      >
                        {record?.note || "—"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Call */}
                        <button
                          type="button"
                          onClick={() => handleCall(record.employee.phone)}
                          className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            border border-blue-100
                            bg-blue-50
                            text-blue-600
                            transition-colors
                            hover:bg-blue-100
                          "
                          title="Gọi điện"
                        >
                          <Phone className="h-4 w-4" />
                        </button>

                        {/* Message */}
                        <button
                          type="button"
                          onClick={() => handleMessage(record?.employee.phone)}
                          className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            border border-indigo-100
                            bg-indigo-50
                            text-indigo-600
                            transition-colors
                            hover:bg-indigo-100
                          "
                          title="Nhắn tin"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(record)}
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
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => openDeleteModal(record)}
                          className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            border border-red-100
                            bg-red-50
                            text-red-500
                            transition-colors
                            hover:bg-red-100
                            hover:text-red-600
                          "
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty */}
              {enrichedRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                        <CalendarCheck className="h-5 w-5 text-slate-400" />
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800">
                        Không có dữ liệu vắng mặt
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Không tìm thấy trường hợp vắng mặt phù hợp.
                      </p>

                      {(search || filterType !== "all" || filterDate) && (
                        <button
                          type="button"
                          onClick={handleResetFilter}
                          className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Cập nhật vắng mặt
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Cập nhật trạng thái và ghi chú cho bản ghi.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Employee */}
            <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
              <div className="flex items-center gap-3">
                {selectedRecord &&
                employees.find((e) => e.id === selectedRecord.employeeId)
                  ?.avatar ? (
                  <img
                    src={
                      employees.find((e) => e.id === selectedRecord.employeeId)
                        ?.avatar || ""
                    }
                    alt="Employee"
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                )}

                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {
                      employees.find((e) => e.id === selectedRecord.employeeId)
                        ?.fullName
                    }
                  </div>

                  <div className="mt-0.5 text-xs text-slate-400">
                    {formatDate(selectedRecord.workDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5 px-6 py-6">
              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Trạng thái
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: "absent",
                      }))
                    }
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left transition-all",
                      editForm.status === "absent"
                        ? "border-red-200 bg-red-50 ring-2 ring-red-100"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                  >
                    <div className="text-sm font-semibold text-red-600">
                      Vắng không phép
                    </div>

                    <div className="mt-1 text-xs text-slate-400">
                      Không có xác nhận nghỉ
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: "leave",
                      }))
                    }
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left transition-all",
                      editForm.status === "leave"
                        ? "border-emerald-200 bg-emerald-50 ring-2 ring-emerald-100"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                  >
                    <div className="text-sm font-semibold text-emerald-600">
                      Nghỉ có phép
                    </div>

                    <div className="mt-1 text-xs text-slate-400">
                      Đã được xác nhận
                    </div>
                  </button>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ghi chú
                </label>

                <textarea
                  value={editForm.note}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Nhập ghi chú..."
                  className="
                    w-full resize-none rounded-xl
                    border border-slate-200
                    bg-white
                    px-4 py-3
                    text-sm text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    transition-all
                    focus:border-slate-300
                    focus:ring-2
                    focus:ring-slate-100
                  "
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <button
                type="button"
                onClick={closeEditModal}
                className="
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-4 py-2.5
                  text-sm font-semibold
                  text-slate-600
                  shadow-sm
                  hover:bg-slate-50
                "
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-slate-900
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  hover:bg-slate-800
                "
              >
                <Save className="h-4 w-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {showDeleteModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Xóa bản ghi vắng?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Bản ghi vắng của nhân viên sẽ bị xóa khỏi danh sách quản lý.
                Hành động này không thể hoàn tác.
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-800">
                  {
                    employees.find(
                      (employee) => employee.id === selectedRecord.employeeId,
                    )?.fullName
                  }
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  {formatDate(selectedRecord.workDate)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-4 py-2.5
                  text-sm font-semibold
                  text-slate-600
                  shadow-sm
                  hover:bg-slate-50
                "
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-red-600
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  hover:bg-red-700
                "
              >
                <Trash2 className="h-4 w-4" />
                Xóa bản ghi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
