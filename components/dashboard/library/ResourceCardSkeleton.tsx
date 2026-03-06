import { Card, CardContent } from "@/components/ui/card";

export function ResourceCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          {/* Title skeleton */}
          <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
          
          {/* Subtitle skeleton */}
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
          </div>
          
          {/* Footer skeleton */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-6 bg-red-100 rounded-full animate-pulse w-16" />
            <div className="h-8 bg-gray-100 rounded animate-pulse w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResourceGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ResourceCardSkeleton key={i} />
      ))}
    </div>
  );
}
