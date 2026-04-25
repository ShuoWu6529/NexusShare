import { useNavigate } from 'react-router-dom'
import { type Course } from '../data/mockCourses'
import StarRating from './StarRating'
import { CheckCircle, Video, BookOpen } from 'lucide-react'

export default function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/course/${course.id}`)}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-nyu-violet/30 transition-all cursor-pointer p-5 flex flex-col gap-3"
    >
      <div>
        <p className="text-xs font-semibold text-nyu-violet uppercase tracking-wider mb-1">
          {course.code}
        </p>
        <h3 className="text-base font-semibold text-gray-900 leading-snug">{course.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{course.professor}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {course.syllabusAvailable && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
            <CheckCircle className="w-3 h-3" /> Syllabus
          </span>
        )}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
            course.recordingPolicy === 'Asynchronous Friendly'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-orange-50 text-orange-700 border-orange-200'
          }`}
        >
          <Video className="w-3 h-3" />
          {course.recordingPolicy === 'Asynchronous Friendly' ? 'Async OK' : 'In-Person Only'}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium border border-yellow-200">
          <BookOpen className="w-3 h-3" />
          {course.textbookCost === 0 ? 'Free Texts' : `$${course.textbookCost}`}
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <StarRating score={course.clarityScore} />
        <span className="text-xs text-gray-400">Verified by {course.verifiedCount} students</span>
      </div>
    </div>
  )
}
