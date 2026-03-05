"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Camera,
  Check,
  AlertCircle,
  Loader2,
  File,
  FileText,
  Video,
  Music,
  FileImage,
} from "lucide-react";
import { cn } from "@/lib/utils";
// Note: Assuming types exist or will be handled. The user provided this code specifically.
// Adjusting imports based on typical project structure if needed, but keeping user code as base.
import { FileCategory, MediaType, type UploadedFile } from "@/types/files";
import {
  useCreateFile,
  useDeleteFile,
  useFileByUrl,
  useDeleteFileByUrl,
} from "@/hooks/use-files";
import {
  UploadedImageData,
  useImageUploadStore,
} from "@/store/image-upload-store";
import { toast } from "sonner";
// Removed next-intl as it's not configured in providers

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface R2ImageUploadProps {
  value: string | string[];
  onChange: (
    value: string | string[],
    file?: UploadedFile | UploadedFile[]
  ) => void;
  label?: string;
  className?: string;
  placeholder?: string;
  category?: string;
  description?: string;
  identifier: string;
  existingFileId?: string | string[];
  existingFileKey?: string | string[];
  variant?: "default" | "compact" | "minimal";
  multiple?: boolean;
  maxFiles?: number;
  acceptedTypes?: string;
}

interface FileData {
  url: string;
  fileId: string | null;
  fileKey: string | undefined;
  cloudflareId?: string;
  name?: string;
  type?: string;
  objectUrl?: string;
  uploading?: boolean;
  progress?: number;
}

export function R2ImageUpload({
  value,
  onChange,
  label,
  className,
  category = FileCategory.GALLERY,
  identifier,
  description,
  existingFileId,
  existingFileKey,
  variant = "default",
  multiple = false,
  maxFiles = 10,
  acceptedTypes = "image/*",
}: R2ImageUploadProps) {
  const isMultiple = multiple || category === FileCategory.GALLERY;
  const valueArray = Array.isArray(value) ? value : value ? [value] : [];
  // Removed next-intl usage

  const [uploadComplete, setUploadComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const {
    getUploadedImage,
    setUploadedImage,
    removeUploadedImage,
    updateImageData,
    clearExpiredImages,
    getUploadedImageArray,
    setUploadedImageArray,
    removeUploadedImageArray,
  } = useImageUploadStore();

  const createFile = useCreateFile();
  const deleteFile = useDeleteFile();
  const deleteFileByUrl = useDeleteFileByUrl();

  useEffect(() => {
    clearExpiredImages();
  }, [clearExpiredImages]);

  // Restore from localStorage on mount
  useEffect(() => {
    if (valueArray.length === 0 && identifier) {
      if (isMultiple) {
        const persistedImages = getUploadedImageArray(identifier);
        if (persistedImages && persistedImages.length > 0) {
          console.log("Restoring multiple from localStorage:", persistedImages);
          const urls = persistedImages.map((img: any) => img.url);
          const uploadedFiles = persistedImages
            .map((img: any) => img.uploadedFile)
            .filter(Boolean) as UploadedFile[];

          onChange(urls, uploadedFiles.length > 0 ? uploadedFiles : undefined);

          const restoredData = persistedImages.map((img: any) => ({
            url: img.url,
            fileId: img.fileId || null,
            fileKey: img.fileKey,
            cloudflareId: img.cloudflareId,
            name: img.uploadedFile?.name,
            type: img.uploadedFile?.type,
          }));
          setFilesData(restoredData);
        }
      } else {
        const persistedImage = getUploadedImage(identifier);
        if (persistedImage) {
          console.log("Restoring single from localStorage:", persistedImage);
          onChange(persistedImage.url, persistedImage.uploadedFile);
          setFilesData([
            {
              url: persistedImage.url,
              fileId: persistedImage.fileId || null,
              fileKey: persistedImage.fileKey,
              cloudflareId: persistedImage.cloudflareId,
              name: persistedImage.uploadedFile?.name,
              type: persistedImage.uploadedFile?.type,
            },
          ]);
        }
      }
    }
  }, [identifier, getUploadedImage, getUploadedImageArray, isMultiple]);

  // Initialize files data from existing values
  useEffect(() => {
    if (valueArray.length > 0 && filesData.length === 0) {
      const newFilesData = valueArray.map((url, index) => ({
        url,
        fileId: Array.isArray(existingFileId)
          ? existingFileId[index] || null
          : existingFileId || null,
        fileKey: Array.isArray(existingFileKey)
          ? existingFileKey[index]
          : existingFileKey,
      }));
      setFilesData(newFilesData);
    }
  }, [valueArray.length]);

  // Persist to localStorage whenever filesData changes
  useEffect(() => {
    if (filesData.length > 0 && identifier) {
      const completedFiles = filesData.filter((f) => !f.uploading);

      if (completedFiles.length > 0) {
        if (isMultiple) {
          const imageDataArray: UploadedImageData[] = completedFiles.map(
            (f) => ({
              url: f.url,
              fileId: f.fileId || undefined,
              fileKey: f.fileKey,
              cloudflareId: f.cloudflareId,
              uploadedFile: f.fileId
                ? {
                    url: f.url,
                    name: f.name || "",
                    type: f.type || "",
                    key: f.fileKey || "",
                    size: 0, // Size is not tracked in FileData, but required by UploadedFile
                  }
                : undefined,
              timestamp: Date.now(),
            })
          );
          setUploadedImageArray(identifier, imageDataArray);
        } else if (completedFiles[0]) {
          const imageData: UploadedImageData = {
            url: completedFiles[0].url,
            fileId: completedFiles[0].fileId || undefined,
            fileKey: completedFiles[0].fileKey,
            cloudflareId: completedFiles[0].cloudflareId,
            uploadedFile: {
              url: completedFiles[0].url,
              name: completedFiles[0].name || "",
              type: completedFiles[0].type || "",
              key: completedFiles[0].fileKey || "",
              size: 0, // Size is not tracked in FileData, but required by UploadedFile
            },
            timestamp: Date.now(),
          };
          setUploadedImage(identifier, imageData);
        }
      }
    } else if (filesData.length === 0 && identifier) {
      if (isMultiple) {
        removeUploadedImageArray(identifier);
      } else {
        removeUploadedImage(identifier);
      }
    }
  }, [
    filesData,
    identifier,
    isMultiple,
    setUploadedImage,
    removeUploadedImage,
    setUploadedImageArray,
    removeUploadedImageArray,
  ]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      filesData.forEach((file) => {
        if (file.objectUrl) {
          URL.revokeObjectURL(file.objectUrl);
        }
      });
    };
  }, [filesData]);

  const handleRemove = useCallback(
    async (index: number) => {
      if (deletingIndex !== null) return;

      setDeletingIndex(index);
      const fileData = filesData[index];

      // Revoke object URL if exists
      if (fileData.objectUrl) {
        URL.revokeObjectURL(fileData.objectUrl);
      }

      try {
        // Delete from Cloudflare if we have the ID
        if (fileData.cloudflareId) {
          try {
            const cloudflareResponse = await fetch(
              `${baseUrl}/api/images/delete`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageId: fileData.cloudflareId }),
              }
            );

            if (!cloudflareResponse.ok) {
              console.warn(
                "Failed to delete from Cloudflare:",
                fileData.cloudflareId
              );
            } else {
              console.log("Deleted from Cloudflare:", fileData.cloudflareId);
            }
          } catch (cfError) {
            console.error("Cloudflare deletion error:", cfError);
          }
        }

        // Delete from R2 using key
        if (fileData.fileKey) {
          try {
            const r2Response = await fetch("/api/r2/delete", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: fileData.fileKey }),
            });

            if (!r2Response.ok) {
              console.warn("Failed to delete from R2:", fileData.fileKey);
            } else {
              console.log("Deleted from R2:", fileData.fileKey);
            }
          } catch (r2Error) {
            console.error("R2 deletion error:", r2Error);
          }
        }

        // Delete from database
        if (fileData.fileId && fileData.fileKey) {
          await deleteFile.mutateAsync({
            fileId: fileData.fileId,
            key: fileData.fileKey,
          });
        } else if (fileData.url) {
          await deleteFileByUrl.mutateAsync(fileData.url);
        }

        // Update local state
        const newFilesData = filesData.filter((_, i) => i !== index);
        const newUrls = newFilesData
          .filter((f) => !f.uploading)
          .map((f) => f.url);

        setFilesData(newFilesData);

        if (isMultiple) {
          onChange(newUrls);
        } else {
          onChange("");
        }

        toast.success("File deleted successfully");
      } catch (error) {
        console.error("Failed to delete file:", error);
        toast.error("Failed to delete file completely, but removed from UI");

        // Still remove from UI even if backend fails
        const newFilesData = filesData.filter((_, i) => i !== index);
        const newUrls = newFilesData
          .filter((f) => !f.uploading)
          .map((f) => f.url);
        setFilesData(newFilesData);

        if (isMultiple) {
          onChange(newUrls);
        } else {
          onChange("");
        }
      } finally {
        setDeletingIndex(null);
      }
    },
    [
      filesData,
      deletingIndex,
      deleteFile,
      deleteFileByUrl,
      onChange,
      isMultiple,
    ]
  );

  const handleFileSelect = async (files: File[]) => {
    // Determine accepted file types based on category and acceptedTypes prop
    let isValid = (file: File) => true;

    if (category === FileCategory.DOCUMENT) {
      isValid = (file: File) => {
        const docTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
          "text/csv",
        ];
        return (
          docTypes.includes(file.type) || file.type.startsWith("application/")
        );
      };
    } else if (acceptedTypes === "image/*") {
      isValid = (file: File) => file.type.startsWith("image/");
    }

    const validFiles = files.filter(isValid);

    if (validFiles.length === 0) {
      toast.error(
        category === FileCategory.DOCUMENT
          ? "Please select valid document files"
          : "Please select valid files"
      );
      return;
    }

    // Check max files limit
    if (isMultiple && filesData.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // For single file mode, only take the first file
    const filesToProcess = isMultiple ? validFiles : [validFiles[0]];

    setIsUploading(true);
    setTotalToUpload(filesToProcess.length);
    setUploadingCount(0);

    // Add files with object URLs and uploading state
    const tempFilesData: FileData[] = filesToProcess.map((file) => ({
      url: "",
      fileId: null,
      fileKey: undefined,
      name: file.name,
      type: file.type,
      objectUrl: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
    }));

    setFilesData((prev) => [...prev, ...tempFilesData]);

    // Upload files one by one
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const tempIndex = filesData.length + i;

      setUploadingCount(i + 1);

      try {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name}: File must be less than 10MB`);
          // Remove the failed file
          setFilesData((prev) => prev.filter((_, idx) => idx !== tempIndex));
          continue;
        }

        // Get presigned URL
        const presignedResponse = await fetch("/api/r2/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            size: file.size,
          }),
        });

        if (!presignedResponse.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { presignedUrl, key, publicUrl } = await presignedResponse.json();

        // Upload to R2 with progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round(
                (event.loaded / event.total) * 100
              );
              setFilesData((prev) =>
                prev.map((f, idx) =>
                  idx === tempIndex ? { ...f, progress: percentComplete } : f
                )
              );
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        // Track in database
        const result = await createFile.mutateAsync({
          url: publicUrl,
          fileKey: key,
          size: file.size,
          metadata: {
            mediaType: file.type || MediaType.IMAGE_JPEG,
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
            category,
          },
        });

        // Update file data with actual URL and mark as completed
        setFilesData((prev) =>
          prev.map((f, idx) =>
            idx === tempIndex
              ? {
                  ...f,
                  url: publicUrl,
                  fileId: result.success && result.data ? result.data.id : null,
                  fileKey: key,
                  uploading: false,
                  progress: 100,
                }
              : f
          )
        );

        // Revoke object URL after successful upload
        setTimeout(() => {
          setFilesData((prev) =>
            prev.map((f, idx) => {
              if (idx === tempIndex && f.objectUrl) {
                URL.revokeObjectURL(f.objectUrl);
                return { ...f, objectUrl: undefined };
              }
              return f;
            })
          );
        }, 1000);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}`);
        // Remove the failed file
        setFilesData((prev) => {
          const filtered = prev.filter((_, idx) => idx !== tempIndex);
          // Revoke object URL
          if (prev[tempIndex]?.objectUrl) {
            URL.revokeObjectURL(prev[tempIndex].objectUrl!);
          }
          return filtered;
        });
      }
    }

    // Update onChange with completed URLs
    setTimeout(() => {
      setFilesData((prev) => {
        const completedFiles = prev.filter((f) => !f.uploading);
        const newUrls = completedFiles.map((f) => f.url);

        if (isMultiple) {
          onChange(newUrls);
        } else {
          onChange(newUrls[0] || "");
        }

        return prev;
      });
    }, 500);

    setIsUploading(false);
    setUploadComplete(true);
    setTimeout(() => setUploadComplete(false), 2000);

    toast.success(`${filesToProcess.length} file(s) uploaded successfully`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input value to allow re-uploading the same file
    event.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      document.getElementById(`file-upload-${identifier}`)?.click();
    }
  };

  const getFileIcon = () => {
    switch (category) {
      case FileCategory.DOCUMENT:
        return FileText;
      case FileCategory.VIDEO:
        return Video;
      case FileCategory.AUDIO:
        return Music;
      case FileCategory.IMAGE:
      case FileCategory.GALLERY:
      case FileCategory.PROFILE:
        return FileImage;
      default:
        return File;
    }
  };

  const isImageFile = (url: string | undefined, type?: string) => {
    if (!url && !type) return false;
    if (type) return type.startsWith("image/");
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    return imageExtensions.some((ext) => url!.toLowerCase().endsWith(ext));
  };

  const renderFilePreview = (
    fileData: FileData,
    size: "small" | "medium" | "large" = "medium"
  ) => {
    const IconComponent = getFileIcon();

    const sizeClasses = {
      small: "w-4 h-4",
      medium: "w-6 h-6",
      large: "w-8 h-8",
    };

    // CRITICAL FIX: Always prefer objectUrl for preview if it exists
    // This is the local blob URL that always works, regardless of R2 bucket permissions
    const previewUrl = fileData.objectUrl || fileData.url;
    const isImage = isImageFile(previewUrl, fileData.type);

    if (isImage && previewUrl) {
      return (
        <>
          <img
            src={previewUrl}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", previewUrl);
              e.currentTarget.style.display = "none";
            }}
          />
          {fileData.uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">
                  {fileData.progress || 0}%
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        {fileData.uploading ? (
          <>
            <Loader2
              className={cn(
                sizeClasses[size],
                "text-primary animate-spin mb-2"
              )}
            />
            <p className="text-xs text-gray-600 font-medium">
              {fileData.progress || 0}%
            </p>
          </>
        ) : (
          <>
            <IconComponent
              className={cn(sizeClasses[size], "text-gray-600 mb-1")}
            />
            <p className="text-xs text-gray-600 font-medium px-2 text-center">
              {category === FileCategory.DOCUMENT && "Doc"}
              {category === FileCategory.VIDEO && "Video"}
              {category === FileCategory.AUDIO && "Audio"}
              {!category && "File"}
            </p>
          </>
        )}
      </div>
    );
  };

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-1.5">
            {label}
          </h3>
        )}

        {filesData.length > 0 ? (
          <div
            className={cn(
              "flex flex-wrap gap-2",
              isMultiple && "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
            )}
          >
            {filesData.map((fileData, index) => (
              <div key={index} className="relative">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                  {renderFilePreview(fileData, "small")}
                  {uploadComplete && !fileData.uploading && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={
                    deletingIndex === index || isUploading || fileData.uploading
                  }
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg disabled:opacity-50 transition-colors z-10"
                >
                  {deletingIndex === index ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {!isMultiple && filesData.length > 0 ? null : (
          <>
            <input
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              disabled={isUploading}
              multiple={isMultiple}
              className="hidden"
              id={`file-upload-${identifier}`}
            />
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "flex items-center gap-2 p-3 border-2 border-dashed rounded-lg transition-all cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
                isUploading && "opacity-60 cursor-not-allowed"
              )}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">
                  {/* {isUploading
                    ? `Uploading ${uploadingCount}/${totalToUpload}...`
                    : isDragging
                    ? "Drop here"
                    : isMultiple
                    ? "Upload files"
                    : "Upload file"} */}
                  {isUploading
                    ? `Uploading ${uploadingCount}/${totalToUpload}...`
                    : isDragging
                    ? "Drop here"
                    : isMultiple
                    ? "Upload files"
                    : "Upload file"}
                </p>
                <p className="text-xs text-gray-500">
                  Max 10MB {isMultiple && `• Up to ${maxFiles}`}
                </p>
              </div>
            </div>
          </>
        )}

        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    );
  }

  // Minimal variant
  if (variant === "minimal") {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-1.5">
            {label}
          </h3>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {filesData.map((fileData, index) => (
            <div key={index} className="relative">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200">
                {renderFilePreview(fileData, "small")}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={
                  deletingIndex === index || isUploading || fileData.uploading
                }
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg disabled:opacity-50 z-10"
              >
                {deletingIndex === index ? (
                  <Loader2 className="w-2 h-2 animate-spin" />
                ) : (
                  <X className="w-2 h-2" />
                )}
              </button>
            </div>
          ))}

          <div>
            <input
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              disabled={isUploading}
              multiple={isMultiple}
              className="hidden"
              id={`file-upload-${identifier}`}
            />
            <button
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              className={cn(
                "inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm",
                "text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                  {uploadingCount}/{totalToUpload}
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 mr-1.5" />
                  {filesData.length > 0 ? "Add More" : "Upload"}
                </>
              )}
            </button>
          </div>
        </div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {filesData.length > 0 ? (
        <div
          className={cn(
            "grid gap-3",
            isMultiple
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 max-w-md"
          )}
        >
          {filesData.map((fileData, index) => (
            <div key={index} className="relative">
              <div
                className="relative w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50"
                style={{ paddingBottom: isMultiple ? "100%" : "56.25%" }}
              >
                {renderFilePreview(fileData, "medium")}

                {uploadComplete && !fileData.uploading && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={
                  deletingIndex === index || isUploading || fileData.uploading
                }
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg disabled:opacity-50 transition-all z-10"
              >
                {deletingIndex === index ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {!isMultiple && filesData.length > 0 ? null : (
        <>
          <input
            type="file"
            accept={acceptedTypes}
            onChange={handleFileChange}
            disabled={isUploading}
            multiple={isMultiple}
            className="hidden"
            id={`file-upload-${identifier}`}
          />
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer",
              "flex flex-col items-center justify-center text-center",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
              isUploading && "opacity-60 cursor-not-allowed"
            )}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-primary" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {/* {isUploading
                    ? `Uploading ${uploadingCount}/${totalToUpload}...`
                    : isDragging
                    ? "Drop here"
                    : isMultiple
                    ? "Upload files"
                    : "Upload file"} */}
                  {isUploading
                    ? `Uploading ${uploadingCount}/${totalToUpload}...`
                    : isDragging
                    ? "Drop here"
                    : isMultiple
                    ? "Upload files"
                    : "Upload file"}
                </p>
                  {!isUploading && (
                  <>
                    <p className="text-xs text-gray-600">Files up to 10MB</p>
                    {isMultiple && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Up to {maxFiles} files
                      </p>
                    )}
                  </>
                )}
              </div>

              {!isUploading && (
                <div className="pt-1">
                  <div className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                    {/* Browse Files */}
                    Browse Files
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
}
