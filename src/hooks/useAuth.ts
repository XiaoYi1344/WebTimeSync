"use client";

import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import type { AxiosRequestConfig } from "axios";

import {
  login,
  logout,
  getAccessToken,
  getCurrentEmployee,
  removeAccessToken,
  removeCurrentEmployee,
  type Employee,
  type LoginRequest,
  type LoginResponse,
} from "@/api/auth";

interface AuthState {
  employee: Employee | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  hydrate: () => void;

  setAuth: (response: LoginResponse) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  employee: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrate: () => {
    const accessToken = getAccessToken();
    const employee = getCurrentEmployee();

    set({
      accessToken,
      employee,
      isAuthenticated: Boolean(accessToken),
      isHydrated: true,
    });
  },

  setAuth: (response) => {
    set({
      accessToken: response.accessToken,
      employee: response.employee,
      isAuthenticated: true,
      isHydrated: true,
    });
  },

  clearAuth: () => {
    removeAccessToken();
    removeCurrentEmployee();

    set({
      accessToken: null,
      employee: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  },
}));

/**
 * Auth hook dùng React Query cho mutation
 * và Zustand cho global auth state.
 */
export function useAuth() {
  const employee = useAuthStore((state) => state.employee);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const hydrate = useAuthStore((state) => state.hydrate);

  const loginMutation = useMutation({
    mutationFn: ({
      data,
      config,
    }: {
      data: LoginRequest;
      config?: AxiosRequestConfig;
    }) => login(data, config),

    onSuccess: (response) => {
      setAuth(response);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: (config?: AxiosRequestConfig) => logout(config),

    onSettled: () => {
      clearAuth();
    },
  });

  return {
    employee,
    accessToken,
    isAuthenticated,
    isHydrated,

    hydrate,

    login: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    logout: logoutMutation.mutateAsync,
    isLogoutLoading: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    clearAuth,
  };
}
