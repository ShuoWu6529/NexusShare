import { useNavigate } from 'react-router-dom'
import { type Course } from '../data/mockCourses'
import StarRating from './StarRating'
import { CheckCircle, Video, BookOpen } from 'lucide-react'

export default function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/course/${course.id}`)}
      className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card card-hover dark:hover:border-nyu-medium-violet-2/50 cursor-pointer p-5 flex flex-col gap-3"
    >
      <div>
        <p className="text-xs font-semibold text-nyu-violet dark:text-nyu-light-violet-1 uppercase tracking-wider mb-1">
          {course.code}
        </p>
        <h3 className="text-base font-semibold text-ink-primary dark:text-ink-dark-primary leading-snug">
          {course.name}
        </h3>
        <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary mt-0.5">{course.professor}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {course.syllabusAvailable && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-nyu-teal/10 text-nyu-teal text-xs font-medium border border-nyu-teal/30 dark:bg-nyu-teal/20 dark:border-nyu-teal/40">
            <CheckCircle className="w-3 h-3" /> Syllabus
          </span>
        )}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
            course.recordingPolicy === 'Asynchronous Friendly'
              ? 'bg-nyu-blue/10 text-nyu-blue border-nyu-blue/30 dark:bg-nyu-blue/20 dark:border-nyu-blue/40'
              : 'bg-nyu-magenta/10 text-nyu-magenta border-nyu-magenta/30 dark:bg-nyu-magenta/20 dark:border-nyu-magenta/40'
          }`}
        >
          <Video className="w-3 h-3" />
          {course.recordingPolicy === 'Asynchronous Friendly' ? 'Async OK' : 'In-Person Only'}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-nyu-yellow/20 text-nyu-dark-gray text-xs font-medium border border-nyu-yellow/40 dark:bg-nyu-yellow/15 dark:text-nyu-yellow dark:border-nyu-yellow/30">
          <BookOpen className="w-3 h-3" />
          {course.textbookCost === 0 ? 'Free Texts' : `$${course.textbookCost}`}
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-nyu-gray-3 dark:border-surface-dark-subtle">
        <StarRating score={course.clarityScore} />
        <span className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary">
          Verified by {course.verifiedCount} students
        </span>
      </div>
    </div>
  )
}
