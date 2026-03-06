"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Image as ImageIcon, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SimpleImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  variant?: "default" | "avatar";
}

export function SimpleImageUpload({
  value,
  onChange,
  label,
  className,
  variant = "default",
}: SimpleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes
  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
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

      const { presignedUrl, publicUrl } = await presignedResponse.json();

      // Upload to R2 with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setPreviewUrl(publicUrl);
      onChange(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    event.target.value = "";
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setPreviewUrl("");
    onChange("");
    toast.success("Image removed");
  };

  const handlePreview = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (variant === "avatar") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        {label && (
          <label className="text-xs font-semibold text-gray-700">
            {label}
          </label>
        )}
        <div
          className="relative group cursor-pointer"
          onClick={triggerFileInput}
        >
          {/* Plain img tag — Radix AvatarImage caches load state and won't re-render after src changes */}
          <div className="h-24 w-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-6 w-6 text-white animate-spin mx-auto" />
                <span className="text-xs text-white font-semibold mt-1">{uploadProgress}%</span>
              </div>
            </div>
          )}

          {!isUploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              {!previewUrl ? (
                <Upload className="h-6 w-6 text-white" />
              ) : (
                <>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={handlePreview}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={handleRemove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          ref={fileInputRef}
        />

        {previewUrl ? (
          <div className="relative group rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin mx-auto mb-2" />
                  <span className="text-sm text-white font-semibold">{uploadProgress}%</span>
                </div>
              </div>
            )}

            {!isUploading && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handlePreview}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#C41E3A] hover:bg-rose-50/50 transition-all flex flex-col items-center justify-center gap-3 group"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-[#8B1538] animate-spin" />
                <span className="text-sm font-medium text-gray-600">
                  Uploading... {uploadProgress}%
                </span>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-[#8B1538]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-black">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
