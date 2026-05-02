"use client";

import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { GraduationCap, Users, BookOpen, Award, Target, Eye, Heart } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Students Enrolled", value: "10,000+", icon: Users },
  { label: "Expert Lecturers", value: "500+", icon: GraduationCap },
  { label: "Courses Available", value: "200+", icon: BookOpen },
  { label: "Success Rate", value: "95%", icon: Award },
];

const values = [
  { icon: Target, title: "Excellence", description: "We strive for academic excellence, ensuring the highest quality education for every student." },
  { icon: Eye, title: "Innovation", description: "We embrace innovative teaching methods and cutting-edge technology to enhance learning." },
  { icon: Heart, title: "Integrity", description: "We uphold the highest standards of integrity, honesty, and ethical conduct in all academic pursuits." },
  { icon: Users, title: "Community", description: "We foster an inclusive community where every student can thrive and reach their full potential." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "320px", paddingTop: "64px" }}>
        <div className="absolute inset-0">
          <img src="/img2.jpeg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A0F23]/88 via-[#8B1538]/82 to-[#6B1329]/92" />
        </div>
        <div className="relative w-full text-center px-4 py-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold mb-3 uppercase tracking-widest">
            <GraduationCap className="w-3 h-3" />
            About Us
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            Empowering Minds,
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              Shaping Futures
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1">
            AYii University is committed to providing world-class education that prepares students for success in a changing global landscape.
          </p>
        </div>
      </section>

      <main>
        {/* Stats */}
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B1538]/10 mb-2.5">
                    <stat.icon className="h-5 w-5 text-[#8B1538]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 leading-none mb-1">{stat.value}</h3>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-10 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="h-9 w-9 rounded-lg bg-[#8B1538]/10 flex items-center justify-center mb-3">
                  <Target className="h-4.5 w-4.5 text-[#8B1538]" />
                </div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Our Mission</h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  To provide accessible, high-quality education that empowers students with the knowledge, skills, and values needed to excel in their chosen fields and contribute meaningfully to society.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="h-9 w-9 rounded-lg bg-[#8B1538]/10 flex items-center justify-center mb-3">
                  <Eye className="h-4.5 w-4.5 text-[#8B1538]" />
                </div>
                <h2 className="text-base font-bold text-gray-900 mb-2">Our Vision</h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  To be a leading institution of higher learning, recognized globally for academic excellence, innovative research, and producing graduates who are leaders and change-makers in their communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-[#8B1538]/10 text-[#8B1538] rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Our Values</span>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">What We Stand For</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto">Our core values guide everything we do and shape the culture of our institution.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v, i) => (
                <div key={i} className="text-center p-5 rounded-xl border border-gray-100 hover:border-[#8B1538]/20 hover:shadow-sm transition-all">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B1538]/10 mb-3">
                    <v.icon className="h-5 w-5 text-[#8B1538]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{v.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-gradient-to-r from-[#5A0F23] via-[#8B1538] to-[#6B1329]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-extrabold text-white mb-2">Ready to Start Your Journey?</h2>
            <p className="text-xs text-white/60 mb-6 max-w-md mx-auto">
              Join thousands of students already transforming their futures with AYii University.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/courses" className="px-6 py-2.5 bg-white text-[#8B1538] font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm">
                Browse Courses
              </Link>
              <Link href="/contact" className="px-6 py-2.5 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/15 transition-colors text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
