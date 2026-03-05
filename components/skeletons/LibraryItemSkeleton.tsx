export function LibraryItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border border-[#1F1F1F] rounded-xl">
      <div className="skeleton h-10 w-10 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
      </div>
      <div className="skeleton h-8 w-20 rounded-lg" />
    </div>
  );
}
