import { Star } from 'lucide-react'

export default function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= score ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}
