// lib/api.ts
import axios, { type AxiosRequestConfig } from "axios";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(async (config) => {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await axiosInstance.get<ApiResponse<T>>(url, config);

    return data.data;
  },

  post: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const { data } = await axiosInstance.post<ApiResponse<T>>(
      url,
      body,
      config,
    );

    return data.data;
  },

  put: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const { data } = await axiosInstance.put<ApiResponse<T>>(url, body, config);

    return data.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await axiosInstance.delete<ApiResponse<T>>(url, config);

    return data.data;
  },
};
