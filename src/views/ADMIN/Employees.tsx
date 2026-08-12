// // "use client";

// // import { useMemo, useState } from "react";
// // import {
// //   Search,
// //   Plus,
// //   MoreHorizontal,
// //   Filter,
// //   ChevronDown,
// //   Pencil,
// //   Trash2,
// //   UserPlus,
// //   X,
// //   CalendarDays,
// //   Phone,
// //   User,
// //   Lock,
// //   Building2,
// //   Image as ImageIcon,
// //   AlertTriangle,
// // } from "lucide-react";

// // import { cn } from "@/lib/utils";
// // import {
// //   employees,
// //   departments,
// //   shifts,
// //   EmployeeStatus,
// // } from "@/@mockdata/employee.mock";

// // type EmployeeForm = {
// //   username: string;
// //   password: string;
// //   fullname: string;
// //   phone: string;
// //   dob: string;
// //   avatarUrl: string;
// //   workDate: string;
// //   departmentName: string;
// // };

// // type ModalMode = "create" | "edit" | null;

// // type EmployeeItem = {
// //   id: string;
// //   employeeCode: string;
// //   fullName: string;
// //   position: string;
// //   departmentId: string;
// //   departmentName?: string;
// //   shiftId: string;
// //   status: EmployeeStatus;
// //   avatar: string;

// //   username?: string;
// //   password?: string;
// //   phone?: string;
// //   dob?: string;
// //   avatarUrl?: string;
// //   workDate?: string;
// // };

// // const emptyForm: EmployeeForm = {
// //   username: "",
// //   password: "",
// //   fullname: "",
// //   phone: "",
// //   dob: "",
// //   avatarUrl: "",
// //   workDate: "",
// //   departmentName: "",
// // };

// // export default function Employees() {
// //   const [employeeList, setEmployeeList] = useState<EmployeeItem[]>(
// //     employees as EmployeeItem[]
// //   );

// //   const [search, setSearch] = useState("");
// //   const [filterDept, setFilterDept] = useState("all");

// //   const [modalMode, setModalMode] = useState<ModalMode>(null);
// //   const [selectedEmployee, setSelectedEmployee] =
// //     useState<EmployeeItem | null>(null);

// //   const [form, setForm] = useState<EmployeeForm>(emptyForm);

// //   const [deleteEmployee, setDeleteEmployee] =
// //     useState<EmployeeItem | null>(null);

// //   const [showPassword, setShowPassword] = useState(false);

// //   /**
// //    * =========================
// //    * Helpers
// //    * =========================
// //    */

// //   const getDeptName = (id: string) =>
// //     departments.find((d) => d.id === id)?.name || "N/A";

// //   const getShiftName = (id: string) =>
// //     shifts.find((s) => s.id === id)?.name || "N/A";

// //   const getDepartmentId = (departmentName: string) =>
// //     departments.find((d) => d.name === departmentName)?.id || "";

// //   const getStatusConfig = (status: EmployeeStatus) => {
// //     switch (status) {
// //       case "active":
// //         return {
// //           label: "Hoạt động",
// //           className:
// //             "bg-emerald-50 text-emerald-600 border-emerald-200",
// //         };

// //       case "inactive":
// //         return {
// //           label: "Đã nghỉ",
// //           className:
// //             "bg-slate-50 text-slate-500 border-slate-200",
// //         };

// //       case "on_leave":
// //         return {
// //           label: "Nghỉ phép",
// //           className:
// //             "bg-amber-50 text-amber-600 border-amber-200",
// //         };

// //       default:
// //         return {
// //           label: status,
// //           className:
// //             "bg-slate-50 text-slate-500 border-slate-200",
// //         };
// //     }
// //   };

// //   /**
// //    * =========================
// //    * Filter
// //    * =========================
// //    */

// //   const filteredEmployees = useMemo(() => {
// //     const keyword = search.trim().toLowerCase();

// //     return employeeList.filter((emp) => {
// //       const departmentName =
// //         emp.departmentName || getDeptName(emp.departmentId);

// //       const matchSearch =
// //         !keyword ||
// //         emp.fullName.toLowerCase().includes(keyword) ||
// //         emp.employeeCode.toLowerCase().includes(keyword) ||
// //         emp.username?.toLowerCase().includes(keyword) ||
// //         emp.phone?.toLowerCase().includes(keyword);

// //       const matchDept =
// //         filterDept === "all" ||
// //         emp.departmentId === filterDept ||
// //         getDepartmentId(departmentName) === filterDept;

// //       return matchSearch && matchDept;
// //     });
// //   }, [employeeList, search, filterDept]);

// //   /**
// //    * =========================
// //    * Open Create
// //    * =========================
// //    */

// //   const handleOpenCreate = () => {
// //     setSelectedEmployee(null);
// //     setForm(emptyForm);
// //     setShowPassword(false);
// //     setModalMode("create");
// //   };

// //   /**
// //    * =========================
// //    * Open Edit
// //    * =========================
// //    */

// //   const handleOpenEdit = (employee: EmployeeItem) => {
// //     const departmentName =
// //       employee.departmentName || getDeptName(employee.departmentId);

// //     setSelectedEmployee(employee);

// //     setForm({
// //       username: employee.username || "",
// //       password: employee.password || "",
// //       fullname: employee.fullName || "",
// //       phone: employee.phone || "",
// //       dob: employee.dob || "",
// //       avatarUrl: employee.avatarUrl || employee.avatar || "",
// //       workDate: employee.workDate || "",
// //       departmentName,
// //     });

// //     setShowPassword(false);
// //     setModalMode("edit");
// //   };

// //   /**
// //    * =========================
// //    * Close Modal
// //    * =========================
// //    */

// //   const handleCloseModal = () => {
// //     setModalMode(null);
// //     setSelectedEmployee(null);
// //     setForm(emptyForm);
// //     setShowPassword(false);
// //   };

// //   /**
// //    * =========================
// //    * Form Change
// //    * =========================
// //    */

// //   const handleChange = (
// //     field: keyof EmployeeForm,
// //     value: string
// //   ) => {
// //     setForm((prev) => ({
// //       ...prev,
// //       [field]: value,
// //     }));
// //   };

// //   /**
// //    * =========================
// //    * Create / Update
// //    * =========================
// //    */

// //   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();

// //     if (!form.fullname.trim()) {
// //       alert("Vui lòng nhập họ và tên.");
// //       return;
// //     }

// //     if (!form.username.trim()) {
// //       alert("Vui lòng nhập username.");
// //       return;
// //     }

// //     if (modalMode === "create" && !form.password.trim()) {
// //       alert("Vui lòng nhập mật khẩu.");
// //       return;
// //     }

// //     if (!form.departmentName) {
// //       alert("Vui lòng chọn phòng ban.");
// //       return;
// //     }

// //     const departmentId = getDepartmentId(form.departmentName);

// //     if (modalMode === "create") {
// //       const newEmployee: EmployeeItem = {
// //         id: `emp-${Date.now()}`,
// //         employeeCode: `NV${String(
// //           employeeList.length + 1
// //         ).padStart(3, "0")}`,

// //         fullName: form.fullname,
// //         position: "Nhân viên",

// //         departmentId,
// //         departmentName: form.departmentName,

// //         shiftId: shifts[0]?.id || "",

// //         status: "active",

// //         avatar:
// //           form.avatarUrl ||
// //           `https://ui-avatars.com/api/?name=${encodeURIComponent(
// //             form.fullname
// //           )}&background=eef2ff&color=4f46e5`,

// //         username: form.username,
// //         password: form.password,
// //         phone: form.phone,
// //         dob: form.dob,
// //         avatarUrl: form.avatarUrl,
// //         workDate: form.workDate,
// //       };

// //       setEmployeeList((prev) => [newEmployee, ...prev]);
// //     }

// //     if (modalMode === "edit" && selectedEmployee) {
// //       setEmployeeList((prev) =>
// //         prev.map((employee) => {
// //           if (employee.id !== selectedEmployee.id) {
// //             return employee;
// //           }

// //           return {
// //             ...employee,

// //             fullName: form.fullname,

// //             departmentId,
// //             departmentName: form.departmentName,

// //             avatar:
// //               form.avatarUrl ||
// //               `https://ui-avatars.com/api/?name=${encodeURIComponent(
// //                 form.fullname
// //               )}&background=eef2ff&color=4f46e5`,

// //             username: form.username,
// //             password: form.password,
// //             phone: form.phone,
// //             dob: form.dob,
// //             avatarUrl: form.avatarUrl,
// //             workDate: form.workDate,
// //           };
// //         })
// //       );
// //     }

// //     handleCloseModal();
// //   };

// //   /**
// //    * =========================
// //    * Delete
// //    * =========================
// //    */

// //   const handleDelete = () => {
// //     if (!deleteEmployee) return;

// //     setEmployeeList((prev) =>
// //       prev.filter((employee) => employee.id !== deleteEmployee.id)
// //     );

// //     setDeleteEmployee(null);
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* =====================================================
// //           HEADER
// //       ====================================================== */}

// //       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
// //         <div>
// //           <h1 className="text-xl font-bold tracking-tight text-slate-900">
// //             Nhân viên
// //           </h1>

// //           <p className="mt-1 text-sm text-slate-500">
// //             Quản lý thông tin, phòng ban và trạng thái nhân viên.
// //           </p>
// //         </div>

// //         <button
// //           type="button"
// //           onClick={handleOpenCreate}
// //           className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
// //         >
// //           <Plus className="h-4 w-4" />
// //           Thêm nhân viên
// //         </button>
// //       </div>

// //       {/* =====================================================
// //           TOOLBAR
// //       ====================================================== */}

// //       <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
// //         <div className="flex flex-col gap-3 lg:flex-row">
// //           {/* Search */}

// //           <div className="relative flex-1">
// //             <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

// //             <input
// //               type="text"
// //               placeholder="Tìm theo tên, mã nhân viên, username, số điện thoại..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
// //             />
// //           </div>

// //           {/* Department Filter */}

// //           <div className="relative w-full lg:w-60">
// //             <Filter className="absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

// //             <select
// //               value={filterDept}
// //               onChange={(e) => setFilterDept(e.target.value)}
// //               className="h-11 w-full appearance-none rounded-xl border border-slate-100 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
// //             >
// //               <option value="all">
// //                 Tất cả phòng ban
// //               </option>

// //               {departments.map((department) => (
// //                 <option
// //                   key={department.id}
// //                   value={department.id}
// //                 >
// //                   {department.name}
// //                 </option>
// //               ))}
// //             </select>

// //             <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //           </div>
// //         </div>
// //       </div>

// //       {/* =====================================================
// //           TABLE
// //       ====================================================== */}

// //       <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
// //         <div className="overflow-x-auto">
// //           <table className="w-full min-w-[1000px]">
// //             <thead>
// //               <tr className="border-b border-slate-100 bg-slate-50/60">
// //                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
// //                   Mã NV
// //                 </th>

// //                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
// //                   Nhân viên
// //                 </th>

// //                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
// //                   Phòng ban
// //                 </th>

// //                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
// //                   Ca làm việc
// //                 </th>

// //                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
// //                   Trạng thái
// //                 </th>

// //                 <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
// //                   Thao tác
// //                 </th>
// //               </tr>
// //             </thead>

// //             <tbody className="divide-y divide-slate-50">
// //               {filteredEmployees.map((emp) => {
// //                 const statusConf = getStatusConfig(emp.status);

// //                 return (
// //                   <tr
// //                     key={emp.id}
// //                     className="group transition-colors hover:bg-slate-50/60"
// //                   >
// //                     {/* Employee Code */}

// //                     <td className="whitespace-nowrap px-6 py-4">
// //                       <span className="inline-flex rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
// //                         {emp.employeeCode}
// //                       </span>
// //                     </td>

// //                     {/* Employee */}

// //                     <td className="whitespace-nowrap px-6 py-4">
// //                       <div className="flex items-center gap-3">
// //                         <div className="relative">
// //                           <img
// //                             src={
// //                               emp.avatar ||
// //                               emp.avatarUrl ||
// //                               `https://ui-avatars.com/api/?name=${encodeURIComponent(
// //                                 emp.fullName
// //                               )}`
// //                             }
// //                             alt={emp.fullName}
// //                             className="h-10 w-10 rounded-full border border-slate-100 object-cover shadow-sm"
// //                           />

// //                           <span
// //                             className={cn(
// //                               "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
// //                               emp.status === "active"
// //                                 ? "bg-emerald-500"
// //                                 : emp.status === "on_leave"
// //                                   ? "bg-amber-500"
// //                                   : "bg-slate-400"
// //                             )}
// //                           />
// //                         </div>

// //                         <div>
// //                           <div className="text-sm font-semibold text-slate-900">
// //                             {emp.fullName}
// //                           </div>

// //                           <div className="mt-0.5 text-xs text-slate-500">
// //                             {emp.position}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </td>

// //                     {/* Department */}

// //                     <td className="whitespace-nowrap px-6 py-4">
// //                       <span className="text-sm text-slate-700">
// //                         {emp.departmentName ||
// //                           getDeptName(emp.departmentId)}
// //                       </span>
// //                     </td>

// //                     {/* Shift */}

// //                     <td className="whitespace-nowrap px-6 py-4">
// //                       <span className="text-sm text-slate-700">
// //                         {getShiftName(emp.shiftId)}
// //                       </span>
// //                     </td>

// //                     {/* Status */}

// //                     <td className="whitespace-nowrap px-6 py-4">
// //                       <span
// //                         className={cn(
// //                           "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold",
// //                           statusConf.className
// //                         )}
// //                       >
// //                         <span className="h-1.5 w-1.5 rounded-full bg-current" />

// //                         {statusConf.label}
// //                       </span>
// //                     </td>

// //                     {/* Actions */}

// //                     <td className="whitespace-nowrap px-6 py-4 text-right">
// //                       <div className="flex items-center justify-end gap-1">
// //                         <button
// //                           type="button"
// //                           onClick={() =>
// //                             handleOpenEdit(emp)
// //                           }
// //                           className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
// //                           title="Chỉnh sửa"
// //                         >
// //                           <Pencil className="h-4 w-4" />
// //                         </button>

// //                         <button
// //                           type="button"
// //                           onClick={() =>
// //                             setDeleteEmployee(emp)
// //                           }
// //                           className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
// //                           title="Xóa"
// //                         >
// //                           <Trash2 className="h-4 w-4" />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 );
// //               })}

// //               {/* Empty State */}

// //               {filteredEmployees.length === 0 && (
// //                 <tr>
// //                   <td
// //                     colSpan={6}
// //                     className="px-6 py-20 text-center"
// //                   >
// //                     <div className="flex flex-col items-center">
// //                       <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
// //                         <Search className="h-5 w-5 text-slate-400" />
// //                       </div>

// //                       <p className="text-sm font-semibold text-slate-700">
// //                         Không tìm thấy nhân viên
// //                       </p>

// //                       <p className="mt-1 text-xs text-slate-400">
// //                         Thử thay đổi từ khóa hoặc bộ lọc phòng ban.
// //                       </p>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Table Footer */}

// //         <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
// //           <p className="text-xs text-slate-400">
// //             Hiển thị{" "}
// //             <span className="font-semibold text-slate-600">
// //               {filteredEmployees.length}
// //             </span>{" "}
// //             /{" "}
// //             <span className="font-semibold text-slate-600">
// //               {employeeList.length}
// //             </span>{" "}
// //             nhân viên
// //           </p>
// //         </div>
// //       </div>

// //       {/* =====================================================
// //           CREATE / EDIT MODAL
// //       ====================================================== */}

// //       {modalMode && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
// //           <div
// //             className="absolute inset-0"
// //             onClick={handleCloseModal}
// //           />

// //           <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
// //             {/* Modal Header */}

// //             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
// //               <div className="flex items-center gap-3">
// //                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
// //                   {modalMode === "create" ? (
// //                     <UserPlus className="h-5 w-5" />
// //                   ) : (
// //                     <Pencil className="h-5 w-5" />
// //                   )}
// //                 </div>

// //                 <div>
// //                   <h2 className="text-base font-bold text-slate-900">
// //                     {modalMode === "create"
// //                       ? "Thêm nhân viên"
// //                       : "Chỉnh sửa nhân viên"}
// //                   </h2>

// //                   <p className="mt-0.5 text-xs text-slate-400">
// //                     {modalMode === "create"
// //                       ? "Tạo tài khoản và thông tin nhân viên mới."
// //                       : "Cập nhật thông tin nhân viên."}
// //                   </p>
// //                 </div>
// //               </div>

// //               <button
// //                 type="button"
// //                 onClick={handleCloseModal}
// //                 className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>

// //             {/* Form */}

// //             <form onSubmit={handleSubmit}>
// //               <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
// //                 <div className="grid gap-5 sm:grid-cols-2">
// //                   {/* Username */}

// //                   <FormField
// //                     label="Username"
// //                     required
// //                     icon={<User className="h-4 w-4" />}
// //                   >
// //                     <input
// //                       type="text"
// //                       value={form.username}
// //                       onChange={(e) =>
// //                         handleChange(
// //                           "username",
// //                           e.target.value
// //                         )
// //                       }
// //                       placeholder="VD: nguyenvana"
// //                       className={inputClass}
// //                     />
// //                   </FormField>

// //                   {/* Password */}

// //                   <FormField
// //                     label="Mật khẩu"
// //                     required={modalMode === "create"}
// //                     icon={<Lock className="h-4 w-4" />}
// //                   >
// //                     <div className="relative">
// //                       <input
// //                         type={
// //                           showPassword
// //                             ? "text"
// //                             : "password"
// //                         }
// //                         value={form.password}
// //                         onChange={(e) =>
// //                           handleChange(
// //                             "password",
// //                             e.target.value
// //                           )
// //                         }
// //                         placeholder={
// //                           modalMode === "edit"
// //                             ? "Để trống nếu không đổi"
// //                             : "Nhập mật khẩu"
// //                         }
// //                         className={cn(
// //                           inputClass,
// //                           "pr-20"
// //                         )}
// //                       />

// //                       <button
// //                         type="button"
// //                         onClick={() =>
// //                           setShowPassword(
// //                             (prev) => !prev
// //                           )
// //                         }
// //                         className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-blue-600"
// //                       >
// //                         {showPassword
// //                           ? "Ẩn"
// //                           : "Hiện"}
// //                       </button>
// //                     </div>
// //                   </FormField>

// //                   {/* Fullname */}

// //                   <FormField
// //                     label="Họ và tên"
// //                     required
// //                     icon={<User className="h-4 w-4" />}
// //                   >
// //                     <input
// //                       type="text"
// //                       value={form.fullname}
// //                       onChange={(e) =>
// //                         handleChange(
// //                           "fullname",
// //                           e.target.value
// //                         )
// //                       }
// //                       placeholder="VD: Nguyễn Văn A"
// //                       className={inputClass}
// //                     />
// //                   </FormField>

// //                   {/* Phone */}

// //                   <FormField
// //                     label="Số điện thoại"
// //                     icon={<Phone className="h-4 w-4" />}
// //                   >
// //                     <input
// //                       type="tel"
// //                       value={form.phone}
// //                       onChange={(e) =>
// //                         handleChange(
// //                           "phone",
// //                           e.target.value
// //                         )
// //                       }
// //                       placeholder="VD: 0901234567"
// //                       className={inputClass}
// //                     />
// //                   </FormField>

// //                   {/* DOB */}

// //                   <FormField
// //                     label="Ngày sinh"
// //                     icon={
// //                       <CalendarDays className="h-4 w-4" />
// //                     }
// //                   >
// //                     <input
// //                       type="date"
// //                       value={form.dob}
// //                       onChange={(e) =>
// //                         handleChange(
// //                           "dob",
// //                           e.target.value
// //                         )
// //                       }
// //                       className={inputClass}
// //                     />
// //                   </FormField>

// //                   {/* Work Date */}

// //                   <FormField
// //                     label="Ngày vào làm"
// //                     icon={
// //                       <CalendarDays className="h-4 w-4" />
// //                     }
// //                   >
// //                     <input
// //                       type="date"
// //                       value={form.workDate}
// //                       onChange={(e) =>
// //                         handleChange(
// //                           "workDate",
// //                           e.target.value
// //                         )
// //                       }
// //                       className={inputClass}
// //                     />
// //                   </FormField>

// //                   {/* Department */}

// //                   <FormField
// //                     label="Phòng ban"
// //                     required
// //                     icon={
// //                       <Building2 className="h-4 w-4" />
// //                     }
// //                   >
// //                     <div className="relative">
// //                       <select
// //                         value={form.departmentName}
// //                         onChange={(e) =>
// //                           handleChange(
// //                             "departmentName",
// //                             e.target.value
// //                           )
// //                         }
// //                         className={cn(
// //                           inputClass,
// //                           "appearance-none pr-10"
// //                         )}
// //                       >
// //                         <option value="">
// //                           Chọn phòng ban
// //                         </option>

// //                         {departments.map(
// //                           (department) => (
// //                             <option
// //                               key={department.id}
// //                               value={department.name}
// //                             >
// //                               {department.name}
// //                             </option>
// //                           )
// //                         )}
// //                       </select>

// //                       <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //                     </div>
// //                   </FormField>

// //                   {/* Avatar */}

// //                  {/* Avatar */}
// // <FormField
// //   label="Ảnh đại diện"
// //   icon={<ImageIcon className="h-4 w-4" />}
// // >
// //   <div className="space-y-3">
// //     <div className="flex items-center gap-4">
// //       {/* Preview */}
// //       <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
// //         {form.avatarUrl ? (
// //           <img
// //             src={form.avatarUrl}
// //             alt="Avatar preview"
// //             className="h-full w-full object-cover"
// //           />
// //         ) : (
// //           <div className="flex h-full w-full items-center justify-center text-slate-400">
// //             <User className="h-6 w-6" />
// //           </div>
// //         )}
// //       </div>

// //       {/* Upload */}
// //       <div className="flex-1">
// //         <label
// //           htmlFor="avatar-upload"
// //           className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
// //         >
// //           <ImageIcon className="mr-2 h-4 w-4" />
// //           Chọn hình ảnh
// //         </label>

// //         <input
// //           id="avatar-upload"
// //           type="file"
// //           accept="image/png,image/jpeg,image/jpg,image/webp"
// //           className="hidden"
// //           onChange={(e) => {
// //             const file = e.target.files?.[0];

// //             if (!file) return;

// //             // Giới hạn 5MB
// //             if (file.size > 5 * 1024 * 1024) {
// //               alert("Ảnh không được vượt quá 5MB.");
// //               e.target.value = "";
// //               return;
// //             }

// //             const previewUrl = URL.createObjectURL(file);

// //             setForm((prev) => ({
// //               ...prev,
// //               avatarUrl: previewUrl,
// //             }));
// //           }}
// //         />

// //         <p className="mt-1.5 text-[11px] text-slate-400">
// //           PNG, JPG hoặc WEBP · tối đa 5MB
// //         </p>
// //       </div>
// //     </div>
// //   </div>
// //   </FormField>
// //                 </div>

// //                 {/* Avatar Preview */}

// //                 {form.avatarUrl && (
// //                   <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
// //                     <div className="mb-3 text-xs font-semibold text-slate-500">
// //                       Xem trước avatar
// //                     </div>

// //                     <div className="flex items-center gap-3">
// //                       <img
// //                         src={form.avatarUrl}
// //                         alt="Avatar preview"
// //                         className="h-12 w-12 rounded-full border border-slate-200 object-cover"
// //                       />

// //                       <div>
// //                         <div className="text-sm font-semibold text-slate-800">
// //                           {form.fullname ||
// //                             "Tên nhân viên"}
// //                         </div>

// //                         <div className="text-xs text-slate-400">
// //                           {form.departmentName ||
// //                             "Chưa chọn phòng ban"}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Footer */}

// //               <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
// //                 <button
// //                   type="button"
// //                   onClick={handleCloseModal}
// //                   className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
// //                 >
// //                   Hủy
// //                 </button>

// //                 <button
// //                   type="submit"
// //                   className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
// //                 >
// //                   {modalMode === "create" ? (
// //                     <>
// //                       <Plus className="h-4 w-4" />
// //                       Tạo nhân viên
// //                     </>
// //                   ) : (
// //                     <>
// //                       <Pencil className="h-4 w-4" />
// //                       Lưu thay đổi
// //                     </>
// //                   )}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* =====================================================
// //           DELETE CONFIRMATION
// //       ====================================================== */}

// //       {deleteEmployee && (
// //         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
// //           <div
// //             className="absolute inset-0"
// //             onClick={() => setDeleteEmployee(null)}
// //           />

// //           <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
// //             <div className="p-6">
// //               <div className="flex items-start gap-4">
// //                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
// //                   <AlertTriangle className="h-5 w-5" />
// //                 </div>

// //                 <div>
// //                   <h2 className="text-base font-bold text-slate-900">
// //                     Xóa nhân viên?
// //                   </h2>

// //                   <p className="mt-1.5 text-sm leading-6 text-slate-500">
// //                     Bạn có chắc muốn xóa nhân viên{" "}
// //                     <span className="font-semibold text-slate-700">
// //                       {deleteEmployee.fullName}
// //                     </span>
// //                     ? Hành động này không thể hoàn tác.
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setDeleteEmployee(null)}
// //                 className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
// //               >
// //                 Hủy
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={handleDelete}
// //                 className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
// //               >
// //                 <Trash2 className="h-4 w-4" />
// //                 Xóa nhân viên
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // /**
// //  * ============================================================
// //  * FORM FIELD
// //  * ============================================================
// //  */

// // function FormField({
// //   label,
// //   required,
// //   icon,
// //   children,
// // }: {
// //   label: string;
// //   required?: boolean;
// //   icon?: React.ReactNode;
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <div className="space-y-2">
// //       <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
// //         {icon && (
// //           <span className="text-slate-400">
// //             {icon}
// //           </span>
// //         )}

// //         {label}

// //         {required && (
// //           <span className="text-red-500">*</span>
// //         )}
// //       </label>

// //       {children}
// //     </div>
// //   );
// // }

// // /**
// //  * ============================================================
// //  * INPUT STYLE
// //  * ============================================================
// //  */

// // const inputClass =
// //   "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

// "use client";

// import { useMemo, useState } from "react";
// import {
//   Search,
//   Plus,
//   Filter,
//   ChevronDown,
//   Pencil,
//   Trash2,
//   UserPlus,
//   X,
//   CalendarDays,
//   Phone,
//   User,
//   Lock,
//   Building2,
//   Image as ImageIcon,
//   AlertTriangle,
//   Loader2,
//   RefreshCw,
// } from "lucide-react";

// import { cn } from "@/lib/utils";

// import {
//   useEmployees,
//   useCreateEmployee,
//   useUpdateEmployee,
//   useDeleteEmployee,
//   type UpdateEmployeeVariables,
// } from "@/hooks/useEmployee";

// import type { Employee } from "@/api/auth";

// type EmployeeForm = {
//   username: string;
//   password: string;
//   fullname: string;
//   phone: string;
//   dob: string;
//   avatarUrl: string;
//   workDate: string;
//   departmentName: string;
// };

// type ModalMode = "create" | "edit" | null;

// type Department = {
//   id: string;
//   name: string;
// };

// const emptyForm: EmployeeForm = {
//   username: "",
//   password: "",
//   fullname: "",
//   phone: "",
//   dob: "",
//   avatarUrl: "",
//   workDate: "",
//   departmentName: "",
// };

// /**
//  * Nếu project của bạn có API departments riêng,
//  * thay danh sách này bằng hook departments thực tế.
//  */
// const departments: Department[] = [];

// function getEmployeeValue<T = unknown>(
//   employee: Employee,
//   keys: string[],
// ): T | undefined {
//   const record = employee as unknown as Record<string, unknown>;

//   for (const key of keys) {
//     if (record[key] !== undefined && record[key] !== null) {
//       return record[key] as T;
//     }
//   }

//   return undefined;
// }

// function getEmployeeId(employee: Employee): string {
//   const value = getEmployeeValue<string | number>(employee, [
//     "id",
//     "employeeId",
//   ]);

//   return value !== undefined ? String(value) : "";
// }

// function getEmployeeCode(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "employeeCode",
//       "code",
//       "employee_code",
//     ]) || "-"
//   );
// }

// function getFullName(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "fullName",
//       "fullname",
//       "full_name",
//       "name",
//     ]) || "Chưa có tên"
//   );
// }

// function getUsername(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "username",
//       "userName",
//     ]) || ""
//   );
// }

// function getPhone(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "phone",
//       "phoneNumber",
//       "phone_number",
//     ]) || ""
//   );
// }

// function getDepartmentName(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "departmentName",
//       "department_name",
//     ]) || "N/A"
//   );
// }

// function getDepartmentId(employee: Employee): string {
//   const value = getEmployeeValue<string | number>(employee, [
//     "departmentId",
//     "department_id",
//   ]);

//   return value !== undefined ? String(value) : "";
// }

// function getPosition(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "position",
//       "positionName",
//       "position_name",
//       "role",
//     ]) || "Nhân viên"
//   );
// }

// function getShiftName(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "shiftName",
//       "shift_name",
//     ]) || "N/A"
//   );
// }

// function getStatus(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "status",
//     ]) || "active"
//   );
// }

// function getAvatar(employee: Employee): string {
//   return (
//     getEmployeeValue<string>(employee, [
//       "avatarUrl",
//       "avatar_url",
//       "avatar",
//       "imageUrl",
//       "image_url",
//     ]) || ""
//   );
// }

// function getStatusConfig(status: string) {
//   switch (status) {
//     case "active":
//       return {
//         label: "Hoạt động",
//         className:
//           "bg-emerald-50 text-emerald-600 border-emerald-200",
//         dotClass: "bg-emerald-500",
//       };

//     case "inactive":
//       return {
//         label: "Đã nghỉ",
//         className:
//           "bg-slate-50 text-slate-500 border-slate-200",
//         dotClass: "bg-slate-400",
//       };

//     case "on_leave":
//       return {
//         label: "Nghỉ phép",
//         className:
//           "bg-amber-50 text-amber-600 border-amber-200",
//         dotClass: "bg-amber-500",
//       };

//     default:
//       return {
//         label: status,
//         className:
//           "bg-slate-50 text-slate-500 border-slate-200",
//         dotClass: "bg-slate-400",
//       };
//   }
// }

// function getDateValue(employee: Employee, keys: string[]) {
//   return (
//     getEmployeeValue<string>(employee, keys) || ""
//   );
// }

// export default function Employees() {
//   const {
//     data: employees = [],
//     isLoading,
//     isFetching,
//     isError,
//     error,
//     refetch,
//   } = useEmployees();

//   const createEmployee = useCreateEmployee();
//   const updateEmployee = useUpdateEmployee();
//   const deleteEmployee = useDeleteEmployee();

//   const [search, setSearch] = useState("");
//   const [filterDept, setFilterDept] = useState("all");

//   const [modalMode, setModalMode] =
//     useState<ModalMode>(null);

//   const [selectedEmployee, setSelectedEmployee] =
//     useState<Employee | null>(null);

//   const [deleteTarget, setDeleteTarget] =
//     useState<Employee | null>(null);

//   const [form, setForm] =
//     useState<EmployeeForm>(emptyForm);

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [avatarPreview, setAvatarPreview] =
//     useState<string>("");

//   const isSubmitting =
//     createEmployee.isPending ||
//     updateEmployee.isPending;

//   const isDeleting = deleteEmployee.isPending;

//   /**
//    * =========================================================
//    * FILTER
//    * =========================================================
//    */

//   const filteredEmployees = useMemo(() => {
//     const keyword = search.trim().toLowerCase();

//     return employees.filter((employee) => {
//       const fullName = getFullName(employee);
//       const employeeCode = getEmployeeCode(employee);
//       const username = getUsername(employee);
//       const phone = getPhone(employee);
//       const departmentName =
//         getDepartmentName(employee);
//       const departmentId =
//         getDepartmentId(employee);

//       const matchSearch =
//         !keyword ||
//         fullName.toLowerCase().includes(keyword) ||
//         employeeCode.toLowerCase().includes(keyword) ||
//         username.toLowerCase().includes(keyword) ||
//         phone.toLowerCase().includes(keyword);

//       const matchDepartment =
//         filterDept === "all" ||
//         departmentId === filterDept ||
//         departmentName === filterDept;

//       return matchSearch && matchDepartment;
//     });
//   }, [employees, search, filterDept]);

//   /**
//    * =========================================================
//    * OPEN CREATE
//    * =========================================================
//    */

//   const handleOpenCreate = () => {
//     setSelectedEmployee(null);
//     setForm(emptyForm);
//     setAvatarPreview("");
//     setShowPassword(false);
//     setModalMode("create");
//   };

//   /**
//    * =========================================================
//    * OPEN EDIT
//    * =========================================================
//    */

//   const handleOpenEdit = (employee: Employee) => {
//     setSelectedEmployee(employee);

//     const avatar = getAvatar(employee);

//     setForm({
//       username: getUsername(employee),
//       password: "",
//       fullname: getFullName(employee),
//       phone: getPhone(employee),
//       dob: getDateValue(employee, [
//         "dob",
//         "dateOfBirth",
//         "date_of_birth",
//       ]),
//       avatarUrl: avatar,
//       workDate: getDateValue(employee, [
//         "workDate",
//         "startDate",
//         "start_date",
//       ]),
//       departmentName: getDepartmentName(employee),
//     });

//     setAvatarPreview(avatar);
//     setShowPassword(false);
//     setModalMode("edit");
//   };

//   /**
//    * =========================================================
//    * CLOSE MODAL
//    * =========================================================
//    */

//   const handleCloseModal = () => {
//     if (isSubmitting) return;

//     setModalMode(null);
//     setSelectedEmployee(null);
//     setForm(emptyForm);
//     setAvatarPreview("");
//     setShowPassword(false);
//   };

//   /**
//    * =========================================================
//    * FORM CHANGE
//    * =========================================================
//    */

//   const handleChange = (
//     field: keyof EmployeeForm,
//     value: string,
//   ) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   /**
//    * =========================================================
//    * AVATAR
//    * =========================================================
//    */

//   const handleAvatarChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const file = event.target.files?.[0];

//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       alert("Ảnh không được vượt quá 5MB.");
//       event.target.value = "";
//       return;
//     }

//     const allowedTypes = [
//       "image/png",
//       "image/jpeg",
//       "image/jpg",
//       "image/webp",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       alert("Chỉ hỗ trợ PNG, JPG và WEBP.");
//       event.target.value = "";
//       return;
//     }

//     const previewUrl = URL.createObjectURL(file);

//     setAvatarPreview(previewUrl);

//     setForm((prev) => ({
//       ...prev,
//       avatarUrl: previewUrl,
//     }));
//   };

//   /**
//    * =========================================================
//    * CREATE / UPDATE
//    * =========================================================
//    */

//   const handleSubmit = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();

//     const fullname = form.fullname.trim();
//     const username = form.username.trim();

//     if (!fullname) {
//       alert("Vui lòng nhập họ và tên.");
//       return;
//     }

//     if (!username) {
//       alert("Vui lòng nhập username.");
//       return;
//     }

//     if (modalMode === "create" && !form.password.trim()) {
//       alert("Vui lòng nhập mật khẩu.");
//       return;
//     }

//     if (!form.departmentName) {
//       alert("Vui lòng chọn phòng ban.");
//       return;
//     }

//     try {
//       if (modalMode === "create") {
//         await createEmployee.mutateAsync({
//           username,
//           password: form.password,
//           fullname,
//           phone: form.phone.trim(),
//           dob: form.dob,
//           avatarUrl: form.avatarUrl,
//           workDate: form.workDate,
//           departmentName: form.departmentName,
//         });

//         handleCloseModal();
//         return;
//       }

//       if (
//         modalMode === "edit" &&
//         selectedEmployee
//       ) {
//         const id = getEmployeeId(selectedEmployee);

//         if (!id) {
//           alert("Không xác định được ID nhân viên.");
//           return;
//         }

//         const payload: UpdateEmployeeVariables["data"] =
//           {
//             username,
//             fullname,
//             phone: form.phone.trim(),
//             dob: form.dob,
//             avatarUrl: form.avatarUrl,
//             workDate: form.workDate,
//             departmentName: form.departmentName,
//           };

//         /**
//          * Không gửi password nếu người dùng
//          * không nhập password mới.
//          */
//         if (form.password.trim()) {
//           payload.password = form.password;
//         }

//         await updateEmployee.mutateAsync({
//           id,
//           data: payload,
//         });

//         handleCloseModal();
//       }
//     } catch (err) {
//       console.error(err);

//       alert(
//         err instanceof Error
//           ? err.message
//           : "Có lỗi xảy ra. Vui lòng thử lại.",
//       );
//     }
//   };

//   /**
//    * =========================================================
//    * DELETE
//    * =========================================================
//    */

//   const handleDelete = async () => {
//     if (!deleteTarget) return;

//     const id = getEmployeeId(deleteTarget);

//     if (!id) {
//       alert("Không xác định được ID nhân viên.");
//       return;
//     }

//     try {
//       await deleteEmployee.mutateAsync(id);

//       setDeleteTarget(null);
//     } catch (err) {
//       console.error(err);

//       alert(
//         err instanceof Error
//           ? err.message
//           : "Không thể xóa nhân viên.",
//       );
//     }
//   };

//   /**
//    * =========================================================
//    * LOADING
//    * =========================================================
//    */

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-100" />
//             <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
//           </div>

//           <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-100" />
//         </div>

//         <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
//           <div className="h-11 w-full animate-pulse rounded-xl bg-slate-50" />
//         </div>

//         <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
//           <div className="space-y-4 p-6">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="h-12 animate-pulse rounded-xl bg-slate-50"
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /**
//    * =========================================================
//    * ERROR
//    * =========================================================
//    */

//   if (isError) {
//     return (
//       <div className="flex min-h-[420px] items-center justify-center">
//         <div className="max-w-md text-center">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
//             <AlertTriangle className="h-5 w-5" />
//           </div>

//           <h2 className="mt-4 text-base font-bold text-slate-900">
//             Không thể tải danh sách nhân viên
//           </h2>

//           <p className="mt-2 text-sm leading-6 text-slate-500">
//             {error instanceof Error
//               ? error.message
//               : "Đã xảy ra lỗi khi kết nối tới máy chủ."}
//           </p>

//           <button
//             type="button"
//             onClick={() => refetch()}
//             className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Thử lại
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* =====================================================
//           HEADER
//       ====================================================== */}

//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h1 className="text-xl font-bold tracking-tight text-slate-900">
//             Nhân viên
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             Quản lý thông tin, phòng ban và trạng thái nhân viên.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleOpenCreate}
//           className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
//         >
//           <Plus className="h-4 w-4" />
//           Thêm nhân viên
//         </button>
//       </div>

//       {/* =====================================================
//           TOOLBAR
//       ====================================================== */}

//       <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
//         <div className="flex flex-col gap-3 lg:flex-row">
//           <div className="relative flex-1">
//             <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//             <input
//               type="text"
//               placeholder="Tìm theo tên, mã nhân viên, username, số điện thoại..."
//               value={search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//               className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
//             />
//           </div>

//           <div className="relative w-full lg:w-60">
//             <Filter className="absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

//             <select
//               value={filterDept}
//               onChange={(event) =>
//                 setFilterDept(event.target.value)
//               }
//               className="h-11 w-full appearance-none rounded-xl border border-slate-100 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//             >
//               <option value="all">
//                 Tất cả phòng ban
//               </option>

//               {departments.map((department) => (
//                 <option
//                   key={department.id}
//                   value={department.id}
//                 >
//                   {department.name}
//                 </option>
//               ))}
//             </select>

//             <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           TABLE
//       ====================================================== */}

//       <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1000px]">
//             <thead>
//               <tr className="border-b border-slate-100 bg-slate-50/60">
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
//                   Mã NV
//                 </th>

//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
//                   Nhân viên
//                 </th>

//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
//                   Phòng ban
//                 </th>

//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
//                   Ca làm việc
//                 </th>

//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
//                   Trạng thái
//                 </th>

//                 <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
//                   Thao tác
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-50">
//               {filteredEmployees.map((employee) => {
//                 const status = getStatus(employee);
//                 const statusConfig =
//                   getStatusConfig(status);

//                 const avatar = getAvatar(employee);
//                 const fullName =
//                   getFullName(employee);

//                 return (
//                   <tr
//                     key={getEmployeeId(employee)}
//                     className="group transition-colors hover:bg-slate-50/60"
//                   >
//                     <td className="whitespace-nowrap px-6 py-4">
//                       <span className="inline-flex rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
//                         {getEmployeeCode(employee)}
//                       </span>
//                     </td>

//                     <td className="whitespace-nowrap px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="relative">
//                           {avatar ? (
//                             <img
//                               src={avatar}
//                               alt={fullName}
//                               className="h-10 w-10 rounded-full border border-slate-100 object-cover shadow-sm"
//                             />
//                           ) : (
//                             <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400">
//                               <User className="h-5 w-5" />
//                             </div>
//                           )}

//                           <span
//                             className={cn(
//                               "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
//                               statusConfig.dotClass,
//                             )}
//                           />
//                         </div>

//                         <div>
//                           <div className="text-sm font-semibold text-slate-900">
//                             {fullName}
//                           </div>

//                           <div className="mt-0.5 text-xs text-slate-500">
//                             {getPosition(employee)}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="whitespace-nowrap px-6 py-4">
//                       <span className="text-sm text-slate-700">
//                         {getDepartmentName(employee)}
//                       </span>
//                     </td>

//                     <td className="whitespace-nowrap px-6 py-4">
//                       <span className="text-sm text-slate-700">
//                         {getShiftName(employee)}
//                       </span>
//                     </td>

//                     <td className="whitespace-nowrap px-6 py-4">
//                       <span
//                         className={cn(
//                           "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold",
//                           statusConfig.className,
//                         )}
//                       >
//                         <span
//                           className={cn(
//                             "h-1.5 w-1.5 rounded-full",
//                             statusConfig.dotClass,
//                           )}
//                         />

//                         {statusConfig.label}
//                       </span>
//                     </td>

//                     <td className="whitespace-nowrap px-6 py-4 text-right">
//                       <div className="flex items-center justify-end gap-1">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleOpenEdit(employee)
//                           }
//                           disabled={isSubmitting}
//                           className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
//                           title="Chỉnh sửa"
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             setDeleteTarget(employee)
//                           }
//                           disabled={isDeleting}
//                           className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
//                           title="Xóa"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {filteredEmployees.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-20 text-center"
//                   >
//                     <div className="flex flex-col items-center">
//                       <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
//                         <Search className="h-5 w-5 text-slate-400" />
//                       </div>

//                       <p className="text-sm font-semibold text-slate-700">
//                         Không tìm thấy nhân viên
//                       </p>

//                       <p className="mt-1 text-xs text-slate-400">
//                         Thử thay đổi từ khóa hoặc bộ lọc phòng ban.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
//           <p className="text-xs text-slate-400">
//             Hiển thị{" "}
//             <span className="font-semibold text-slate-600">
//               {filteredEmployees.length}
//             </span>{" "}
//             /{" "}
//             <span className="font-semibold text-slate-600">
//               {employees.length}
//             </span>{" "}
//             nhân viên
//           </p>

//           {isFetching && (
//             <div className="flex items-center gap-2 text-xs text-slate-400">
//               <Loader2 className="h-3.5 w-3.5 animate-spin" />
//               Đang đồng bộ...
//             </div>
//           )}
//         </div>
//       </div>

//       {/* =====================================================
//           CREATE / EDIT MODAL
//       ====================================================== */}

//       {modalMode && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
//           <div
//             className="absolute inset-0"
//             onClick={handleCloseModal}
//           />

//           <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                   {modalMode === "create" ? (
//                     <UserPlus className="h-5 w-5" />
//                   ) : (
//                     <Pencil className="h-5 w-5" />
//                   )}
//                 </div>

//                 <div>
//                   <h2 className="text-base font-bold text-slate-900">
//                     {modalMode === "create"
//                       ? "Thêm nhân viên"
//                       : "Chỉnh sửa nhân viên"}
//                   </h2>

//                   <p className="mt-0.5 text-xs text-slate-400">
//                     {modalMode === "create"
//                       ? "Tạo tài khoản và thông tin nhân viên mới."
//                       : "Cập nhật thông tin nhân viên."}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleCloseModal}
//                 disabled={isSubmitting}
//                 className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
//                 <div className="grid gap-5 sm:grid-cols-2">
//                   <FormField
//                     label="Username"
//                     required
//                     icon={<User className="h-4 w-4" />}
//                   >
//                     <input
//                       type="text"
//                       value={form.username}
//                       onChange={(event) =>
//                         handleChange(
//                           "username",
//                           event.target.value,
//                         )
//                       }
//                       placeholder="VD: nguyenvana"
//                       disabled={isSubmitting}
//                       className={inputClass}
//                     />
//                   </FormField>

//                   <FormField
//                     label="Mật khẩu"
//                     required={modalMode === "create"}
//                     icon={<Lock className="h-4 w-4" />}
//                   >
//                     <div className="relative">
//                       <input
//                         type={
//                           showPassword
//                             ? "text"
//                             : "password"
//                         }
//                         value={form.password}
//                         onChange={(event) =>
//                           handleChange(
//                             "password",
//                             event.target.value,
//                           )
//                         }
//                         placeholder={
//                           modalMode === "edit"
//                             ? "Để trống nếu không đổi"
//                             : "Nhập mật khẩu"
//                         }
//                         disabled={isSubmitting}
//                         className={cn(
//                           inputClass,
//                           "pr-20",
//                         )}
//                       />

//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowPassword(
//                             (prev) => !prev,
//                           )
//                         }
//                         disabled={isSubmitting}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-blue-600"
//                       >
//                         {showPassword
//                           ? "Ẩn"
//                           : "Hiện"}
//                       </button>
//                     </div>
//                   </FormField>

//                   <FormField
//                     label="Họ và tên"
//                     required
//                     icon={<User className="h-4 w-4" />}
//                   >
//                     <input
//                       type="text"
//                       value={form.fullname}
//                       onChange={(event) =>
//                         handleChange(
//                           "fullname",
//                           event.target.value,
//                         )
//                       }
//                       placeholder="VD: Nguyễn Văn A"
//                       disabled={isSubmitting}
//                       className={inputClass}
//                     />
//                   </FormField>

//                   <FormField
//                     label="Số điện thoại"
//                     icon={<Phone className="h-4 w-4" />}
//                   >
//                     <input
//                       type="tel"
//                       value={form.phone}
//                       onChange={(event) =>
//                         handleChange(
//                           "phone",
//                           event.target.value,
//                         )
//                       }
//                       placeholder="VD: 0901234567"
//                       disabled={isSubmitting}
//                       className={inputClass}
//                     />
//                   </FormField>

//                   <FormField
//                     label="Ngày sinh"
//                     icon={
//                       <CalendarDays className="h-4 w-4" />
//                     }
//                   >
//                     <input
//                       type="date"
//                       value={form.dob}
//                       onChange={(event) =>
//                         handleChange(
//                           "dob",
//                           event.target.value,
//                         )
//                       }
//                       disabled={isSubmitting}
//                       className={inputClass}
//                     />
//                   </FormField>

//                   <FormField
//                     label="Ngày vào làm"
//                     icon={
//                       <CalendarDays className="h-4 w-4" />
//                     }
//                   >
//                     <input
//                       type="date"
//                       value={form.workDate}
//                       onChange={(event) =>
//                         handleChange(
//                           "workDate",
//                           event.target.value,
//                         )
//                       }
//                       disabled={isSubmitting}
//                       className={inputClass}
//                     />
//                   </FormField>

//                   <FormField
//                     label="Phòng ban"
//                     required
//                     icon={
//                       <Building2 className="h-4 w-4" />
//                     }
//                   >
//                     <div className="relative">
//                       <select
//                         value={form.departmentName}
//                         onChange={(event) =>
//                           handleChange(
//                             "departmentName",
//                             event.target.value,
//                           )
//                         }
//                         disabled={isSubmitting}
//                         className={cn(
//                           inputClass,
//                           "appearance-none pr-10",
//                         )}
//                       >
//                         <option value="">
//                           Chọn phòng ban
//                         </option>

//                         {departments.map(
//                           (department) => (
//                             <option
//                               key={department.id}
//                               value={department.name}
//                             >
//                               {department.name}
//                             </option>
//                           ),
//                         )}
//                       </select>

//                       <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                     </div>
//                   </FormField>

//                   <FormField
//                     label="Ảnh đại diện"
//                     icon={
//                       <ImageIcon className="h-4 w-4" />
//                     }
//                   >
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-4">
//                         <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
//                           {avatarPreview ? (
//                             <img
//                               src={avatarPreview}
//                               alt="Avatar preview"
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             <div className="flex h-full w-full items-center justify-center text-slate-400">
//                               <User className="h-6 w-6" />
//                             </div>
//                           )}
//                         </div>

//                         <div className="flex-1">
//                           <label
//                             htmlFor="avatar-upload"
//                             className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
//                           >
//                             <ImageIcon className="mr-2 h-4 w-4" />
//                             Chọn hình ảnh
//                           </label>

//                           <input
//                             id="avatar-upload"
//                             type="file"
//                             accept="image/png,image/jpeg,image/jpg,image/webp"
//                             className="hidden"
//                             onChange={
//                               handleAvatarChange
//                             }
//                           />

//                           <p className="mt-1.5 text-[11px] text-slate-400">
//                             PNG, JPG hoặc WEBP · tối đa 5MB
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </FormField>
//                 </div>

//                 {avatarPreview && (
//                   <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
//                     <div className="mb-3 text-xs font-semibold text-slate-500">
//                       Xem trước avatar
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <img
//                         src={avatarPreview}
//                         alt="Avatar preview"
//                         className="h-12 w-12 rounded-full border border-slate-200 object-cover"
//                       />

//                       <div>
//                         <div className="text-sm font-semibold text-slate-800">
//                           {form.fullname ||
//                             "Tên nhân viên"}
//                         </div>

//                         <div className="text-xs text-slate-400">
//                           {form.departmentName ||
//                             "Chưa chọn phòng ban"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   disabled={isSubmitting}
//                   className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   Hủy
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       Đang xử lý...
//                     </>
//                   ) : modalMode === "create" ? (
//                     <>
//                       <Plus className="h-4 w-4" />
//                       Tạo nhân viên
//                     </>
//                   ) : (
//                     <>
//                       <Pencil className="h-4 w-4" />
//                       Lưu thay đổi
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           DELETE CONFIRMATION
//       ====================================================== */}

//       {deleteTarget && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
//           <div
//             className="absolute inset-0"
//             onClick={() =>
//               !isDeleting &&
//               setDeleteTarget(null)
//             }
//           />

//           <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
//             <div className="p-6">
//               <div className="flex items-start gap-4">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
//                   <AlertTriangle className="h-5 w-5" />
//                 </div>

//                 <div>
//                   <h2 className="text-base font-bold text-slate-900">
//                     Xóa nhân viên?
//                   </h2>

//                   <p className="mt-1.5 text-sm leading-6 text-slate-500">
//                     Bạn có chắc muốn xóa nhân viên{" "}
//                     <span className="font-semibold text-slate-700">
//                       {getFullName(deleteTarget)}
//                     </span>
//                     ? Hành động này không thể hoàn tác.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setDeleteTarget(null)
//                 }
//                 disabled={isDeleting}
//                 className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
//               >
//                 Hủy
//               </button>

//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 disabled={isDeleting}
//                 className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {isDeleting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Đang xóa...
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 className="h-4 w-4" />
//                     Xóa nhân viên
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function FormField({
//   label,
//   required,
//   icon,
//   children,
// }: {
//   label: string;
//   required?: boolean;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-2">
//       <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
//         {icon && (
//           <span className="text-slate-400">
//             {icon}
//           </span>
//         )}

//         {label}

//         {required && (
//           <span className="text-red-500">*</span>
//         )}
//       </label>

//       {children}
//     </div>
//   );
// }

// const inputClass =
//   "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";


"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  Pencil,
  Trash2,
  UserPlus,
  X,
  CalendarDays,
  Phone,
  User,
  Lock,
  Building2,
  Image as ImageIcon,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  type UpdateEmployeeVariables,
} from "@/hooks/useEmployee";

import type { Employee } from "@/api/auth";
import toast from "react-hot-toast";

/* =========================================================
   TYPES
========================================================= */

type EmployeeForm = {
  username: string;
  password: string;
  fullname: string;
  phone: string;
  dob: string;
  avatarUrl: string | null;
  workDate: string;
  departmentName: string;
};

type ModalMode = "create" | "edit" | null;

type Department = {
  id: string;
  name: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_DEPARTMENT = "Phòng Công Nghệ Thông Tin";

const departments: Department[] = [
  {
    id: "it",
    name: DEFAULT_DEPARTMENT,
  },
];

const emptyForm: EmployeeForm = {
  username: "",
  password: "",
  fullname: "",
  phone: "",
  dob: "",
  avatarUrl: null,
  workDate: "",
  departmentName: DEFAULT_DEPARTMENT,
};

/* =========================================================
   EMPLOYEE HELPERS
========================================================= */

function getEmployeeValue<T = unknown>(
  employee: Employee,
  keys: string[],
): T | undefined {
  const record = employee as unknown as Record<string, unknown>;

  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key] as T;
    }
  }

  return undefined;
}

function getEmployeeId(employee: Employee): string {
  const value = getEmployeeValue<string | number>(employee, [
    "id",
    "employeeId",
  ]);

  return value !== undefined ? String(value) : "";
}

function getEmployeeCode(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, [
      "employeeCode",
      "code",
      "employee_code",
    ]) || "-"
  );
}

function getFullName(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, [
      "fullName",
      "fullname",
      "full_name",
      "name",
    ]) || "Chưa có tên"
  );
}

function getUsername(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, [
      "username",
      "userName",
    ]) || ""
  );
}

function getPhone(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, [
      "phone",
      "phoneNumber",
      "phone_number",
    ]) || ""
  );
}

function getDepartmentName(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, [
      "departmentName",
      "department_name",
    ]) || "N/A"
  );
}

function getDepartmentId(employee: Employee): string {
  const value = getEmployeeValue<string | number>(employee, [
    "departmentId",
    "department_id",
  ]);

  return value !== undefined ? String(value) : "";
}

function getPosition(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, [
      "position",
      "positionName",
      "position_name",
      "role",
    ]) || "Nhân viên"
  );
}

function getShiftName(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, [
      "shiftName",
      "shift_name",
    ]) || "N/A"
  );
}

function getStatus(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, ["status"]) || "active"
  );
}

function getAvatar(employee: Employee): string {
  return (
    getEmployeeValue<string>(employee, [
      "avatarUrl",
      "avatar_url",
      "avatar",
      "imageUrl",
      "image_url",
    ]) || ""
  );
}

function getDateValue(
  employee: Employee,
  keys: string[],
): string {
  return getEmployeeValue<string>(employee, keys) || "";
}

/* =========================================================
   STATUS
========================================================= */

function getStatusConfig(status: string) {
  switch (status) {
    case "active":
      return {
        label: "Hoạt động",
        className:
          "bg-emerald-50 text-emerald-600 border-emerald-200",
        dotClass: "bg-emerald-500",
      };

    case "inactive":
      return {
        label: "Đã nghỉ",
        className:
          "bg-slate-50 text-slate-500 border-slate-200",
        dotClass: "bg-slate-400",
      };

    case "on_leave":
      return {
        label: "Nghỉ phép",
        className:
          "bg-amber-50 text-amber-600 border-amber-200",
        dotClass: "bg-amber-500",
      };

    default:
      return {
        label: status,
        className:
          "bg-slate-50 text-slate-500 border-slate-200",
        dotClass: "bg-slate-400",
      };
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Employees() {
  const {
    data: employees = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useEmployees();

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");

  const [modalMode, setModalMode] =
    useState<ModalMode>(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Employee | null>(null);

  const [form, setForm] =
    useState<EmployeeForm>(emptyForm);

  const [showPassword, setShowPassword] =
    useState(false);

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const isSubmitting =
    createEmployee.isPending ||
    updateEmployee.isPending;

  const isDeleting = deleteEmployee.isPending;

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const fullName = getFullName(employee);
      const employeeCode = getEmployeeCode(employee);
      const username = getUsername(employee);
      const phone = getPhone(employee);
      const departmentName =
        getDepartmentName(employee);
      const departmentId =
        getDepartmentId(employee);

      const matchSearch =
        !keyword ||
        fullName.toLowerCase().includes(keyword) ||
        employeeCode.toLowerCase().includes(keyword) ||
        username.toLowerCase().includes(keyword) ||
        phone.toLowerCase().includes(keyword);

      const matchDepartment =
        filterDept === "all" ||
        departmentId === filterDept ||
        departmentName === filterDept;

      return matchSearch && matchDepartment;
    });
  }, [employees, search, filterDept]);

  /* =========================================================
     OPEN CREATE
  ========================================================= */

  const handleOpenCreate = () => {
    setSelectedEmployee(null);

    setForm({
      ...emptyForm,
      departmentName: DEFAULT_DEPARTMENT,
      avatarUrl: null,
    });

    setAvatarPreview("");
    setShowPassword(false);
    setModalMode("create");
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);

    const avatar = getAvatar(employee);
    const departmentName =
      getDepartmentName(employee);

    setForm({
      username: getUsername(employee),
      password: "",
      fullname: getFullName(employee),
      phone: getPhone(employee),
      dob: getDateValue(employee, [
        "dob",
        "dateOfBirth",
        "date_of_birth",
      ]),
      avatarUrl: avatar || null,
      workDate: getDateValue(employee, [
        "workDate",
        "startDate",
        "start_date",
      ]),
      departmentName:
        departmentName !== "N/A"
          ? departmentName
          : DEFAULT_DEPARTMENT,
    });

    setAvatarPreview(avatar);
    setShowPassword(false);
    setModalMode("edit");
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setModalMode(null);
    setSelectedEmployee(null);
    setForm(emptyForm);
    setAvatarPreview("");
    setShowPassword(false);
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (
    field: keyof EmployeeForm,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     AVATAR
  ========================================================= */

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAvatarPreview("");

      setForm((prev) => ({
        ...prev,
        avatarUrl: null,
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB.");

      event.target.value = "";

      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Chỉ hỗ trợ PNG, JPG và WEBP.",
      );

      event.target.value = "";

      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setAvatarPreview(previewUrl);

    setForm((prev) => ({
      ...prev,
      avatarUrl: previewUrl,
    }));
  };

  /* =========================================================
     CREATE / UPDATE
  ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const fullname = form.fullname.trim();
    const username = form.username.trim();

    if (!fullname) {
      toast.error("Vui lòng nhập họ và tên.");
      return;
    }

    if (!username) {
      toast.error("Vui lòng nhập username.");
      return;
    }

    if (
      modalMode === "create" &&
      !form.password.trim()
    ) {
      toast.error("Vui lòng nhập mật khẩu.");
      return;
    }

    if (!form.departmentName) {
      toast.error("Vui lòng chọn phòng ban.");
      return;
    }

    try {
      if (modalMode === "create") {
        await createEmployee.mutateAsync({
          username,
          password: form.password,
          fullname,
          phone: form.phone.trim(),
          dob: form.dob,
          avatarUrl: form.avatarUrl,
          workDate: form.workDate,
          departmentName:
            form.departmentName ||
            DEFAULT_DEPARTMENT,
        });

        toast.success(
          "Tạo nhân viên thành công.",
        );

        handleCloseModal();

        return;
      }

      if (
        modalMode === "edit" &&
        selectedEmployee
      ) {
        const id =
          getEmployeeId(selectedEmployee);

        if (!id) {
          toast.error(
            "Không xác định được ID nhân viên.",
          );

          return;
        }

        const payload: UpdateEmployeeVariables["data"] =
          {
            username,
            fullname,
            phone: form.phone.trim(),
            dob: form.dob,
            avatarUrl: form.avatarUrl,
            workDate: form.workDate,
            departmentName:
              form.departmentName ||
              DEFAULT_DEPARTMENT,
          };

        if (form.password.trim()) {
          payload.password = form.password;
        }

        await updateEmployee.mutateAsync({
          id,
          data: payload,
        });

        toast.success(
          "Cập nhật nhân viên thành công.",
        );

        handleCloseModal();
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error
          ? err.message
          : modalMode === "create"
            ? "Không thể tạo nhân viên. Vui lòng thử lại."
            : "Không thể cập nhật nhân viên. Vui lòng thử lại.",
      );
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const id = getEmployeeId(deleteTarget);

    if (!id) {
      toast.error(
        "Không xác định được ID nhân viên.",
      );

      return;
    }

    try {
      await deleteEmployee.mutateAsync(id);

      toast.success(
        `Đã xóa nhân viên "${getFullName(
          deleteTarget,
        )}".`,
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể xóa nhân viên.",
      );
    }
  };

  /* =========================================================
     RETRY
  ========================================================= */

  const handleRetry = async () => {
    try {
      await refetch();

      toast.success(
        "Đã tải lại danh sách nhân viên.",
      );
    } catch {
      toast.error(
        "Không thể tải lại danh sách nhân viên.",
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-100" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-100" />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-50" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="space-y-4 p-6">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-slate-50"
                />
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-base font-bold text-slate-900">
            Không thể tải danh sách nhân viên
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error instanceof Error
              ? error.message
              : "Đã xảy ra lỗi khi kết nối tới máy chủ."}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Nhân viên
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý thông tin, phòng ban và trạng thái
            nhân viên.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Thêm nhân viên
        </button>
      </div>

      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Tìm theo tên, mã nhân viên, username, số điện thoại..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="relative w-full lg:w-60">
            <Filter className="absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={filterDept}
              onChange={(event) =>
                setFilterDept(event.target.value)
              }
              className="h-11 w-full appearance-none rounded-xl border border-slate-100 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="all">
                Tất cả phòng ban
              </option>

              {departments.map((department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Mã NV
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Nhân viên
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Phòng ban
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Ca làm việc
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Trạng thái
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.map(
                (employee) => {
                  const status =
                    getStatus(employee);

                  const statusConfig =
                    getStatusConfig(status);

                  const avatar =
                    getAvatar(employee);

                  const fullName =
                    getFullName(employee);

                  return (
                    <tr
                      key={getEmployeeId(employee)}
                      className="group transition-colors hover:bg-slate-50/60"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {getEmployeeCode(
                            employee,
                          )}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={fullName}
                                className="h-10 w-10 rounded-full border border-slate-100 object-cover shadow-sm"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400">
                                <User className="h-5 w-5" />
                              </div>
                            )}

                            <span
                              className={cn(
                                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
                                statusConfig.dotClass,
                              )}
                            />
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {fullName}
                            </div>

                            <div className="mt-0.5 text-xs text-slate-500">
                              {getPosition(
                                employee,
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {getDepartmentName(
                            employee,
                          )}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {getShiftName(employee)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold",
                            statusConfig.className,
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              statusConfig.dotClass,
                            )}
                          />

                          {statusConfig.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEdit(
                                employee,
                              )
                            }
                            disabled={
                              isSubmitting
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget(
                                employee,
                              )
                            }
                            disabled={isDeleting}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}

              {filteredEmployees.length ===
                0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        Không tìm thấy nhân viên
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Thử thay đổi từ khóa hoặc
                        bộ lọc phòng ban.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">
            Hiển thị{" "}
            <span className="font-semibold text-slate-600">
              {filteredEmployees.length}
            </span>{" "}
            /{" "}
            <span className="font-semibold text-slate-600">
              {employees.length}
            </span>{" "}
            nhân viên
          </p>

          {isFetching && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Đang đồng bộ...
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div
            className="absolute inset-0"
            onClick={handleCloseModal}
          />

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {modalMode === "create" ? (
                    <UserPlus className="h-5 w-5" />
                  ) : (
                    <Pencil className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {modalMode === "create"
                      ? "Thêm nhân viên"
                      : "Chỉnh sửa nhân viên"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {modalMode === "create"
                      ? "Tạo tài khoản và thông tin nhân viên mới."
                      : "Cập nhật thông tin nhân viên."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* USERNAME */}

                  <FormField
                    label="Username"
                    required
                    icon={
                      <User className="h-4 w-4" />
                    }
                  >
                    <input
                      type="text"
                      value={form.username}
                      onChange={(event) =>
                        handleChange(
                          "username",
                          event.target.value,
                        )
                      }
                      placeholder="VD: nguyenvana"
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </FormField>

                  {/* PASSWORD */}

                  <FormField
                    label="Mật khẩu"
                    required={
                      modalMode === "create"
                    }
                    icon={
                      <Lock className="h-4 w-4" />
                    }
                  >
                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={form.password}
                        onChange={(event) =>
                          handleChange(
                            "password",
                            event.target.value,
                          )
                        }
                        placeholder={
                          modalMode === "edit"
                            ? "Để trống nếu không đổi"
                            : "Nhập mật khẩu"
                        }
                        disabled={isSubmitting}
                        className={cn(
                          inputClass,
                          "pr-20",
                        )}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev,
                          )
                        }
                        disabled={isSubmitting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-blue-600"
                      >
                        {showPassword
                          ? "Ẩn"
                          : "Hiện"}
                      </button>
                    </div>
                  </FormField>

                  {/* FULLNAME */}

                  <FormField
                    label="Họ và tên"
                    required
                    icon={
                      <User className="h-4 w-4" />
                    }
                  >
                    <input
                      type="text"
                      value={form.fullname}
                      onChange={(event) =>
                        handleChange(
                          "fullname",
                          event.target.value,
                        )
                      }
                      placeholder="VD: Nguyễn Văn A"
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </FormField>

                  {/* PHONE */}

                  <FormField
                    label="Số điện thoại"
                    icon={
                      <Phone className="h-4 w-4" />
                    }
                  >
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        handleChange(
                          "phone",
                          event.target.value,
                        )
                      }
                      placeholder="VD: 0901234567"
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </FormField>

                  {/* DOB */}

                  <FormField
                    label="Ngày sinh"
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                  >
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(event) =>
                        handleChange(
                          "dob",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </FormField>

                  {/* WORK DATE */}

                  <FormField
                    label="Ngày vào làm"
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                  >
                    <input
                      type="date"
                      value={form.workDate}
                      onChange={(event) =>
                        handleChange(
                          "workDate",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </FormField>

                  {/* DEPARTMENT */}

                  <FormField
                    label="Phòng ban"
                    required
                    icon={
                      <Building2 className="h-4 w-4" />
                    }
                  >
                    <div className="relative">
                      <select
                        value={
                          form.departmentName
                        }
                        onChange={(event) =>
                          handleChange(
                            "departmentName",
                            event.target.value,
                          )
                        }
                        disabled={isSubmitting}
                        className={cn(
                          inputClass,
                          "appearance-none pr-10",
                        )}
                      >
                        <option value="">
                          Chọn phòng ban
                        </option>

                        {departments.map(
                          (department) => (
                            <option
                              key={department.id}
                              value={
                                department.name
                              }
                            >
                              {department.name}
                            </option>
                          ),
                        )}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </FormField>

                  {/* AVATAR */}

                  <FormField
                    label="Ảnh đại diện"
                    icon={
                      <ImageIcon className="h-4 w-4" />
                    }
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <User className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <label
                            htmlFor="avatar-upload"
                            className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Chọn hình ảnh
                          </label>

                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                            onChange={
                              handleAvatarChange
                            }
                          />

                          <p className="mt-1.5 text-[11px] text-slate-400">
                            PNG, JPG hoặc WEBP ·
                            tối đa 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </FormField>
                </div>

                {/* AVATAR PREVIEW */}

                {avatarPreview && (
                  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-500">
                      Xem trước avatar
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                      />

                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {form.fullname ||
                            "Tên nhân viên"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {form.departmentName ||
                            "Chưa chọn phòng ban"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : modalMode ===
                    "create" ? (
                    <>
                      <Plus className="h-4 w-4" />
                      Tạo nhân viên
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
          DELETE CONFIRMATION
      ====================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div
            className="absolute inset-0"
            onClick={() =>
              !isDeleting &&
              setDeleteTarget(null)
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
                    Xóa nhân viên?
                  </h2>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    Bạn có chắc muốn xóa nhân
                    viên{" "}
                    <span className="font-semibold text-slate-700">
                      {getFullName(
                        deleteTarget,
                      )}
                    </span>
                    ? Hành động này không thể
                    hoàn tác.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={isDeleting}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Xóa nhân viên
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
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   INPUT CLASS
========================================================= */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";