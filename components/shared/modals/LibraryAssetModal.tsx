"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useUploadBook,
  useUpdateBook,
  useUploadPastPaper,
  useUpdatePastPaper,
  useSubmitJournal,
  useUpdateJournal,
} from "@/hooks/useLibrary";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { FileCategory } from "@/types/files";
import { AlertCircle, CheckCircle2, Loader2, Plus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Schemas ─────────────────────────────────────────────────────────────────

const bookSchema = z.object({
  title: z.string().min(1, "Book title is required"),
  publisher: z.string().min(1, "Publisher name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  link: z.string().url("Please enter a valid URL (https://...)").min(1, "Book link is required"),
});

const paperSchema = z.object({
  title: z.string().min(1, "Paper title is required"),
  subject: z.string().min(1, "Subject is required"),
  courseUnit: z.string().min(1, "Course unit code is required"),
  year: z.number().int().min(2000, "Year must be 2000 or later").max(2100, "Invalid year"),
  fileKey: z.string().min(1, "Please upload a paper file"),
});

const journalSchema = z.object({
  title: z.string().min(1, "Journal title is required"),
  abstract: z.string().min(10, "Abstract must be at least 10 characters"),
  doi: z.string().optional(),
  fileKey: z.string().min(1, "Please upload a journal file"),
});

type BookValues = z.infer<typeof bookSchema>;
type PaperValues = z.infer<typeof paperSchema>;
type JournalValues = z.infer<typeof journalSchema>;

// ── Shared helpers ───────────────────────────────────────────────────────────

/** Red-border + red label styling applied to a field that has an error */
function fieldCls(hasError: boolean, base = "") {
  return cn(base, hasError && "border-red-400 focus:border-red-400 focus:ring-red-300 bg-red-50/40");
}

/** Inline error badge shown under each errored field */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs font-medium text-red-600 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

/** Loading overlay shown while a mutation is in-flight */
function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-[2px] rounded-lg">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-red-100" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-semibold text-gray-700">Saving to library…</p>
    </div>
  );
}

interface LibraryAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "book" | "paper" | "journal";
  asset?: any;
}

// ── Book Form ────────────────────────────────────────────────────────────────

function BookForm({
  asset,
  onClose,
  onLoadingChange,
}: {
  asset?: any;
  onClose: () => void;
  onLoadingChange: (v: boolean) => void;
}) {
  const isEditing = !!asset;
  const uploadBook = useUploadBook();
  const updateBook = useUpdateBook();
  const isLoading = uploadBook.isPending || updateBook.isPending;

  useEffect(() => { onLoadingChange(isLoading); }, [isLoading, onLoadingChange]);

  const form = useForm<BookValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: asset?.title ?? "",
      publisher: asset?.publisher ?? "",
      category: asset?.category ?? "",
      description: asset?.description ?? "",
      coverImage: asset?.coverImage ?? "",
      link: asset?.link ?? "",
    },
  });

  const onSubmit = async (data: BookValues) => {
    try {
      if (isEditing) {
        await updateBook.mutateAsync({ id: asset.id, ...data });
      } else {
        await uploadBook.mutateAsync(data);
      }
      onClose();
    } catch { /* toast handled in hook */ }
  };

  const errors = form.formState.errors;

  return (
    <Form {...form}>
      <div className="relative">
        <LoadingOverlay show={isLoading} />
        <form
          id="library-asset-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("px-6 pt-5 pb-6 space-y-4", isLoading && "pointer-events-none opacity-60")}
        >
          {/* Title + Publisher */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-xs font-semibold", errors.title ? "text-red-600" : "text-gray-700")}>
                    Book Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="e.g. Introduction to Computer Science"
                      className={fieldCls(!!errors.title, "h-10 text-sm rounded-lg border-gray-200")}
                    />
                  </FormControl>
                  <FieldError message={errors.title?.message} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-xs font-semibold", errors.publisher ? "text-red-600" : "text-gray-700")}>
                    Publisher <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="e.g. Pearson Education"
                      className={fieldCls(!!errors.publisher, "h-10 text-sm rounded-lg border-gray-200")}
                    />
                  </FormControl>
                  <FieldError message={errors.publisher?.message} />
                </FormItem>
              )}
            />
          </div>

          {/* Link */}
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-xs font-semibold", errors.link ? "text-red-600" : "text-gray-700")}>
                  Book Link (URL) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="https://example.com/book"
                    className={fieldCls(!!errors.link, "h-10 text-sm rounded-lg border-gray-200 font-mono")}
                  />
                </FormControl>
                <FieldError message={errors.link?.message} />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-xs font-semibold", errors.category ? "text-red-600" : "text-gray-700")}>
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="e.g. Computer Science, Mathematics"
                    className={fieldCls(!!errors.category, "h-10 text-sm rounded-lg border-gray-200")}
                  />
                </FormControl>
                <FieldError message={errors.category?.message} />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-700">Description <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isLoading}
                    placeholder="Brief summary of the book"
                    className="min-h-[90px] text-sm border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-red-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-700">Cover Image <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                <FormControl>
                  <R2ImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    category={FileCategory.GALLERY}
                    identifier={`book-cover-${asset?.id ?? "new"}`}
                    multiple={false}
                    variant="compact"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Summary of errors after attempted submit */}
          {Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-red-700">
                Please fix the highlighted fields before publishing.
              </p>
            </div>
          )}
        </form>
      </div>
    </Form>
  );
}

// ── Past Paper Form ──────────────────────────────────────────────────────────

function PaperForm({
  asset,
  onClose,
  onLoadingChange,
}: {
  asset?: any;
  onClose: () => void;
  onLoadingChange: (v: boolean) => void;
}) {
  const isEditing = !!asset;
  const uploadPaper = useUploadPastPaper();
  const updatePaper = useUpdatePastPaper();
  const isLoading = uploadPaper.isPending || updatePaper.isPending;

  useEffect(() => { onLoadingChange(isLoading); }, [isLoading, onLoadingChange]);

  const form = useForm<PaperValues>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: asset?.title ?? "",
      subject: asset?.subject ?? "",
      courseUnit: asset?.courseUnit ?? "",
      year: asset?.year ?? new Date().getFullYear(),
      fileKey: asset?.fileKey ?? "",
    },
  });

  const onSubmit = async (data: PaperValues) => {
    try {
      if (isEditing) {
        await updatePaper.mutateAsync({ id: asset.id, ...data });
      } else {
        await uploadPaper.mutateAsync(data);
      }
      onClose();
    } catch { /* toast handled in hook */ }
  };

  const errors = form.formState.errors;

  return (
    <Form {...form}>
      <div className="relative">
        <LoadingOverlay show={isLoading} />
        <form
          id="library-asset-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("px-6 pt-5 pb-6 space-y-4", isLoading && "pointer-events-none opacity-60")}
        >
          {/* File Upload */}
          <FormField
            control={form.control}
            name="fileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-xs font-semibold", errors.fileKey ? "text-red-600" : "text-gray-700")}>
                  Paper File (PDF) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className={cn("rounded-xl border-2 border-dashed p-1 transition-colors", errors.fileKey ? "border-red-400 bg-red-50/40" : "border-gray-200")}>
                    <R2ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      category={FileCategory.DOCUMENT}
                      identifier={`paper-${asset?.id ?? "new"}`}
                      multiple={false}
                    />
                  </div>
                </FormControl>
                <FieldError message={errors.fileKey?.message} />
              </FormItem>
            )}
          />

          {/* Title + Subject */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-xs font-semibold", errors.title ? "text-red-600" : "text-gray-700")}>
                    Paper Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="e.g. Final Exam 2024"
                      className={fieldCls(!!errors.title, "h-10 text-sm rounded-lg border-gray-200")}
                    />
                  </FormControl>
                  <FieldError message={errors.title?.message} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-xs font-semibold", errors.subject ? "text-red-600" : "text-gray-700")}>
                    Subject <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="e.g. Software Engineering"
                      className={fieldCls(!!errors.subject, "h-10 text-sm rounded-lg border-gray-200")}
                    />
                  </FormControl>
                  <FieldError message={errors.subject?.message} />
                </FormItem>
              )}
            />
          </div>

          {/* Course Unit + Year */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="courseUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-xs font-semibold", errors.courseUnit ? "text-red-600" : "text-gray-700")}>
                    Course Unit Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="e.g. CS101"
                      className={fieldCls(!!errors.courseUnit, "h-10 text-sm rounded-lg border-gray-200 font-mono")}
                    />
                  </FormControl>
                  <FieldError message={errors.courseUnit?.message} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-xs font-semibold", errors.year ? "text-red-600" : "text-gray-700")}>
                    Academic Year <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : "")}
                      className={fieldCls(!!errors.year, "h-10 text-sm rounded-lg border-gray-200")}
                    />
                  </FormControl>
                  <FieldError message={errors.year?.message} />
                </FormItem>
              )}
            />
          </div>

          {/* Error summary */}
          {Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-red-700">Please fix the highlighted fields before uploading.</p>
            </div>
          )}
        </form>
      </div>
    </Form>
  );
}

// ── Journal Form ─────────────────────────────────────────────────────────────

function JournalForm({
  asset,
  onClose,
  onLoadingChange,
}: {
  asset?: any;
  onClose: () => void;
  onLoadingChange: (v: boolean) => void;
}) {
  const isEditing = !!asset;
  const uploadJournal = useSubmitJournal();
  const updateJournal = useUpdateJournal();
  const isLoading = uploadJournal.isPending || updateJournal.isPending;

  const [newAuthor, setNewAuthor] = useState("");
  const [authors, setAuthors] = useState<string[]>(asset?.authors ?? []);
  const [authorsError, setAuthorsError] = useState(false);
  const [authorsSubmitTried, setAuthorsSubmitTried] = useState(false);

  useEffect(() => { onLoadingChange(isLoading); }, [isLoading, onLoadingChange]);

  const form = useForm<JournalValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: asset?.title ?? "",
      abstract: asset?.abstract ?? "",
      doi: asset?.doi ?? "",
      fileKey: asset?.fileKey ?? "",
    },
  });

  const addAuthor = () => {
    const trimmed = newAuthor.trim();
    if (trimmed && !authors.includes(trimmed)) {
      const next = [...authors, trimmed];
      setAuthors(next);
      setNewAuthor("");
      if (next.length > 0) setAuthorsError(false);
    }
  };

  const removeAuthor = (index: number) => {
    const next = authors.filter((_, i) => i !== index);
    setAuthors(next);
    if (next.length === 0 && authorsSubmitTried) setAuthorsError(true);
  };

  const onSubmit = async (data: JournalValues) => {
    setAuthorsSubmitTried(true);
    if (authors.length === 0) {
      setAuthorsError(true);
      return;
    }
    setAuthorsError(false);
    try {
      const payload = { ...data, authors };
      if (isEditing) {
        await updateJournal.mutateAsync({ id: asset.id, ...payload });
      } else {
        await uploadJournal.mutateAsync(payload);
      }
      onClose();
    } catch { /* toast handled in hook */ }
  };

  const errors = form.formState.errors;
  const hasErrors = Object.keys(errors).length > 0 || authorsError;

  return (
    <Form {...form}>
      <div className="relative">
        <LoadingOverlay show={isLoading} />
        <form
          id="library-asset-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("px-6 pt-5 pb-6 space-y-4", isLoading && "pointer-events-none opacity-60")}
        >
          {/* File Upload */}
          <FormField
            control={form.control}
            name="fileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-xs font-semibold", errors.fileKey ? "text-red-600" : "text-gray-700")}>
                  Journal File (PDF) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className={cn("rounded-xl border-2 border-dashed p-1 transition-colors", errors.fileKey ? "border-red-400 bg-red-50/40" : "border-gray-200")}>
                    <R2ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      category={FileCategory.DOCUMENT}
                      identifier={`journal-${asset?.id ?? "new"}`}
                      multiple={false}
                    />
                  </div>
                </FormControl>
                <FieldError message={errors.fileKey?.message} />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-xs font-semibold", errors.title ? "text-red-600" : "text-gray-700")}>
                  Journal Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="Title of the Journal Article"
                    className={fieldCls(!!errors.title, "h-10 text-sm rounded-lg border-gray-200")}
                  />
                </FormControl>
                <FieldError message={errors.title?.message} />
              </FormItem>
            )}
          />

          {/* Abstract */}
          <FormField
            control={form.control}
            name="abstract"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-xs font-semibold", errors.abstract ? "text-red-600" : "text-gray-700")}>
                  Abstract <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isLoading}
                    placeholder="Executive summary of the journal article"
                    className={fieldCls(!!errors.abstract, "min-h-[90px] text-sm rounded-lg border-gray-200 resize-none")}
                  />
                </FormControl>
                <FieldError message={errors.abstract?.message} />
              </FormItem>
            )}
          />

          {/* Authors */}
          <div>
            <Label className={cn("text-xs font-semibold mb-2 block", authorsError ? "text-red-600" : "text-gray-700")}>
              Authors <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 mb-2.5">
              <Input
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Enter author full name, then press Add"
                disabled={isLoading}
                className={cn("h-10 text-sm rounded-lg border-gray-200", authorsError && authors.length === 0 && "border-red-400 bg-red-50/40")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addAuthor(); }
                }}
              />
              <Button
                type="button"
                onClick={addAuthor}
                disabled={isLoading || !newAuthor.trim()}
                className="h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 shrink-0 transition-all"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>

            {authors.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                {authors.map((author, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm"
                  >
                    <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                    {author}
                    <button
                      type="button"
                      onClick={() => removeAuthor(i)}
                      disabled={isLoading}
                      className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className={cn(
                "flex items-center gap-2 p-3 rounded-xl border text-xs text-gray-500",
                authorsError ? "border-red-300 bg-red-50 text-red-600" : "border-dashed border-gray-200 bg-gray-50"
              )}>
                <Upload className="h-4 w-4 shrink-0" />
                <span>No authors added yet. Use the field above.</span>
              </div>
            )}
            {authorsError && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-red-600 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                At least one author is required
              </p>
            )}
          </div>

          {/* DOI */}
          <FormField
            control={form.control}
            name="doi"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-700">
                  DOI <span className="text-gray-400 font-normal">(optional — Digital Object Identifier)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="e.g. 10.1000/xyz123"
                    className="h-10 text-sm rounded-lg border-gray-200 font-mono"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error summary */}
          {hasErrors && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-red-700">Please fix the highlighted fields before publishing.</p>
            </div>
          )}
        </form>
      </div>
    </Form>
  );
}

// ── Main Modal ───────────────────────────────────────────────────────────────

export function LibraryAssetModal({
  open,
  onOpenChange,
  type,
  asset,
}: LibraryAssetModalProps) {
  const isEditing = !!asset;
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  const typeLabel =
    type === "book" ? "Book" : type === "paper" ? "Past Paper" : "Journal";

  const typeColor =
    type === "book"
      ? "from-red-600 to-indigo-600"
      : type === "paper"
      ? "from-violet-600 to-purple-600"
      : "from-emerald-600 to-teal-600";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl border-none shadow-2xl p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
            <div className={cn("bg-gradient-to-br p-2.5 rounded-xl shadow-md", typeColor)}>
              <Plus className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">
                {isEditing ? "Edit" : "Add New"} {typeLabel}
              </p>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                {isEditing ? "Update the details below" : `Fill in the details to publish a new ${typeLabel.toLowerCase()} to the library`}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Form Body */}
        <ScrollArea className="max-h-[calc(90vh-168px)]">
          {type === "book" && (
            <BookForm
              key={`book-${asset?.id ?? "new"}`}
              asset={asset}
              onClose={handleClose}
              onLoadingChange={setIsLoading}
            />
          )}
          {type === "paper" && (
            <PaperForm
              key={`paper-${asset?.id ?? "new"}`}
              asset={asset}
              onClose={handleClose}
              onLoadingChange={setIsLoading}
            />
          )}
          {type === "journal" && (
            <JournalForm
              key={`journal-${asset?.id ?? "new"}`}
              asset={asset}
              onClose={handleClose}
              onLoadingChange={setIsLoading}
            />
          )}
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-5 pt-4 pb-6 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            Fields marked <span className="text-red-500 font-bold">*</span> are required
          </p>
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="h-10 rounded-xl font-semibold text-gray-600 px-5 hover:bg-gray-200 transition-all text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="library-asset-form"
              disabled={isLoading}
              className={cn(
                "h-10 px-6 rounded-xl font-bold text-white text-sm transition-all shadow-lg flex items-center gap-2",
                "bg-gradient-to-r hover:opacity-90",
                typeColor,
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditing ? "Updating…" : "Publishing…"}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {isEditing ? "Update Resource" : "Publish to Library"}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
