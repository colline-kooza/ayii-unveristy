"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  X, 
  Loader2, 
  Plus, 
  Image as ImageIcon, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Trash2,
  Camera
} from "lucide-react";
import { useUploadMultipleImages } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  className?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export function MultiImageUpload({
  value = [],
  onChange,
  disabled = false,
  className,
  maxFiles = 10,
  maxSize = 10,
}: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(value);
  const uploadMutation = useUploadMultipleImages();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal previews with prop value
  useEffect(() => {
    if (value) {
      setPreviews(value);
    }
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max files
    if (previews.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter((f) => f.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some images exceed ${maxSize}MB limit`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter((f) => !f.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      toast.error("Please select only image files");
      return;
    }

    // Create local previews for optimistic UI
    const newPreviews = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setPreviews((prev) => [...prev, ...newPreviews]);

    // Upload to R2
    try {
      const results = await uploadMutation.mutateAsync(files);
      const urls = results.map((r) => r.data.url);
      
      const updatedUrls = [...value, ...urls];
      onChange(updatedUrls);
      
      toast.success(`${files.length} images uploaded successfully`);
    } catch (error) {
      // Remove failed previews
      setPreviews((prev) => prev.slice(0, prev.length - newPreviews.length));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newUrls = value.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newUrls);
    toast.info("Image removed from gallery");
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-6 w-full", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-primary" />
             Visual Assets
          </label>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
               Gallery Management
            </p>
            <span className="text-[10px] text-gray-300">•</span>
            <p className="text-[10px] text-primary font-black uppercase tracking-wide">
               {previews.length} / {maxFiles} Files
            </p>
          </div>
        </div>

        {previews.length < maxFiles && (
          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled || uploadMutation.isPending}
            className="group h-10 px-6 bg-black hover:bg-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 border-none font-black text-[10px] uppercase tracking-widest"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <div className="h-5 w-5 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                <span>Add Media</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Modern Preview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {previews.map((preview, index) => (
            <motion.div
              key={preview + index}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="relative group aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <img
                src={preview}
                alt={`Asset ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Status & Actions */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="flex justify-end">
                  {!disabled && !uploadMutation.isPending && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="h-8 w-8 rounded-xl bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors pointer-events-auto active:scale-90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-1 pointer-events-none">
                   <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">
                         Verified Asset
                      </span>
                   </div>
                   <p className="text-[8px] text-white/60 font-medium uppercase truncate">
                      INDEX_{String(index + 1).padStart(3, '0')}
                   </p>
                </div>
              </div>

              {/* Uploading State Overlay */}
              {uploadMutation.isPending && index >= value.length && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-6">
                  <div className="relative h-16 w-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        className="text-white/10"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={175.9}
                        initial={{ strokeDashoffset: 175.9 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Loader2 className="h-4 w-4 text-white animate-spin mb-1" />
                      <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                        SYNC
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State / Add Placeholder */}
        {previews.length === 0 && !uploadMutation.isPending && (
          <button
            type="button"
            onClick={handleButtonClick}
            className="aspect-square rounded-[1.5rem] border-2 border-dashed border-gray-100 hover:border-primary hover:bg-rose-50/30 transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <Camera className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary transition-colors">
                Drop Images
              </p>
              <p className="text-[8px] text-gray-300 font-bold uppercase mt-1">
                JPG, PNG, WebP
              </p>
            </div>
          </button>
        )}
      </div>

      {previews.length > 0 && previews.length < maxFiles && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 border-dashed"
        >
           <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm border border-gray-100">
              <Info className="h-4 w-4" />
           </div>
           <div className="flex-1">
              <p className="text-[10px] font-black text-black uppercase tracking-tight">Gallery Optimization</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">You can add up to {maxFiles - previews.length} more images to your library</p>
           </div>
           <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter bg-white border-gray-100 px-3 py-1 rounded-lg">
              {previews.length} / {maxFiles}
           </Badge>
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploadMutation.isPending}
      />
    </div>
  );
}
