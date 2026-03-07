"use client";

import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, FileText, Users, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdmissionsPage() {
  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up and create your student profile with your personal information."
    },
    {
      number: "02",
      title: "Browse Courses",
      description: "Explore our comprehensive course catalog and find programs that match your interests."
    },
    {
      number: "03",
      title: "Enroll",
      description: "Complete the enrollment process and start your learning journey with us."
    },
    {
      number: "04",
      title: "Start Learning",
      description: "Access course materials, attend live classes, and engage with our community."
    }
  ];

  const requirements = [
    "Valid government-issued ID or passport",
    "High school diploma or equivalent certificate",
    "Completed application form",
    "Personal statement (500 words)",
    "Two letters of recommendation",
    "Official transcripts from previous institutions"
  ];

  const intakes = [
    { season: "Spring Semester", dates: "January - May", deadline: "December 15" },
    { season: "Summer Semester", dates: "June - August", deadline: "May 15" },
    { season: "Fall Semester", dates: "September - December", deadline: "August 15" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-black to-gray-800 py-20 text-white lg:py-32">
          <div className="container relative z-10 mx-auto px-6 lg:px-12">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-red-600/20 text-red-400 border-red-500/30 text-xs font-semibold px-5 py-1.5">
                Admissions
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Start Your Journey <br />
                <span className="text-red-400">With Us Today</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Join thousands of students who are transforming their futures through quality education at AYii University.
              </p>
              <Link href="/auth/sign-in">
                <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2">
                  Apply Now
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-red-100 text-red-700 text-xs font-semibold px-5 py-1.5">
                How It Works
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
                Simple Application Process
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting started is easy. Follow these four simple steps to begin your academic journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-red-500 transition-colors">
                    <div className="text-5xl font-bold text-red-100 mb-4">{step.number}</div>
                    <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-red-100 text-red-700 text-xs font-semibold px-5 py-1.5">
                  Requirements
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
                  What You'll Need
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Make sure you have the following documents ready before starting your application. This will help streamline the process.
                </p>
                <div className="space-y-4">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <p className="text-gray-700">{req}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-6">
                  Our admissions team is here to guide you through every step of the application process.
                </p>
                <Link href="/contact">
                  <button className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
                    Contact Admissions
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Intake Dates */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-red-100 text-red-700 text-xs font-semibold px-5 py-1.5">
                Important Dates
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
                Semester Intake Dates
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Plan ahead with our semester schedule and application deadlines.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {intakes.map((intake, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-red-500 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mb-6">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">{intake.season}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Duration</p>
                      <p className="text-sm text-black font-medium">{intake.dates}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Application Deadline</p>
                      <p className="text-sm text-red-600 font-bold">{intake.deadline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-linear-to-r from-red-600 to-red-700 text-white">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Apply?
            </h2>
            <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
              Take the first step towards your future. Start your application today.
            </p>
            <Link href="/auth/sign-in">
              <button className="px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                Begin Application
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
