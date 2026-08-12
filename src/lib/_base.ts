// import type { AxiosInstance, AxiosRequestConfig } from "axios";

// export async function apiGet<T>(client: AxiosInstance, url: string, config?: AxiosRequestConfig) {
//   const res = await client.get<T>(url, config);
//   return res.data;
// }

// export async function apiPost<T>(
//   client: AxiosInstance,
//   url: string,
//   body?: unknown,
//   config?: AxiosRequestConfig,
// ) {
//   const res = await client.post<T>(url, body, config);
//   return res.data;
// }

// export async function apiPut<T>(
//   client: AxiosInstance,
//   url: string,
//   body?: unknown,
//   config?: AxiosRequestConfig,
// ) {
//   const res = await client.put<T>(url, body, config);
//   return res.data;
// }

// export async function apiDelete<T>(
//   client: AxiosInstance,
//   url: string,
//   config?: AxiosRequestConfig,
// ) {
//   const res = await client.delete<T>(url, config);
//   return res.data;
// }



import type {
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";

export async function apiGet<T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await client.get<T>(
    url,
    config,
  );

  return res.data;
}

export async function apiPost<T>(
  client: AxiosInstance,
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await client.post<T>(
    url,
    body,
    config,
  );

  return res.data;
}

export async function apiPut<T>(
  client: AxiosInstance,
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await client.put<T>(
    url,
    body,
    config,
  );

  return res.data;
}

export async function apiDelete<T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await client.delete<T>(
    url,
    config,
  );

  return res.data;
}
