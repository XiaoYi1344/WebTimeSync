"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  employeeApi,
  type CreateEmployeeRequest,
  type UpdateEmployeeRequest,
} from "@/api/employee";

import type { Employee } from "@/api/auth";

import {
  getEmployeeFaceImages,
  uploadEmployeeFaceImages,
  type EmployeeFaceImage,
} from "@/api/file";

/* =========================================================
 * Query Keys
 * ======================================================= */

export const employeeKeys = {
  all: ["employees"] as const,

  lists: () => [...employeeKeys.all, "list"] as const,

  list: (params?: unknown) =>
    [...employeeKeys.lists(), params] as const,

  details: () => [...employeeKeys.all, "detail"] as const,

  detail: (id: number | string) =>
    [...employeeKeys.details(), id] as const,

  faceImages: (employeeId: number | string) =>
    [...employeeKeys.all, "face-images", employeeId] as const,
};

/* =========================================================
 * GET EMPLOYEES
 * ======================================================= */

export function useEmployees(
  options?: Omit<
    UseQueryOptions<
      Employee[],
      Error,
      Employee[],
      ReturnType<typeof employeeKeys.lists>
    >,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    ...options,

    queryKey: employeeKeys.lists(),

    queryFn: () => employeeApi.getEmployees(),

    staleTime: 30_000,
  });
}

/* =========================================================
 * GET EMPLOYEE
 * ======================================================= */

export function useEmployee(
  id: number | string | null | undefined,
  options?: Omit<
    UseQueryOptions<
      Employee,
      Error,
      Employee,
      ReturnType<typeof employeeKeys.detail>
    >,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    ...options,

    queryKey:
      id !== null && id !== undefined
        ? employeeKeys.detail(id)
        : employeeKeys.detail("unknown"),

    queryFn: () => employeeApi.getEmployee(id!),

    enabled:
      id !== null &&
      id !== undefined &&
      (options?.enabled ?? true),

    staleTime: 30_000,
  });
}

/* =========================================================
 * CREATE EMPLOYEE
 * ======================================================= */

export function useCreateEmployee(
  options?: UseMutationOptions<
    Employee,
    Error,
    CreateEmployeeRequest
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: (data) =>
      employeeApi.createEmployee(data),

    onSuccess: async (
      employee,
      variables,
      onMutateResult,
      context,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });

      await options?.onSuccess?.(
        employee,
        variables,
        onMutateResult,
        context,
      );
    },
  });
}

/* =========================================================
 * UPDATE EMPLOYEE
 * ======================================================= */

export interface UpdateEmployeeVariables {
  id: number | string;
  data: UpdateEmployeeRequest;
}

export function useUpdateEmployee(
  options?: UseMutationOptions<
    Employee,
    Error,
    UpdateEmployeeVariables
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: ({ id, data }) =>
      employeeApi.updateEmployee(id, data),

    onSuccess: async (
      employee,
      variables,
      onMutateResult,
      context,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: employeeKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: employeeKeys.detail(
            variables.id,
          ),
        }),
      ]);

      await options?.onSuccess?.(
        employee,
        variables,
        onMutateResult,
        context,
      );
    },
  });
}

/* =========================================================
 * DELETE EMPLOYEE
 * ======================================================= */

export function useDeleteEmployee(
  options?: UseMutationOptions<
    void,
    Error,
    number | string
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: (id) =>
      employeeApi.deleteEmployee(id),

    onSuccess: async (
      result,
      employeeId,
      onMutateResult,
      context,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: employeeKeys.lists(),
        }),

        queryClient.removeQueries({
          queryKey: employeeKeys.detail(
            employeeId,
          ),
        }),

        queryClient.removeQueries({
          queryKey: employeeKeys.faceImages(
            employeeId,
          ),
        }),
      ]);

      await options?.onSuccess?.(
        result,
        employeeId,
        onMutateResult,
        context,
      );
    },
  });
}

/* =========================================================
 * GET EMPLOYEE FACE IMAGES
 * ======================================================= */

export function useEmployeeFaceImages(
  employeeId: number | string | null | undefined,
  options?: Omit<
    UseQueryOptions<
      EmployeeFaceImage[],
      Error,
      EmployeeFaceImage[],
      ReturnType<typeof employeeKeys.faceImages>
    >,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    ...options,

    queryKey:
      employeeId !== null &&
      employeeId !== undefined
        ? employeeKeys.faceImages(employeeId)
        : employeeKeys.faceImages("unknown"),

    queryFn: () =>
      getEmployeeFaceImages(employeeId!),

    enabled:
      employeeId !== null &&
      employeeId !== undefined &&
      (options?.enabled ?? true),

    staleTime: 30_000,
  });
}

/* =========================================================
 * UPLOAD EMPLOYEE FACE IMAGES
 * ======================================================= */

export interface UploadEmployeeFaceImagesVariables {
  employeeId: number | string;
  files: File[];
}

export function useUploadEmployeeFaceImages(
  options?: UseMutationOptions<
    EmployeeFaceImage[],
    Error,
    UploadEmployeeFaceImagesVariables
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: ({ employeeId, files }) =>
      uploadEmployeeFaceImages(
        employeeId,
        files,
      ),

    onSuccess: async (
      images,
      variables,
      onMutateResult,
      context,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: employeeKeys.faceImages(
          variables.employeeId,
        ),
      });

      await options?.onSuccess?.(
        images,
        variables,
        onMutateResult,
        context,
      );
    },
  });
}
