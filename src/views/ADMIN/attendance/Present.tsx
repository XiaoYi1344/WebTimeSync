"use client";

import { useMemo, useState } from "react";
import {
  Search,
  UserCheck,
  MapPin,
  Clock,
  CheckCircle2,
  User,
  Filter,
  ChevronDown,
  RefreshCw,
  Users,
  Timer,
  Eye,
  X,
} from "lucide-react";

import {
  attendanceRecords,
  employees,
  devices,
} from "@/@mockdata/employee.mock";

import { cn } from "@/lib/utils";

type FilterStatus = "all" | "working" | "checked_out";

type PresentRecord = ReturnType<typeof getPresentRecords>[number];

function getPresentRecords(today: string) {
  return attendanceRecords
    .filter(
      (record) =>
        record.workDate === today &&
        record.checkIn !== null
    )
    .map((record) => {
      const employee = employees.find(
        (employee) => employee.id === record.employeeId
      );

      const device = devices.find(
        (device) => device.id === record.checkInDeviceId
      );

      return {
        ...record,
        employee,
        device,
      };
    })
    .filter(
      (
        record
      ): record is typeof record & {
        employee: NonNullable<typeof record.employee>;
      } => Boolean(record.employee)
    );
}

export default function Present() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>("all");

  const [filterDevice, setFilterDevice] =
    useState("all");

  const [sortOrder, setSortOrder] =
    useState<"latest" | "earliest">("latest");

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [selectedRecord, setSelectedRecord] =
    useState<PresentRecord | null>(null);

  // Demo date
  const today = "2026-08-10";

  const allPresentRecords = useMemo(
    () => getPresentRecords(today),
    []
  );

  const deviceOptions = useMemo(() => {
    const map = new Map<string, string>();

    allPresentRecords.forEach((record) => {
      if (record.device?.id) {
        map.set(
          record.device.id,
          record.device.location || "Thiết bị"
        );
      }
    });

    return Array.from(map.entries());
  }, [allPresentRecords]);

  const presentRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return allPresentRecords
      .filter((record) => {
        const matchSearch =
          !keyword ||
          record.employee.fullName
            .toLowerCase()
            .includes(keyword) ||
          record.employee.employeeCode
            .toLowerCase()
            .includes(keyword) ||
          record.employee.position
            ?.toLowerCase()
            .includes(keyword);

        const isWorking = !record.checkOut;

        const matchStatus =
          filterStatus === "all" ||
          (filterStatus === "working" && isWorking) ||
          (filterStatus === "checked_out" && !isWorking);

        const matchDevice =
          filterDevice === "all" ||
          record.device?.id === filterDevice;

        return (
          matchSearch &&
          matchStatus &&
          matchDevice
        );
      })
      .sort((a, b) => {
        const timeA = new Date(
          a.checkIn!
        ).getTime();

        const timeB = new Date(
          b.checkIn!
        ).getTime();

        return sortOrder === "latest"
          ? timeB - timeA
          : timeA - timeB;
      });
  }, [
    allPresentRecords,
    search,
    filterStatus,
    filterDevice,
    sortOrder,
  ]);

  const totalPresent =
    allPresentRecords.length;

  const workingCount =
    allPresentRecords.filter(
      (record) => !record.checkOut
    ).length;

  const checkedOutCount =
    allPresentRecords.filter(
      (record) => Boolean(record.checkOut)
    ).length;

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const formatTime = (
    value: string | null
  ) => {
    if (!value) return "—";

    return new Date(value).toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatDate = (
    value: string
  ) => {
    return new Date(value).toLocaleDateString(
      "vi-VN"
    );
  };

  const getWorkingDuration = (
    checkIn: string | null,
    checkOut: string | null
  ) => {
    if (!checkIn) return "—";

    const start = new Date(checkIn).getTime();

    const end = checkOut
      ? new Date(checkOut).getTime()
      : new Date().getTime();

    const minutes = Math.max(
      0,
      Math.floor((end - start) / 60000)
    );

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }

    return `${mins} phút`;
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Nhân viên có mặt
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi nhân viên đã check-in trong ngày{" "}
            <span className="font-semibold text-slate-700">
              {formatDate(today)}
            </span>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="
            inline-flex w-fit items-center gap-2
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-2.5
            text-sm font-semibold
            text-slate-700
            shadow-sm
            transition-all
            hover:border-slate-300
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <RefreshCw
            className={cn(
              "h-4 w-4",
              isRefreshing &&
                "animate-spin"
            )}
          />

          {isRefreshing
            ? "Đang cập nhật..."
            : "Làm mới"}
        </button>
      </div>

      {/* =========================================================
          SUMMARY
      ========================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Tổng đã check-in
              </div>

              <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {totalPresent}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                nhân viên hôm nay
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Working */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Đang làm việc
              </div>

              <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                {workingCount}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                chưa check-out
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Checked out */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Đã check-out
              </div>

              <div className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
                {checkedOutCount}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                đã kết thúc ca
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <CheckCircle2 className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FILTERS
      ========================================================== */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
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
          <div className="relative w-full sm:w-48">
            <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as FilterStatus
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

              <option value="working">
                Đang làm việc
              </option>

              <option value="checked_out">
                Đã check-out
              </option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Device */}
          <div className="relative w-full sm:w-56">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={filterDevice}
              onChange={(e) =>
                setFilterDevice(e.target.value)
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
                Tất cả thiết bị
              </option>

              {deviceOptions.map(
                ([id, location]) => (
                  <option
                    key={id}
                    value={id}
                  >
                    {location}
                  </option>
                )
              )}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Sort */}
        <div className="relative w-full sm:w-48 lg:w-48">
          <Clock className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                e.target.value as
                  | "latest"
                  | "earliest"
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
            <option value="latest">
              Check-in mới nhất
            </option>

            <option value="earliest">
              Check-in sớm nhất
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-slate-400">
          Hiển thị{" "}
          <span className="font-bold text-slate-700">
            {presentRecords.length}
          </span>{" "}
          / {totalPresent} nhân viên
        </div>

        {(search ||
          filterStatus !== "all" ||
          filterDevice !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilterStatus("all");
              setFilterDevice("all");
            }}
            className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* =========================================================
          EMPLOYEE CARDS
      ========================================================== */}
      {presentRecords.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presentRecords.map((record) => {
            const isWorking = !record.checkOut;

            return (
              <div
                key={record.id}
                className="
                  group flex flex-col
                  overflow-hidden
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
                {/* Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3.5">
                      {/* Avatar */}
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
                              h-12 w-12
                              rounded-full
                              border border-slate-200
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex h-12 w-12
                              items-center justify-center
                              rounded-full
                              border border-slate-200
                              bg-slate-50
                              text-slate-400
                            "
                          >
                            <User className="h-5 w-5" />
                          </div>
                        )}

                        {/* Online */}
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white",
                            isWorking
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-800">
                          {
                            record
                              .employee
                              .fullName
                          }
                        </h3>

                        <div className="mt-0.5 truncate text-xs font-medium text-slate-400">
                          {
                            record
                              .employee
                              .position
                          }
                        </div>

                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                          {
                            record
                              .employee
                              .employeeCode
                          }
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRecord(
                          record
                        )
                      }
                      className="
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-lg
                        text-slate-400
                        opacity-0
                        transition-all
                        hover:bg-slate-100
                        hover:text-slate-700
                        group-hover:opacity-100
                      "
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Status */}
                  <div className="mt-4">
                    {isWorking ? (
                      <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                          </span>

                          <span className="text-xs font-semibold text-emerald-600">
                            Đang làm việc
                          </span>
                        </div>

                        <span className="text-[10px] font-semibold text-emerald-500">
                          ACTIVE
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />

                          <span className="text-xs font-semibold text-slate-600">
                            Đã check-out
                          </span>
                        </div>

                        <span className="text-[10px] font-semibold text-slate-400">
                          DONE
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Attendance */}
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    {/* Check in */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Check-in
                        </div>

                        <div className="mt-0.5 font-mono text-sm font-bold text-slate-700">
                          {formatTime(
                            record.checkIn
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Check out */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-100 bg-violet-50">
                        <CheckCircle2 className="h-4 w-4 text-violet-600" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Check-out
                        </div>

                        <div className="mt-0.5 font-mono text-sm font-bold text-slate-700">
                          {formatTime(
                            record.checkOut
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Device */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50">
                        <MapPin className="h-4 w-4 text-indigo-600" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Thiết bị
                        </div>

                        <div
                          className="mt-0.5 truncate text-xs font-semibold text-slate-700"
                          title={
                            record.device
                              ?.location ||
                            "Không xác định"
                          }
                        >
                          {record.device
                            ?.location ||
                            "Không xác định"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Timer className="h-3.5 w-3.5" />

                    <span>
                      Thời gian
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-700">
                    {getWorkingDuration(
                      record.checkIn,
                      record.checkOut
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* =======================================================
           EMPTY STATE
        ======================================================== */
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <UserCheck className="h-5 w-5 text-slate-400" />
          </div>

          <h3 className="text-sm font-semibold text-slate-800">
            Không tìm thấy nhân viên
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
            Không có nhân viên nào phù hợp
            với bộ lọc hiện tại.
          </p>

          {(search ||
            filterStatus !== "all" ||
            filterDevice !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
                setFilterDevice("all");
              }}
              className="
                mt-4 rounded-lg
                border border-slate-200
                bg-white
                px-3 py-2
                text-xs font-semibold
                text-slate-600
                shadow-sm
                hover:bg-slate-50
              "
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* =========================================================
          DETAIL MODAL
      ========================================================== */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setSelectedRecord(null);
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Chi tiết chấm công
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Thông tin check-in trong ngày
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRecord(null)
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

            {/* Employee */}
            <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5">
              {selectedRecord.employee
                .avatar ? (
                <img
                  src={
                    selectedRecord
                      .employee.avatar
                  }
                  alt={
                    selectedRecord.employee
                      .fullName
                  }
                  className="h-14 w-14 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
              )}

              <div>
                <div className="text-base font-bold text-slate-900">
                  {
                    selectedRecord
                      .employee
                      .fullName
                  }
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  {
                    selectedRecord
                      .employee
                      .employeeCode
                  }{" "}
                  ·{" "}
                  {
                    selectedRecord
                      .employee.position
                  }
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Ngày
                </div>

                <div className="mt-1 text-sm font-bold text-slate-800">
                  {formatDate(
                    selectedRecord.workDate
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Thời gian làm
                </div>

                <div className="mt-1 font-mono text-sm font-bold text-slate-800">
                  {getWorkingDuration(
                    selectedRecord.checkIn,
                    selectedRecord.checkOut
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                  Check-in
                </div>

                <div className="mt-1 font-mono text-lg font-bold text-blue-700">
                  {formatTime(
                    selectedRecord.checkIn
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-violet-500">
                  Check-out
                </div>

                <div className="mt-1 font-mono text-lg font-bold text-violet-700">
                  {formatTime(
                    selectedRecord.checkOut
                  )}
                </div>
              </div>

              <div className="col-span-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />

                  <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-500">
                    Thiết bị check-in
                  </span>
                </div>

                <div className="mt-2 text-sm font-bold text-indigo-800">
                  {selectedRecord.device
                    ?.location ||
                    "Không xác định"}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedRecord(null)
                }
                className="
                  rounded-xl
                  bg-slate-900
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  transition-colors
                  hover:bg-slate-800
                "
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}