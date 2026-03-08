"use client";

import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is AYii University?",
          a: "AYii University is a modern online learning platform that provides quality education through interactive courses, live classes, and comprehensive learning resources. We offer a wide range of academic programs designed to help students achieve their educational goals."
        },
        {
          q: "How do I create an account?",
          a: "Click on the 'Sign In' button in the top right corner, then select 'Create Account'. Fill in your personal information, verify your email address, and you're ready to start exploring our courses."
        },
        {
          q: "Is there a mobile app available?",
          a: "Currently, our platform is optimized for web browsers on both desktop and mobile devices. A dedicated mobile app is in development and will be available soon."
        }
      ]
    },
    {
      category: "Courses & Enrollment",
      questions: [
        {
          q: "How do I enroll in a course?",
          a: "Browse our course catalog, select a course you're interested in, and click the 'Enroll' button. Once enrolled, you'll have immediate access to all course materials and can start learning right away."
        },
        {
          q: "Can I unenroll from a course?",
          a: "Yes, you can unenroll from a course at any time from your student dashboard. However, please note that refund policies may apply depending on when you unenroll."
        },
        {
          q: "How many courses can I take at once?",
          a: "There's no limit to the number of courses you can enroll in. However, we recommend starting with 2-3 courses to ensure you can manage your time effectively."
        }
      ]
    },
    {
      category: "Payments & Pricing",
      questions: [
        {
          q: "How much do courses cost?",
          a: "Course prices vary depending on the program and duration. You can view the price for each course on its detail page. We also offer financial aid and scholarship opportunities for eligible students."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, and PayPal. Some regions may have additional payment options available."
        },
        {
          q: "Is there a refund policy?",
          a: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with a course, you can request a full refund within 14 days of enrollment."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "What are the system requirements?",
          a: "Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge). For live classes, you'll need a stable internet connection, webcam, and microphone."
        },
        {
          q: "I'm having trouble accessing my course. What should I do?",
          a: "First, try clearing your browser cache and cookies. If the issue persists, contact our support team through the Help Center, and we'll assist you promptly."
        },
        {
          q: "How do I reset my password?",
          a: "Click on 'Forgot Password' on the sign-in page, enter your email address, and we'll send you instructions to reset your password."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-black to-gray-800 py-20 text-white lg:py-24">
          <div className="container relative z-10 mx-auto px-6 lg:px-12 text-center">
            <Badge className="mb-6 bg-red-600/20 text-red-400 border-red-500/30 text-xs font-semibold px-5 py-1.5">
              FAQs
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Frequently Asked <span className="text-red-400">Questions</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-300">
              Find quick answers to common questions about our platform, courses, and services.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-12">
              {faqs.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h2 className="text-2xl font-bold text-black mb-6">{section.category}</h2>
                  <div className="space-y-4">
                    {section.questions.map((faq, faqIndex) => {
                      const globalIndex = sectionIndex * 100 + faqIndex;
                      const isOpen = openIndex === globalIndex;
                      
                      return (
                        <div
                          key={faqIndex}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-black pr-4">{faq.q}</span>
                            <ChevronDown
                              className={`h-5 w-5 text-gray-500 shrink-0 transition-transform ${
                                isOpen ? "transform rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-5">
                              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-black mb-4">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 mb-8">
                Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact">
                  <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
                    Contact Support
                  </button>
                </a>
                <a href="/help">
                  <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-xl transition-colors">
                    Visit Help Center
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
