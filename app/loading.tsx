import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative bg-white rounded-full p-6 shadow-lg border-4 border-primary/10">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
        <p className="text-sm text-gray-500">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
