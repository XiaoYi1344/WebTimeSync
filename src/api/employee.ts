import type { AxiosRequestConfig } from "axios";

import API from "@/lib/axios";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from "@/lib/_base";

import { getAccessToken } from "./auth";
import type { Employee } from "./auth";

export interface CreateEmployeeRequest {
  username: string;
  password: string;
  fullname: string;
  phone: string;
  dob: string;
  avatarUrl?: string | null;
  workDate: string;
  departmentName: string;
}

export interface UpdateEmployeeRequest {
  username?: string;
  password?: string;
  fullname?: string;
  phone?: string;
  dob?: string;
  avatarUrl?: string | null;
  workDate?: string;
  departmentName?: string;
}

function authConfig(
  config?: AxiosRequestConfig,
): AxiosRequestConfig {
  const token = getAccessToken();

  return {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  };
}

/**
 * GET /admin/employee
 */
export async function getEmployees(
  config?: AxiosRequestConfig,
): Promise<Employee[]> {
  return apiGet<Employee[]>(
    API,
    "/admin/employee",
    authConfig(config),
  );
}

/**
 * GET /admin/employee/:id
 */
export async function getEmployee(
  id: number | string,
  config?: AxiosRequestConfig,
): Promise<Employee> {
  return apiGet<Employee>(
    API,
    `/admin/employee/${id}`,
    authConfig(config),
  );
}

/**
 * POST /admin/employee
 */
export async function createEmployee(
  data: CreateEmployeeRequest,
  config?: AxiosRequestConfig,
): Promise<Employee> {
  return apiPost<Employee>(
    API,
    "/admin/employee",
    data,
    authConfig(config),
  );
}

/**
 * PUT /admin/employee/:id
 */
export async function updateEmployee(
  id: number | string,
  data: UpdateEmployeeRequest,
  config?: AxiosRequestConfig,
): Promise<Employee> {
  return apiPut<Employee>(
    API,
    `/admin/employee/${id}`,
    data,
    authConfig(config),
  );
}

/**
 * DELETE /admin/employee/:id
 */
export async function deleteEmployee(
  id: number | string,
  config?: AxiosRequestConfig,
): Promise<void> {
  return apiDelete<void>(
    API,
    `/admin/employee/${id}`,
    authConfig(config),
  );
}

export const employeeApi = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};