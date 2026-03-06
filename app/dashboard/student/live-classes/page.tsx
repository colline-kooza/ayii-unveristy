"use client";

import React, { useState, useEffect } from "react";
import { 
  Video, 
  ExternalLink, 
  Clock, 
  MonitorPlay,
  Users,
  Search,
  BookOpen,
  ArrowRight,
  Wifi,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";

interface Course {
  id: string;
  title: string;
  unitCode: string;
}

interface Lecturer {
  name: string | null;
}

interface LiveLecture {
  id: string;
  courseId: string;
  meetingUrl: string;
  status: "LIVE" | "ENDED";
  startedAt: string;
  course: Course;
  lecturer: Lecturer;
}

export default function StudentLiveClasses() {
  const [lectures, setLectures] = useState<LiveLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLectures = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/lectures");
      if (res.ok) {
        const data = await res.json();
        setLectures(data);
      }
    } catch (error) {
      toast.error("Failed to load live classes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
    // Poll for new lectures every 30 seconds
    const interval = setInterval(fetchLectures, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredLectures = lectures.filter(l => 
    l.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.course.unitCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto min-h-screen bg-[#fcfdfe]">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-600 p-8 lg:p-12 text-white shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-2xl" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
            Live Classes Available
          </Badge>
          <h1 className="text-xl lg:text-3xl font-black tracking-tighter italic leading-[1.1]">
            Join Live <br />
            <span className="text-primary-100">Classes</span> Now.
          </h1>
          <p className="text-primary-50 text-sm font-medium italic opacity-90">
            Connect instantly with your lecturers and peers in high-definition virtual classrooms.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <Wifi className="w-4 h-4 text-green-300 animate-pulse" />
              <span className="text-xs font-bold italic tracking-wide">{lectures.length} Live Classes</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-bold italic tracking-wide">Interactive Audio/Video</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-black italic">Available Classes</h2>
          <p className="text-xs text-gray-400 font-medium italic tracking-wide">Select a live class to join the session.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search courses..." 
            className="pl-10 h-11 text-sm rounded-2xl border-gray-100 bg-white/50 focus:ring-primary/20 italic"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredLectures.length > 0 ? (
            filteredLectures.map((lecture, idx) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full border-t-2 border-t-transparent hover:border-t-primary">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        LIVE
                      </Badge>
                      <span className="text-[10px] font-black text-gray-300 tracking-[0.2em] italic uppercase">{lecture.course.unitCode}</span>
                    </div>
                    <CardTitle className="text-xl font-black italic group-hover:text-primary transition-colors leading-tight">
                      {lecture.course.title}
                    </CardTitle>
                    <CardDescription className="font-bold text-gray-400 flex items-center gap-2 mt-2 italic">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="w-3 h-3 text-gray-500" />
                      </div>
                      Lecturer: {lecture.lecturer.name || "Academic Staff"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-50 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold italic tracking-wide text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Started At
                        </span>
                        <span className="text-gray-600">{format(new Date(lecture.startedAt), "hh:mm a")}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold italic tracking-wide text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <MonitorPlay className="w-3.5 h-3.5" />
                          Platform
                        </span>
                        <span className="text-gray-600 uppercase">Meeting Link</span>
                      </div>
                    </div>

                    <Button 
                      asChild
                      className="w-full h-11 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-sm italic tracking-wider transition-all shadow-lg shadow-primary/20 group/btn"
                    >
                      <a href={lecture.meetingUrl} target="_blank" rel="noopener noreferrer">
                        Join Class Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center animate-pulse">
                <Video className="w-10 h-10 text-gray-100" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black italic text-gray-400 uppercase tracking-widest">No Live Classes</h3>
                <p className="text-xs text-gray-300 font-bold italic">There are no live classes at the moment. Check back later.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
