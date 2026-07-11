export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface-2">
      <div className="aspect-[3/4] w-full animate-pulse bg-white/5" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/5" />
        <div className="h-3 w-3/5 animate-pulse rounded-full bg-white/5" />
        <div className="mt-1 h-4 w-2/5 animate-pulse rounded-full bg-white/5" />
      </div>
    </div>
  );
}
