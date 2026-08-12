"use client";

import { motion } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  TrendingDown,
  Target,
  CalendarClock,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { attendanceRecords, employees } from "@/@mockdata/employee.mock";
import { cn } from "@/lib/utils";

// Chuẩn bị dữ liệu cho biểu đồ
const chartData = [
  { date: "01/08", late: 0, early: 0 },
  { date: "02/08", late: 15, early: 0 },
  { date: "03/08", late: 0, early: 0 },
  { date: "04/08", late: 5, early: 0 },
  { date: "05/08", late: 0, early: 0 },
  { date: "06/08", late: 30, early: 5 },
  { date: "07/08", late: 20, early: 0 },
  { date: "08/08", late: 0, early: 0 },
  { date: "09/08", late: 10, early: 15 },
  { date: "10/08", late: 17, early: 0 },
];

export default function LatePage() {
  const employee = employees.find((e) => e.employeeCode === "NV003");
  const myRecords = attendanceRecords.filter(
    (r) => r.employeeId === employee?.id,
  );

  const lateRecords = myRecords.filter((r) => r.lateMinutes > 0);
  const earlyRecords = myRecords.filter((r) => r.earlyLeaveMinutes > 0);

  const totalLateMinutes = lateRecords.reduce(
    (acc, r) => acc + r.lateMinutes,
    0,
  );

  // Custom Tooltip cho Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50">
          <p className="mb-2 font-bold text-slate-900">{label}</p>

          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />

              <span className="text-slate-500">{entry.name}:</span>

              <span className="font-mono font-semibold text-slate-900">
                {entry.value} phút
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-full bg-white text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
            Thống kê Vi phạm Giờ giấc
          </h1>

          <p className="text-sm text-slate-500">
            Phân tích chuyên sâu về tình trạng đi trễ, về sớm của bạn trong
            tháng.
          </p>
        </div>

        {/* KPI Overview Cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Late */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-500/70 transition-transform group-hover:scale-110" />
              </div>
            </div>

            <p className="mb-1 text-sm font-medium text-slate-500">
              Tổng thời gian đi trễ
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter text-red-600">
                {totalLateMinutes}
              </span>

              <span className="font-bold text-slate-400">phút</span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 font-semibold text-red-600">
                {lateRecords.length} lần
              </span>

              <span className="text-slate-500">vượt quy định tháng</span>
            </div>
          </motion.div>

          {/* Early */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <TrendingDown className="h-5 w-5 text-orange-500/70 transition-transform group-hover:scale-110" />
              </div>
            </div>

            <p className="mb-1 text-sm font-medium text-slate-500">
              Tổng thời gian về sớm
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter text-orange-600">
                {earlyRecords.reduce((acc, r) => acc + r.earlyLeaveMinutes, 0)}
              </span>

              <span className="font-bold text-slate-400">phút</span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="rounded-lg border border-orange-100 bg-orange-50 px-2 py-1 font-semibold text-orange-600">
                {earlyRecords.length} lần
              </span>

              <span className="text-slate-500">rời khỏi cơ quan sớm</span>
            </div>
          </motion.div>

          {/* KPI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-100 blur-3xl" />

            <div className="relative">
              <p className="mb-1 text-sm font-medium text-indigo-600">
                Điểm KPI Chuyên cần
              </p>

              <div className="mt-2 text-5xl font-black tracking-tighter text-slate-900">
                85
                <span className="text-2xl font-bold text-slate-300">/100</span>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
                  <Target className="h-4 w-4 text-indigo-600" />
                </span>
                Có nguy cơ trừ thưởng cuối tháng
              </p>
            </div>
          </motion.div>
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Trend Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Activity className="h-5 w-5 text-indigo-600" />
                Xu hướng Vi phạm
              </h3>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#ef4444"
                        stopOpacity={0.16}
                      />

                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="colorEarly" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#f97316"
                        stopOpacity={0.16}
                      />

                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="late"
                    name="Đi trễ"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorLate)"
                  />

                  <Area
                    type="monotone"
                    dataKey="early"
                    name="Về sớm"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorEarly)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Chart / List */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Lịch sử Vi phạm chi tiết
              </h3>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                {lateRecords.length} lần
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {lateRecords.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.04,
                  }}
                  className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/40 p-4 transition-all hover:border-red-200 hover:bg-red-50"
                >
                  <div>
                    <div className="mb-1 font-bold text-slate-900">
                      Ngày {record.workDate}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4 text-red-500" />
                      In:{" "}
                      {new Date(record.checkIn!).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <span className="text-slate-300">•</span>
                      <span>Chuẩn: 08:00</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-red-600">
                      +{record.lateMinutes}p
                    </div>

                    <div className="text-xs font-semibold uppercase tracking-wide text-red-500">
                      Trễ
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
