"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Users, MessageCircle, FileText, Video, Settings, GraduationCap, HelpCircle, Search, ChevronRight } from "lucide-react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";

const categories = [
  { icon: GraduationCap, title: "Getting Started",           description: "Learn the basics and set up your account.",                  articles: 12 },
  { icon: BookOpen,      title: "Courses & Enrollment",      description: "Browse courses, enroll, and access materials.",              articles: 18 },
  { icon: Video,         title: "Live Classes",               description: "Join live sessions and use video conferencing tools.",       articles: 8  },
  { icon: FileText,      title: "Assignments & Submissions",  description: "Submit assignments and track your academic progress.",       articles: 15 },
  { icon: Users,         title: "Account Management",         description: "Manage your profile, settings, and security preferences.",  articles: 10 },
  { icon: Settings,      title: "Technical Support",          description: "Troubleshoot technical issues and get platform support.",   articles: 20 },
];

const popular = [
  "How do I enroll in a course?",
  "How to join a live class session?",
  "How do I submit an assignment?",
  "How to reset my password?",
  "How to update my profile information?",
  "How to access the digital library?",
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((c) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
  );

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
            <HelpCircle className="w-3 h-3" />
            Help Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            How Can We
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              Help You?
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1 mb-5">
            Search our knowledge base or browse categories to find answers to your questions.
          </p>
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center bg-white/10 border border-white/25 rounded-xl backdrop-blur-sm overflow-hidden focus-within:border-white/50 focus-within:bg-white/15 transition-all shadow-lg shadow-black/20">
              <Search className="ml-4 h-4 w-4 text-white/50 shrink-0" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="mr-3 text-white/40 hover:text-white/70 text-xs font-medium transition-colors">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* Categories */}
        <section className="py-10 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-7">
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Browse by Category</h2>
              <p className="text-xs text-gray-500">Find help organised by topic.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-[#8B1538]/30 hover:shadow-md transition-all cursor-pointer group">
                  <div className="h-9 w-9 rounded-lg bg-[#8B1538]/10 flex items-center justify-center mb-3 group-hover:bg-[#8B1538] transition-colors">
                    <cat.icon className="h-4.5 w-4.5 text-[#8B1538] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{cat.title}</h3>
                  <p className="text-xs text-gray-500 mb-2 leading-relaxed">{cat.description}</p>
                  <p className="text-[10px] text-[#8B1538] font-bold">{cat.articles} articles</p>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="col-span-3 py-10 text-center text-xs text-gray-400">No categories match your search.</div>
              )}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-7">
              <span className="inline-block px-3 py-1 bg-[#8B1538]/10 text-[#8B1538] rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Most Viewed</span>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Popular Help Articles</h2>
              <p className="text-xs text-gray-500">Quick answers to the most common questions.</p>
            </div>
            <div className="space-y-2">
              {popular.map((article, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-xl hover:bg-[#8B1538]/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <FileText className="h-3.5 w-3.5 text-[#8B1538]" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 group-hover:text-[#8B1538] transition-colors">{article}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#8B1538] shrink-0 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-10 bg-gray-50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 mb-2">Still Need Help?</h2>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">Can't find what you're looking for? Our support team is ready to help.</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#8B1538]/10 flex items-center justify-center shrink-0">
                        <MessageCircle className="h-4 w-4 text-[#8B1538]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Live Chat</p>
                        <p className="text-[10px] text-gray-400">Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#8B1538]/10 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-[#8B1538]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Submit a Ticket</p>
                        <p className="text-[10px] text-gray-400">Response within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Link href="/contact" className="block w-full h-9 bg-gradient-to-r from-[#8B1538] to-[#C41E3A] text-white text-xs font-bold rounded-lg flex items-center justify-center transition-all hover:from-[#C41E3A] hover:to-[#E63946]">
                    Contact Support
                  </Link>
                  <Link href="/faq" className="block w-full h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center justify-center transition-colors">
                    View FAQs
                  </Link>
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
