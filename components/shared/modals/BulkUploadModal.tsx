"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCreateStudentsBulk } from "@/hooks/useAdminStudents";
import { Upload, FileText, Download, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface BulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkUploadModal({ open, onOpenChange }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkCreate = useCreateStudentsBulk();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        alert("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await bulkCreate.mutateAsync(file);
      setFile(null);
      onOpenChange(false);
    } catch (err) {
      // Handled by hook
    }
  };

  const downloadTemplate = () => {
    const headers = ["name", "email", "registrationNumber", "department", "program"];
    const rows = [
      ["John Doe", "john@example.com", "2024/CS/001", "Computer Science", "Bachelor of Science"],
      ["Jane Smith", "jane@example.com", "2024/IT/042", "Information Technology", "Bachelor of IT"]
    ];
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_bulk_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
        if (!val) setFile(null);
        onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <div className="bg-red-600 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Upload className="h-32 w-32" />
            </div>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    Bulk Student Import
                </DialogTitle>
                <p className="text-red-100 text-sm mt-2">Upload a CSV file to create multiple student accounts at once.</p>
            </DialogHeader>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <div className="p-8 space-y-6">
              <button 
                  onClick={downloadTemplate}
                  className="w-full flex items-center justify-between p-4 border border-red-100 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors group"
              >
                  <div className="flex items-center gap-3">
                      <div className="bg-red-600 p-2 rounded-lg text-white">
                          <Download className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                          <p className="text-sm font-bold text-red-900 leading-none">Download Template</p>
                          <p className="text-[10px] text-red-600 mt-1 uppercase tracking-wider font-medium">Standard format required</p>
                      </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-red-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                      "border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer flex flex-col items-center text-center gap-4",
                      file ? "border-green-300 bg-green-50/30" : "border-gray-200 hover:border-red-400 hover:bg-red-50/30"
                  )}
              >
                  <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept=".csv" 
                      className="hidden" 
                  />
                  
                  {file ? (
                      <>
                          <div className="bg-green-100 p-4 rounded-full text-green-600">
                              <FileText className="h-8 w-8" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-black">{file.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB • Ready to sync</p>
                          </div>
                          <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 font-bold"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setFile(null);
                              }}
                          >
                              <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                      </>
                  ) : (
                      <>
                          <div className="bg-gray-100 p-4 rounded-full text-gray-400 group-hover:text-red-500 transition-colors">
                              <Upload className="h-8 w-8" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-black group-hover:text-red-600 transition-colors">Select your CSV file</p>
                              <p className="text-xs text-gray-500 mt-1">Drag and drop or click to browse</p>
                          </div>
                      </>
                  )}
              </div>

              <div className="space-y-4 pb-4">
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                      <p className="text-[10px] text-amber-800 leading-relaxed uppercase font-bold tracking-tight">
                          Ensure all emails and registration numbers are unique. 
                          Temporary passwords will be delivered to students upon completion.
                      </p>
                  </div>

                  <Button 
                      onClick={handleUpload}
                      disabled={!file || bulkCreate.isPending}
                      className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2"
                  >
                      {bulkCreate.isPending ? (
                          <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing Records...
                          </>
                      ) : (
                          <>
                              <CheckCircle2 className="h-4 w-4" />
                              Finalize and Import
                          </>
                      )}
                  </Button>
              </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
    )
}
