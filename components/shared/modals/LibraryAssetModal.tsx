"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useUploadBook,
  useUpdateBook,
  useUploadPastPaper,
  useUpdatePastPaper,
  useSubmitJournal,
  useUpdateJournal,
  useUploadNewspaper,
  useUpdateNewspaper,
} from "@/hooks/useLibrary";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { FileCategory } from "@/types/files";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  fileKey: z.string().min(1, "File is required"),
});

const paperSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  courseUnit: z.string().min(1, "Course unit is required"),
  year: z.coerce.number().int().min(2000),
  fileKey: z.string().min(1, "File is required"),
});

const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  fileKey: z.string().min(1, "File is required"),
});

const newspaperSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  edition: z.string().min(1, "Edition is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  fileKey: z.string().min(1, "File is required"),
});

interface LibraryAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "book" | "paper" | "journal" | "newspaper";
  asset?: any; // If editing
}

export function LibraryAssetModal({
  open,
  onOpenChange,
  type,
  asset,
}: LibraryAssetModalProps) {
  const isEditing = !!asset;
  const [newAuthor, setNewAuthor] = useState("");

  const uploadBook = useUploadBook();
  const updateBook = useUpdateBook();
  const uploadPaper = useUploadPastPaper();
  const updatePaper = useUpdatePastPaper();
  const uploadJournal = useSubmitJournal(); // Admin POST automatically approves
  const updateJournal = useUpdateJournal();
  const uploadNewspaper = useUploadNewspaper();
  const updateNewspaper = useUpdateNewspaper();

  const getSchema = () => {
    switch (type) {
      case "book": return bookSchema;
      case "paper": return paperSchema;
      case "journal": return journalSchema;
      case "newspaper": return newspaperSchema;
      default: return bookSchema;
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      description: "",
      coverImage: "",
      subject: "",
      courseUnit: "",
      year: new Date().getFullYear(),
      abstract: "",
      authors: [] as string[],
      headline: "",
      edition: "",
      publishedDate: new Date().toISOString().split("T")[0],
      fileKey: "",
    },
  });

  useEffect(() => {
    if (asset) {
      const formattedAsset = { ...asset };
      if (type === "newspaper" && asset.publishedDate) {
        formattedAsset.publishedDate = new Date(asset.publishedDate).toISOString().split("T")[0];
      }
      reset(formattedAsset);
    } else {
      reset({
        title: "",
        author: "",
        category: "",
        description: "",
        coverImage: "",
        subject: "",
        courseUnit: "",
        year: new Date().getFullYear(),
        abstract: "",
        authors: [] as string[],
        headline: "",
        edition: "",
        publishedDate: new Date().toISOString().split("T")[0],
        fileKey: "",
      });
    }
  }, [asset, open, type, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (type === "book") {
        isEditing ? await updateBook.mutateAsync({ id: asset.id, ...data }) : await uploadBook.mutateAsync(data);
      } else if (type === "paper") {
        isEditing ? await updatePaper.mutateAsync({ id: asset.id, ...data }) : await uploadPaper.mutateAsync(data);
      } else if (type === "journal") {
        isEditing ? await updateJournal.mutateAsync({ id: asset.id, ...data }) : await uploadJournal.mutateAsync(data);
      } else if (type === "newspaper") {
        isEditing ? await updateNewspaper.mutateAsync({ id: asset.id, ...data }) : await uploadNewspaper.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (err) {
      // toast handled in hook
    }
  };

  const authors = watch("authors");

  const addAuthor = () => {
    if (newAuthor.trim()) {
      setValue("authors", [...authors, newAuthor.trim()]);
      setNewAuthor("");
    }
  };

  const removeAuthor = (index: number) => {
    setValue("authors", authors.filter((_, i) => i !== index));
  };

  const isLoading = 
    uploadBook.isPending || updateBook.isPending || 
    uploadPaper.isPending || updatePaper.isPending ||
    uploadJournal.isPending || updateJournal.isPending ||
    uploadNewspaper.isPending || updateNewspaper.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-none shadow-2xl p-0">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEditing ? "Update" : "Add New"} {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common File Upload */}
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Resource File</Label>
              <Controller
                name="fileKey"
                control={control}
                render={({ field }) => (
                  <R2ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    category={FileCategory.DOCUMENT}
                    identifier="library-asset-resource"
                    multiple={false}
                  />
                )}
              />
              {errors.fileKey && <p className="text-xs text-red-500">{errors.fileKey.message as string}</p>}
            </div>

            {/* Type Specific Fields */}
            {type === "book" && (
              <>
                <div className="space-y-2">
                  <Label>Book Title</Label>
                  <Input {...control.register("title")} placeholder="e.g. Modern Physics" />
                </div>
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input {...control.register("author")} placeholder="Name of author" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input {...control.register("category")} placeholder="e.g. Science" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea {...control.register("description")} placeholder="Short summary of the book" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Cover Image (Optional)</Label>
                  <Controller
                    name="coverImage"
                    control={control}
                    render={({ field }) => (
                      <R2ImageUpload
                        value={(field.value as string) || ""}
                        onChange={field.onChange}
                        category={FileCategory.GALLERY}
                        identifier="library-book-cover"
                        multiple={false}
                      />
                    )}
                  />
                </div>
              </>
            )}

            {type === "paper" && (
              <>
                <div className="space-y-2">
                  <Label>Paper Title</Label>
                  <Input {...control.register("title")} placeholder="e.g. End of Semester Exam 2024" />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input {...control.register("subject")} placeholder="e.g. Software Engineering" />
                </div>
                <div className="space-y-2">
                  <Label>Course Unit Code</Label>
                  <Input {...control.register("courseUnit")} placeholder="e.g. CS101" />
                </div>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Input type="number" {...control.register("year")} />
                </div>
              </>
            )}

            {type === "journal" && (
              <>
                <div className="md:col-span-2 space-y-2">
                  <Label>Journal Title</Label>
                  <Input {...control.register("title")} placeholder="Scholarly publication title" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Abstract</Label>
                  <Textarea {...control.register("abstract")} placeholder="Executive summary" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Authors</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={newAuthor} 
                      onChange={(e) => setNewAuthor(e.target.value)} 
                      placeholder="Add an author"
                      onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addAuthor(); }}}
                    />
                    <Button type="button" onClick={addAuthor} variant="secondary">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {authors.map((author, i) => (
                      <div key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 leading-none">
                        {author}
                        <button type="button" onClick={() => removeAuthor(i)}><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {type === "newspaper" && (
              <>
                <div className="md:col-span-2 space-y-2">
                  <Label>Headline / Publication Name</Label>
                  <Input {...control.register("headline")} placeholder="e.g. Daily Mirror Africa Edition" />
                </div>
                <div className="space-y-2">
                  <Label>Edition</Label>
                  <Input {...control.register("edition")} placeholder="e.g. Morning Edition" />
                </div>
                <div className="space-y-2">
                  <Label>Date of Publication</Label>
                  <Input type="date" {...control.register("publishedDate")} />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="font-bold text-xs px-6 py-5 rounded-xl border-gray-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Resource" : "Publish to Library"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
