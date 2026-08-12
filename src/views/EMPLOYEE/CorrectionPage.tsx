
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileEdit,
  Send,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock3,
  XCircle,
  FileText,
  Filter,
} from "lucide-react";
import {
  correctionRequests,
  employees,
} from "@/@mockdata/employee.mock";
import { cn } from "@/lib/utils";

export default function CorrectionPage() {
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [historyFilter, setHistoryFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [requestType, setRequestType] = useState("wrong_time");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employee = employees.find(
    (e) => e.employeeCode === "NV003"
  );

  const myRequests = correctionRequests.filter(
    (r) => r.employeeId === employee?.id
  );

  const filteredRequests = myRequests.filter(
    (req) =>
      historyFilter === "all" ||
      req.status === historyFilter
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setActiveTab("history");
    }, 1500);
  };

  return (
    <div className="min-h-full space-y-6 bg-white text-slate-900">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
            Yêu cầu Giải trình
          </h1>

          <p className="text-sm text-slate-500">
            Gửi yêu cầu chỉnh sửa dữ liệu chấm công nếu có sai sót từ hệ thống.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab("new")}
          className={cn(
            "relative px-6 py-3 text-sm font-medium transition-all",
            activeTab === "new"
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <div className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            Tạo Yêu Cầu Mới
          </div>

          {activeTab === "new" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "relative px-6 py-3 text-sm font-medium transition-all",
            activeTab === "history"
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Lịch sử Yêu cầu
          </div>

          {activeTab === "history" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "new" ? (
          <motion.div
            key="new"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto w-full max-w-3xl"
          >
            {/* Form Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Request Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium uppercase tracking-wider text-slate-700">
                    1. Phân loại lỗi
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      {
                        id: "wrong_time",
                        label: "Sai giờ vào/ra",
                        desc: "Camera nhận diện trễ",
                      },
                      {
                        id: "missing_check_in",
                        label: "Quên Check-in",
                        desc: "Chưa chấm công khi đến",
                      },
                      {
                        id: "missing_check_out",
                        label: "Quên Check-out",
                        desc: "Chưa chấm công khi về",
                      },
                      {
                        id: "wrong_status",
                        label: "Sai trạng thái",
                        desc: "Hệ thống ghi nhận sai",
                      },
                    ].map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setRequestType(type.id)}
                        className={cn(
                          "flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-4 transition-all",
                          requestType === type.id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                        )}
                      >
                        <div
                          className={cn(
                            "font-bold",
                            requestType === type.id
                              ? "text-indigo-700"
                              : "text-slate-900"
                          )}
                        >
                          {type.label}
                        </div>

                        <div className="text-xs text-slate-500">
                          {type.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date / Time */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm font-medium uppercase tracking-wider text-slate-700">
                      2. Ngày phát sinh
                    </label>

                    <div className="group relative">
                      <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />

                      <input
                        type="date"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium uppercase tracking-wider text-slate-700">
                      3. Giờ thực tế
                    </label>

                    <div className="group relative">
                      <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />

                      <input
                        type="time"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-3">
                  <label className="text-sm font-medium uppercase tracking-wider text-slate-700">
                    4. Chi tiết lý do
                  </label>

                  <div className="group relative">
                    <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />

                    <textarea
                      rows={4}
                      required
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                      placeholder="Trình bày rõ ràng lý do của bạn..."
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Gửi Yêu Cầu Chỉnh Sửa
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            {/* Filters */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "Tất cả" },
                { id: "pending", label: "Đang chờ duyệt" },
                { id: "approved", label: "Đã duyệt" },
                { id: "rejected", label: "Bị từ chối" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() =>
                    setHistoryFilter(filter.id as any)
                  }
                  className={cn(
                    "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    historyFilter === filter.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* History */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {filteredRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                          {req.requestType.replace(/_/g, " ")}
                        </span>

                        <div className="text-lg font-bold text-slate-900">
                          Sửa{" "}
                          {req.requestedCheckIn
                            ? "Check-in"
                            : "Check-out"}
                        </div>
                      </div>

                      {req.status === "pending" && (
                        <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                          <Clock3 className="h-5 w-5" />
                        </div>
                      )}

                      {req.status === "approved" && (
                        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}

                      {req.status === "rejected" && (
                        <div className="rounded-xl bg-red-50 p-2 text-red-600">
                          <XCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="mb-4 flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-sm italic leading-6 text-slate-500">
                        "{req.reason}"
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(
                          req.createdAt
                        ).toLocaleDateString("vi-VN")}
                      </div>

                      {req.reviewedBy ? (
                        <div className="text-indigo-600">
                          Đã phản hồi
                        </div>
                      ) : (
                        <div>Chờ phản hồi</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredRequests.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400">
                  <Filter className="mx-auto mb-3 h-12 w-12 opacity-20" />
                  Không có yêu cầu nào khớp với bộ lọc.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

