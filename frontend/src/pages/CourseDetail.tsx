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
      <div className="min-h-screen flex items-center justify-center bg-nyu-light-gray dark:bg-surface-dark-base">
        <div className="text-center">
          <p className="text-ink-secondary dark:text-ink-dark-secondary mb-4">Course not found.</p>
          <Link to="/" className="text-nyu-violet dark:text-nyu-light-violet-1 font-medium hover:underline">
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const grading = [
    { label: 'Exams', value: course.gradingBreakdown.exams, color: 'bg-nyu-violet' },
    { label: 'Projects', value: course.gradingBreakdown.projects, color: 'bg-nyu-blue' },
    { label: 'Homework', value: course.gradingBreakdown.homework, color: 'bg-nyu-yellow' },
    { label: 'Participation', value: course.gradingBreakdown.participation, color: 'bg-nyu-teal' },
  ]

  return (
    <div className="min-h-screen bg-nyu-light-gray dark:bg-surface-dark-base transition-colors duration-200">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark-raised/80 backdrop-blur-md backdrop-saturate-150 border-b border-nyu-gray-3 dark:border-white/[0.06] shadow-navbar transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-ink-secondary dark:text-ink-dark-secondary hover:text-nyu-violet dark:hover:text-nyu-light-violet-1 transition-colors duration-150 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
          <div className="h-5 w-px bg-nyu-gray-3 dark:bg-surface-dark-muted" />
          <span className="text-sm font-semibold text-ink-primary dark:text-ink-dark-primary">
            {course.code} — {course.name}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold text-nyu-violet dark:text-nyu-light-violet-1 uppercase tracking-wider mb-1">
            {course.code}
          </p>
          <h1 className="text-2xl font-bold text-ink-primary dark:text-ink-dark-primary">{course.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <p className="text-ink-secondary dark:text-ink-dark-secondary text-sm">{course.professor}</p>
            <StarRating score={course.clarityScore} />
            <span className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary">Verified by {course.verifiedCount} students</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <div className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-6">
              <h2 className="text-base font-semibold text-ink-primary dark:text-ink-dark-primary mb-4">Latest Syllabus</h2>
              <div className="bg-nyu-light-gray dark:bg-surface-dark-base border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-lg h-52 flex flex-col items-center justify-center gap-3">
                <FileText className="w-12 h-12 text-nyu-gray-2 dark:text-surface-dark-muted" />
                {course.syllabusAvailable ? (
                  <>
                    <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary font-medium">Syllabus available</p>
                    <span className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary">Spring 2026 · PDF</span>
                  </>
                ) : (
                  <p className="text-sm text-ink-tertiary dark:text-ink-dark-tertiary">No syllabus uploaded yet</p>
                )}
              </div>
            </div>

            <div className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-6">
              <h2 className="text-base font-semibold text-ink-primary dark:text-ink-dark-primary mb-5">Grading Breakdown</h2>
              <div className="flex flex-col gap-4">
                {grading.map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-ink-secondary dark:text-ink-dark-secondary font-medium">{label}</span>
                      <span className="text-ink-primary dark:text-ink-dark-primary font-semibold">{value}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-nyu-gray-3 dark:bg-surface-dark-subtle rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-[width] duration-700 ease-out`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <div className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-6">
              <h2 className="text-base font-semibold text-ink-primary dark:text-ink-dark-primary mb-4">Community Resources</h2>
              <div className="flex flex-col divide-y divide-nyu-gray-3 dark:divide-surface-dark-subtle">
                {course.resources.map((resource, i) => (
                  <div key={i} className="flex items-center justify-between py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-primary dark:text-ink-dark-primary truncate">{resource.title}</p>
                      <p className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary mt-0.5">{RESOURCE_DATES[i] ?? 'Apr 10, 2026'}</p>
                    </div>
                    <a
                      href={resource.url}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nyu-light-violet-2 dark:bg-surface-dark-subtle text-nyu-violet dark:text-nyu-light-violet-1 text-xs font-semibold hover:bg-nyu-light-violet-1 dark:hover:bg-surface-dark-muted transition-colors duration-150"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Peer Link
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-6 flex flex-col gap-5">
              <button className="w-full py-3 rounded-xl bg-nyu-violet text-white font-semibold text-sm hover:bg-nyu-deep-violet transition-colors duration-150 inline-flex items-center justify-center gap-2 active:scale-[0.97]">
                <Users className="w-4 h-4" />
                Request Peer Support
              </button>

              <div>
                <p className="text-sm font-medium text-ink-secondary dark:text-ink-dark-secondary mb-3">Was this helpful?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHelpful('yes')}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors duration-150 ${
                      helpful === 'yes'
                        ? 'bg-nyu-teal/10 border-nyu-teal text-nyu-teal dark:bg-nyu-teal/20'
                        : 'border-nyu-gray-3 dark:border-surface-dark-muted text-ink-secondary dark:text-ink-dark-secondary hover:border-nyu-teal hover:text-nyu-teal hover:bg-nyu-teal/10 dark:hover:bg-nyu-teal/10'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes
                  </button>
                  <button
                    onClick={() => setHelpful('no')}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors duration-150 ${
                      helpful === 'no'
                        ? 'bg-nyu-magenta/10 border-nyu-magenta text-nyu-magenta dark:bg-nyu-magenta/20'
                        : 'border-nyu-gray-3 dark:border-surface-dark-muted text-ink-secondary dark:text-ink-dark-secondary hover:border-nyu-magenta hover:text-nyu-magenta hover:bg-nyu-magenta/10 dark:hover:bg-nyu-magenta/10'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-nyu-yellow/20 dark:bg-nyu-yellow/10 border border-nyu-yellow/40 dark:border-nyu-yellow/30">
                <AlertCircle className="w-4 h-4 text-nyu-dark-gray dark:text-nyu-yellow shrink-0 mt-0.5" />
                <p className="text-xs text-nyu-dark-gray dark:text-nyu-yellow leading-relaxed">
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
