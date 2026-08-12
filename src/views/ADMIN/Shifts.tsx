"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Clock,
  Coffee,
  Timer,
  MoreVertical,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { shifts as initialShifts } from "@/@mockdata/employee.mock";

type ShiftStatus = "active" | "inactive";

type ShiftItem = {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStart?: string | null;
  breakEnd?: string | null;
  graceMinutes: number;
  workMinutes: number;
  status: ShiftStatus;
};

type ShiftForm = {
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  graceMinutes: string;
  status: ShiftStatus;
};

const emptyForm: ShiftForm = {
  code: "",
  name: "",
  startTime: "08:00",
  endTime: "17:00",
  breakStart: "12:00",
  breakEnd: "13:00",
  graceMinutes: "15",
  status: "active",
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
};

const calculateWorkMinutes = (
  startTime: string,
  endTime: string,
  breakStart: string,
  breakEnd: string,
) => {
  const start = toMinutes(startTime);
  let end = toMinutes(endTime);

  if (end <= start) {
    end += 24 * 60;
  }

  let total = end - start;

  if (breakStart && breakEnd) {
    const breakStartMinutes = toMinutes(breakStart);
    let breakEndMinutes = toMinutes(breakEnd);

    if (breakEndMinutes <= breakStartMinutes) {
      breakEndMinutes += 24 * 60;
    }

    if (
      breakStartMinutes >= start &&
      breakEndMinutes <= end
    ) {
      total -= breakEndMinutes - breakStartMinutes;
    }
  }

  return Math.max(total, 0);
};

export default function Shifts() {
  const [shiftList, setShiftList] = useState<ShiftItem[]>(
    initialShifts as ShiftItem[],
  );

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<
    "create" | "edit"
  >("create");

  const [selectedShift, setSelectedShift] =
    useState<ShiftItem | null>(null);

  const [form, setForm] =
    useState<ShiftForm>(emptyForm);

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [openMenu, setOpenMenu] = useState<string | null>(
    null,
  );

  const [deleteTarget, setDeleteTarget] =
    useState<ShiftItem | null>(null);

  const filteredShifts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return shiftList;
    }

    return shiftList.filter(
      (shift) =>
        shift.name.toLowerCase().includes(keyword) ||
        shift.code.toLowerCase().includes(keyword),
    );
  }, [search, shiftList]);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedShift(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
    setOpenMenu(null);
  };

  const openEditModal = (shift: ShiftItem) => {
    setModalMode("edit");
    setSelectedShift(shift);

    setForm({
      code: shift.code,
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakStart: shift.breakStart ?? "",
      breakEnd: shift.breakEnd ?? "",
      graceMinutes: String(shift.graceMinutes),
      status: shift.status,
    });

    setErrors({});
    setModalOpen(true);
    setOpenMenu(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedShift(null);
    setErrors({});
  };

  const updateForm = (
    field: keyof ShiftForm,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.code.trim()) {
      nextErrors.code = "Vui lòng nhập mã ca.";
    }

    if (!form.name.trim()) {
      nextErrors.name = "Vui lòng nhập tên ca.";
    }

    if (!form.startTime) {
      nextErrors.startTime = "Vui lòng chọn giờ bắt đầu.";
    }

    if (!form.endTime) {
      nextErrors.endTime = "Vui lòng chọn giờ kết thúc.";
    }

    if (
      form.breakStart &&
      !form.breakEnd
    ) {
      nextErrors.breakEnd =
        "Vui lòng chọn thời gian kết thúc nghỉ.";
    }

    if (
      !form.breakEnd &&
      form.breakStart
    ) {
      nextErrors.breakStart =
        "Vui lòng chọn thời gian bắt đầu nghỉ.";
    }

    const grace = Number(form.graceMinutes);

    if (
      form.graceMinutes === "" ||
      Number.isNaN(grace) ||
      grace < 0 ||
      grace > 180
    ) {
      nextErrors.graceMinutes =
        "Thời gian châm chước phải từ 0–180 phút.";
    }

    if (
      form.startTime &&
      form.endTime
    ) {
      const workMinutes =
        calculateWorkMinutes(
          form.startTime,
          form.endTime,
          form.breakStart,
          form.breakEnd,
        );

      if (workMinutes <= 0) {
        nextErrors.endTime =
          "Giờ kết thúc phải sau giờ bắt đầu.";
      }

      if (workMinutes > 24 * 60) {
        nextErrors.endTime =
          "Thời gian làm việc không hợp lệ.";
      }
    }

    const duplicateCode = shiftList.some(
      (shift) =>
        shift.code.toLowerCase() ===
          form.code.trim().toLowerCase() &&
        shift.id !== selectedShift?.id,
    );

    if (duplicateCode) {
      nextErrors.code =
        "Mã ca đã tồn tại.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const workMinutes =
      calculateWorkMinutes(
        form.startTime,
        form.endTime,
        form.breakStart,
        form.breakEnd,
      );

    if (modalMode === "create") {
      const newShift: ShiftItem = {
        id: `shift-${Date.now()}`,
        code: form.code.trim(),
        name: form.name.trim(),
        startTime: form.startTime,
        endTime: form.endTime,
        breakStart:
          form.breakStart || null,
        breakEnd:
          form.breakEnd || null,
        graceMinutes: Number(
          form.graceMinutes,
        ),
        workMinutes,
        status: form.status,
      };

      setShiftList((prev) => [
        ...prev,
        newShift,
      ]);
    }

    if (
      modalMode === "edit" &&
      selectedShift
    ) {
      setShiftList((prev) =>
        prev.map((shift) => {
          if (
            shift.id !==
            selectedShift.id
          ) {
            return shift;
          }

          return {
            ...shift,
            code: form.code.trim(),
            name: form.name.trim(),
            startTime: form.startTime,
            endTime: form.endTime,
            breakStart:
              form.breakStart || null,
            breakEnd:
              form.breakEnd || null,
            graceMinutes: Number(
              form.graceMinutes,
            ),
            workMinutes,
            status: form.status,
          };
        }),
      );
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setShiftList((prev) =>
      prev.filter(
        (shift) =>
          shift.id !== deleteTarget.id,
      ),
    );

    setDeleteTarget(null);
  };

  const handleToggleStatus = (
    shift: ShiftItem,
  ) => {
    setShiftList((prev) =>
      prev.map((item) =>
        item.id === shift.id
          ? {
              ...item,
              status:
                item.status === "active"
                  ? "inactive"
                  : "active",
            }
          : item,
      ),
    );

    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ca làm việc
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý thời gian, ca kíp và quy định chấm công.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="
            inline-flex items-center justify-center gap-2
            rounded-xl
            bg-slate-900
            px-4 py-2.5
            text-sm font-semibold
            text-white
            shadow-sm
            transition-all
            hover:bg-slate-800
            hover:shadow-md
            active:scale-[0.98]
          "
        >
          <Plus className="h-4 w-4" />
          Thêm ca làm việc
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Tìm theo tên hoặc mã ca..."
            className="
              h-11 w-full rounded-xl
              border border-slate-200
              bg-white
              pl-10 pr-4
              text-sm text-slate-900
              placeholder:text-slate-400
              shadow-sm
              outline-none
              transition-all
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />
        </div>

        <div className="text-xs font-medium text-slate-400">
          {filteredShifts.length} /{" "}
          {shiftList.length} ca
        </div>
      </div>

      {/* Shift Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {filteredShifts.map((shift) => (
          <div
            key={shift.id}
            className="
              group relative flex flex-col overflow-visible
              rounded-2xl
              border border-slate-200
              bg-white
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:border-slate-300
              hover:shadow-lg
              hover:shadow-slate-200/50
            "
          >
            {/* Card Header */}
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-[16px] font-bold text-slate-900">
                      {shift.name}
                    </h3>

                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                        shift.status ===
                          "active"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border-slate-200 bg-slate-100 text-slate-500",
                      )}
                    >
                      {shift.status ===
                      "active"
                        ? "Hoạt động"
                        : "Tạm ngưng"}
                    </span>
                  </div>

                  <div className="mt-1.5 text-xs font-medium text-slate-400">
                    Mã ca:{" "}
                    <span className="font-semibold text-slate-500">
                      {shift.code}
                    </span>
                  </div>
                </div>

                {/* More */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu ===
                          shift.id
                          ? null
                          : shift.id,
                      )
                    }
                    className="
                      flex h-8 w-8
                      items-center justify-center
                      rounded-lg
                      text-slate-400
                      transition-colors
                      hover:bg-white
                      hover:text-slate-700
                      hover:shadow-sm
                    "
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {openMenu === shift.id && (
                    <div className="absolute right-0 top-9 z-30 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            shift,
                          )
                        }
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Pencil className="h-4 w-4" />
                        Chỉnh sửa
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleStatus(
                            shift,
                          )
                        }
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Power className="h-4 w-4" />
                        {shift.status ===
                        "active"
                          ? "Tạm ngưng"
                          : "Kích hoạt"}
                      </button>

                      <div className="my-1 h-px bg-slate-100" />

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(
                            shift,
                          );
                          setOpenMenu(null);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa ca
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex-1 space-y-5 px-5 py-5">
              {/* Working Hours */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Giờ làm việc
                  </div>

                  <div className="font-mono text-[16px] font-bold tracking-tight text-slate-800">
                    {shift.startTime}

                    <span className="mx-2 font-sans text-slate-300">
                      →
                    </span>

                    {shift.endTime}
                  </div>
                </div>
              </div>

              {/* Break */}
              {shift.breakStart &&
                shift.breakEnd && (
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600">
                      <Coffee className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Giờ nghỉ giải lao
                      </div>

                      <div className="font-mono text-sm font-semibold text-slate-700">
                        {shift.breakStart}

                        <span className="mx-2 font-sans text-slate-300">
                          →
                        </span>

                        {shift.breakEnd}
                      </div>
                    </div>
                  </div>
                )}

              {/* Grace Period */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600">
                  <Timer className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Châm chước đi trễ
                  </div>

                  <div className="text-sm font-bold text-slate-800">
                    {shift.graceMinutes}{" "}
                    phút
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-4">
              <span className="text-xs font-medium text-slate-400">
                Tổng thời gian làm việc
              </span>

              <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
                {Math.floor(
                  shift.workMinutes / 60,
                )}
                h{" "}
                {shift.workMinutes % 60}
                m
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredShifts.length === 0 && (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <Clock className="h-5 w-5 text-slate-400" />
          </div>

          <h3 className="text-sm font-semibold text-slate-800">
            Không tìm thấy ca làm việc
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Chưa có ca làm việc nào phù hợp với điều kiện hiện tại.
          </p>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div
            className="absolute inset-0"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {modalMode === "create"
                    ? "Thêm ca làm việc"
                    : "Chỉnh sửa ca làm việc"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Cấu hình thời gian và quy định chấm công cho ca.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Code */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Mã ca
                  </label>

                  <input
                    value={form.code}
                    onChange={(e) =>
                      updateForm(
                        "code",
                        e.target.value.toUpperCase(),
                      )
                    }
                    placeholder="VD: HC-01"
                    className={cn(
                      "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none transition-all",
                      errors.code
                        ? "border-red-300 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                    )}
                  />

                  {errors.code && (
                    <p className="text-xs text-red-500">
                      {errors.code}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Tên ca
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      updateForm(
                        "name",
                        e.target.value,
                      )
                    }
                    placeholder="VD: Hành chính"
                    className={cn(
                      "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none transition-all",
                      errors.name
                        ? "border-red-300 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                    )}
                  />

                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Start */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Giờ bắt đầu
                  </label>

                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      updateForm(
                        "startTime",
                        e.target.value,
                      )
                    }
                    className={cn(
                      "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none",
                      errors.startTime
                        ? "border-red-300"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                    )}
                  />

                  {errors.startTime && (
                    <p className="text-xs text-red-500">
                      {errors.startTime}
                    </p>
                  )}
                </div>

                {/* End */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Giờ kết thúc
                  </label>

                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      updateForm(
                        "endTime",
                        e.target.value,
                      )
                    }
                    className={cn(
                      "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none",
                      errors.endTime
                        ? "border-red-300"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                    )}
                  />

                  {errors.endTime && (
                    <p className="text-xs text-red-500">
                      {errors.endTime}
                    </p>
                  )}
                </div>

                {/* Break start */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Bắt đầu nghỉ
                  </label>

                  <input
                    type="time"
                    value={form.breakStart}
                    onChange={(e) =>
                      updateForm(
                        "breakStart",
                        e.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Break end */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Kết thúc nghỉ
                  </label>

                  <input
                    type="time"
                    value={form.breakEnd}
                    onChange={(e) =>
                      updateForm(
                        "breakEnd",
                        e.target.value,
                      )
                    }
                    className={cn(
                      "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none",
                      errors.breakEnd
                        ? "border-red-300"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                    )}
                  />

                  {errors.breakEnd && (
                    <p className="text-xs text-red-500">
                      {errors.breakEnd}
                    </p>
                  )}
                </div>

                {/* Grace */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Châm chước đi trễ
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={180}
                      value={form.graceMinutes}
                      onChange={(e) =>
                        updateForm(
                          "graceMinutes",
                          e.target.value,
                        )
                      }
                      className={cn(
                        "h-11 w-full rounded-xl border bg-white px-3 pr-16 text-sm outline-none",
                        errors.graceMinutes
                          ? "border-red-300"
                          : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                      )}
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      phút
                    </span>
                  </div>

                  {errors.graceMinutes && (
                    <p className="text-xs text-red-500">
                      {errors.graceMinutes}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Trạng thái
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      updateForm(
                        "status",
                        e.target.value as ShiftStatus,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="active">
                      Hoạt động
                    </option>

                    <option value="inactive">
                      Tạm ngưng
                    </option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Clock className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                      Tổng thời gian dự kiến
                    </div>

                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {(() => {
                        const minutes =
                          calculateWorkMinutes(
                            form.startTime,
                            form.endTime,
                            form.breakStart,
                            form.breakEnd,
                          );

                        return `${Math.floor(
                          minutes / 60,
                        )} giờ ${minutes % 60} phút`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  <Save className="h-4 w-4" />

                  {modalMode === "create"
                    ? "Thêm ca"
                    : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div
            className="absolute inset-0"
            onClick={() =>
              setDeleteTarget(null)
            }
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Xóa ca làm việc?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Bạn có chắc muốn xóa ca{" "}
              <span className="font-semibold text-slate-800">
                {deleteTarget.name}
              </span>{" "}
              ({deleteTarget.code})? Hành động này
              không thể hoàn tác.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Xóa ca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}