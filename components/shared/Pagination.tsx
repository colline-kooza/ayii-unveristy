"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemName = "items",
  className,
}: PaginationProps) {
  if (totalPages <= 1 && !totalItems) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50/30 border-t border-gray-100 gap-4", className)}>
      <div className="text-xs text-gray-500 font-medium order-2 sm:order-1 text-center sm:text-left">
        {totalItems ? (
          <>
            Showing <span className="text-black font-bold">{Math.min(itemsPerPage || 0, totalItems)}</span> of <span className="text-black font-bold">{totalItems}</span> {itemName}
          </>
        ) : (
          `Page ${currentPage} of ${totalPages}`
        )}
      </div>
      
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 border-gray-200 text-gray-600 hover:bg-white disabled:opacity-30"
          title="First Page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 border-gray-200 text-gray-600 hover:bg-white disabled:opacity-30"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "h-8 w-8 p-0 text-[11px] font-bold transition-all shadow-none border-gray-200",
                currentPage === pageNum 
                  ? "bg-[#8B1538] hover:bg-[#6B1329] text-white shadow-lg shadow-[#8B1538]/20 border-0" 
                  : "text-gray-600 hover:bg-white"
              )}
            >
              {pageNum}
            </Button>
          ))}
          {totalPages > 5 && getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
             <span className="text-gray-400 text-xs px-1">...</span>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 border-gray-200 text-gray-600 hover:bg-white disabled:opacity-30"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 border-gray-200 text-gray-600 hover:bg-white disabled:opacity-30"
          title="Last Page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
