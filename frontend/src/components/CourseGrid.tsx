import { useEffect, useState } from 'react'
import { type Course } from '../data/mockCourses'
import CourseCard from './CourseCard'
import SkeletonCard from './SkeletonCard'

interface CourseGridProps {
  courses: Course[]
  query: string
  loading?: boolean
  showAll?: boolean
}

export default function CourseGrid({ courses, query, loading: externalLoading, showAll }: Readonly<CourseGridProps>) {
  const [queryLoading, setQueryLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setQueryLoading(true)
    const timer = setTimeout(() => setQueryLoading(false), 300)
    return () => clearTimeout(timer)
  }, [query])

  const loading = externalLoading || queryLoading

  const displayed = (showAll || query.trim() !== '') ? courses : courses.slice(0, 6)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (displayed.length === 0) {
    return (
      <div className="text-center py-16 text-ink-secondary dark:text-ink-dark-secondary">
        <p className="text-lg font-medium">No courses found for "{query}"</p>
        <p className="text-sm mt-1">Try searching by course code, professor, or department.</p>
      </div>
    )
  }

  return (
    <div key={query} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayed.map((course, i) => (
        <div key={course.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  )
}
