"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";

export interface UploadResponse {
  data: {
    url: string;
    key: string;
  };
  success: boolean;
}

export function useUploadMultipleImages() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const uploadPromises = files.map(async (file) => {
        try {
          // 1. Get presigned URL
          const { data: presignData } = await apiClient.post("/upload/presign", {
            filename: file.name,
            contentType: file.type || "image/jpeg",
          });

          const { presignedUrl, key, publicUrl } = presignData;

          // 2. Upload to R2
          await axios.put(presignedUrl, file, {
            headers: { "Content-Type": file.type || "image/jpeg" },
            withCredentials: false,
          });

          return {
            success: true,
            data: {
              url: publicUrl,
              key: key,
            },
          } as UploadResponse;
        } catch (error) {
          console.error(`Upload failed for ${file.name}:`, error);
          throw error;
        }
      });

      return Promise.all(uploadPromises);
    },
    onError: (error) => {
      toast.error("Some images failed to upload. Please try again.");
    },
  });
}
