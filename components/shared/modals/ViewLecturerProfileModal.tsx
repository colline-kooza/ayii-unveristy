"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Lecturer } from "@/types/admin";
import { getAvatarUrl } from "@/lib/avatarUtils";
import { 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  ShieldCheck,
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewLecturerProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lecturer: Lecturer | null;
}

export function ViewLecturerProfileModal({
  open,
  onOpenChange,
  lecturer,
}: ViewLecturerProfileModalProps) {
  if (!lecturer) return null;

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="h-9 w-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-[#8B1538]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-black mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#8B1538] to-[#6B1329] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Lecturer Profile</DialogTitle>
          </DialogHeader>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg -mt-16">
              <AvatarImage src={getAvatarUrl(lecturer.image, lecturer.name, 'lecturer')} />
              <AvatarFallback className="bg-rose-100 text-[#8B1538] text-2xl font-bold">
                {lecturer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-xl font-bold text-black">{lecturer.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{lecturer.department}</p>
            </div>

            <Badge
              variant={lecturer.status === "ACTIVE" ? "default" : "destructive"}
              className={cn(
                "font-semibold px-3 py-1",
                lecturer.status === "ACTIVE"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100"
              )}
            >
              {lecturer.status === "ACTIVE" ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {lecturer.status}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="space-y-2">
            <InfoRow icon={Mail} label="Email Address" value={lecturer.email} />
            <InfoRow icon={Building} label="Department" value={lecturer.department} />
            {lecturer.specialization && (
              <InfoRow icon={Briefcase} label="Specialization" value={lecturer.specialization} />
            )}
            {lecturer.employeeId && (
              <InfoRow icon={ShieldCheck} label="Employee ID" value={lecturer.employeeId} />
            )}
            {lecturer.createdAt && (
              <InfoRow 
                icon={Calendar} 
                label="Joined" 
                value={new Date(lecturer.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 
              />
            )}
          </div>

          {/* Suspension Reason if applicable */}
          {lecturer.status === "SUSPENDED" && lecturer.suspensionReason && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-semibold text-red-900 uppercase tracking-wide mb-1">
                Suspension Reason
              </p>
              <p className="text-sm text-red-700">{lecturer.suspensionReason}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
