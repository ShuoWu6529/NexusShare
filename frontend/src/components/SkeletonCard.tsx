export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-3 animate-pulse">
      <div>
        <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-48 bg-gray-200 rounded mb-1" />
        <div className="h-3 w-32 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
        <div className="h-6 w-28 bg-gray-100 rounded-full" />
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-3 w-32 bg-gray-100 rounded" />
      </div>
    </div>
  )
}
