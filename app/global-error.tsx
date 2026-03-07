"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl" />
              <div className="relative bg-white rounded-full p-6 shadow-lg border-4 border-red-100 inline-block">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Critical Error
            </h1>
            <p className="text-gray-600 mb-6">
              We encountered a critical error. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Error Details
                </p>
                <p className="text-sm text-gray-700 font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={reset}
                className="bg-primary hover:bg-primary/90 text-white shadow-md"
                size="lg"
              >
                <RefreshCcw className="h-5 w-5 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.href = "/"}
                variant="outline"
                size="lg"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
