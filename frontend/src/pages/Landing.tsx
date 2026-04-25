import { useState, useMemo, useEffect } from 'react'
import { Search, BookOpenCheck, Users, DollarSign, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import CourseGrid from '../components/CourseGrid'
import UploadModal from '../components/UploadModal'
import Toast from '../components/Toast'
import { fetchCourses } from '../api'
import type { Course } from '../data/mockCourses'

export default function Landing() {
  const [courses, setCourses] = useState<Course[]>([])
  const [query, setQuery] = useState('')
  const [apiLoading, setApiLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('Uploaded successfully!')

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setApiLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return courses
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.professor.toLowerCase().includes(q)
    )
  }, [query, courses])

  const avgRating = courses.length
    ? (courses.reduce((sum, c) => sum + c.clarityScore, 0) / courses.length).toFixed(1)
    : '—'

  return (
    <div className="min-h-screen bg-nyu-light-gray dark:bg-surface-dark-base transition-colors duration-200">
      <Navbar onUploadClick={() => setShowModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Split hero */}
        <section className="flex flex-col lg:flex-row gap-10 items-start mb-14">
          {/* Left: headline + search */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nyu-violet/10 dark:bg-nyu-violet/20 text-nyu-violet dark:text-nyu-light-violet-1 text-xs font-semibold mb-5 border border-nyu-violet/20 dark:border-nyu-violet/30">
              <BookOpenCheck className="w-3.5 h-3.5" />
              NYU-Verified Platform
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-nyu-black dark:text-ink-dark-primary leading-tight tracking-tight mb-4">
              Know Your Semester<br className="hidden sm:block" /> Before It Starts.
            </h1>
            <p className="text-lg text-ink-secondary dark:text-ink-dark-secondary max-w-lg mb-8">
              NYU-verified syllabus transparency and course readiness platform.
            </p>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-tertiary dark:text-ink-dark-tertiary" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Course Code, Professor, or Major..."
                className="w-full pl-12 pr-5 py-4 text-base border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-2xl shadow-card focus:outline-none focus:ring-2 focus:ring-nyu-violet/20 focus:border-nyu-violet dark:focus:border-nyu-medium-violet-1 bg-nyu-white dark:bg-surface-dark-raised text-ink-primary dark:text-ink-dark-primary placeholder-ink-tertiary dark:placeholder-ink-dark-tertiary transition-colors duration-150"
              />
            </div>
          </div>

          {/* Right: stats card */}
          <div className="w-full lg:w-72 shrink-0 bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-2xl shadow-card p-6 fade-up">
            <p className="text-xs font-semibold text-ink-tertiary dark:text-ink-dark-tertiary uppercase tracking-wider mb-4">Platform Stats</p>
            <div className="flex flex-col gap-5">
              {[
                { icon: BookOpenCheck, value: '450+', label: 'Syllabi Shared', color: 'text-nyu-teal' },
                { icon: Users, value: courses.length.toString(), label: 'Courses Available', color: 'text-nyu-blue' },
                { icon: DollarSign, value: '$12,400', label: 'Saved on Textbooks', color: 'text-nyu-violet dark:text-nyu-light-violet-1' },
                { icon: Star, value: avgRating, label: 'Avg. Clarity Score', color: 'text-nyu-yellow' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-nyu-light-gray dark:bg-surface-dark-subtle flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-lg font-bold leading-tight ${color}`}>{value}</p>
                    <p className="text-xs text-ink-secondary dark:text-ink-dark-secondary leading-snug">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course grid */}
        <section className="fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-nyu-dark-gray dark:text-ink-dark-primary">
              {query ? `Results for "${query}"` : 'Top Courses'}
            </h2>
            {!query && (
              <span className="text-sm text-ink-tertiary dark:text-ink-dark-tertiary">{courses.length} courses available</span>
            )}
          </div>
          <CourseGrid courses={filtered} query={query} loading={apiLoading} />
        </section>
      </main>

      {showModal && (
        <UploadModal
          courses={courses}
          onClose={() => setShowModal(false)}
          onSuccess={(msg) => {
            setToastMsg(msg ?? 'Uploaded successfully!')
            setShowToast(true)
          }}
        />
      )}

      {showToast && (
        <Toast message={toastMsg} onDismiss={() => setShowToast(false)} />
      )}
    </div>
  )
}
