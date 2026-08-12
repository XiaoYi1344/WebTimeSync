"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  ScanFace,
  Camera,
  ShieldCheck,
  AlertCircle,
  Filter,
  MoreHorizontal,
  ChevronDown,
  X,
  CheckCircle2,
  RotateCcw,
  UserRound,
  Cpu,
  Upload,
  Loader2,
  ImagePlus,
  Trash2,
} from "lucide-react";

import { useQueries } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import {
  devices,
} from "@/@mockdata/employee.mock";

import {
  useEmployees,
  useEmployeeFaceImages,
  useUploadEmployeeFaceImages,
  employeeKeys,
} from "@/hooks/useEmployee";

import {
  getEmployeeFaceImages,
  type EmployeeFaceImage,
} from "@/api/file";

import type { Employee } from "@/api/auth";
import toast from "react-hot-toast";

/* =========================================================
   TYPES
========================================================= */

type ModalMode = "register" | "update" | "info" | null;

type FaceStatus =
  | "registered"
  | "not_registered";

type FaceRecord = {
  employee: Employee;
  images: EmployeeFaceImage[];
  status: FaceStatus;
  updatedAt: string | null;
  deviceId: string | null;
};

type FaceForm = {
  employeeId: string;
  deviceId: string;
  files: File[];
  previews: string[];
};

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_FACE_IMAGES = 9;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const emptyForm: FaceForm = {
  employeeId: "",
  deviceId: "",
  files: [],
  previews: [],
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

/* =========================================================
   HELPERS
========================================================= */

function getEmployeeName(employee: Employee) {
  return (
    (employee as any).fullName ??
    (employee as any).name ??
    "Nhân viên"
  );
}

function getEmployeeCode(employee: Employee) {
  return (
    (employee as any).employeeCode ??
    (employee as any).code ??
    `#${employee.id}`
  );
}

function getEmployeeAvatar(employee: Employee) {
  return (
    (employee as any).avatar ??
    (employee as any).avatarUrl ??
    ""
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Faces() {
  /* =======================================================
     EMPLOYEES
  ======================================================= */

  const {
    data: employees = [],
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    error: employeesError,
  } = useEmployees();

  /* =======================================================
     STATES
  ======================================================= */

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<"all" | FaceStatus>("all");

  const [modalMode, setModalMode] =
    useState<ModalMode>(null);

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<number | string | null>(null);

  const [form, setForm] =
    useState<FaceForm>(emptyForm);

  const [isCameraOpen, setIsCameraOpen] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [openMenuId, setOpenMenuId] =
    useState<number | string | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  /* =======================================================
     FACE IMAGE QUERIES
     
     Mỗi employee sẽ có một query:
     GET /admin/employee/face-images/:employeeId
  ======================================================= */

  const faceQueries = useQueries({
    queries: employees.map((employee) => ({
      queryKey: employeeKeys.faceImages(employee.id),
      queryFn: () =>
        getEmployeeFaceImages(employee.id),
      staleTime: 30_000,
      enabled:
        employee.id !== null &&
        employee.id !== undefined,
    })),
  });

  /* =======================================================
     UPLOAD MUTATION
  ======================================================= */

  const uploadMutation =
  useUploadEmployeeFaceImages({
    onSuccess: () => {
      toast.success(
        modalMode === "register"
          ? "Đăng ký Face ID thành công."
          : "Cập nhật Face ID thành công.",
      );

      handleCloseModal();
    },

    onError: (error) => {
      const message =
        error?.message ||
        "Không thể upload ảnh khuôn mặt.";

      setSubmitError(message);

      toast.error(message);
    },
  });

  /* =======================================================
     BUILD RECORDS
  ======================================================= */

  const records = useMemo<FaceRecord[]>(() => {
    return employees
      .map((employee, index) => {
        const query = faceQueries[index];

        const images =
          query?.data ?? [];

        const latestImage =
          [...images]
            .sort((a, b) => {
              const aTime = a.createdAt
                ? new Date(a.createdAt).getTime()
                : 0;

              const bTime = b.createdAt
                ? new Date(b.createdAt).getTime()
                : 0;

              return bTime - aTime;
            })[0];

        const status: FaceStatus =
          images.length > 0
            ? "registered"
            : "not_registered";

        return {
          employee,
          images,
          status,
          updatedAt:
            latestImage?.createdAt ??
            null,
          deviceId:
            devices[0]?.id ??
            null,
        };
      })
      .filter((record) => {
        const keyword =
          search.trim().toLowerCase();

        if (!keyword) {
          return true;
        }

        const name =
          getEmployeeName(record.employee)
            .toLowerCase();

        const code =
          getEmployeeCode(record.employee)
            .toLowerCase();

        return (
          name.includes(keyword) ||
          code.includes(keyword)
        );
      })
      .filter((record) => {
        if (filterStatus === "all") {
          return true;
        }

        return (
          record.status === filterStatus
        );
      });
  }, [
    employees,
    faceQueries,
    search,
    filterStatus,
  ]);

  /* =======================================================
     SELECTED EMPLOYEE
  ======================================================= */

  const selectedEmployee = useMemo(() => {
    if (!form.employeeId) {
      return null;
    }

    return employees.find(
      (employee) =>
        String(employee.id) ===
        String(form.employeeId),
    );
  }, [
    employees,
    form.employeeId,
  ]);

  /* =======================================================
     SELECTED EMPLOYEE FACE IMAGES
  ======================================================= */

  const selectedFaceQuery =
    useEmployeeFaceImages(
      selectedEmployeeId,
      {
        enabled:
          modalMode !== null &&
          selectedEmployeeId !== null,
      },
    );

  /* =======================================================
     STATUS CONFIG
  ======================================================= */

  const getStatusConfig = (
    status: FaceStatus,
  ) => {
    switch (status) {
      case "registered":
        return {
          label: "Đã đăng ký",
          icon: ShieldCheck,
          className:
            "text-emerald-600 bg-emerald-50 border-emerald-100",
        };

      case "not_registered":
      default:
        return {
          label: "Chưa đăng ký",
          icon: AlertCircle,
          className:
            "text-amber-600 bg-amber-50 border-amber-100",
        };
    }
  };

  /* =======================================================
     OPEN REGISTER
  ======================================================= */

  function handleOpenRegister(
    employeeId?: number | string,
  ) {
    if (employeeId !== undefined) {
      setSelectedEmployeeId(employeeId);
      setForm({
        ...emptyForm,
        employeeId: String(employeeId),
        deviceId:
          devices[0]?.id
            ? String(devices[0].id)
            : "",
      });
    } else {
      setSelectedEmployeeId(null);
      setForm({
        ...emptyForm,
        employeeId: "",
        deviceId:
          devices[0]?.id
            ? String(devices[0].id)
            : "",
      });
    }

    setSubmitError("");
    setModalMode("register");
  }

  /* =======================================================
     OPEN UPDATE
  ======================================================= */

  function handleOpenUpdate(
    employeeId: number | string,
  ) {
    setSelectedEmployeeId(employeeId);

    const employee =
      employees.find(
        (item) =>
          String(item.id) ===
          String(employeeId),
      );

    setForm({
      ...emptyForm,
      employeeId: String(
        employee?.id ?? employeeId,
      ),
      deviceId:
        devices[0]?.id
          ? String(devices[0].id)
          : "",
    });

    setSubmitError("");
    setModalMode("update");
  }

  /* =======================================================
     OPEN INFO
  ======================================================= */

  function handleOpenInfo(
    employeeId: number | string,
  ) {
    setSelectedEmployeeId(employeeId);
    setForm({
      ...emptyForm,
      employeeId: String(employeeId),
      deviceId:
        devices[0]?.id
          ? String(devices[0].id)
          : "",
    });
    setSubmitError("");
    setModalMode("info");
  }

  /* =======================================================
     LOAD EXISTING IMAGES FOR UPDATE
  ======================================================= */

  useEffect(() => {
    if (
      modalMode !== "update" ||
      !selectedEmployeeId
    ) {
      return;
    }

    if (
      selectedFaceQuery.isLoading ||
      !selectedFaceQuery.data
    ) {
      return;
    }

    const images =
      selectedFaceQuery.data;

    setForm((prev) => ({
      ...prev,
      previews: images.map(
        (image) => image.imageUrl,
      ),
      files: [],
    }));
  }, [
    modalMode,
    selectedEmployeeId,
    selectedFaceQuery.data,
    selectedFaceQuery.isLoading,
  ]);

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  function handleCloseModal() {
    stopCamera();

    form.previews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    setModalMode(null);
    setSelectedEmployeeId(null);
    setForm(emptyForm);
    setSubmitError("");
  }

  /* =======================================================
     CAMERA
  ======================================================= */

  async function startCamera() {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        toast.error("Trình duyệt không hỗ trợ camera.");
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: "user",
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            },
            audio: false,
          },
        );

      streamRef.current = stream;

      setIsCameraOpen(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;
        }
      });
    } catch (error) {
      toast.error(
        "Không thể truy cập camera. Vui lòng kiểm tra quyền camera của trình duyệt.",
      );
    }
  }

  /* =======================================================
     STOP CAMERA
  ======================================================= */

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    setIsCameraOpen(false);
  }

  /* =======================================================
     CAPTURE CAMERA
  ======================================================= */

 function capturePhoto() {
  const video = videoRef.current;

  if (!video) {
    toast.error("Camera chưa sẵn sàng.");
    return;
  }

  if (form.previews.length >= MAX_FACE_IMAGES) {
    toast.error(
      `Đã đạt tối đa ${MAX_FACE_IMAGES} ảnh khuôn mặt.`,
      {
        id: "face-max-images",
      },
    );

    stopCamera();
    return;
  }

  if (
    video.videoWidth === 0 ||
    video.videoHeight === 0
  ) {
    toast.error(
      "Camera chưa nhận được hình ảnh. Vui lòng thử lại.",
    );

    return;
  }

  const canvas =
    document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context =
    canvas.getContext("2d");

  if (!context) {
    toast.error(
      "Không thể chụp ảnh từ camera.",
    );

    return;
  }

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const preview = canvas.toDataURL(
    "image/jpeg",
    0.9,
  );

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        toast.error(
          "Không thể tạo ảnh từ camera.",
        );

        return;
      }

      const file = new File(
        [blob],
        `face-${Date.now()}.jpg`,
        {
          type: "image/jpeg",
        },
      );

      setForm((prev) => {
        if (
          prev.previews.length >=
          MAX_FACE_IMAGES
        ) {
          toast.error(
            `Đã đạt tối đa ${MAX_FACE_IMAGES} ảnh khuôn mặt.`,
            {
              id: "face-max-images",
            },
          );

          return prev;
        }

        return {
          ...prev,
          files: [
            ...prev.files,
            file,
          ],
          previews: [
            ...prev.previews,
            preview,
          ],
        };
      });

      toast.success(
        "Đã chụp ảnh khuôn mặt.",
      );

      stopCamera();
    },
    "image/jpeg",
    0.9,
  );
}

  /* =======================================================
     UPLOAD IMAGE
  ======================================================= */

  function handleUploadImages(fileList: FileList | null) {
  if (!fileList) return;

  const selectedFiles = Array.from(fileList);

  if (selectedFiles.length === 0) {
    return;
  }

  const currentCount = form.previews.length;

  // Đã đủ 9 ảnh
  if (currentCount >= MAX_FACE_IMAGES) {
    toast.error(
      `Đã đạt tối đa ${MAX_FACE_IMAGES} ảnh khuôn mặt.`,
      {
        id: "face-max-images",
      },
    );

    return;
  }

  const remainingSlots =
    MAX_FACE_IMAGES - currentCount;

  // Người dùng chọn quá số lượng còn lại
  if (selectedFiles.length > remainingSlots) {
    toast.error(
      `Chỉ có thể thêm ${remainingSlots} ảnh nữa. Tối đa ${MAX_FACE_IMAGES} ảnh.`,
      {
        id: "face-max-images",
      },
    );

    selectedFiles.splice(remainingSlots);
  }

  if (selectedFiles.length === 0) {
    return;
  }

  // Validate type
  const invalidFile = selectedFiles.find(
    (file) => !file.type.startsWith("image/"),
  );

  if (invalidFile) {
    toast.error(
      `"${invalidFile.name}" không phải là file hình ảnh.`,
    );

    return;
  }

  // Validate size
  const oversizedFile = selectedFiles.find(
    (file) => file.size > MAX_FILE_SIZE,
  );

  if (oversizedFile) {
    toast.error(
      `"${oversizedFile.name}" vượt quá giới hạn 5MB.`,
    );

    return;
  }

  const previews = selectedFiles.map((file) =>
    URL.createObjectURL(file),
  );

  setForm((prev) => ({
    ...prev,
    files: [
      ...prev.files,
      ...selectedFiles,
    ],
    previews: [
      ...prev.previews,
      ...previews,
    ],
  }));

  toast.success(
    `Đã thêm ${selectedFiles.length} ảnh khuôn mặt.`,
  );
}

  /* =======================================================
     REMOVE SELECTED PREVIEW
  ======================================================= */

  function handleRemovePreview(
  index: number,
) {
  setForm((prev) => {
    const preview =
      prev.previews[index];

    if (
      preview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    const newPreviews =
      prev.previews.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      );

    /*
     * Chỉ preview blob mới tương ứng với file mới.
     *
     * Existing image từ API không có trong files.
     *
     * Vì vậy xác định vị trí file bằng cách
     * đếm số blob trước index.
     */
    const blobIndex =
      prev.previews
        .slice(0, index)
        .filter((item) =>
          item.startsWith("blob:"),
        ).length;

    const isNewFile =
      preview?.startsWith("blob:");

    let newFiles = prev.files;

    if (isNewFile) {
      newFiles =
        prev.files.filter(
          (_, fileIndex) =>
            fileIndex !== blobIndex,
        );
    }

    return {
      ...prev,
      previews: newPreviews,
      files: newFiles,
    };
  });

  toast.success("Đã xóa ảnh khỏi danh sách review.");
}

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  setSubmitError("");

  if (!form.employeeId) {
    const message =
      "Vui lòng chọn nhân viên.";

    setSubmitError(message);
    toast.error(message);

    return;
  }

  if (!form.deviceId) {
    const message =
      "Vui lòng chọn thiết bị lấy mẫu.";

    setSubmitError(message);
    toast.error(message);

    return;
  }

  // Không được quá 9 ảnh review
  if (
    form.previews.length >
    MAX_FACE_IMAGES
  ) {
    const message =
      `Chỉ được tối đa ${MAX_FACE_IMAGES} ảnh khuôn mặt.`;

    setSubmitError(message);
    toast.error(message);

    return;
  }

  // REGISTER bắt buộc phải có ảnh
  if (modalMode === "register") {
    if (form.files.length === 0) {
      const message =
        "Vui lòng chụp hoặc tải ít nhất 1 ảnh khuôn mặt.";

      setSubmitError(message);
      toast.error(message);

      return;
    }
  }

  // UPDATE
  if (modalMode === "update") {
    // Không còn ảnh
    if (form.previews.length === 0) {
      const message =
        "Vui lòng giữ lại ít nhất 1 ảnh khuôn mặt.";

      setSubmitError(message);
      toast.error(message);

      return;
    }

    // Không có ảnh mới
    if (form.files.length === 0) {
      toast.success(
        "Không có ảnh mới cần cập nhật.",
      );

      handleCloseModal();
      return;
    }
  }

  if (
    form.files.length >
    MAX_FACE_IMAGES
  ) {
    const message =
      `Chỉ được upload tối đa ${MAX_FACE_IMAGES} ảnh.`;

    setSubmitError(message);
    toast.error(message);

    return;
  }

  try {
    await uploadMutation.mutateAsync({
      employeeId: form.employeeId,
      files: form.files,
    });
  } catch {
    // onError của mutation đã xử lý toast
  }
}

  /* =======================================================
     CLEAN CAMERA
  ======================================================= */

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop(),
          );
      }

      form.previews.forEach(
        (preview) => {
          if (
            preview.startsWith("blob:")
          ) {
            URL.revokeObjectURL(
              preview,
            );
          }
        },
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isEmployeesLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          Đang tải danh sách nhân viên...
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (isEmployeesError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />

          <div>
            <h3 className="text-sm font-semibold text-red-700">
              Không thể tải danh sách nhân viên
            </h3>

            <p className="mt-1 text-xs text-red-600">
              {employeesError?.message ||
                "Đã xảy ra lỗi khi gọi API."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ScanFace className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Face ID
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Quản lý và cập nhật dữ liệu nhận diện
                khuôn mặt cho nhân viên.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            handleOpenRegister()
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <ScanFace className="h-4 w-4" />
          Đăng ký Face ID
        </button>
      </div>

      {/* ===================================================
          FILTERS
      =================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Tìm nhân viên..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div className="relative w-full sm:w-52">
          <Filter className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(
                event.target.value as
                  | "all"
                  | FaceStatus,
              )
            }
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
          >
            <option value="all">
              Tất cả trạng thái
            </option>

            <option value="registered">
              Đã đăng ký
            </option>

            <option value="not_registered">
              Chưa đăng ký
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Nhân viên
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Dữ liệu
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Cập nhật
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thiết bị
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {records.map((record) => {
                const config =
                  getStatusConfig(
                    record.status,
                  );

                const Icon =
                  config.icon;

                const firstImage =
                  record.images[0]
                    ?.imageUrl;

                const employeeId =
                  record.employee.id;

                return (
                  <tr
                    key={employeeId}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    {/* EMPLOYEE */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {firstImage ? (
                            <img
                              src={
                                firstImage
                              }
                              alt={getEmployeeName(
                                record.employee,
                              )}
                              className="h-10 w-10 rounded-xl border border-slate-200 object-cover shadow-sm"
                            />
                          ) : getEmployeeAvatar(
                              record.employee,
                            ) ? (
                            <img
                              src={getEmployeeAvatar(
                                record.employee,
                              )}
                              alt={getEmployeeName(
                                record.employee,
                              )}
                              className="h-10 w-10 rounded-xl border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                              <UserRound className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-800">
                            {getEmployeeName(
                              record.employee,
                            )}
                          </div>

                          <div className="mt-0.5 text-xs font-medium text-slate-400">
                            {getEmployeeCode(
                              record.employee,
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                          config.className,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />

                        {config.label}
                      </div>
                    </td>

                    {/* IMAGES */}

                    <td className="whitespace-nowrap px-6 py-4">
                      {record.images.length >
                      0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {record.images
                              .slice(0, 3)
                              .map(
                                (
                                  image,
                                  index,
                                ) => (
                                  <img
                                    key={
                                      image.id
                                    }
                                    src={
                                      image.imageUrl
                                    }
                                    alt={`Face ${index + 1}`}
                                    className="h-8 w-8 rounded-lg border-2 border-white object-cover shadow-sm"
                                  />
                                ),
                              )}
                          </div>

                          <span className="text-xs font-semibold text-slate-600">
                            {
                              record
                                .images
                                .length
                            }{" "}
                            ảnh
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Chưa có ảnh
                        </span>
                      )}
                    </td>

                    {/* UPDATED */}

                    <td className="whitespace-nowrap px-6 py-4">
                      {record.updatedAt ? (
                        <>
                          <div className="text-sm font-medium text-slate-700">
                            {new Date(
                              record.updatedAt,
                            ).toLocaleDateString(
                              "vi-VN",
                            )}
                          </div>

                          <div className="mt-0.5 text-xs text-slate-400">
                            {new Date(
                              record.updatedAt,
                            ).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              },
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* DEVICE */}

                    <td className="whitespace-nowrap px-6 py-4">
                      {record.deviceId &&
                      devices.find(
                        (device) =>
                          String(
                            device.id,
                          ) ===
                          String(
                            record.deviceId,
                          ),
                      ) ? (
                        (() => {
                          const device =
                            devices.find(
                              (item) =>
                                String(
                                  item.id,
                                ) ===
                                String(
                                  record.deviceId,
                                ),
                            );

                          return (
                            <>
                              <div className="text-sm font-medium text-slate-700">
                                {
                                  device?.name
                                }
                              </div>

                              <div className="mt-0.5 text-xs text-slate-400">
                                {device
                                  ?.location ||
                                  "—"}
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <span className="text-sm text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {record.status ===
                        "not_registered" ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenRegister(
                                employeeId,
                              )
                            }
                            className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                          >
                            Đăng ký
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenUpdate(
                                employeeId,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Cập nhật
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenInfo(
                              employeeId,
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 focus:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {records.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                        <ScanFace className="h-5 w-5 text-slate-400" />
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800">
                        Không tìm thấy nhân viên
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Thử thay đổi từ khóa hoặc
                        bộ lọc trạng thái.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================
          MODAL
      =================================================== */}

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]">
          <div
            className="absolute inset-0"
            onClick={handleCloseModal}
          />

          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ScanFace className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {modalMode === "register"
                      ? selectedEmployeeId === null
                        ? "Đăng ký Face ID — Chọn nhân viên"
                        : "Đăng ký Face ID"
                      : modalMode === "update"
                      ? "Cập nhật Face ID"
                      : "Thông tin Face ID"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {modalMode === "info"
                      ? "Dữ liệu khuôn mặt đã đăng ký trên hệ thống."
                      : selectedEmployeeId === null
                      ? "Chọn nhân viên từ danh sách để bắt đầu lấy mẫu khuôn mặt."
                      : "Upload tối đa 9 ảnh khuôn mặt để hệ thống nhận diện."}
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

            {modalMode === "info" ? (
              /* =======================================================
                 INFO MODAL VIEW
              ======================================================= */
              <div>
                <div className="max-h-[75vh] space-y-6 overflow-y-auto px-6 py-6">
                  {/* EMPLOYEE INFO */}
                  {selectedEmployee && (
                    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                      {getEmployeeAvatar(selectedEmployee) ? (
                        <img
                          src={getEmployeeAvatar(selectedEmployee)}
                          alt={getEmployeeName(selectedEmployee)}
                          className="h-14 w-14 rounded-2xl border border-white object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-blue-500 shadow-sm">
                          <UserRound className="h-6 w-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="text-base font-bold text-slate-800">
                          {getEmployeeName(selectedEmployee)}
                        </div>
                        <div className="text-sm font-medium text-slate-400 mt-0.5">
                          Mã nhân viên: {getEmployeeCode(selectedEmployee)}
                        </div>
                      </div>

                      <div className={cn(
                        "rounded-full border px-3 py-1 text-xs font-bold shadow-sm",
                        selectedFaceQuery.data && selectedFaceQuery.data.length > 0
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                          : "text-amber-600 bg-amber-50 border-amber-100"
                      )}>
                        {selectedFaceQuery.data && selectedFaceQuery.data.length > 0
                          ? "Đã đăng ký"
                          : "Chưa đăng ký"}
                      </div>
                    </div>
                  )}

                  {/* IMAGES GRID */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Ảnh khuôn mặt đã đăng ký
                      </h3>
                      {selectedFaceQuery.data && selectedFaceQuery.data.length > 0 && (
                        <span className="text-xs font-semibold text-slate-500">
                          Tổng số: {selectedFaceQuery.data.length} ảnh
                        </span>
                      )}
                    </div>

                    {selectedFaceQuery.isLoading ? (
                      <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tải ảnh khuôn mặt...
                      </div>
                    ) : selectedFaceQuery.data && selectedFaceQuery.data.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {selectedFaceQuery.data.map((image, index) => (
                          <div
                            key={image.id}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                          >
                            <img
                              src={image.imageUrl}
                              alt={`Face ${index + 1}`}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                              #{index + 1}
                            </div>
                            {image.createdAt && (
                              <div className="absolute bottom-2 left-2 right-2 rounded-md bg-black/60 p-1 text-[9px] font-medium text-white backdrop-blur-sm truncate" title={new Date(image.createdAt).toLocaleString("vi-VN")}>
                                {new Date(image.createdAt).toLocaleDateString("vi-VN")}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-slate-400">
                        <ScanFace className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                        Chưa có dữ liệu hình ảnh khuôn mặt trên hệ thống.
                      </div>
                    )}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Đóng
                  </button>

                  {selectedFaceQuery.data && selectedFaceQuery.data.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedEmployeeId) {
                          handleOpenUpdate(selectedEmployeeId);
                        }
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Cập nhật Face ID
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedEmployeeId) {
                          handleOpenRegister(selectedEmployeeId);
                        }
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                      <ScanFace className="h-4 w-4" />
                      Đăng ký Face ID
                    </button>
                  )}
                </div>
              </div>
            ) : modalMode === "register" && selectedEmployeeId === null ? (
              /* =======================================================
                 SELECT EMPLOYEE STEP (Header Register Flow)
              ======================================================= */
              <div>
                <div className="space-y-5 px-6 py-6">
                  <FormField
                    label="Nhân viên đăng ký Face ID"
                    required
                    icon={<UserRound className="h-4 w-4" />}
                  >
                    <div className="relative">
                      <select
                        value={form.employeeId}
                        onChange={(event) => {
                          const val = event.target.value;
                          setForm((prev) => ({
                            ...prev,
                            employeeId: val,
                          }));
                        }}
                        className={cn(inputClass, "appearance-none pr-10")}
                      >
                        <option value="">Chọn nhân viên</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {getEmployeeName(employee)} — {getEmployeeCode(employee)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </FormField>

                  {selectedEmployee && (
                    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                      {getEmployeeAvatar(selectedEmployee) ? (
                        <img
                          src={getEmployeeAvatar(selectedEmployee)}
                          alt={getEmployeeName(selectedEmployee)}
                          className="h-10 w-10 rounded-xl border border-white object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-500">
                          <UserRound className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800">
                          {getEmployeeName(selectedEmployee)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getEmployeeCode(selectedEmployee)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Hủy
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!form.employeeId) {
                        toast.error("Vui lòng chọn nhân viên.");
                        return;
                      }
                      setSelectedEmployeeId(form.employeeId);
                    }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            ) : (
              /* =======================================================
                 FORM STEP (Register / Update fields)
              ======================================================= */
              <form onSubmit={handleSubmit}>
                <div className="max-h-[75vh] space-y-5 overflow-y-auto px-6 py-6">
                  {/* EMPLOYEE & DEVICE */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      label="Nhân viên"
                      required
                      icon={<UserRound className="h-4 w-4" />}
                    >
                      <div className="relative">
                        <select
                          value={form.employeeId}
                          disabled={
                            modalMode === "update" || selectedEmployeeId !== null
                          }
                          onChange={(event) => {
                            const employeeId = event.target.value;
                            setSelectedEmployeeId(employeeId || null);
                            setForm((prev) => ({
                              ...prev,
                              employeeId,
                            }));
                          }}
                          className={cn(
                            inputClass,
                            "appearance-none pr-10",
                            (modalMode === "update" || selectedEmployeeId !== null) &&
                              "cursor-not-allowed bg-slate-50 text-slate-400",
                          )}
                        >
                          <option value="">Chọn nhân viên</option>
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {getEmployeeName(employee)} — {getEmployeeCode(employee)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </FormField>

                    {/* DEVICE */}
                    <FormField
                      label="Thiết bị lấy mẫu"
                      required
                      icon={<Cpu className="h-4 w-4" />}
                    >
                      <div className="relative">
                        <select
                          value={form.deviceId}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              deviceId: event.target.value,
                            }))
                          }
                          className={cn(inputClass, "appearance-none pr-10")}
                        >
                          <option value="">Chọn thiết bị</option>
                          {devices.map((device) => (
                            <option key={device.id} value={device.id}>
                              {device.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </FormField>
                  </div>

                  {/* SELECTED EMPLOYEE BANNER */}
                  {selectedEmployee && (
                    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                      {getEmployeeAvatar(selectedEmployee) ? (
                        <img
                          src={getEmployeeAvatar(selectedEmployee)}
                          alt={getEmployeeName(selectedEmployee)}
                          className="h-10 w-10 rounded-xl border border-white object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-500">
                          <UserRound className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800">
                          {getEmployeeName(selectedEmployee)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getEmployeeCode(selectedEmployee)}
                        </div>
                      </div>
                      <div className="ml-auto rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-blue-600">
                        Đối tượng nhận diện
                      </div>
                    </div>
                  )}

                  {/* EXISTING IMAGES LOADING (Update mode) */}
                  {modalMode === "update" && selectedFaceQuery.isLoading && (
                    <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải dữ liệu khuôn mặt...
                    </div>
                  )}

                  {/* CAMERA / UPLOAD SECTION */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <ScanFace className="h-4 w-4 text-slate-400" />
                        Dữ liệu khuôn mặt
                        <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-medium text-slate-400">
                        {form.previews.length}/{MAX_FACE_IMAGES} ảnh
                      </span>
                    </div>

                    {isCameraOpen ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                        <div className="relative aspect-video">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full object-cover"
                          />
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="relative h-[70%] w-[42%] rounded-[45%] border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]">
                              <div className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                                Đưa khuôn mặt vào khung
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-10">
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="h-10 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                            >
                              Hủy camera
                            </button>
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white/40 bg-white text-slate-800 shadow-lg transition hover:scale-105"
                            >
                              <Camera className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {form.previews.length > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-slate-700">
                                  Ảnh đã chọn
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                  Kiểm tra ảnh trước khi đăng ký
                                </p>
                              </div>
                              <div
                                className={cn(
                                  "rounded-full px-2.5 py-1 text-[11px] font-bold",
                                  form.previews.length >= MAX_FACE_IMAGES
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-blue-50 text-blue-600",
                                )}
                              >
                                {form.previews.length}/{MAX_FACE_IMAGES}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                              {form.previews.map((preview, index) => {
                                const isNewImage = preview.startsWith("blob:");
                                return (
                                  <div
                                    key={`${preview}-${index}`}
                                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                                  >
                                    <img
                                      src={preview}
                                      alt={`Face ${index + 1}`}
                                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                                      #{index + 1}
                                    </div>
                                    <div
                                      className={cn(
                                        "absolute bottom-2 left-2 rounded-md px-1.5 py-1 text-[9px] font-semibold text-white backdrop-blur-sm",
                                        isNewImage ? "bg-blue-600/80" : "bg-slate-900/70",
                                      )}
                                    >
                                      {isNewImage ? "Ảnh mới" : "Ảnh hiện tại"}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePreview(index)}
                                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-500 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                                      title="Xóa ảnh"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                );
                              })}

                              {form.previews.length < MAX_FACE_IMAGES && (
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="group flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-blue-300 hover:bg-blue-50"
                                >
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:text-blue-500">
                                    <ImagePlus className="h-5 w-5" />
                                  </div>
                                  <span className="mt-2 text-[10px] font-semibold text-slate-400 group-hover:text-blue-500">
                                    Thêm ảnh
                                  </span>
                                  <span className="mt-0.5 text-[9px] text-slate-300">
                                    Còn {MAX_FACE_IMAGES - form.previews.length}
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8">
                            <div className="flex flex-col items-center text-center">
                              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                <ScanFace className="h-7 w-7" />
                              </div>
                              <h3 className="text-sm font-semibold text-slate-700">
                                Chưa có dữ liệu khuôn mặt
                              </h3>
                              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                                Chụp trực tiếp bằng camera hoặc tải tối đa 9 ảnh khuôn mặt của nhân viên.
                              </p>
                              <div className="mt-5 flex flex-wrap justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={startCamera}
                                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                                >
                                  <Camera className="h-4 w-4" />
                                  Mở camera
                                </button>
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                  <Upload className="h-4 w-4" />
                                  Tải ảnh lên
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        handleUploadImages(event.target.files);
                        event.target.value = "";
                      }}
                    />

                    <p className="text-[11px] leading-5 text-slate-400">
                      Khuyến nghị sử dụng nhiều góc khuôn mặt khác nhau, đủ ánh sáng, không đeo khẩu trang hoặc che khuất khuôn mặt. Mỗi ảnh tối đa 5MB.
                    </p>
                  </div>

                  {/* SUBMIT ERROR DISPLAY */}
                  {submitError && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* AI INFO */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-700">
                          Dữ liệu sẽ được xử lý bởi AI backend
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-slate-400">
                          Sau khi upload, backend sẽ lưu các ảnh khuôn mặt và thực hiện xử lý embedding theo pipeline AI của hệ thống. Frontend không tự giả lập độ chính xác.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={uploadMutation.isPending}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    disabled={
                      uploadMutation.isPending ||
                      !form.employeeId ||
                      !form.deviceId
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang upload...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        {modalMode === "register" ? "Đăng ký Face ID" : "Cập nhật Face ID"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
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
