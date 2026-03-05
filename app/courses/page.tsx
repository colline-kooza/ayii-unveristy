"use client";

import React, { useEffect, useState } from "react";
import { 
  BookOpen, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  GraduationCap,
  Star,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/courses/public")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fcfdfe]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Synchronizing Institutional Assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 py-24 text-white lg:py-32">
          <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="container relative z-10 mx-auto px-6 lg:px-12 text-center">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-1.5 backdrop-blur-xl">
              Institutional Course Directory 2026
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
              Architecting The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary/80 animate-gradient-x">Future of Learning</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[13px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-12">
              Explore our curated selection of high-performance academic units designed to elevate professional capacity and technical mastery.
            </p>
            
            <div className="max-w-xl mx-auto relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Query Department, Unit Code or Course Title..." 
                className="h-14 pl-14 pr-6 bg-white/5 border-white/10 text-white rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary/30 text-[13px] font-medium backdrop-blur-xl transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <div className="container mx-auto px-6 lg:px-12 -mt-10 relative z-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="border-none shadow-2xl shadow-gray-200/40 bg-white rounded-[2rem] overflow-hidden hover:ring-2 hover:ring-primary/10 transition-all group flex flex-col">
                <CardHeader className="p-0 relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent z-10"></div>
                  <img 
                    src={`https://images.unsplash.com/photo-1523050335392-93851179ae09?q=80&w=800&auto=format&fit=crop&sig=${course.id}`} 
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <Badge className="bg-white/10 text-white border-white/20 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 backdrop-blur-xl">
                      {course.unitCode}
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 z-20 right-6">
                     <h2 className="text-xl font-black text-white tracking-tight leading-[1.1] mb-1">{course.title}</h2>
                     <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest leading-none">{course.department}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-8 w-8 rounded-xl border border-gray-100 shadow-sm">
                      <AvatarImage src={course.lecturer?.image || ""} />
                      <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black">
                        {course.lecturer?.name?.[0] || 'L'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Director of Studies</p>
                      <p className="text-[11px] font-black text-gray-900">{course.lecturer?.name || "Senior Faculty"}</p>
                    </div>
                  </div>

                  <p className="text-[13px] font-bold text-gray-500 mb-8 line-clamp-2 leading-relaxed h-10">
                    {course.description || "Comprehensive academic exploration of institutional fundamentals and strategic paradigms."}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 transition-colors group-hover:bg-gray-100/50">
                      <Users className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-[11px] font-black text-gray-900 leading-none">{course._count?.enrollments || 0}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Agents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 transition-colors group-hover:bg-gray-100/50">
                      <Star className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-[11px] font-black text-gray-900 leading-none">4.9</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Rating</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-8 pt-0 mt-auto">
                  <Link href={`/apply/${course.id}`} className="w-full">
                    <Button className="w-full h-12 bg-gray-900 hover:bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-gray-200/50 transition-all gap-3 group/btn">
                      Initiate Application
                      <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 mb-6">
                <BookOpen className="h-10 w-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Zero Academic Units Found</h3>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest max-w-sm mx-auto">
                Your query did not synchronize with our institutional directory. Please refine your search parameters.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
