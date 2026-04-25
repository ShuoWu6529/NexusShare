export default function SkeletonCard() {
  return (
    <div className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-5 flex flex-col gap-3">
      <div>
        <div className="h-3 w-24 skeleton-shimmer rounded mb-2" />
        <div className="h-5 w-48 skeleton-shimmer rounded mb-1" />
        <div className="h-3 w-32 skeleton-shimmer rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 skeleton-shimmer rounded-full" />
        <div className="h-6 w-28 skeleton-shimmer rounded-full" />
        <div className="h-6 w-16 skeleton-shimmer rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-nyu-gray-3 dark:border-surface-dark-subtle">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 skeleton-shimmer rounded" />
          ))}
        </div>
        <div className="h-3 w-32 skeleton-shimmer rounded" />
      </div>
    </div>
  )
}
