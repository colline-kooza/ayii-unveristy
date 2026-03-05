"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  FileBadge,
  MoreHorizontal,
  Mail,
  Phone,
  CheckSquare,
  Square,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("PENDING");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admissions");
      const data = await res.json();
      setApplications(data || []);
    } catch (error) {
      toast.error("Failed to synchronize applications");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: string, reason?: string) => {
    const previousApps = [...applications];
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status, rejectionReason: reason || null } : app
    ));

    try {
      setProcessing(true);
      const res = await fetch(`/api/admissions/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: reason })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");

      toast.success(status === "APPROVED" ? "Institutional Credentials Dispatched" : "Application Decoupled");
      setIsDetailsOpen(false);
      setIsRejectOpen(false);
      fetchApplications();
    } catch (error: any) {
      setApplications(previousApps);
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkAction = async (status: string) => {
    if (!selectedIds.length) return;
    
    setProcessing(true);
    let successCount = 0;
    
    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/admissions/${id}/review`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });
        if (res.ok) successCount++;
      }
      toast.success(`Bulk Processing Complete: ${successCount} Synchronization(s) Successful`);
      setSelectedIds([]);
      fetchApplications();
    } catch (error) {
      toast.error("Bulk processing interrupted");
    } finally {
      setProcessing(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentTabApps = applications.filter(a => a.status === activeTab);
    if (selectedIds.length === currentTabApps.length && currentTabApps.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentTabApps.map(a => a.id));
    }
  };

  const filteredApps = Array.isArray(applications) ? applications.filter(app => 
    app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge className="bg-orange-50 text-orange-600 border border-orange-100 text-[9px] font-black uppercase px-3 py-1 rounded-lg gap-2"><Clock className="h-3 w-3" /> Awaiting Audit</Badge>;
      case "APPROVED": return <Badge className="bg-green-50 text-green-600 border border-green-100 text-[9px] font-black uppercase px-3 py-1 rounded-lg gap-2"><CheckCircle2 className="h-3 w-3" /> System Approved</Badge>;
      case "REJECTED": return <Badge className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-black uppercase px-3 py-1 rounded-lg gap-2"><XCircle className="h-3 w-3" /> De-synchronized</Badge>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-8 bg-[#fcfdfe] min-h-screen relative">
      {/* Institutional Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/5 rounded-2xl">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Admissions Ledger</h1>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 italic">
              Academic Unit Onboarding & Synchronization
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Badge className="bg-gray-900 text-white border-0 text-[10px] font-black uppercase px-5 py-2 rounded-xl shadow-lg shadow-gray-200">
             {applications.filter(a => a.status === "PENDING").length} Pending Audits
           </Badge>
        </div>
      </header>

      <Tabs defaultValue="PENDING" onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between mb-8">
          <TabsList className="bg-gray-100/50 p-1 rounded-xl border border-gray-100 italic h-10">
            {[
              { id: "PENDING", label: "Pending" },
              { id: "APPROVED", label: "Approved" },
              { id: "REJECTED", label: "Rejected" }
            ].map((tab) => {
              const count = applications.filter(a => a.status === tab.id).length;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="rounded-lg px-6 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm h-full gap-2"
                >
                  {tab.label}
                  <span className={cn(
                    "ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold border",
                    activeTab === tab.id 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "bg-gray-200/50 border-gray-300/30 text-gray-500"
                  )}>
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 font-bold" />
              <Input 
                placeholder="Search candidate registry..." 
                className="pl-10 h-10 text-[12px] border-gray-100 bg-white shadow-none rounded-xl focus:border-primary/30 focus:ring-primary/5 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === "PENDING" && (
              <Button 
                variant="outline" 
                onClick={toggleSelectAll}
                className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-gray-100 hover:bg-gray-50"
              >
                {selectedIds.length > 0 ? "De-select All" : "Select All"}
              </Button>
            )}
          </div>
        </div>

        {["PENDING", "APPROVED", "REJECTED"].map((status) => (
          <TabsContent key={status} value={status} className="mt-0 outline-none">
             <div className="grid gap-5">
               {filteredApps.filter(app => app.status === status).length > 0 ? (
                 filteredApps.filter(app => app.status === status).map((app) => (
                   <Card key={app.id} className={cn(
                     "border-none shadow-xl shadow-gray-200/40 bg-white rounded-[2rem] overflow-hidden transition-all group relative",
                     selectedIds.includes(app.id) && "ring-2 ring-primary ring-offset-2"
                   )}>
                     <CardContent className="p-0">
                       <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                         {status === "PENDING" && (
                           <div className="flex items-center justify-center">
                             <Checkbox 
                               checked={selectedIds.includes(app.id)}
                               onCheckedChange={() => toggleSelect(app.id)}
                               className="h-5 w-5 rounded-lg data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                             />
                           </div>
                         )}
                         
                         <div className="flex items-center gap-4 flex-1 min-w-0">
                           <Avatar className="h-12 w-12 rounded-2xl border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center shrink-0">
                             <AvatarFallback className="text-gray-400 font-black text-xs">
                               {(app.fullName || "??").split(" ").map((n: string) => n[0]).join("")}
                             </AvatarFallback>
                           </Avatar>
                           <div className="min-w-0">
                             <h3 className="text-[15px] font-black text-gray-900 truncate tracking-tight">{app.fullName}</h3>
                             <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{app.email}</span>
                             </div>
                           </div>
                         </div>

                         <div className="flex items-center gap-8 px-8 border-l border-gray-50 flex-1">
                           <div className="flex flex-col">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Target Academic Unit</p>
                             <span className="text-[12px] font-black text-gray-900">{app.course?.title}</span>
                           </div>
                           <div className="hidden xl:flex flex-col">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Sync Date</p>
                             <span className="text-[12px] font-black text-gray-900">{new Date(app.createdAt).toLocaleDateString()}</span>
                           </div>
                         </div>

                         <div className="flex items-center justify-between lg:justify-end gap-4 flex-1">
                           {status === "PENDING" ? (
                             <>
                               <Button 
                                 size="sm"
                                 onClick={() => { setSelectedApp(app); setIsRejectOpen(true); }}
                                 className="h-10 w-10 p-0 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-xl border-none transition-all"
                               >
                                 <ThumbsDown className="h-4 w-4" />
                               </Button>
                               <Button 
                                 size="sm"
                                 onClick={() => handleReview(app.id, "APPROVED")}
                                 className="h-10 w-10 p-0 text-green-600 hover:text-white bg-green-50 hover:bg-green-600 rounded-xl border-none transition-all"
                               >
                                 <ThumbsUp className="h-4 w-4" />
                               </Button>
                               <div className="h-8 w-px bg-gray-50 mx-2" />
                             </>
                           ) : (
                             <div className="mr-auto">{getStatusBadge(app.status)}</div>
                           )}
                           
                           <Button 
                             onClick={() => { setSelectedApp(app); setIsDetailsOpen(true); }}
                             variant="ghost"
                             className="h-10 px-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all gap-2"
                           >
                             View Audit <ChevronRight className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 ))
               ) : (
                 <div className="py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                    <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
                      <Layers className="h-8 w-8 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight">Registry Empty</h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest max-w-sm mx-auto italic">
                      No candidate profiles detected in the {status.toLowerCase()} synchronization queue.
                    </p>
                 </div>
               )}
             </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Sticky Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-primary/20 flex items-center gap-8 border border-white/10 backdrop-blur-xl">
             <div className="flex items-center gap-3 border-r border-white/10 pr-8">
               <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center font-black text-xs">
                 {selectedIds.length}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Candidates Selected</span>
             </div>
             <div className="flex items-center gap-4">
               <Button 
                 disabled={processing}
                 onClick={() => handleBulkAction("APPROVED")}
                 className="bg-white hover:bg-green-500 text-gray-900 hover:text-white h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2"
               >
                 {processing ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" />}
                 Bulk Approve
               </Button>
               <Button 
                 variant="ghost"
                 disabled={processing}
                 onClick={() => { /* Bulk rejection would need a reason modal, keeping it simple for now or adding a default 'Bulk Rejected' */ handleBulkAction("REJECTED"); }}
                 className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all gap-2"
               >
                 <ThumbsDown className="h-3 w-3" />
                 Bulk Reject
               </Button>
               <Button 
                 variant="ghost"
                 onClick={() => setSelectedIds([])}
                 className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all ml-2"
               >
                 Cancel
               </Button>
             </div>
          </div>
        </div>
      )}

      {/* Audit Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem] bg-[#fcfdfe]">
          <DialogHeader className="p-8 pb-4 bg-gray-900 text-white rounded-t-[2rem]">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-black tracking-tight">Audit Protocol: Profile Verification</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold uppercase text-[9px] mt-1 tracking-widest italic">Institutional Archive Synchronization</DialogDescription>
              </div>
              {selectedApp && getStatusBadge(selectedApp.status)}
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
             <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div>
                   <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 border-b border-gray-100 pb-2 italic">Identity Synthesis</h4>
                   <div className="space-y-4">
                     <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Full Entity Name</p>
                       <p className="text-[13px] font-black text-gray-900 uppercase">{selectedApp?.fullName}</p>
                     </div>
                     <div className="flex gap-10">
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Digital Route</p>
                          <p className="text-[12px] font-bold text-gray-900">{selectedApp?.email}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Comm Uplink</p>
                          <p className="text-[12px] font-bold text-gray-900">{selectedApp?.phone}</p>
                        </div>
                     </div>
                   </div>
                 </div>

                 <div>
                   <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 border-b border-gray-100 pb-2 italic">Academic Heritage</h4>
                   <div className="space-y-4">
                     <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Preceding Institution</p>
                       <p className="text-[13px] font-black text-gray-900 uppercase">{selectedApp?.academicRecords?.school}</p>
                     </div>
                     <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Attained Certification</p>
                       <p className="text-[13px] font-black text-gray-900 uppercase">{selectedApp?.academicRecords?.qualification}</p>
                     </div>
                     <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Performance Metadata</p>
                       <p className="text-[12px] font-medium text-gray-600 leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">"{selectedApp?.academicRecords?.summary}"</p>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="space-y-6">
                 <div>
                   <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 border-b border-gray-100 pb-2 italic">Institutional Artifacts</h4>
                   <div className="grid gap-3">
                     {selectedApp?.academicDocs?.map((doc: string, i: number) => (
                       <a 
                         key={i} 
                         href={`/api/r2/download?key=${doc}`} 
                         target="_blank" 
                         className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                       >
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                              <FileBadge className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                            </div>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Artifact_Sync_{i+1}</span>
                         </div>
                         <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-primary" />
                       </a>
                     ))}
                     {(!selectedApp?.academicDocs || selectedApp.academicDocs.length === 0) && (
                       <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                         <AlertCircle className="h-5 w-5 text-gray-300 mx-auto mb-2" />
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Zero Evidence Detected</p>
                       </div>
                     )}
                   </div>
                 </div>
                 
                 {selectedApp?.status === "REJECTED" && (
                   <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                     <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-2 italic">De-sync Logic Exception</p>
                     <p className="text-[12px] font-bold text-red-800 leading-relaxed italic border-l-2 border-red-300 pl-4">{selectedApp.rejectionReason}</p>
                   </div>
                 )}
               </div>
             </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t border-gray-100 rounded-b-[2rem] gap-4">
            {selectedApp?.status === "PENDING" && (
              <div className="flex items-center gap-3 w-full">
                <Button 
                  disabled={processing}
                  onClick={() => setIsRejectOpen(true)}
                  variant="ghost" 
                  className="h-11 px-6 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  Reject Candidate
                </Button>
                <Button 
                  disabled={processing}
                  onClick={() => handleReview(selectedApp.id, "APPROVED")}
                  className="h-11 px-8 bg-gray-900 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-gray-200 transition-all gap-2 flex-grow sm:flex-grow-0"
                >
                  {processing ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" />}
                  Approve Application
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsOpen(false)}
                  className="h-11 px-6 text-[10px] font-black uppercase tracking-widest border-gray-100 rounded-xl transition-all ml-auto"
                >
                  Exit Audit
                </Button>
              </div>
            )}
            {selectedApp?.status !== "PENDING" && (
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsOpen(false)}
                className="h-11 px-8 text-[10px] font-black uppercase tracking-widest border-gray-100 rounded-xl transition-all ml-auto"
              >
                Close Folder
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-8 border-none shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">Sync Exception Logic</DialogTitle>
            <DialogDescription className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 italic">Candidate Rejection Parameters</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-3 block ml-1">Formal Audit Discrepancy</Label>
            <Textarea 
              className="min-h-[140px] rounded-2xl border-gray-100 focus:border-red-500 transition-all text-[13px] font-medium p-5 resize-none bg-gray-50/30"
              placeholder="e.g. Incomplete documentation artifacts detected..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-3">
             <Button variant="ghost" onClick={() => setIsRejectOpen(false)} className="rounded-xl h-11 text-[10px] font-black uppercase transition-all">Cancel</Button>
             <Button 
               disabled={!rejectionReason || processing}
               onClick={() => handleReview(selectedApp.id, "REJECTED", rejectionReason)}
               className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 px-8 text-[10px] font-black uppercase shadow-lg shadow-red-200 transition-all"
             >
               Finalize Exception
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
