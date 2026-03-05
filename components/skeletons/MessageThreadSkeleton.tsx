function MessageBubbleSkeleton({ mine = false }: { mine?: boolean }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} gap-2`}>
      {!mine && <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />}
      <div className="space-y-1 max-w-[60%]">
        <div className={`skeleton h-10 ${mine ? "w-48" : "w-56"} rounded-2xl`} />
        <div className={`skeleton h-3 w-16 ${mine ? "ml-auto" : ""}`} />
      </div>
    </div>
  );
}

export function MessageThreadSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton mine />
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton mine />
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton mine />
    </div>
  );
}
