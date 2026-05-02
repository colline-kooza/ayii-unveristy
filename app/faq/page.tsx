"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown } from "lucide-react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";

const faqs = [
  {
    category: "General",
    questions: [
      { q: "What is AYii University?", a: "AYii University is a modern learning platform providing quality education through interactive courses, live classes, and comprehensive resources designed for student success." },
      { q: "How do I create an account?", a: "Click 'Sign In' in the top right, then select 'Create Account'. Fill in your details, verify your email, and you're ready to start learning." },
      { q: "Is there a mobile app available?", a: "Our platform is fully optimised for mobile browsers. A dedicated app is in development and will be available soon." },
    ],
  },
  {
    category: "Courses & Enrollment",
    questions: [
      { q: "How do I enroll in a course?", a: "Browse the course catalog, select a course, and click 'Enroll'. You'll have immediate access to all materials once enrolled." },
      { q: "Can I unenroll from a course?", a: "Yes, you can unenroll at any time from your student dashboard. Refund policies may apply depending on when you unenroll." },
      { q: "How many courses can I take at once?", a: "There's no limit. We recommend starting with 2–3 courses to manage your time effectively." },
    ],
  },
  {
    category: "Payments & Pricing",
    questions: [
      { q: "How much do courses cost?", a: "Prices vary by program. View each course's detail page for pricing. Financial aid and scholarships are also available." },
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards and PayPal. Additional regional options may be available." },
      { q: "Is there a refund policy?", a: "Yes — 14-day money-back guarantee. Request a full refund within 14 days of enrollment if you're not satisfied." },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      { q: "What are the system requirements?", a: "Any modern browser (Chrome, Firefox, Safari, Edge) works. For live classes you'll need a stable connection, webcam, and microphone." },
      { q: "I can't access my course. What should I do?", a: "Clear your browser cache and cookies first. If the issue continues, contact our support team via the Help Center." },
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the sign-in page, enter your email, and follow the reset instructions we send you." },
    ],
  },
];

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>("0-0");

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
            FAQs
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            Frequently Asked
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1">
            Quick answers to common questions about our platform, courses, and services.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          {faqs.map((section, si) => (
            <div key={si}>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-[#8B1538] rounded-full" />
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.questions.map((faq, qi) => {
                  const key = `${si}-${qi}`;
                  const open = openKey === key;
                  return (
                    <div key={qi} className={`bg-white rounded-xl border transition-all ${open ? "border-[#8B1538]/30 shadow-sm" : "border-gray-200"}`}>
                      <button
                        onClick={() => setOpenKey(open ? null : key)}
                        className="w-full px-5 py-3.5 flex items-center justify-between text-left gap-4"
                      >
                        <span className="text-sm font-semibold text-gray-800">{faq.q}</span>
                        <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-[#8B1538]" : ""}`} />
                      </button>
                      {open && (
                        <div className="px-5 pb-4">
                          <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-10 p-6 bg-gradient-to-r from-[#5A0F23] via-[#8B1538] to-[#6B1329] rounded-2xl text-center">
          <h3 className="text-base font-extrabold text-white mb-1">Still Have Questions?</h3>
          <p className="text-xs text-white/60 mb-5">Our support team is happy to help.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-5 py-2 bg-white text-[#8B1538] font-bold rounded-lg hover:bg-gray-100 transition-colors text-xs">
              Contact Support
            </Link>
            <Link href="/help" className="px-5 py-2 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/15 transition-colors text-xs">
              Help Center
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
