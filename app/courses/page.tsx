"use client";

import React, { useEffect, useState } from "react";
import { 
  BookOpen, 
  Search, 
  Users, 
  Star,
  ChevronRight,
  Loader2,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const handleCourseAction = () => {
    if (user) {
      // User is logged in, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not logged in, redirect to sign in
      router.push("/auth/sign-in");
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
          <p className="text-xs font-semibold text-gray-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-16 text-white lg:py-20 mt-14">
          <div className="container relative z-10 mx-auto px-6 lg:px-12 text-center">
            <Badge className="mb-4 bg-red-600/20 text-red-400 border-red-500/30 text-xs font-semibold px-4 py-1">
              Course Catalog 2026
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Explore Our <br />
              <span className="text-red-400">Academic Programs</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-gray-300 mb-6">
              Discover our comprehensive selection of courses designed to help you achieve your academic and professional goals.
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by department, code, or course title..." 
                className="h-10 pl-10 pr-4 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <div className="container mx-auto px-6 lg:px-12 -mt-6 relative z-20 pb-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="border-gray-200 bg-white hover:shadow-lg transition-all group flex flex-col">
                <CardHeader className="p-0 relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
                  <img 
                    src="https://img.freepik.com/free-photo/group-diverse-pupils-engaging-online-course-discussion-via-video-call_482257-123125.jpg?semt=ais_hybrid&w=740&q=80"
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-white/90 text-gray-900 border-0 text-xs font-semibold">
                      {course.unitCode}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 z-20 right-3">
                     <h2 className="text-base font-bold text-white mb-0.5">{course.title}</h2>
                     <p className="text-xs font-medium text-red-300">{course.department}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-7 w-7 border">
                      <AvatarImage src={course.lecturer?.image || ""} />
                      <AvatarFallback className="bg-red-100 text-red-700 text-xs font-semibold">
                        {course.lecturer?.name?.[0] || 'L'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-gray-500">Instructor</p>
                      <p className="text-xs font-semibold text-gray-900">{course.lecturer?.name || "Faculty Member"}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                    {course.description || "Comprehensive course covering essential concepts and practical applications."}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-lg">
                      <Users className="h-3 w-3 text-red-600" />
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{course._count?.enrollments || 0}</p>
                        <p className="text-xs text-gray-500">Students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-lg">
                      <Star className="h-3 w-3 text-orange-500" />
                      <div>
                        <p className="text-xs font-semibold text-gray-900">4.9</p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-5 pt-0 mt-auto">
                  <Button 
                    onClick={handleCourseAction}
                    className="w-full h-9 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold gap-2"
                  >
                    {user ? (
                      <>
                        View Course
                        <ChevronRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        Sign In to Enroll
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Try adjusting your search criteria to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
