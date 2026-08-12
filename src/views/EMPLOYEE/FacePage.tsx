"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ScanFace,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Clock,
  MapPin,
  Target,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFaceWebSocket } from "@/hooks/useFaceWebsocket";

type CameraStatus = "init" | "ready" | "scanning" | "error";

type RecognitionStatus = "idle" | "success" | "error";

type FaceMode = "check_in" | "check_out" | "register";

export default function FacePage() {
  const [mode, setMode] = useState<FaceMode>("check_in");

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("init");

  const [recognitionStatus, setRecognitionStatus] =
    useState<RecognitionStatus>("idle");

  const [currentTime, setCurrentTime] = useState(new Date());

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  // WEBSOCKET
  const {
    status: wsStatus,
    lastMessage,
    start: startFaceScan,
    stop: stopFaceScan,
  } = useFaceWebSocket();

  // ============================================================
  // UPDATE CLOCK
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // KẾT QUẢ
  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    switch (lastMessage.type) {
      case "face.processing":
        setCameraStatus("scanning");
        break;

      case "face.recognized":
        console.log("Employee:", lastMessage.employee);

        console.log("Confidence:", lastMessage.confidence);

        break;

      case "attendance.success":
        setRecognitionStatus("success");
        setCameraStatus("ready");

        setTimeout(() => {
          setRecognitionStatus("idle");
        }, 3000);

        break;

      case "face.registered":
        setRecognitionStatus("success");
        setCameraStatus("ready");

        setTimeout(() => {
          setRecognitionStatus("idle");
        }, 3000);

        break;

      case "face.error":
        console.error(lastMessage.code, lastMessage.message);

        setRecognitionStatus("error");
        setCameraStatus("ready");

        break;
    }
  }, [lastMessage]);

  // ============================================================
  // START CAMERA
  // ============================================================

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) return;

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus("error");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        streamRef.current = stream;

        setCameraStatus("ready");
      }
    } catch (error) {
      console.error("Camera Error:", error);

      setCameraStatus("error");
    }
  }, []);

  // ============================================================
  // INIT CAMERA
  // ============================================================

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, [startCamera]);

  // ============================================================
  // HANDLE FACE RECOGNITION
  // ============================================================

  // const handleAction = () => {
  //   if (cameraStatus !== "ready") return;

  //   // Reset recognition state
  //   setRecognitionStatus("idle");

  //   // Start scanning
  //   setCameraStatus("scanning");

  //   // Simulate AI processing
  //   setTimeout(() => {
  //     const success = Math.random() > 0.1;

  //     if (success) {
  //       setRecognitionStatus("success");
  //     } else {
  //       setRecognitionStatus("error");
  //     }

  //     // Camera is ready again
  //     setCameraStatus("ready");

  //     // Hide result after 3 seconds
  //     setTimeout(() => {
  //       setRecognitionStatus("idle");
  //     }, 3000);
  //   }, 2000);
  // };
  const handleAction = async () => {
    if (cameraStatus !== "ready" || !videoRef.current) {
      return;
    }

    setRecognitionStatus("idle");

    await startFaceScan(videoRef.current, mode);
  };

  // ============================================================
  // RETRY CAMERA
  // ============================================================

  const handleRetryCamera = () => {
    setCameraStatus("init");
    startCamera();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-8">
      {/* ======================================================
      HEADER
  ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
              <ScanFace className="w-5 h-5 text-indigo-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                AI Terminal
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Hệ thống nhận diện khuôn mặt tự động
          </p>
        </div>

        {/* Time + Location */}
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Time */}
          <div className="px-5 py-3.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Thời gian thực
            </div>

            <div className="flex items-center gap-2 text-slate-900">
              <Clock className="w-4 h-4 text-indigo-600" />

              <span className="font-mono text-lg font-semibold tracking-tight">
                {currentTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200" />

          {/* Location */}
          <div className="px-5 py-3.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Vị trí
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Tòa nhà Alpha
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
      MAIN GRID
  ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ====================================================
        CAMERA
    ==================================================== */}

        <div className="col-span-1 lg:col-span-7">
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center aspect-[4/3]">
            {/* CAMERA ERROR */}
            {cameraStatus === "error" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center px-6 max-w-md"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-red-500" />
                </div>

                <p className="font-semibold text-lg text-white">
                  Không tìm thấy Camera
                </p>

                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Vui lòng kiểm tra kết nối thiết bị và quyền truy cập Camera.
                </p>

                <button
                  onClick={handleRetryCamera}
                  className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  Thử lại Camera
                </button>
              </motion.div>
            ) : (
              <>
                {/* VIDEO */}

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                />

                {/* CAMERA INITIALIZING */}

                {cameraStatus === "init" && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="relative w-11 h-11 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 animate-spin" />
                      </div>

                      <p className="text-white font-semibold">
                        Đang khởi động Camera...
                      </p>

                      <p className="text-slate-400 text-sm mt-2">
                        Vui lòng cấp quyền truy cập Camera
                      </p>
                    </div>
                  </div>
                )}

                {/* ==================================================
                CAMERA HUD
            ================================================== */}

                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute inset-0 border-[12px] border-black/10">
                    {/* Corner markers */}

                    <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-white/70" />
                    <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-white/70" />
                    <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-white/70" />
                    <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-white/70" />
                  </div>

                  {/* Status */}

                  <div className="absolute top-5 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          cameraStatus === "scanning"
                            ? "bg-indigo-400 animate-pulse"
                            : "bg-emerald-400",
                        )}
                      />

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                        {cameraStatus === "scanning"
                          ? "Đang quét"
                          : "Camera sẵn sàng"}
                      </span>
                    </div>
                  </div>

                  {/* Center Reticle */}

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52">
                    <div className="absolute inset-0 rounded-full border border-white/20" />
                    <div className="absolute inset-5 rounded-full border border-white/10" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <Target className="w-7 h-7 text-white/40" />
                    </div>
                  </div>

                  {/* Bottom status */}

                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
                      <span className="text-xs text-white/70">
                        Đưa khuôn mặt vào vùng nhận diện
                      </span>
                    </div>
                  </div>
                </div>

                {/* SCANNING LINE */}

                <AnimatePresence>
                  {cameraStatus === "scanning" && (
                    <motion.div
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "reverse",
                      }}
                      className="absolute left-8 right-8 h-px bg-indigo-400 shadow-[0_0_18px_rgba(129,140,248,0.9)] z-20"
                    />
                  )}
                </AnimatePresence>

                {/* ==================================================
                RECOGNITION RESULT
            ================================================== */}

                <AnimatePresence>
                  {/* SUCCESS */}

                  {recognitionStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex items-center justify-center"
                    >
                      <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full mx-5 shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-50 flex items-center justify-center">
                          <CheckCircle className="w-9 h-9 text-emerald-600" />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900">
                          Thành công
                        </h3>

                        <p className="text-emerald-600 font-semibold mt-2">
                          {mode === "check_in"
                            ? "Đã chấm công VÀO CA"
                            : mode === "check_out"
                              ? "Đã chấm công RA CA"
                              : "Đã cập nhật khuôn mặt"}
                        </p>

                        <p className="text-slate-500 mt-4 text-sm font-mono">
                          {currentTime.toLocaleTimeString("vi-VN")}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ERROR */}

                  {recognitionStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
                    >
                      <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full mx-5 shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
                          <XCircle className="w-9 h-9 text-red-500" />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900">
                          Không nhận dạng được
                        </h3>

                        <p className="text-red-600 font-medium mt-2">
                          Vui lòng thử lại
                        </p>

                        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                          Nhìn thẳng vào Camera và đảm bảo khu vực có đủ ánh
                          sáng.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>

        {/* ====================================================
        RIGHT SIDE
    ==================================================== */}

        <div className="col-span-1 lg:col-span-5 flex flex-col">
          {/* ACTION SELECTION */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-base font-bold text-slate-900">
                Lựa chọn hành động
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Chọn thao tác trước khi xác thực khuôn mặt
              </p>
            </div>

            <div className="space-y-2.5">
              {/* CHECK IN */}

              <button
                type="button"
                onClick={() => setMode("check_in")}
                disabled={cameraStatus === "scanning"}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200",
                  mode === "check_in"
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                  cameraStatus === "scanning" &&
                    "opacity-50 cursor-not-allowed",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      mode === "check_in"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <LogIn className="w-5 h-5" />
                  </div>

                  <div>
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        mode === "check_in"
                          ? "text-indigo-700"
                          : "text-slate-800",
                      )}
                    >
                      Vào ca
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      Bắt đầu ngày làm việc
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-[1.5px]",
                    mode === "check_in"
                      ? "border-indigo-600 bg-indigo-600 ring-4 ring-indigo-100"
                      : "border-slate-300",
                  )}
                />
              </button>

              {/* CHECK OUT */}

              <button
                type="button"
                onClick={() => setMode("check_out")}
                disabled={cameraStatus === "scanning"}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200",
                  mode === "check_out"
                    ? "bg-violet-50 border-violet-200"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                  cameraStatus === "scanning" &&
                    "opacity-50 cursor-not-allowed",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      mode === "check_out"
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <LogOut className="w-5 h-5" />
                  </div>

                  <div>
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        mode === "check_out"
                          ? "text-violet-700"
                          : "text-slate-800",
                      )}
                    >
                      Ra ca
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      Kết thúc ngày làm việc
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-[1.5px]",
                    mode === "check_out"
                      ? "border-violet-600 bg-violet-600 ring-4 ring-violet-100"
                      : "border-slate-300",
                  )}
                />
              </button>

              {/* REGISTER FACE */}

              <button
                type="button"
                onClick={() => setMode("register")}
                disabled={cameraStatus === "scanning"}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200",
                  mode === "register"
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                  cameraStatus === "scanning" &&
                    "opacity-50 cursor-not-allowed",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      mode === "register"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <ScanFace className="w-5 h-5" />
                  </div>

                  <div>
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        mode === "register"
                          ? "text-emerald-700"
                          : "text-slate-800",
                      )}
                    >
                      Đăng ký khuôn mặt
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      Cập nhật dữ liệu nhận diện
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-[1.5px]",
                    mode === "register"
                      ? "border-emerald-600 bg-emerald-600 ring-4 ring-emerald-100"
                      : "border-slate-300",
                  )}
                />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-6" />

          {/* ACTION BUTTON */}

          <button
            type="button"
            onClick={handleAction}
            disabled={
              cameraStatus !== "ready" || recognitionStatus === "success"
            }
            className={cn(
              "w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98]",
              mode === "check_in" &&
                "bg-indigo-600 hover:bg-indigo-700 text-white",
              mode === "check_out" &&
                "bg-violet-600 hover:bg-violet-700 text-white",
              mode === "register" &&
                "bg-emerald-600 hover:bg-emerald-700 text-white",
              (cameraStatus !== "ready" || recognitionStatus === "success") &&
                "opacity-50 cursor-not-allowed",
            )}
          >
            {cameraStatus === "scanning" ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />

                {mode === "check_in"
                  ? "Xác nhận vào ca"
                  : mode === "check_out"
                    ? "Xác nhận ra ca"
                    : "Xác nhận đăng ký"}
              </>
            )}
          </button>

          {/* FRAUD WARNING */}

          <div className="flex items-start gap-2 mt-4 px-1">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />

            <p className="text-[11px] leading-relaxed text-slate-400">
              Mọi hành vi gian lận bằng ảnh hoặc video giả mạo sẽ được ghi nhận
              vào hệ thống Fraud Detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
