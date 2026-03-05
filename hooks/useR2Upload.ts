"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

type R2Folder =
  | "assignments"
  | "submissions"
  | "past-papers"
  | "journals"
  | "newspapers"
  | "avatars";

interface UploadResult {
  key: string;
  fileUrl: string;
}

export function useR2Upload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(
    async (file: File, folder: R2Folder): Promise<UploadResult> => {
      setIsUploading(true);
      setProgress(0);

      try {
        // Step 1: Get presigned URL
        const { data: presignData } = await apiClient.post("/upload/presign", {
          folder,
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        });

        const { presignedUrl, key } = presignData;

        // Step 2: Upload directly to R2 with progress tracking
        await axios.put(presignedUrl, file, {
          headers: { "Content-Type": file.type || "application/octet-stream" },
          withCredentials: false, // R2 presigned URLs don't need credentials
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
          },
        });

        setProgress(100);
        return { key, fileUrl: key }; // Return key, not presigned URL
      } catch (error) {
        toast.error("File upload failed. Please try again.");
        throw error;
      } finally {
        setIsUploading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [],
  );

  const getDownloadUrl = useCallback(async (key: string): Promise<string> => {
    const { data } = await apiClient.get(
      `/upload/download?key=${encodeURIComponent(key)}`,
    );
    return data.url;
  }, []);

  return { upload, getDownloadUrl, progress, isUploading };
}
