"use client";

import React, { useState, useEffect } from "react";
import { 
  Video, 
  Plus, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MonitorPlay,
  Play,
  StopCircle,
  Users,
  Search,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface Course {
  id: string;
  title: string;
  unitCode: string;
}

interface LiveLecture {
  id: string;
  courseId: string;
  meetingUrl: string;
  status: "LIVE" | "ENDED";
  startedAt: string;
  endedAt: string | null;
  course: Course;
}

export default function LecturerLiveClasses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<LiveLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [open, setOpen] = useState(false);

  // New lecture form state
  const [selectedCourse, setSelectedCourse] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, lecturesRes] = await Promise.all([
        fetch("/api/lecturer/courses"),
        fetch("/api/lectures")
      ]);

      if (coursesRes.ok && lecturesRes.ok) {
        const coursesData = await coursesRes.json();
        const lecturesData = await lecturesRes.json();
        setCourses(coursesData);
        setLectures(lecturesData);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !meetingUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsStarting(true);
    try {
      const res = await fetch("/api/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourse, meetingUrl }),
      });

      if (res.ok) {
        const newLecture = await res.json();
        setLectures([newLecture, ...lectures]);
        toast.success("Live class started successfully!");
        setOpen(false);
        setSelectedCourse("");
        setMeetingUrl("");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to start live class");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndClass = async (id: string) => {
    try {
      const res = await fetch(`/api/lectures/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ENDED" }),
      });

      if (res.ok) {
        const updated = await res.json();
        setLectures(lectures.map(l => l.id === id ? updated : l));
        toast.success("Class ended successfully");
      }
    } catch (error) {
      toast.error("Failed to end class");
    }
  };

  const activeLectures = lectures.filter(l => l.status === "LIVE");
  const pastLectures = lectures.filter(l => l.status === "ENDED");

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto min-h-screen bg-[#fcfdfe]">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="outline" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 border-primary/20">
            Live Learning Terminal
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-black lg:text-4xl italic">
            Broadcast <span className="text-primary">Knowledge.</span>
          </h1>
          <p className="text-gray-500 max-w-xl text-base font-medium leading-relaxed italic">
            Instantly synchronize with your students across the digital campus.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="default" className="rounded-2xl h-11 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3">
              <MonitorPlay className="w-4 h-4" />
              Start Live Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl border-0 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <DialogHeader className="relative">
              <DialogTitle className="text-2xl font-black italic">Initialize Stream</DialogTitle>
              <DialogDescription className="text-gray-500 font-medium italic">
                Select your academic track and meeting coordinates.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleStartClass} className="space-y-6 pt-4 relative">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 italic">Pick Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:ring-primary/20Transition-all italic">
                    <SelectValue placeholder="Select high-audit course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 italic">
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.unitCode}: {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 italic">Meeting URL (Zoom/Meet/Teams)</label>
                <Input 
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:ring-primary/20 italic"
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isStarting}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/10"
                >
                  {isStarting ? "Broadcasting..." : "Go Live Now"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Play className="w-5 h-5 text-green-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black italic">Active Transmissions</h2>
              <p className="text-xs text-gray-400 font-medium italic">Synchronizing institutional intelligence in real-time.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeLectures.length > 0 ? (
              activeLectures.map((lecture) => (
                <motion.div
                  key={lecture.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="rounded-3xl border-0 shadow-sm bg-white hover:shadow-md transition-all border-l-4 border-l-green-500 overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 rounded-md font-bold text-[9px] uppercase tracking-tighter">
                              <span className="w-1 h-1 rounded-full bg-green-500 mr-1 animate-ping" />
                              LIVE NOW
                            </Badge>
                            <span className="text-[10px] font-black text-gray-300 tracking-widest italic">{lecture.course.unitCode}</span>
                          </div>
                          <h3 className="text-xl font-bold italic group-hover:text-primary transition-colors">{lecture.course.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium italic">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              Started {format(new Date(lecture.startedAt), "hh:mm a")}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              Synced with Enrollment
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            className="rounded-xl border-gray-100 hover:bg-gray-50 px-6 font-bold truncate max-w-[150px] italic"
                            asChild
                          >
                            <a href={lecture.meetingUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Join Session
                            </a>
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="rounded-xl px-6 font-bold italic bg-red-50 text-red-600 hover:bg-red-100 border-0"
                            onClick={() => handleEndClass(lecture.id)}
                          >
                            <StopCircle className="w-4 h-4 mr-2" />
                            Terminate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30">
                <CardContent className="h-40 flex flex-col items-center justify-center text-center p-6 italic">
                  <MonitorPlay className="w-10 h-10 text-gray-200 mb-2" />
                  <p className="text-sm font-bold text-gray-400">No active transmissions detected.</p>
                  <p className="text-[10px] text-gray-300 font-medium">Initiate class terminal to begin syncing knowledge.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Audit Trail (Past Lectures) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <h2 className="text-lg font-black italic">Transmission Audit</h2>
              <p className="text-xs text-gray-400 font-medium italic">Historical academic synchronization log.</p>
            </div>
          </div>

          <div className="space-y-3">
            {pastLectures.slice(0, 5).map((lecture) => (
              <Card key={lecture.id} className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden group hover:scale-[1.01] transition-transform">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-gray-300 tracking-widest italic">{lecture.course.unitCode}</span>
                      <Badge className="bg-gray-50 text-gray-400 hover:bg-gray-50 border-none px-1.5 rounded text-[8px] font-bold">COMPLETED</Badge>
                    </div>
                    <h4 className="text-sm font-bold italic truncate">{lecture.course.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium italic">
                      <span>{format(new Date(lecture.startedAt), "MMM dd, yyyy")}</span>
                      <span>{format(new Date(lecture.startedAt), "HH:mm")} - {lecture.endedAt ? format(new Date(lecture.endedAt), "HH:mm") : "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pastLectures.length === 0 && (
              <div className="text-center py-10 italic">
                <BookOpen className="w-8 h-8 text-gray-100 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-300">Clean audit history.</p>
              </div>
            )}
            {pastLectures.length > 5 && (
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary italic hover:bg-primary/5 rounded-xl">
                View Full Academic Ledger
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
