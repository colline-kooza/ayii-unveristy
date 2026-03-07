"use client";

import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, MessageCircle, FileText, Video, Settings, GraduationCap, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const categories = [
    {
      icon: GraduationCap,
      title: "Getting Started",
      description: "Learn the basics of using the platform and setting up your account.",
      articles: 12
    },
    {
      icon: BookOpen,
      title: "Courses & Enrollment",
      description: "Find answers about browsing courses, enrolling, and accessing materials.",
      articles: 18
    },
    {
      icon: Video,
      title: "Live Classes",
      description: "Get help with joining live sessions and using video conferencing tools.",
      articles: 8
    },
    {
      icon: FileText,
      title: "Assignments & Submissions",
      description: "Learn how to submit assignments and track your academic progress.",
      articles: 15
    },
    {
      icon: Users,
      title: "Account Management",
      description: "Manage your profile, settings, and account security preferences.",
      articles: 10
    },
    {
      icon: Settings,
      title: "Technical Support",
      description: "Troubleshoot technical issues and get platform support.",
      articles: 20
    }
  ];

  const popularArticles = [
    "How do I enroll in a course?",
    "How to join a live class session?",
    "How do I submit an assignment?",
    "How to reset my password?",
    "How to update my profile information?",
    "How to access the digital library?"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-black to-gray-800 py-20 text-white lg:py-24">
          <div className="container relative z-10 mx-auto px-6 lg:px-12 text-center">
            <Badge className="mb-6 bg-red-600/20 text-red-400 border-red-500/30 text-xs font-semibold px-5 py-1.5">
              Help Center
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              How Can We <span className="text-red-400">Help You?</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
              Search our knowledge base or browse categories to find answers to your questions.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full h-14 px-6 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors">
                  <HelpCircle className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
                Browse by Category
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find the help you need organized by topic.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <category.icon className="h-6 w-6 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <p className="text-xs text-red-600 font-semibold">{category.articles} articles</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-red-100 text-red-700 text-xs font-semibold px-5 py-1.5">
                  Most Viewed
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
                  Popular Help Articles
                </h2>
                <p className="text-gray-600">
                  Quick answers to the most common questions.
                </p>
              </div>

              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-xl hover:bg-red-50 transition-colors cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-red-600" />
                      </div>
                      <p className="text-black font-medium group-hover:text-red-600 transition-colors">
                        {article}
                      </p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-lg border border-gray-200">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-black mb-4">
                      Still Need Help?
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Can't find what you're looking for? Our support team is here to help you with any questions or issues.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-black">Live Chat</p>
                          <p className="text-sm text-gray-600">Available 24/7</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-black">Submit a Ticket</p>
                          <p className="text-sm text-gray-600">Response within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Link href="/contact">
                      <button className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
                        Contact Support
                      </button>
                    </Link>
                    <Link href="/faq">
                      <button className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-xl transition-colors">
                        View FAQs
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
