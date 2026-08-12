// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Lock, Mail, ArrowRight, Fingerprint, Sparkles, Camera, ScanFace, CheckCircle2 } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";

// export default function LoginPage() {
//   const [loginMode, setLoginMode] = useState<"text" | "face">("face");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [cameraStatus, setCameraStatus] = useState<"init" | "ready" | "scanning" | "success" | "error">("init");

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const router = useRouter();

//   // Handle Text Login
//   const handleTextLogin = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsLoading(true);

//   setTimeout(() => {
//     setIsLoading(false);

//     if (
//       email === "admin@timesync.com" &&
//       password === "admin123"
//     ) {
//       router.push("/faces");
//     } else {
//       router.push("/face");
//     }
//   }, 1500);
// };

//   // Start Camera
//   const startCamera = useCallback(async () => {
//     try {
//       if (streamRef.current) return;
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//         setCameraStatus("ready");
//       }
//     } catch (error) {
//       console.error("Lỗi truy cập Camera:", error);
//       setCameraStatus("error");
//     }
//   }, []);

//   // Stop Camera
//   const stopCamera = useCallback(() => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//       streamRef.current = null;
//     }
//   }, []);

//   // Handle Face Scan
//   const handleFaceScan = () => {
//     if (cameraStatus !== "ready") return;
//     setCameraStatus("scanning");

//     // Giả lập xử lý AI
//     setTimeout(() => {
//       setCameraStatus("success");
//       setTimeout(() => {
//         stopCamera();
//         router.push("/face");
//       }, 1000);
//     }, 2000);
//   };

//   // Manage Camera Lifecycle based on Mode
//   useEffect(() => {
//     if (loginMode === "face") {
//       setCameraStatus("init");
//       startCamera();
//     } else {
//       stopCamera();
//     }
//     return () => stopCamera();
//   }, [loginMode, startCamera, stopCamera]);

//   return (
//     <div className="min-h-screen w-full flex bg-neutral-950 text-neutral-50 overflow-hidden font-sans">
//       {/* Left side: Abstract background */}
//       <div className="relative hidden lg:flex flex-col justify-center items-center w-[45%] bg-neutral-900 border-r border-neutral-800 p-12 overflow-hidden">
//         {/* Decorative background blur */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <motion.div
//             animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.1, 0.2, 0.1] }}
//             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600 blur-[120px]"
//           />
//           <motion.div
//             animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.1, 0.2, 0.1] }}
//             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//             className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600 blur-[100px]"
//           />
//         </div>

//         <div className="relative z-10 w-full max-w-lg">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
//                 <Fingerprint className="w-8 h-8 text-indigo-400" />
//               </div>
//               <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
//                 TimeSync
//               </h1>
//             </div>
//             <h2 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
//               Kỷ nguyên mới của <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
//                 quản lý nhân sự
//               </span>
//             </h2>
//             <p className="text-lg text-neutral-400 mb-10 max-w-md leading-relaxed">
//               Hệ thống chấm công bằng khuôn mặt AI tích hợp Camera thực tế. Nhận diện chuẩn xác, nhanh chóng chỉ với 0.2s.
//             </p>

//             <div className="flex gap-4">
//               <div className="flex items-center gap-2 bg-neutral-950/50 border border-neutral-800 rounded-full px-5 py-2.5 text-sm font-medium">
//                 <Sparkles className="w-4 h-4 text-blue-400" />
//                 <span>AI Face Recognition</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Right side: Login Area */}
//       <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-20 bg-neutral-950">

//         {/* Toggle Login Mode */}
//         <div className="absolute top-8 right-8 flex items-center bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
//           <button
//             onClick={() => setLoginMode("face")}
//             className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", loginMode === "face" ? "bg-indigo-600 text-white shadow-lg" : "text-neutral-400 hover:text-white")}
//           >
//             <ScanFace className="w-4 h-4" /> Face Login
//           </button>
//           <button
//             onClick={() => setLoginMode("text")}
//             className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", loginMode === "text" ? "bg-indigo-600 text-white shadow-lg" : "text-neutral-400 hover:text-white")}
//           >
//             <Mail className="w-4 h-4" /> Email
//           </button>
//         </div>

//         <div className="w-full max-w-md mt-16">
//           <AnimatePresence mode="wait">

//             {/* FACE LOGIN MODE */}
//             {loginMode === "face" && (
//               <motion.div
//                 key="face"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.3 }}
//                 className="w-full flex flex-col items-center"
//               >
//                 <div className="text-center mb-8">
//                   <h3 className="text-3xl font-bold mb-2">Nhận diện khuôn mặt</h3>
//                   <p className="text-neutral-400">Nhìn thẳng vào Camera để đăng nhập vào hệ thống</p>
//                 </div>

//                 <div className="relative w-full max-w-[320px] aspect-square rounded-[2rem] overflow-hidden bg-neutral-900 border-4 border-neutral-800 shadow-2xl flex items-center justify-center">

//                   {cameraStatus === "error" ? (
//                     <div className="text-center text-red-400 p-4">
//                       <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                       <p>Không thể truy cập Camera. Vui lòng kiểm tra quyền trình duyệt.</p>
//                     </div>
//                   ) : (
//                     <>
//                       <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
//                       />

//                       {/* Scanning Grid & Overlay */}
//                       <div className="absolute inset-0 z-10 pointer-events-none">
//                         <div className="w-full h-full border-[12px] border-neutral-950/40" />

//                         {/* Target brackets */}
//                         <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-white/50 rounded-tl-xl" />
//                         <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-xl" />
//                         <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-white/50 rounded-bl-xl" />
//                         <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-white/50 rounded-br-xl" />
//                       </div>

//                       {/* Scanning Animation */}
//                       {cameraStatus === "scanning" && (
//                         <motion.div
//                           initial={{ top: "0%" }}
//                           animate={{ top: "100%" }}
//                           transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
//                           className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] z-20"
//                         />
//                       )}

//                       {/* Success Overlay */}
//                       <AnimatePresence>
//                         {cameraStatus === "success" && (
//                           <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="absolute inset-0 bg-green-500/20 backdrop-blur-sm z-30 flex flex-col items-center justify-center"
//                           >
//                             <CheckCircle2 className="w-20 h-20 text-green-400 drop-shadow-lg mb-2" />
//                             <span className="font-bold text-white text-lg drop-shadow-md">Xác thực thành công</span>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </>
//                   )}
//                 </div>

//                 <button
//                   onClick={handleFaceScan}
//                   disabled={cameraStatus !== "ready"}
//                   className="mt-8 w-full max-w-[320px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-bold transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(79,70,229,0.2)]"
//                 >
//                   {cameraStatus === "init" ? "Đang khởi tạo Camera..." :
//                    cameraStatus === "scanning" ? "Đang xử lý..." :
//                    cameraStatus === "success" ? "Thành công!" : "Quét Khuôn Mặt Ngay"}
//                 </button>
//               </motion.div>
//             )}

//             {/* TEXT LOGIN MODE */}
//             {loginMode === "text" && (
//               <motion.div
//                 key="text"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className="w-full"
//               >
//                 <h3 className="text-3xl font-bold mb-2">Đăng nhập</h3>
//                 <p className="text-neutral-400 mb-8">Sử dụng Email và Mật khẩu được cấp.</p>

//                 <form onSubmit={handleTextLogin} className="space-y-5">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-neutral-300">Email</label>
//                     <div className="relative group">
//                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                         <Mail className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
//                       </div>
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
//                         placeholder="name@company.com"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <label className="text-sm font-medium text-neutral-300">Mật khẩu</label>
//                       <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">Quên mật khẩu?</a>
//                     </div>
//                     <div className="relative group">
//                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                         <Lock className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
//                       </div>
//                       <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
//                         placeholder="••••••••"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-medium transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
//                   >
//                     {isLoading ? (
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     ) : (
//                       <>
//                         <span>Đăng nhập</span>
//                         <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </button>
//                 </form>

//                 <p className="mt-8 text-center text-neutral-400 text-sm">
//                   Chưa có tài khoản? <Link href="/register" className="text-indigo-400 font-medium hover:text-indigo-300">Đăng ký ngay</Link>
//                 </p>
//               </motion.div>
//             )}

//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Lock,
  ArrowRight,
  Fingerprint,
  Sparkles,
  Camera,
  ScanFace,
  CheckCircle2,
  User,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

type LoginMode = "text" | "face";

type CameraStatus = "init" | "ready" | "scanning" | "success" | "error";

export default function LoginPage() {
  const router = useRouter();

  const { login, isLoginLoading } = useAuth();

  // =========================================================
  // LOGIN STATE
  // =========================================================

  const [loginMode, setLoginMode] = useState<LoginMode>("text");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // =========================================================
  // CAMERA STATE
  // =========================================================

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("init");

  const [faceError, setFaceError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const streamRef = useRef<MediaStream | null>(null);

  // =========================================================
  // CAMERA
  // =========================================================

  const stopCamera = useCallback(() => {
    if (!streamRef.current) {
      return;
    }

    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current || !navigator.mediaDevices?.getUserMedia) {
        return;
      }

      setCameraStatus("init");
      setFaceError("");

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
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play().catch(() => {});

        setCameraStatus("ready");
      }
    } catch (error) {
      console.error("Không thể truy cập Camera:", error);

      setCameraStatus("error");

      setFaceError(
        "Không thể truy cập Camera. Vui lòng kiểm tra quyền Camera của trình duyệt.",
      );
    }
  }, []);

  // =========================================================
  // CAMERA LIFECYCLE
  // =========================================================

  useEffect(() => {
    if (loginMode === "face") {
      startCamera();
    } else {
      stopCamera();
      setCameraStatus("init");
      setFaceError("");
    }

    return () => {
      stopCamera();
    };
  }, [loginMode, startCamera, stopCamera]);

  // =========================================================
  // UNMOUNT CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // =========================================================
  // ACCOUNT LOGIN
  // =========================================================

  const handleTextLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoginLoading) {
      return;
    }

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      toast.error("Username or password is incorrect");

      return;
    }

    try {
      const response = await login({
        data: {
          username: trimmedUsername,
          password,
        },
      });

      const role = response.employee.role;

      toast.success("Đăng nhập thành công");

      if (role === "admin") {
        router.replace("/faces");
        return;
      }

      router.replace("/face");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);

      toast.error("Username or password is incorrect");
    }
  };

  // =========================================================
  // FACE LOGIN
  // =========================================================

  const handleFaceScan = () => {
    if (cameraStatus !== "ready") {
      return;
    }

    setFaceError("");
    setCameraStatus("scanning");

    // TODO:
    // Thay bằng API Face Recognition thật.

    setTimeout(() => {
      setCameraStatus("success");

      toast.success("Xác thực khuôn mặt thành công");

      setTimeout(() => {
        stopCamera();

        router.replace("/face");
      }, 1000);
    }, 2000);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full flex bg-neutral-950 text-neutral-50 overflow-hidden font-sans">
      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <div className="relative hidden lg:flex flex-col justify-center items-center w-[45%] bg-neutral-900 border-r border-neutral-800 p-12 overflow-hidden">
        {/* BACKGROUND */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main ambient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-blue-950/30" />

          {/* Top glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600 blur-[120px]"
          />

          {/* Bottom glow */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600 blur-[100px]"
          />
        </div>

        {/* LEFT CONTENT
            Không còn initial opacity = 0
            => mở trang thấy ngay */}
        <div className="relative z-10 w-full max-w-lg">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <ScanFace className="w-8 h-8 text-indigo-200" />
              </div>

              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-100">
                TimeSync
              </h1>
            </div>

            <h2 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
              Kỷ nguyên mới của
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                quản lý nhân sự
              </span>
            </h2>

            <p className="text-lg text-neutral-100 mb-10 max-w-md leading-relaxed">
              Hệ thống chấm công bằng khuôn mặt AI tích hợp Camera thực tế. Nhận
              diện chuẩn xác, nhanh chóng và an toàn.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-20 bg-neutral-950">
        {/* MODE SWITCH */}

        <div className="absolute top-8 right-8 flex items-center bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setLoginMode("text")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              loginMode === "text"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-neutral-400 hover:text-white",
            )}
          >
            <User className="w-4 h-4" />
            Tài khoản
          </button>

          <button
            type="button"
            onClick={() => setLoginMode("face")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              loginMode === "face"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-neutral-400 hover:text-white",
            )}
          >
            <ScanFace className="w-4 h-4" />
            Face Login
          </button>
        </div>

        <div className="w-full max-w-md mt-16">
          <AnimatePresence mode="wait">
            {/* =================================================
                ACCOUNT LOGIN
            ================================================= */}

            {loginMode === "text" && (
              <motion.div
                key="text"
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
                  duration: 0.25,
                }}
                className="w-full"
              >
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-5">
                    <User className="w-6 h-6 text-indigo-400" />
                  </div>

                  <h3 className="text-3xl font-bold mb-2">Đăng nhập</h3>

                  <p className="text-neutral-400">
                    Sử dụng Username và Mật khẩu được cấp.
                  </p>
                </div>

                <form onSubmit={handleTextLogin} className="space-y-5">
                  {/* USERNAME */}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">
                      Username
                    </label>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                      </div>

                      <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                        className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        placeholder="Nhập username"
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-neutral-300">
                        Mật khẩu
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                      </div>

                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={isLoginLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-[0_0_30px_rgba(79,70,229,0.2)]"
                  >
                    {isLoginLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                        <span>Đang đăng nhập...</span>
                      </>
                    ) : (
                      <>
                        <span>Đăng nhập</span>

                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-neutral-400 text-sm">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/register"
                    className="text-indigo-400 font-medium hover:text-indigo-300"
                  >
                    Đăng ký ngay
                  </Link>
                </p>

                <button
                  type="button"
                  onClick={() => setLoginMode("face")}
                  className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-neutral-500 hover:text-indigo-400 transition-colors"
                >
                  <ScanFace className="w-4 h-4" />
                  Hoặc đăng nhập bằng khuôn mặt
                </button>
              </motion.div>
            )}

            {/* =================================================
                FACE LOGIN
            ================================================= */}

            {loginMode === "face" && (
              <motion.div
                key="face"
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
                transition={{
                  duration: 0.25,
                }}
                className="w-full flex flex-col items-center"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-5">
                    <ScanFace className="w-6 h-6 text-indigo-400" />
                  </div>

                  <h3 className="text-3xl font-bold mb-2">
                    Nhận diện khuôn mặt
                  </h3>

                  <p className="text-neutral-400">
                    Nhìn thẳng vào Camera để đăng nhập vào hệ thống
                  </p>
                </div>

                {/* CAMERA */}

                <div className="relative w-full max-w-[320px] aspect-square rounded-[2rem] overflow-hidden bg-neutral-900 border-4 border-neutral-800 shadow-2xl flex items-center justify-center">
                  {cameraStatus === "error" ? (
                    <div className="text-center text-red-400 p-6">
                      <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />

                      <p className="text-sm leading-relaxed">
                        {faceError || "Không thể truy cập Camera."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                      />

                      {/* OVERLAY */}

                      <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="w-full h-full border-[12px] border-neutral-950/40" />

                        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-white/60 rounded-tl-xl" />

                        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-white/60 rounded-tr-xl" />

                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-white/60 rounded-bl-xl" />

                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-white/60 rounded-br-xl" />
                      </div>

                      {/* SCANNING */}

                      {cameraStatus === "scanning" && (
                        <motion.div
                          initial={{
                            top: "0%",
                          }}
                          animate={{
                            top: "100%",
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "reverse",
                          }}
                          className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] z-20"
                        />
                      )}

                      {/* INIT */}

                      {cameraStatus === "init" && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-950/40 backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin" />

                            <span className="text-sm text-white">
                              Đang khởi tạo Camera...
                            </span>
                          </div>
                        </div>
                      )}

                      {/* SUCCESS */}

                      <AnimatePresence>
                        {cameraStatus === "success" && (
                          <motion.div
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            className="absolute inset-0 bg-green-500/20 backdrop-blur-sm z-30 flex flex-col items-center justify-center"
                          >
                            <CheckCircle2 className="w-20 h-20 text-green-400 drop-shadow-lg mb-2" />

                            <span className="font-bold text-white text-lg drop-shadow-md">
                              Xác thực thành công
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                {/* SCAN BUTTON */}

                <button
                  type="button"
                  onClick={handleFaceScan}
                  disabled={cameraStatus !== "ready"}
                  className="mt-8 w-full max-w-[320px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(79,70,229,0.2)]"
                >
                  {cameraStatus === "init"
                    ? "Đang khởi tạo Camera..."
                    : cameraStatus === "scanning"
                      ? "Đang nhận diện..."
                      : cameraStatus === "success"
                        ? "Thành công!"
                        : cameraStatus === "error"
                          ? "Camera không khả dụng"
                          : "Quét Khuôn Mặt Ngay"}
                </button>

                {/* BACK */}

                <button
                  type="button"
                  onClick={() => setLoginMode("text")}
                  className="mt-6 text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  ← Quay lại đăng nhập tài khoản
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
