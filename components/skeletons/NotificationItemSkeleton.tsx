export function NotificationItemSkeleton() {
  return (
    <div className="flex gap-3 p-4 border-b border-[#1F1F1F]">
      <div className="skeleton h-9 w-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  );
}
