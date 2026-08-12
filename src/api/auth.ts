// import type { AxiosRequestConfig } from "axios";
// import API from "@/lib/axios";
// import { apiPost } from "@/lib/_base";

// export interface Employee {
//   id: number;
//   username: string;
//   fullname: string;
//   phone: string;
//   dob: string;
//   avatarUrl: string;
//   workDate: string;
//   departmentName: string;
//   role: string;
//   createdAt: string;
// }

// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// export interface LoginResponse {
//   accessToken: string;
//   tokenType: string;
//   employee: Employee;
// }

// export interface RefreshResponse {
//   accessToken?: string;
//   tokenType?: string;
// }

// const ACCESS_TOKEN_KEY = "accessToken";
// const EMPLOYEE_KEY = "employee";

// /**
//  * Tạm thời lưu access token ở localStorage.
//  * Sau này có thể chuyển sang httpOnly cookie mà không cần
//  * thay đổi các service employee.
//  */
// export function getAccessToken(): string | null {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   return localStorage.getItem(ACCESS_TOKEN_KEY);
// }

// export function setAccessToken(token: string): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   localStorage.setItem(ACCESS_TOKEN_KEY, token);
// }

// export function removeAccessToken(): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   localStorage.removeItem(ACCESS_TOKEN_KEY);
// }

// export function getCurrentEmployee(): Employee | null {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   const employee = localStorage.getItem(EMPLOYEE_KEY);

//   if (!employee) {
//     return null;
//   }

//   try {
//     return JSON.parse(employee) as Employee;
//   } catch {
//     return null;
//   }
// }

// export function setCurrentEmployee(employee: Employee): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));
// }

// export function removeCurrentEmployee(): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   localStorage.removeItem(EMPLOYEE_KEY);
// }

// export async function login(
//   data: LoginRequest,
//   config?: AxiosRequestConfig,
// ): Promise<LoginResponse> {
//   const response = await apiPost<LoginResponse>(
//     API,
//     "/auth/login",
//     data,
//     config,
//   );

//   // Tạm thời lưu token để các API admin sử dụng.
//   setAccessToken(response.accessToken);

//   // Lưu thông tin employee hiện tại.
//   setCurrentEmployee(response.employee);

//   return response;
// }

// export async function logout(
//   config?: AxiosRequestConfig,
// ): Promise<void> {
//   try {
//     await apiPost(
//       API,
//       "/admin/auth/logout",
//       {},
//       {
//         ...config,
//         withCredentials: false,
//       },
//     );
//   } finally {
//     removeAccessToken();
//     removeCurrentEmployee();
//   }
// }

// export async function refreshToken(): Promise<RefreshResponse> {
//   const response = await apiPost<RefreshResponse>(
//     API,
//     "/admin/auth/refresh-token",
//     {},
//     {
//       withCredentials: false,
//     },
//   );

//   if (response.accessToken) {
//     setAccessToken(response.accessToken);
//   }

//   return response;
// }

// export function clearAuth(): void {
//   removeAccessToken();
//   removeCurrentEmployee();
// }
import type { AxiosRequestConfig } from "axios";

import API from "@/lib/axios";
import { apiPost } from "@/lib/_base";

/* =========================================================
   TYPES
========================================================= */

export type UserRole = "admin" | "user";

export interface Employee {
  id: number;
  username: string;
  fullname: string;
  phone: string;
  dob: string;
  avatarUrl: string;
  workDate: string;
  departmentName: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  employee: Employee;
}

export interface RefreshResponse {
  accessToken?: string;
  tokenType?: string;
}

/* =========================================================
   STORAGE
========================================================= */

const ACCESS_TOKEN_KEY = "accessToken";
const EMPLOYEE_KEY = "employee";

/* =========================================================
   ACCESS TOKEN
========================================================= */

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/* =========================================================
   EMPLOYEE
========================================================= */

export function getCurrentEmployee(): Employee | null {
  if (typeof window === "undefined") {
    return null;
  }

  const employee = localStorage.getItem(EMPLOYEE_KEY);

  if (!employee) {
    return null;
  }

  try {
    return JSON.parse(employee) as Employee;
  } catch {
    return null;
  }
}

export function setCurrentEmployee(employee: Employee): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));
}

export function removeCurrentEmployee(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(EMPLOYEE_KEY);
}

/* =========================================================
   LOGIN
========================================================= */

export async function login(
  data: LoginRequest,
  config?: AxiosRequestConfig,
): Promise<LoginResponse> {
  const response = await apiPost<LoginResponse>(API, "/auth/login", data, {
    ...config,
    withCredentials: false,
  });

  setAccessToken(response.accessToken);

  setCurrentEmployee(response.employee);

  return response;
}

/* =========================================================
   LOGOUT
========================================================= */

export async function logout(config?: AxiosRequestConfig): Promise<void> {
  try {
    await apiPost(
      API,
      "/admin/auth/logout",
      {},
      {
        ...config,
        withCredentials: false,
      },
    );
  } finally {
    removeAccessToken();
    removeCurrentEmployee();
  }
}

/* =========================================================
   REFRESH TOKEN
========================================================= */

export async function refreshToken(): Promise<RefreshResponse> {
  const response = await apiPost<RefreshResponse>(
    API,
    "/admin/auth/refresh-token",
    {},
    {
      withCredentials: false,
    },
  );

  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }

  return response;
}

/* =========================================================
   CLEAR AUTH
========================================================= */

export function clearAuth(): void {
  removeAccessToken();
  removeCurrentEmployee();
}
