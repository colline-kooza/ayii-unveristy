"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Code, 
  Building, 
  GraduationCap,
  Calendar,
  User,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description?: string;
  unitCode: string;
  department: string;
  _count?: {
    enrollments: number;
  };
  lecturer?: {
    name: string;
    email?: string;
  };
  createdAt?: string;
}

interface ViewCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

export function ViewCourseModal({
  open,
  onOpenChange,
  course,
}: ViewCourseModalProps) {
  if (!course) return null;

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
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
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#8B1538] to-[#6B1329] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Course Details</DialogTitle>
          </DialogHeader>
        </div>

        {/* Course Content */}
        <div className="p-6 space-y-6">
          {/* Course Title and Code */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center border-4 border-white shadow-lg -mt-14">
              <BookOpen className="h-8 w-8 text-[#8B1538]" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-black">{course.title}</h3>
              <code className="inline-block mt-2 bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-bold border border-red-100">
                {course.unitCode}
              </code>
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Course Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="space-y-2">
            <InfoRow icon={Building} label="Department" value={course.department} />
            
            {course.lecturer && (
              <InfoRow 
                icon={User} 
                label="Lead Lecturer" 
                value={course.lecturer.name} 
              />
            )}
            
            <InfoRow 
              icon={Users} 
              label="Total Enrollments" 
              value={`${course._count?.enrollments || 0} students`} 
            />
            
            {course.createdAt && (
              <InfoRow 
                icon={Calendar} 
                label="Created" 
                value={new Date(course.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 
              />
            )}
          </div>

          {/* Enrollment Badge */}
          <div className="flex justify-center pt-2">
            <Badge 
              variant="secondary" 
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-bold px-4 py-2"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              {course._count?.enrollments || 0} Active Students
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
