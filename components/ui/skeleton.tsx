export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#e8e0d4] ${className}`}
    />
  );
}

export function MemberCardSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e8e0d4] last:border-0">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

export function FamilyPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf8f3]">
      <div className="border-b border-[#e8e0d4] bg-white/80 px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </main>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf8f3] py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
