import { useState, useMemo } from 'react'
import { Search, BookOpenCheck, Users, DollarSign } from 'lucide-react'
import Navbar from '../components/Navbar'
import CourseGrid from '../components/CourseGrid'
import UploadModal from '../components/UploadModal'
import Toast from '../components/Toast'
import { mockCourses } from '../data/mockCourses'

export default function Landing() {
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return mockCourses
    return mockCourses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.professor.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onUploadClick={() => setShowModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nyu-violet/10 text-nyu-violet text-xs font-semibold mb-4">
            <BookOpenCheck className="w-3.5 h-3.5" />
            NYU-Verified Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
            Know Your Semester<br className="hidden sm:block" /> Before It Starts.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            NYU-verified syllabus transparency and course readiness platform.
          </p>
        </section>

        <section className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Course Code, Professor, or Major..."
              className="w-full pl-12 pr-5 py-4 text-base border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet/30 focus:border-nyu-violet bg-white placeholder-gray-400"
            />
          </div>
        </section>

        <section className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-3 divide-x divide-gray-200 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {[
              { icon: BookOpenCheck, value: '450', label: 'Syllabi Shared' },
              { icon: Users, value: '120', label: 'Courses with Peer Support' },
              { icon: DollarSign, value: '$12,400', label: 'Saved on Textbooks' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center py-4 px-3">
                <Icon className="w-4 h-4 text-nyu-violet mb-1" />
                <span className="text-lg font-bold text-gray-900">{value}</span>
                <span className="text-xs text-gray-500 text-center leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {query ? `Results for "${query}"` : 'Top Courses'}
            </h2>
            {!query && (
              <span className="text-sm text-gray-400">{mockCourses.length} courses available</span>
            )}
          </div>
          <CourseGrid courses={filtered} query={query} />
        </section>
      </main>

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowToast(true)}
        />
      )}

      {showToast && (
        <Toast message="Uploaded successfully!" onDismiss={() => setShowToast(false)} />
      )}
    </div>
  )
}
