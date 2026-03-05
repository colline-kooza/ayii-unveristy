export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="skeleton h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-4 w-32" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="skeleton h-10 w-full rounded-lg" />
        <div className="skeleton h-10 w-full rounded-lg" />
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
