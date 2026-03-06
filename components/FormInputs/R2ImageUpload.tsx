"use client";

import { useState, useEffect, useCallback } from "react";
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
  CloudUpload,
  Plus,
  Trash2,
  Eye,
  Info,
  ExternalLink,
  Calendar,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileCategory, MediaType, type UploadedFile } from "@/types/files";
import {
  useCreateFile,
  useDeleteFile,
  useDeleteFileByUrl,
} from "@/hooks/use-files";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  size?: number;
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

  const [uploadComplete, setUploadComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Details Modal state
  const [detailsFile, setDetailsFile] = useState<FileData | null>(null);

  const createFile = useCreateFile();
  const deleteFile = useDeleteFile();
  const deleteFileByUrl = useDeleteFileByUrl();

  // Initialize files data from existing values (e.g. when editing a record)
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
  }, [valueArray.length]); // intentionally only on length change

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

      if (fileData.objectUrl) {
        URL.revokeObjectURL(fileData.objectUrl);
      }

      try {
        if (fileData.fileId && fileData.fileKey) {
          await deleteFile.mutateAsync({
            fileId: fileData.fileId,
            key: fileData.fileKey,
          });
        } else if (fileData.fileKey) {
          await fetch("/api/r2/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: fileData.fileKey }),
          });
        } else if (fileData.url) {
          await deleteFileByUrl.mutateAsync(fileData.url);
        }

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

        toast.success("File removed successfully");
      } catch (error) {
        console.error("Failed to delete file:", error);
        toast.error("Removed from UI, but backend deletion failed");

        // Still remove from UI on failure so user isn't stuck
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
    [filesData, deletingIndex, deleteFile, deleteFileByUrl, onChange, isMultiple]
  );

  const handleFileSelect = async (files: File[]) => {
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
      toast.error("Please select valid files");
      return;
    }

    if (isMultiple && filesData.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const filesToProcess = isMultiple ? validFiles : [validFiles[0]];

    setIsUploading(true);
    setTotalToUpload(filesToProcess.length);
    setUploadingCount(0);

    const tempFilesData: FileData[] = filesToProcess.map((file) => ({
      url: "",
      fileId: null,
      fileKey: undefined,
      name: file.name,
      type: file.type,
      size: file.size,
      objectUrl: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
    }));

    setFilesData((prev) => [...prev, ...tempFilesData]);

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const tempIndex = filesData.length + i;

      setUploadingCount(i + 1);

      try {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name}: File must be less than 10MB`);
          setFilesData((prev) => prev.filter((_, idx) => idx !== tempIndex));
          continue;
        }

        const presignedResponse = await fetch("/api/r2/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            size: file.size,
          }),
        });

        if (!presignedResponse.ok) throw new Error("Presigned URL failed");

        const { presignedUrl, key, publicUrl } = await presignedResponse.json();

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
          xhr.onload = () =>
            xhr.status === 200 || xhr.status === 204 ? resolve() : reject();
          xhr.onerror = () => reject();
          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

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

        setFilesData((prev) =>
          prev.map((f, idx) =>
            idx === tempIndex
              ? {
                  ...f,
                  url: publicUrl,
                  fileId:
                    result.success && result.data ? result.data.id : null,
                  fileKey: key,
                  uploading: false,
                  progress: 100,
                }
              : f
          )
        );

        // Revoke object URL after a short delay once the real URL is set
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
        setFilesData((prev) => prev.filter((_, idx) => idx !== tempIndex));
      }
    }

    // Notify parent with final urls after all uploads complete
    setTimeout(() => {
      setFilesData((prev) => {
        const completedFiles = prev.filter((f) => !f.uploading);
        const newUrls = completedFiles.map((f) => f.url);
        if (isMultiple) onChange(newUrls);
        else onChange(newUrls[0] || "");
        return prev;
      });
    }, 500);

    setIsUploading(false);
    setUploadComplete(true);
    setTimeout(() => setUploadComplete(false), 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) handleFileSelect(files);
    event.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isUploading) {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) handleFileSelect(files);
    }
  };

  const handleClick = () => {
    if (!isUploading)
      document.getElementById(`file-upload-${identifier}`)?.click();
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
    const exts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];
    return exts.some((ext) => url!.toLowerCase().endsWith(ext));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFilePreview = (
    fileData: FileData,
    size: "small" | "medium" | "large" = "medium"
  ) => {
    const Icon = getFileIcon();
    const sCls = { small: "w-4 h-4", medium: "w-6 h-6", large: "w-8 h-8" };
    const pUrl = fileData.objectUrl || fileData.url;
    const isImg = isImageFile(pUrl, fileData.type);

    if (isImg && pUrl) {
      return (
        <>
          <img
            src={pUrl}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {fileData.uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">
                  {fileData.progress}%
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
        {fileData.uploading ? (
          <>
            <Loader2 className={cn(sCls[size], "text-primary animate-spin mb-2")} />
            <p className="text-xs text-gray-600 font-medium">
              {fileData.progress}%
            </p>
          </>
        ) : (
          <>
            <Icon className={cn(sCls[size], "text-gray-600 mb-1")} />
            <p className="text-[10px] text-gray-500 font-bold uppercase">
              {category}
            </p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2 px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-red-600" /> {label}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group relative border-2 border-dashed rounded-[1.5rem] p-1 transition-all duration-300",
          isDragging
            ? "border-red-500 bg-red-50/50 scale-[0.99]"
            : "border-gray-200 hover:border-red-400 hover:bg-gray-50/30",
          isUploading && "opacity-80 scale-[0.98]"
        )}
      >
        <input
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          disabled={isUploading}
          multiple={isMultiple}
          className="hidden"
          id={`file-upload-${identifier}`}
        />

        {filesData.length > 0 ? (
          <div className="p-2 sm:p-4 bg-white/50 rounded-[1.25rem]">
            <div
              className={cn(
                "grid gap-3 sm:gap-4",
                isMultiple
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  : "grid-cols-1"
              )}
            >
              {filesData.map((f, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group/item transition-all hover:shadow-xl hover:ring-2 hover:ring-red-500/20"
                >
                  {renderFilePreview(f, "large")}

                  {/* Action Overlay */}
                  {!f.uploading && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center opacity-0 group-hover/item:opacity-100 transition-all translate-y-2 group-hover/item:translate-y-0">
                      <button
                        type="button"
                        onClick={() => setDetailsFile(f)}
                        className="h-8 w-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(i)}
                        disabled={deletingIndex === i}
                        className="h-8 w-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                      >
                        {deletingIndex === i ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {f.uploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                      <div className="relative h-12 w-12 flex items-center justify-center mb-2">
                        <Loader2 className="h-6 w-6 text-red-600 animate-spin" />
                        <span className="absolute text-[9px] font-black text-red-600">
                          {f.progress}%
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Uploading
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {isMultiple && filesData.length < maxFiles && (
                <button
                  type="button"
                  onClick={handleClick}
                  className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-100 hover:border-red-400 hover:bg-red-50/50 transition-all flex flex-col items-center justify-center gap-2 group/add overflow-hidden"
                >
                  <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center group-hover/add:bg-red-600 group-hover/add:text-white transition-all shadow-sm">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover/add:text-red-600">
                    Add Media
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="cursor-pointer py-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="h-20 w-20 rounded-[2rem] bg-red-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-2xl shadow-red-500/10 border border-red-100/50">
              {isUploading ? (
                <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
              ) : (
                <CloudUpload className="h-10 w-10 text-red-600" />
              )}
            </div>
            <div className="space-y-1 px-4">
              <h4 className="text-base font-black text-black group-hover:text-red-600 transition-colors uppercase tracking-tight">
                {isUploading ? "Uploading..." : "Upload Campus Media"}
              </h4>
              <p className="text-[11px] text-gray-400 font-bold px-4 max-w-sm mx-auto leading-relaxed uppercase tracking-tighter opacity-80">
                Drag and drop assets here, or{" "}
                <span className="text-red-600 font-black underline underline-offset-4 decoration-2">
                  browse files
                </span>
                .
              </p>
            </div>
          </div>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-gray-400 font-medium text-center px-4 italic opacity-70">
          {description}
        </p>
      )}

      {/* Details Dialog - Premium Asset Profile View */}
      <Dialog open={!!detailsFile} onOpenChange={() => setDetailsFile(null)}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-white/95 backdrop-blur-xl">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 mix-blend-overlay pointer-events-none">
              <Info className="h-48 w-48" />
            </div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-500/20 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-inner">
                  <FileText className="h-6 w-6 text-red-400" />
                </div>
                <Badge className="bg-red-600/20 text-red-400 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                  Asset Profile
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-wider leading-tight">
                {detailsFile?.name || "Digital Asset"}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <Calendar className="h-3 w-3" />
                  System ID: {detailsFile?.fileId?.slice(-8) || "PENDING"}
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            <div className="group relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/50 shadow-inner flex items-center justify-center transition-all hover:shadow-2xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              {detailsFile && renderFilePreview(detailsFile, "large")}
              <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[9px] uppercase px-3 py-1">
                  HQ Preview Mode
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-1 transition-all hover:bg-white hover:shadow-lg hover:border-red-100 group">
                <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Format
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase">
                  {detailsFile?.type?.split("/")[1] || "binary"}
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-1 transition-all hover:bg-white hover:shadow-lg hover:border-red-100 group">
                <div className="h-8 w-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-2 group-hover:scale-110 transition-transform">
                  <Info className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Storage Size
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {formatFileSize(detailsFile?.size)}
                </span>
              </div>
            </div>

            {detailsFile?.fileKey && (
              <div className="p-5 rounded-[2rem] bg-slate-900 shadow-2xl shadow-red-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform">
                  <ExternalLink className="h-12 w-12 text-white" />
                </div>
                <p className="text-[9px] font-black uppercase text-red-400 tracking-[0.3em] mb-3">
                  Cloud Persistence Key
                </p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-[10px] font-mono text-slate-400 break-all leading-relaxed">
                    {detailsFile.fileKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-500 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      navigator.clipboard.writeText(detailsFile?.fileKey || "");
                      toast.success("Key copied to clipboard");
                    }}
                  >
                    <Layers className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setDetailsFile(null)}
                className="flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                Dismiss
              </Button>
              <Button
                className="flex-[1.5] h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-12px_rgba(220,38,38,0.3)] transition-all hover:-translate-y-1 active:scale-95 gap-3"
                asChild
              >
                <a
                  href={detailsFile?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Access Content
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
