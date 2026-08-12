"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Building,
  Clock,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Video,
  VideoOff,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";

const STEPS = [
  { id: 1, title: "Thông tin cơ bản" },
  { id: 2, title: "Công việc" },
  { id: 3, title: "Xác thực khuôn mặt" },
];

type CameraStatus =
  | "idle"
  | "starting"
  | "ready"
  | "captured"
  | "error";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cameraStatus, setCameraStatus] =
    useState<CameraStatus>("idle");

  const [cameraError, setCameraError] = useState("");

  const [capturedImage, setCapturedImage] =
    useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleNext = () =>
    setStep((s) => Math.min(s + 1, 3));

  const handlePrev = () =>
    setStep((s) => Math.max(s - 1, 1));

  /**
   * Stop camera
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraStatus("idle");
  }, []);

  /**
   * Start camera
   */
  const startCamera = useCallback(async () => {
    try {
      setCameraError("");
      setCameraStatus("starting");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Trình duyệt không hỗ trợ truy cập Camera."
        );
      }

      // Nếu camera đang chạy thì không tạo stream mới
      if (streamRef.current) {
        setCameraStatus("ready");
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();

        setCameraStatus("ready");
      }
    } catch (error) {
      console.error("Camera error:", error);

      setCameraStatus("error");

      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        setCameraError(
          "Bạn đã từ chối quyền Camera. Hãy cho phép trình duyệt sử dụng Camera rồi thử lại."
        );
      } else if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
        setCameraError(
          "Không tìm thấy Camera trên thiết bị."
        );
      } else if (
        error instanceof DOMException &&
        error.name === "NotReadableError"
      ) {
        setCameraError(
          "Camera đang được sử dụng bởi ứng dụng khác."
        );
      } else {
        setCameraError(
          "Không thể kết nối Camera. Vui lòng kiểm tra thiết bị và quyền trình duyệt."
        );
      }
    }
  }, []);

  /**
   * Capture face image
   */
  const captureImage = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (video.readyState < 2) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) return;

    /**
     * Vì video đang mirror bằng CSS,
     * khi chụp cũng mirror ảnh để preview giống camera.
     */
    context.translate(width, 0);
    context.scale(-1, 1);

    context.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    const image = canvas.toDataURL(
      "image/jpeg",
      0.92
    );

    setCapturedImage(image);
    setCameraStatus("captured");

    stopCamera();
  }, [stopCamera]);

  /**
   * Retake image
   */
  const retakeImage = useCallback(() => {
    setCapturedImage(null);
    setCameraError("");
    setCameraStatus("idle");
  }, []);

  /**
   * Camera lifecycle
   */
  useEffect(() => {
    if (step !== 3) {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [step, stopCamera]);

  /**
   * Submit
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!capturedImage) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  /**
   * Success screen
   */
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Đăng ký thành công!
          </h2>

          <p className="text-neutral-400 mb-8">
            Tài khoản của bạn đã được tạo.
            Dữ liệu khuôn mặt đã được ghi nhận
            và lưu trữ an toàn.
          </p>

          <Link
            href="/login"
            className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-medium transition-colors"
          >
            Đến trang Đăng nhập
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-50 flex flex-col justify-center items-center p-4 sm:p-8">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Tạo tài khoản mới
          </h1>

          <p className="text-neutral-400">
            Hoàn thiện hồ sơ nhân sự của bạn trong vài bước đơn giản.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-800 rounded-full z-0" />

          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0"
            animate={{
              width: `${((step - 1) / 2) * 100}%`,
            }}
          />

          {STEPS.map((s) => (
            <div
              key={s.id}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                  step >= s.id
                    ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                )}
              >
                {step > s.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  s.id
                )}
              </div>

              <span
                className={cn(
                  "hidden sm:block text-xs font-medium",
                  step >= s.id
                    ? "text-indigo-300"
                    : "text-neutral-500"
                )}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <form
            onSubmit={
              step === 3
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    handleNext();
                  }
            }
          >
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">
                        Họ và tên
                      </label>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400" />
                        </div>

                        <input
                          type="text"
                          required
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">
                        Email
                      </label>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400" />
                        </div>

                        <input
                          type="email"
                          required
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">
                      Mật khẩu
                    </label>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400" />
                      </div>

                      <input
                        type="password"
                        required
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">
                      Phòng ban
                    </label>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400" />
                      </div>

                      <select
                        required
                        defaultValue=""
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none text-white"
                      >
                        <option value="" disabled>
                          Chọn phòng ban
                        </option>

                        <option value="IT">
                          Công nghệ thông tin
                        </option>

                        <option value="HR">
                          Nhân sự
                        </option>

                        <option value="SALES">
                          Kinh doanh
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">
                      Ca làm việc mặc định
                    </label>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400" />
                      </div>

                      <select
                        required
                        defaultValue=""
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none text-white"
                      >
                        <option value="" disabled>
                          Chọn ca làm việc
                        </option>

                        <option value="HC">
                          Hành chính (08:00 - 17:30)
                        </option>

                        <option value="S1">
                          Ca sáng (06:00 - 14:00)
                        </option>

                        <option value="S2">
                          Ca chiều (14:00 - 22:00)
                        </option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="space-y-6 text-center"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Xác thực khuôn mặt
                    </h3>

                    <p className="text-neutral-400 text-sm">
                      Đưa khuôn mặt vào giữa khung hình
                      và đảm bảo môi trường đủ sáng.
                    </p>
                  </div>

                  {/* CAMERA */}
                  <div className="relative mx-auto w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
                    {/* Camera */}
                    {cameraStatus !== "captured" && (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover scale-x-[-1]",
                          cameraStatus !== "ready" &&
                            cameraStatus !== "starting"
                            ? "opacity-0"
                            : "opacity-100"
                        )}
                      />
                    )}

                    {/* Captured image */}
                    {cameraStatus === "captured" &&
                      capturedImage && (
                        <img
                          src={capturedImage}
                          alt="Ảnh khuôn mặt"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}

                    {/* Initial */}
                    {cameraStatus === "idle" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                          <Video className="w-9 h-9 text-neutral-500" />
                        </div>

                        <p className="text-neutral-400 text-sm">
                          Camera chưa được bật
                        </p>
                      </div>
                    )}

                    {/* Starting */}
                    {cameraStatus === "starting" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-4" />

                        <p className="text-neutral-400 text-sm">
                          Đang kết nối Camera...
                        </p>
                      </div>
                    )}

                    {/* Error */}
                    {cameraStatus === "error" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-neutral-950">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                          <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>

                        <p className="text-red-300 font-medium mb-2">
                          Không thể mở Camera
                        </p>

                        <p className="text-neutral-500 text-sm text-center max-w-sm">
                          {cameraError}
                        </p>
                      </div>
                    )}

                    {/* Face frame */}
                    {(cameraStatus === "ready" ||
                      cameraStatus === "starting") && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/10" />

                        {/* Face oval */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48%] h-[70%] rounded-[50%] border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]" />

                        {/* Corners */}
                        <div className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 border-indigo-400 rounded-tl-xl" />

                        <div className="absolute top-5 right-5 w-10 h-10 border-t-2 border-r-2 border-indigo-400 rounded-tr-xl" />

                        <div className="absolute bottom-5 left-5 w-10 h-10 border-b-2 border-l-2 border-indigo-400 rounded-bl-xl" />

                        <div className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2 border-indigo-400 rounded-br-xl" />

                        {/* Scanning line */}
                        {cameraStatus === "ready" && (
                          <motion.div
                            animate={{
                              top: ["15%", "85%", "15%"],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute left-[20%] right-[20%] h-[2px] bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,1)]"
                          />
                        )}
                      </div>
                    )}

                    {/* Captured badge */}
                    {cameraStatus === "captured" && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2">
                        <div className="px-4 py-2 rounded-full bg-green-500/90 backdrop-blur text-white text-sm font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Đã chụp khuôn mặt
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden canvas */}
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />

                  {/* Camera error */}
                  {cameraStatus === "error" && (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="mx-auto bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl px-6 py-3 font-medium inline-flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Thử lại
                    </button>
                  )}

                  {/* Camera buttons */}
                  {cameraStatus === "idle" && (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-7 py-3.5 font-medium inline-flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.25)]"
                    >
                      <Camera className="w-5 h-5" />
                      Bật Camera
                    </button>
                  )}

                  {cameraStatus === "ready" && (
                    <button
                      type="button"
                      onClick={captureImage}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 py-3.5 font-bold inline-flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                    >
                      <Camera className="w-5 h-5" />
                      Chụp khuôn mặt
                    </button>
                  )}

                  {cameraStatus === "captured" && (
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={retakeImage}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl px-6 py-3 font-medium inline-flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Chụp lại
                      </button>
                    </div>
                  )}

                  {/* Camera status */}
                  {cameraStatus === "ready" && (
                    <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Camera đang hoạt động
                    </div>
                  )}

                  {cameraStatus === "captured" && (
                    <p className="text-neutral-500 text-sm">
                      Kiểm tra ảnh trước khi hoàn tất đăng ký.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="flex justify-between mt-10 pt-6 border-t border-neutral-800">
              <button
                type="button"
                onClick={handlePrev}
                className={cn(
                  "px-6 py-3 rounded-xl font-medium transition-colors",
                  step === 1
                    ? "opacity-0 pointer-events-none"
                    : "bg-neutral-800 hover:bg-neutral-700 text-white"
                )}
              >
                Quay lại
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  (step === 3 && !capturedImage)
                }
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium transition-all transform active:scale-95 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 3
                      ? "Hoàn tất đăng ký"
                      : "Tiếp tục"}

                    {step !== 3 && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
