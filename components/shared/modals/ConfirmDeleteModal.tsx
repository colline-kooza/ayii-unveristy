"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirm Deletion",
  description = "This action cannot be undone. This will permanently delete the record and remove the data from our servers.",
  itemName,
  isLoading: externalLoading,
}: ConfirmDeleteModalProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-[1.5rem] bg-white">
        <div className="bg-red-50 p-5 flex flex-col items-center text-center space-y-3">
          <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-black">
              {title}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-gray-500 mt-2 px-4 leading-relaxed">
              {description}
              {itemName && (
                <span className="block mt-2 font-bold text-red-600 bg-red-100/50 py-1 px-2 rounded-lg inline-block">
                  {itemName}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-2 pb-6 flex flex-col gap-3">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="h-12 w-full rounded-xl font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Deletion...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Permanently Delete
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-12 w-full rounded-xl font-bold text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel and Keep
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
