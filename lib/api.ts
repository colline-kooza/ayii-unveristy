import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{ error?: string; issues?: Record<string, string[]> }>,
  ) => {
    const status = error.response?.status;
    const message = error.response?.data?.error;

    if (status === 401) {
      if (error.config?.url === "/users/me") {
        return Promise.reject(error);
      }
      
      // Not authenticated → redirect to sign-in
      if (typeof window !== "undefined") {
        window.location.href = "/auth/sign-in";
      }
      return Promise.reject(error);
    }

    if (status === 403) {
      const isSuspended = message?.toLowerCase().includes("suspend");
      if (isSuspended && typeof window !== "undefined") {
        window.location.href = "/auth/sign-in?suspended=true";
      }
      return Promise.reject(error);
    }

    if (status === 422) {
      // Validation errors are handled per-form via useFormErrors helper
      return Promise.reject(error);
    }

    if (status === 409) {
      // Conflict errors handled per-mutation
      return Promise.reject(error);
    }

    if (status && status >= 500) {
      toast.error("Something went wrong. Please try again.");
    }

    return Promise.reject(error);
  },
);

// Helper to extract error message from AxiosError
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.error ??
      error.message ??
      "An unexpected error occurred"
    );
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

// Helper to extract Zod validation issues
export function getValidationErrors(
  error: unknown,
): Record<string, string[]> | null {
  if (error instanceof AxiosError && error.response?.status === 422) {
    return error.response.data?.issues ?? null;
  }
  return null;
}
