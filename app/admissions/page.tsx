"use client";

import Link from "next/link";
import { CheckCircle, Calendar, FileText, ArrowRight, GraduationCap } from "lucide-react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";

const steps = [
  { number: "01", title: "Create Account",  description: "Sign up and create your student profile with your personal information." },
  { number: "02", title: "Browse Courses",  description: "Explore our course catalog and find programs that match your interests." },
  { number: "03", title: "Enroll",          description: "Complete enrollment and start your learning journey with us." },
  { number: "04", title: "Start Learning",  description: "Access course materials, attend live classes, and engage with the community." },
];

const requirements = [
  "Valid government-issued ID or passport",
  "High school diploma or equivalent certificate",
  "Completed application form",
  "Personal statement (500 words)",
  "Two letters of recommendation",
  "Official transcripts from previous institutions",
];

const intakes = [
  { season: "Spring Semester", dates: "January – May",       deadline: "December 15" },
  { season: "Summer Semester", dates: "June – August",       deadline: "May 15" },
  { season: "Fall Semester",   dates: "September – December", deadline: "August 15" },
];

export default function AdmissionsPage() {
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
            Admissions
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            Start Your Journey
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              With Us Today
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1 mb-5">
            Join thousands of students transforming their futures through quality education at AYii University.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#8B1538] font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm shadow-lg shadow-black/20"
          >
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <main>
        {/* Steps */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-[#8B1538]/10 text-[#8B1538] rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">How It Works</span>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Simple Application Process</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto">Four simple steps to begin your academic journey.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((step, i) => (
                <div key={i} className="relative bg-white p-5 rounded-xl border border-gray-200 hover:border-[#8B1538]/30 hover:shadow-sm transition-all">
                  <div className="text-3xl font-extrabold text-[#8B1538]/10 mb-3 leading-none">{step.number}</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-10 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <span className="inline-block px-3 py-1 bg-[#8B1538]/10 text-[#8B1538] rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Requirements</span>
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">What You'll Need</h2>
                <p className="text-xs text-gray-500 mb-5 leading-relaxed">Have the following documents ready before starting your application.</p>
                <div className="space-y-2.5">
                  {requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#8B1538]/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-3 w-3 text-[#8B1538]" />
                      </div>
                      <p className="text-xs text-gray-700">{req}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="h-10 w-10 rounded-xl bg-[#8B1538]/10 flex items-center justify-center mb-3">
                  <FileText className="h-5 w-5 text-[#8B1538]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                  Our admissions team is here to guide you through every step of the application process.
                </p>
                <Link
                  href="/contact"
                  className="block w-full h-9 bg-gradient-to-r from-[#8B1538] to-[#C41E3A] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center shadow-sm"
                >
                  Contact Admissions
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Intake Dates */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-[#8B1538]/10 text-[#8B1538] rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Important Dates</span>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Semester Intake Dates</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto">Plan ahead with our semester schedule and application deadlines.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {intakes.map((intake, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-[#8B1538]/30 hover:shadow-sm transition-all">
                  <div className="h-9 w-9 rounded-lg bg-[#8B1538]/10 flex items-center justify-center mb-3">
                    <Calendar className="h-4.5 w-4.5 text-[#8B1538]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">{intake.season}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Duration</p>
                      <p className="text-xs text-gray-700 font-medium">{intake.dates}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Deadline</p>
                      <p className="text-xs text-[#8B1538] font-bold">{intake.deadline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-gradient-to-r from-[#5A0F23] via-[#8B1538] to-[#6B1329]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-extrabold text-white mb-2">Ready to Apply?</h2>
            <p className="text-xs text-white/60 mb-6 max-w-sm mx-auto">Take the first step towards your future. Start your application today.</p>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#8B1538] font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Begin Application <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
