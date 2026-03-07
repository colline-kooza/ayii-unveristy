"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// ── Current user profile ──────────────────
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const { data } = await apiClient.get("/users/me");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — profile doesn't change often
  });
}

// ── Sign in ───────────────────────────────
export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: {
      identifier: string;
      password: string;
    }) => {
      // Better Auth sign-in endpoint
      const { data } = await apiClient.post("/auth/sign-in/email", {
        email: credentials.identifier, // auth.ts hook handles reg number → email swap
        password: credentials.password,
        rememberMe: true,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      const role = data?.user?.role;
      const isTemp = data?.user?.isTemporaryPassword;

      if (isTemp) {
        router.push("/change-password");
        return;
      }
      // Redirect to /dashboard which will then redirect based on role
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("Sign in failed", { description: getErrorMessage(error) });
    },
  });
}

// ── Sign out ──────────────────────────────
export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to sign out");
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/auth/sign-in");
    },
    onError: () => {
      // Force redirect even if request fails
      queryClient.clear();
      router.push("/auth/sign-in");
    },
  });
}

// ── Update profile ────────────────────────
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      name?: string;
      email?: string;
      department?: string;
    }) => {
      const { data } = await apiClient.patch("/users/me", updates);
      return data;
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.me });
      const previous = queryClient.getQueryData(queryKeys.me);
      queryClient.setQueryData(queryKeys.me, (old: any) => ({
        ...old,
        ...updates,
      }));
      return { previous };
    },
    onSuccess: () => toast.success("Profile updated successfully"),
    onError: (error, _, ctx) => {
      queryClient.setQueryData(queryKeys.me, ctx?.previous);
      toast.error("Update failed", { description: getErrorMessage(error) });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

// ── Change password ───────────────────────
export function useChangePassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const { data } = await apiClient.patch("/users/me/password", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("Password change failed", {
        description: getErrorMessage(error),
      });
    },
  });
}

// ── Reset password (OTP flow) ─────────────
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (identifier: string) => {
      const { data } = await apiClient.post("/auth/reset-password", {
        identifier,
      });
      return data;
    },
    onSuccess: () => toast.success("OTP sent to your email address"),
    onError: (error) =>
      toast.error("Request failed", { description: getErrorMessage(error) }),
  });
}

export function useVerifyPasswordReset() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: {
      identifier: string;
      otp: string;
      newPassword: string;
    }) => {
      const { data } = await apiClient.post(
        "/auth/reset-password/verify",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully. Please log in.");
      router.push("/auth/sign-in");
    },
    onError: (error) =>
      toast.error("Reset failed", { description: getErrorMessage(error) }),
  });
}
