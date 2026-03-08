"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[180px] lg:text-[240px] font-black text-gray-200 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-8 shadow-2xl border-4 border-gray-100">
              <Search className="h-16 w-16 lg:h-20 lg:w-20 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Oops! The page you&apos;re looking for seems to have wandered off. 
            It might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="border-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Need help finding something?
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/courses" className="text-primary hover:underline font-medium">
              Browse Courses
            </Link>
            <Link href="/dashboard" className="text-primary hover:underline font-medium">
              Dashboard
            </Link>
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact Support
            </Link>
            <Link href="/faq" className="text-primary hover:underline font-medium">
              FAQ
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
