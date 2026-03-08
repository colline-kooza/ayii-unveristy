"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCcw, Home, Mail } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-red-100 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl" />
            <div className="relative bg-white rounded-full p-6 shadow-lg border-4 border-red-100">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Something Went Wrong
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Error Details (Dev Only)
              </p>
              <p className="text-sm text-gray-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              <RefreshCcw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-2"
                size="lg"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Need Help?
                </h3>
                <p className="text-xs text-blue-700 mb-2">
                  If this problem persists, please contact our support team with the error details.
                </p>
                <Link href="/contact">
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs font-semibold"
                  >
                    Contact Support →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 text-center">
              Or try these helpful links:
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <Link href="/dashboard" className="text-primary hover:underline font-medium">
                Dashboard
              </Link>
              <Link href="/courses" className="text-primary hover:underline font-medium">
                Courses
              </Link>
              <Link href="/help" className="text-primary hover:underline font-medium">
                Help Center
              </Link>
              <Link href="/faq" className="text-primary hover:underline font-medium">
                FAQ
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
    </div>
  );
}
