// import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

// const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// if (!baseURL) {
//   console.warn("Missing NEXT_PUBLIC_API_ENDPOINT");
// }

// export const API = axios.create({
//   baseURL: baseURL || "",
//   timeout: 20_000,
//   withCredentials: false,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// type RetryRequestConfig = InternalAxiosRequestConfig & {
//   _retry?: boolean;
// };

// let isRefreshing = false;
// let refreshPromise: Promise<AxiosResponse> | null = null;

// function redirectToSignIn() {
//   if (typeof window === "undefined") return;

//   const pathname = window.location.pathname || "/dashboard";

//   if (pathname.startsWith("/sign-in")) return;

//   window.location.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
// }

// function isAuthEndpoint(url?: string) {
//   if (!url) return false;

//   return (
//     url.includes("/admin/auth/login") ||
//     url.includes("/admin/auth/logout") ||
//     url.includes("/admin/auth/refresh-token")
//   );
// }

// API.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as RetryRequestConfig | undefined;

//     if (!originalRequest) {
//       return Promise.reject(error);
//     }

//     const status = error.response?.status;
//     const url = originalRequest.url;

//     if (
//       status !== 401 ||
//       originalRequest._retry ||
//       isAuthEndpoint(url) ||
//       typeof window === "undefined"
//     ) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     try {
//       if (!isRefreshing) {
//         isRefreshing = true;

//         refreshPromise = API.post(
//           "/admin/auth/refresh-token",
//           {},
//           {
//             withCredentials: false,
//           },
//         ).finally(() => {
//           isRefreshing = false;
//           refreshPromise = null;
//         });
//       }

//       await refreshPromise;

//       return API(originalRequest);
//     } catch (refreshError) {
//       redirectToSignIn();
//       return Promise.reject(refreshError);
//     }
//   },
// );

// export default API;

import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

if (!baseURL) {
  console.warn("Missing NEXT_PUBLIC_API_ENDPOINT");
}

export const API = axios.create({
  baseURL: baseURL || "",
  timeout: 20_000,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    // "Content-Type": "application/json",
  },
});

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;

let refreshPromise: Promise<AxiosResponse> | null = null;

function redirectToSignIn() {
  if (typeof window === "undefined") {
    return;
  }

  const pathname = window.location.pathname || "/dashboard";

  if (pathname.startsWith("/sign-in")) {
    return;
  }

  window.location.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
}

function isAuthEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/logout") ||
    url.includes("/auth/refresh-token")
  );
}

API.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const url = originalRequest.url;

    /**
     * Chỉ xử lý 401.
     */
    if (
      status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint(url) ||
      typeof window === "undefined"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      /**
       * Nếu chưa có request refresh,
       * tạo một request mới.
       *
       * Nếu nhiều API cùng 401,
       * tất cả sẽ dùng chung promise này.
       */
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = API.post(
          "/admin/auth/refresh-token",
          {},
          {
            withCredentials: false,
          },
        ).finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      await refreshPromise;

      /**
       * Refresh thành công
       * → gọi lại request cũ.
       */
      return API(originalRequest);
    } catch (refreshError) {
      /**
       * Refresh thất bại
       * → về trang đăng nhập.
       */
      redirectToSignIn();

      return Promise.reject(refreshError);
    }
  },
);

export default API;
