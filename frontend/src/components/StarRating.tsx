import { Star } from 'lucide-react'

export default function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= score
              ? 'fill-nyu-yellow text-nyu-yellow'
              : 'fill-nyu-gray-3 text-nyu-gray-2 dark:fill-surface-dark-subtle dark:text-surface-dark-muted'
          }`}
        />
      ))}
    </div>
  )
}
