import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Users,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from 'lucide-react'
import { mockCourses } from '../data/mockCourses'
import StarRating from '../components/StarRating'

const RESOURCE_DATES: Record<number, string> = {
  0: 'Jan 14, 2026',
  1: 'Feb 3, 2026',
  2: 'Mar 9, 2026',
  3: 'Apr 1, 2026',
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const course = mockCourses.find((c) => c.id === id)
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Course not found.</p>
          <Link to="/" className="text-nyu-violet font-medium hover:underline">
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const grading = [
    { label: 'Exams', value: course.gradingBreakdown.exams, color: 'bg-nyu-violet' },
    { label: 'Projects', value: course.gradingBreakdown.projects, color: 'bg-blue-500' },
    { label: 'Homework', value: course.gradingBreakdown.homework, color: 'bg-yellow-400' },
    { label: 'Participation', value: course.gradingBreakdown.participation, color: 'bg-green-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-nyu-violet transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-700">
            {course.code} — {course.name}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold text-nyu-violet uppercase tracking-wider mb-1">
            {course.code}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <p className="text-gray-500 text-sm">{course.professor}</p>
            <StarRating score={course.clarityScore} />
            <span className="text-xs text-gray-400">Verified by {course.verifiedCount} students</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column — Official Knowledge */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Latest Syllabus</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg h-52 flex flex-col items-center justify-center gap-3">
                <FileText className="w-12 h-12 text-gray-300" />
                {course.syllabusAvailable ? (
                  <>
                    <p className="text-sm text-gray-500 font-medium">Syllabus available</p>
                    <span className="text-xs text-gray-400">Spring 2026 · PDF</span>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">No syllabus uploaded yet</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Grading Breakdown</h2>
              <div className="flex flex-col gap-4">
                {grading.map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600 font-medium">{label}</span>
                      <span className="text-gray-900 font-semibold">{value}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Community Knowledge */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Community Resources</h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {course.resources.map((resource, i) => (
                  <div key={i} className="flex items-center justify-between py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{resource.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{RESOURCE_DATES[i] ?? 'Apr 10, 2026'}</p>
                    </div>
                    <a
                      href={resource.url}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nyu-violet/10 text-nyu-violet text-xs font-semibold hover:bg-nyu-violet/20 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Peer Link
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-5">
              <button className="w-full py-3 rounded-xl bg-nyu-violet text-white font-semibold text-sm hover:bg-nyu-violet-dark transition-colors inline-flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Request Peer Support
              </button>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Was this helpful?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHelpful('yes')}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      helpful === 'yes'
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes
                  </button>
                  <button
                    onClick={() => setHelpful('no')}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      helpful === 'no'
                        ? 'bg-red-50 border-red-300 text-red-600'
                        : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Supplementary peer-study resource. No exams or restricted materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
