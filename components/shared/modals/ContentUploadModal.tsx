"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectInput } from "@/components/shared/SelectInput";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { UploadCloud, FileText, Newspaper, Book, Check, Layout, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const contentSchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["PAST_PAPER", "JOURNAL", "BOOK"]),
  category: z.string().min(2, "Category/Department is required"),
  fileUrl: z.string().min(1, "File upload is required"),
  description: z.string().optional(),
  year: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

interface ContentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONTENT_TYPES = [
  { value: "PAST_PAPER", label: "Past Examination Paper", description: "Academic papers for student reference" },
  { value: "JOURNAL", label: "Academic Journal", description: "Scholarly publications and e-journals" },
  { value: "BOOK", label: "E-Book / Reference", description: "Digital textbooks and library resources" },
];

const DEPARTMENTS = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "IT", label: "Information Technology" },
  { value: "SBM", label: "School of Business" },
  { value: "Nursing", label: "Medical & Nursing" },
  { value: "General", label: "General Library" },
];

export function ContentUploadModal({ open, onOpenChange }: ContentUploadModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: "PAST_PAPER",
      fileUrl: "",
    }
  });

  const selectedType = watch("type");

  const onSubmit = async (data: ContentFormValues) => {
    try {
      setIsLoading(true);
      // Logic for actual API call would go here
      console.log("Submitting content:", data);
      await new Promise(r => setTimeout(r, 1500));
      reset();
      onOpenChange(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <div className="bg-slate-900 p-6 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Database className="h-24 w-24" />
            </div>
            <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <div className="bg-red-600 p-2 rounded-lg">
                        <UploadCloud className="h-4 w-4" />
                    </div>
                    Resource Central
                </DialogTitle>
                <p className="text-slate-400 text-xs mt-1">Publish new academic resources to the university digital library.</p>
            </DialogHeader>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">File Metadata</Label>
                  <Input 
                      {...register("title")} 
                      placeholder="e.g. Intro to Algorithms 2024" 
                      className="h-11 border-slate-100 rounded-xl focus:ring-4 focus:ring-red-50/50"
                  />
                  {errors.title && <p className="text-[10px] text-red-500 font-medium">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        label="Resource Type"
                        options={CONTENT_TYPES}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose type..."
                        className="h-11"
                      />
                    )}
                  />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        label="Target Faculty"
                        options={DEPARTMENTS}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select faculty..."
                        className="h-11"
                      />
                    )}
                  />
                  {errors.category && <p className="text-[10px] text-red-500 font-medium">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Publication Year</Label>
                  <Input 
                      {...register("year")} 
                      placeholder="2024" 
                      className="h-11 border-slate-100 rounded-xl"
                  />
                </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Digital Asset (PDF/Docs)</Label>
              <Controller
                name="fileUrl"
                control={control}
                render={({ field }) => (
                  <R2ImageUpload
                    identifier="library-resource"
                    label="Publish Digital File"
                    description="Upload the finalized document (Max 10MB)"
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    variant="default"
                  />
                )}
              />
              {errors.fileUrl && <p className="text-[10px] text-red-500 font-medium">{errors.fileUrl.message}</p>}
            </div>

            <div className="flex justify-end pt-6 pb-4 border-t border-slate-50 gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-11 px-6 text-slate-500 font-semibold rounded-xl">
                Discard Draft
              </Button>
              <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="h-11 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-200 flex items-center gap-2 group"
              >
                {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Database className="h-4 w-4" />
                    </motion.div>
                ) : <Check className="h-4 w-4 group-hover:scale-110 transition-transform" />}
                {isLoading ? "Synchronizing..." : "Publish to Library"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
