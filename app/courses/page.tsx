"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Users, Star, ChevronRight, Loader2, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/useAuth";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: user } = useMe();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses/public")
      .then((r) => r.json())
      .then((d) => { setCourses(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = () => router.push(user ? "/dashboard" : "/auth/sign-in");

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B1538]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "320px", paddingTop: "64px" }}>
        <div className="absolute inset-0">
          <img src="/img2.jpeg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A0F23]/88 via-[#8B1538]/82 to-[#6B1329]/92" />
        </div>
        <div className="relative w-full text-center px-4 py-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold mb-3 uppercase tracking-widest">
            <BookOpen className="w-3 h-3" />
            Course Catalog 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            Explore Our
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              Academic Programs
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1 mb-5">
            Discover courses designed to help you achieve your academic and professional goals.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center bg-white/10 border border-white/25 rounded-xl backdrop-blur-sm overflow-hidden focus-within:border-white/50 focus-within:bg-white/15 transition-all shadow-lg shadow-black/20">
              <Search className="ml-4 h-4 w-4 text-white/50 shrink-0" />
              <input
                type="text"
                placeholder="Search by department, code, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mr-3 text-white/40 hover:text-white/70 text-xs font-medium transition-colors">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No courses found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-6">
              <span className="font-semibold text-gray-700 text-sm">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""} available
            </p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <div key={course.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                    <img
                      src="https://img.freepik.com/free-photo/group-diverse-pupils-engaging-online-course-discussion-via-video-call_482257-123125.jpg?semt=ais_hybrid&w=740&q=80"
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 z-20">
                      <span className="px-2 py-0.5 bg-white/90 text-gray-900 rounded-full text-[10px] font-bold">
                        {course.unitCode}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-3 z-20 right-3">
                      <h2 className="text-sm font-bold text-white leading-snug mb-0.5 line-clamp-1">{course.title}</h2>
                      <p className="text-[10px] font-medium text-[#FFB3BA]">{course.department}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6 border border-gray-200">
                        <AvatarImage src={course.lecturer?.image || ""} />
                        <AvatarFallback className="bg-[#8B1538]/10 text-[#8B1538] text-[10px] font-bold">
                          {course.lecturer?.name?.[0] || "L"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[10px] text-gray-400">Instructor</p>
                        <p className="text-xs font-semibold text-gray-800 leading-none">{course.lecturer?.name || "Faculty Member"}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed flex-1">
                      {course.description || "Comprehensive course covering essential concepts and practical applications."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded-lg">
                        <Users className="h-3 w-3 text-[#8B1538]" />
                        <div>
                          <p className="text-xs font-bold text-gray-800 leading-none">{course._count?.enrollments ?? 0}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Students</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded-lg">
                        <Star className="h-3 w-3 text-amber-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-800 leading-none">4.9</p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Rating</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleAction}
                      className="w-full h-8 bg-gradient-to-r from-[#8B1538] to-[#C41E3A] hover:from-[#C41E3A] hover:to-[#E63946] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#8B1538]/20"
                    >
                      {user ? (
                        <><span>View Course</span><ChevronRight className="h-3.5 w-3.5" /></>
                      ) : (
                        <><LogIn className="h-3.5 w-3.5" /><span>Sign In to Enroll</span></>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
