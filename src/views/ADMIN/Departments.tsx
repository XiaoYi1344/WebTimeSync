"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Users,
  MoreVertical,
  LayoutGrid,
  Search,
  Pencil,
  Trash2,
  X,
  Building2,
  UserRound,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  departments,
  employees,
} from "@/@mockdata/employee.mock";

/* =========================================================
   TYPES
========================================================= */

type DepartmentStatus = "active" | "inactive";

type Department = {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: DepartmentStatus;
  managerId: string | null;
  employeeCount: number;
};

type DepartmentForm = {
  name: string;
  code: string;
  description: string;
  status: DepartmentStatus;
  managerId: string;
};

/* =========================================================
   INITIAL FORM
========================================================= */

const emptyForm: DepartmentForm = {
  name: "",
  code: "",
  description: "",
  status: "active",
  managerId: "",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Departments() {
  const [departmentList, setDepartmentList] =
    useState<Department[]>(
      departments as Department[]
    );

  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<
    "create" | "edit" | null
  >(null);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [form, setForm] =
    useState<DepartmentForm>(emptyForm);

  const [deleteDepartment, setDeleteDepartment] =
    useState<Department | null>(null);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredDepts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return departmentList;
    }

    return departmentList.filter(
      (dept) =>
        dept.name
          .toLowerCase()
          .includes(keyword) ||
        dept.code
          .toLowerCase()
          .includes(keyword) ||
        dept.description
          ?.toLowerCase()
          .includes(keyword)
    );
  }, [departmentList, search]);

  /* =========================================================
     MANAGER
  ========================================================= */

  const getManagerInfo = (managerId: string | null) => {
    if (!managerId) return null;

    return employees.find(
      (employee) => employee.id === managerId
    );
  };

  /* =========================================================
     OPEN CREATE
  ========================================================= */

  const handleOpenCreate = () => {
    setSelectedDepartment(null);
    setForm(emptyForm);
    setModalMode("create");
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const handleOpenEdit = (department: Department) => {
    setSelectedDepartment(department);

    setForm({
      name: department.name,
      code: department.code,
      description: department.description || "",
      status: department.status,
      managerId: department.managerId || "",
    });

    setModalMode("edit");
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedDepartment(null);
    setForm(emptyForm);
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (
    field: keyof DepartmentForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const name = form.name.trim();
    const code = form.code.trim().toUpperCase();

    if (!name) {
      alert("Vui lòng nhập tên phòng ban.");
      return;
    }

    if (!code) {
      alert("Vui lòng nhập mã phòng ban.");
      return;
    }

    /* Check duplicate code */

    const duplicateCode = departmentList.some(
      (department) =>
        department.code.toLowerCase() ===
          code.toLowerCase() &&
        department.id !== selectedDepartment?.id
    );

    if (duplicateCode) {
      alert("Mã phòng ban đã tồn tại.");
      return;
    }

    /* CREATE */

    if (modalMode === "create") {
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name,
        code,
        description: form.description.trim(),
        status: form.status,
        managerId: form.managerId || null,
        employeeCount: 0,
      };

      setDepartmentList((prev) => [
        newDepartment,
        ...prev,
      ]);
    }

    /* EDIT */

    if (
      modalMode === "edit" &&
      selectedDepartment
    ) {
      setDepartmentList((prev) =>
        prev.map((department) => {
          if (
            department.id !==
            selectedDepartment.id
          ) {
            return department;
          }

          return {
            ...department,
            name,
            code,
            description:
              form.description.trim(),
            status: form.status,
            managerId:
              form.managerId || null,
          };
        })
      );
    }

    handleCloseModal();
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = () => {
    if (!deleteDepartment) return;

    setDepartmentList((prev) =>
      prev.filter(
        (department) =>
          department.id !==
          deleteDepartment.id
      )
    );

    setDeleteDepartment(null);
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Phòng ban
            </h1>

            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
              {departmentList.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý phòng ban, trưởng phòng và cơ cấu
            nhân sự.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Thêm phòng ban
        </button>
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Tìm phòng ban hoặc mã phòng ban..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* =====================================================
          DEPARTMENT GRID
      ====================================================== */}

      {filteredDepts.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDepts.map((dept) => {
            const manager = getManagerInfo(
              dept.managerId
            );

            return (
              <div
                key={dept.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
              >
                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Icon */}

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors group-hover:bg-slate-100">
                      <LayoutGrid
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Info */}

                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-bold text-slate-900">
                        {dept.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          Mã
                        </span>

                        <span className="truncate text-xs font-semibold text-slate-500">
                          {dept.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="flex shrink-0 items-center gap-1">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                        dept.status === "active"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      )}
                    >
                      {dept.status === "active"
                        ? "Hoạt động"
                        : "Tạm ngưng"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenEdit(dept)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      title="Chỉnh sửa"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <div className="mb-6 min-h-[42px] flex-1">
                  <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                    {dept.description ||
                      "Chưa có mô tả cho phòng ban này."}
                  </p>
                </div>

                {/* Divider */}

                <div className="mb-4 h-px bg-slate-100" />

                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="flex items-center justify-between gap-4">
                  {/* Manager */}

                  <div className="min-w-0 flex-1">
                    {manager ? (
                      <div className="flex min-w-0 items-center gap-2.5">
                        <img
                          src={manager.avatar}
                          alt={manager.fullName}
                          className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
                        />

                        <div className="min-w-0">
                          <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                            Trưởng phòng
                          </div>

                          <div className="truncate text-xs font-semibold text-slate-700">
                            {manager.fullName}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                          Trưởng phòng
                        </div>

                        <span className="text-xs font-medium italic text-slate-400">
                          Chưa phân công
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Employee Count */}

                  <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <Users className="h-4 w-4 text-slate-400" />

                    <div className="leading-none">
                      <div className="text-sm font-bold text-slate-800">
                        {dept.employeeCount}
                      </div>

                      <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
                        Nhân sự
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    HOVER ACTIONS
                ================================================== */}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-transparent transition-colors group-hover:bg-blue-500" />
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {filteredDepts.length === 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-20 text-center shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
              <Search className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Không tìm thấy phòng ban
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
              Không có phòng ban nào phù hợp với
              điều kiện tìm kiếm hiện tại.
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div
            className="absolute inset-0"
            onClick={handleCloseModal}
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {modalMode === "create" ? (
                    <Plus className="h-5 w-5" />
                  ) : (
                    <Pencil className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {modalMode === "create"
                      ? "Thêm phòng ban"
                      : "Chỉnh sửa phòng ban"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {modalMode === "create"
                      ? "Tạo phòng ban mới trong hệ thống."
                      : "Cập nhật thông tin phòng ban."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-6 py-6">
                {/* Name */}

                <FormField
                  label="Tên phòng ban"
                  required
                  icon={
                    <Building2 className="h-4 w-4" />
                  }
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      handleChange(
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="VD: Phòng Công nghệ thông tin"
                    className={inputClass}
                  />
                </FormField>

                {/* Code */}

                <FormField
                  label="Mã phòng ban"
                  required
                  icon={
                    <FileText className="h-4 w-4" />
                  }
                >
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) =>
                      handleChange(
                        "code",
                        e.target.value
                          .toUpperCase()
                          .replace(/\s+/g, "_")
                      )
                    }
                    placeholder="VD: IT"
                    className={inputClass}
                  />
                </FormField>

                {/* Description */}

                <FormField
                  label="Mô tả"
                  icon={
                    <FileText className="h-4 w-4" />
                  }
                >
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      handleChange(
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Mô tả chức năng của phòng ban..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </FormField>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Manager */}

                  <FormField
                    label="Trưởng phòng"
                    icon={
                      <UserRound className="h-4 w-4" />
                    }
                  >
                    <div className="relative">
                      <select
                        value={form.managerId}
                        onChange={(e) =>
                          handleChange(
                            "managerId",
                            e.target.value
                          )
                        }
                        className={cn(
                          inputClass,
                          "appearance-none pr-10"
                        )}
                      >
                        <option value="">
                          Chưa phân công
                        </option>

                        {employees.map(
                          (employee) => (
                            <option
                              key={employee.id}
                              value={employee.id}
                            >
                              {employee.fullName}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </FormField>

                  {/* Status */}

                  <FormField
                    label="Trạng thái"
                    icon={
                      <CheckCircle2 className="h-4 w-4" />
                    }
                  >
                    <div className="relative">
                      <select
                        value={form.status}
                        onChange={(e) =>
                          handleChange(
                            "status",
                            e.target.value as DepartmentStatus
                          )
                        }
                        className={cn(
                          inputClass,
                          "appearance-none pr-10"
                        )}
                      >
                        <option value="active">
                          Hoạt động
                        </option>

                        <option value="inactive">
                          Tạm ngưng
                        </option>
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Footer */}

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  {modalMode === "create" ? (
                    <>
                      <Plus className="h-4 w-4" />
                      Tạo phòng ban
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteDepartment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div
            className="absolute inset-0"
            onClick={() =>
              setDeleteDepartment(null)
            }
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Xóa phòng ban?
                  </h2>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    Bạn có chắc muốn xóa phòng ban{" "}
                    <span className="font-semibold text-slate-700">
                      {deleteDepartment.name}
                    </span>
                    ?
                  </p>

                  {deleteDepartment.employeeCount >
                    0 && (
                    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-700">
                      Phòng ban này hiện có{" "}
                      <strong>
                        {
                          deleteDepartment.employeeCount
                        }
                      </strong>{" "}
                      nhân sự. Trong hệ thống
                      thực tế nên kiểm tra ràng buộc
                      trước khi xóa.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setDeleteDepartment(null)
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Xóa phòng ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        {label}

        {required && (
          <span className="text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   INPUT STYLE
========================================================= */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";