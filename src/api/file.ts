import type { AxiosRequestConfig } from "axios";

import API from "@/lib/axios";
import { apiGet, apiPost } from "@/lib/_base";
import { getAccessToken } from "./auth";

export interface EmployeeFaceImage {
  id: number;
  employeeId: number;
  imageUrl: string;
  createdAt?: string;
}

export interface FaceImagesResponse {
  images: EmployeeFaceImage[];
}

/**
 * POST /admin/employee/face-images/:employeeId
 *
 * Upload tối đa 9 ảnh khuôn mặt cho employee.
 *
 * Field FormData: files
 */
export async function uploadEmployeeFaceImages(
  employeeId: number | string,
  files: File[],
  config?: AxiosRequestConfig,
): Promise<EmployeeFaceImage[]> {
  if (files.length === 0) {
    throw new Error("Vui lòng chọn ít nhất 1 ảnh.");
  }

  if (files.length > 9) {
    throw new Error("Chỉ được upload tối đa 9 ảnh.");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const token = getAccessToken();

  const response = await apiPost<EmployeeFaceImage[]>(
    API,
    `/admin/employee/face-images/${employeeId}`,
    formData,
    {
      ...config,
      headers: {
        ...(config?.headers ?? {}),
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        // Không set Content-Type.
        // Axios sẽ tự thêm multipart/form-data + boundary.
      },
    },
  );

  return response;
}

/**
 * GET /admin/employee/face-images/:employeeId
 */
export async function getEmployeeFaceImages(
  employeeId: number | string,
  config?: AxiosRequestConfig,
): Promise<EmployeeFaceImage[]> {
  const token = getAccessToken();

  return apiGet<EmployeeFaceImage[]>(
    API,
    `/admin/employee/face-images/${employeeId}`,
    {
      ...config,
      headers: {
        ...(config?.headers ?? {}),
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    },
  );
}