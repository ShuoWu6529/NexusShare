import { useState, useEffect, useMemo } from 'react'
import { Search, X, SlidersHorizontal, Star } from 'lucide-react'
import { fetchCourses } from '../api'
import type { Course, School } from '../data/mockCourses'
import CourseGrid from '../components/CourseGrid'
import Navbar from '../components/Navbar'

const SCHOOLS: School[] = ['Tandon', 'CAS', 'Stern', 'Gallatin', 'Tisch', 'Steinhardt']

type CostBucket = 'any' | 'free' | 'under50' | '50to100' | 'over100'
type AttendanceFilter = 'any' | 'required' | 'not-required'
type RecordingFilter = 'any' | 'Asynchronous Friendly' | 'In-Person Only'

interface Filters {
  query: string
  schools: School[]
  attendance: AttendanceFilter
  recording: RecordingFilter
  cost: CostBucket
  minClarity: number
  syllabusOnly: boolean
}

const DEFAULT_FILTERS: Filters = {
  query: '',
  schools: [],
  attendance: 'any',
  recording: 'any',
  cost: 'any',
  minClarity: 0,
  syllabusOnly: false,
}

function matchesCost(cost: number, bucket: CostBucket): boolean {
  if (bucket === 'any') return true
  if (bucket === 'free') return cost === 0
  if (bucket === 'under50') return cost > 0 && cost < 50
  if (bucket === '50to100') return cost >= 50 && cost <= 100
  if (bucket === 'over100') return cost > 100
  return true
}

function buildChips(filters: Filters): { label: string; clear: () => Filters }[] {
  const chips: { label: string; clear: () => Filters }[] = []
  if (filters.query) chips.push({ label: `"${filters.query}"`, clear: () => ({ ...filters, query: '' }) })
  filters.schools.forEach((s) => chips.push({ label: s, clear: () => ({ ...filters, schools: filters.schools.filter((x) => x !== s) }) }))
  if (filters.attendance !== 'any') chips.push({ label: filters.attendance === 'required' ? 'Attendance Required' : 'No Mandatory Attendance', clear: () => ({ ...filters, attendance: 'any' }) })
  if (filters.recording !== 'any') chips.push({ label: filters.recording, clear: () => ({ ...filters, recording: 'any' }) })
  if (filters.cost !== 'any') {
    const labels: Record<CostBucket, string> = { any: '', free: 'Free Textbook', under50: 'Textbook < $50', '50to100': 'Textbook $50–$100', over100: 'Textbook > $100' }
    chips.push({ label: labels[filters.cost], clear: () => ({ ...filters, cost: 'any' }) })
  }
  if (filters.minClarity > 0) chips.push({ label: `${filters.minClarity}+ Stars`, clear: () => ({ ...filters, minClarity: 0 }) })
  if (filters.syllabusOnly) chips.push({ label: 'Syllabus Available', clear: () => ({ ...filters, syllabusOnly: false }) })
  return chips
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [hoverClarity, setHoverClarity] = useState(0)

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase()
    return courses.filter((c) => {
      if (q && !c.code.toLowerCase().includes(q) && !c.name.toLowerCase().includes(q) && !c.professor.toLowerCase().includes(q)) return false
      if (filters.schools.length > 0 && !filters.schools.includes((c as any).school)) return false
      if (filters.attendance === 'required' && !(c as any).mandatoryAttendance) return false
      if (filters.attendance === 'not-required' && (c as any).mandatoryAttendance) return false
      if (filters.recording !== 'any' && c.recordingPolicy !== filters.recording) return false
      if (!matchesCost(c.textbookCost, filters.cost)) return false
      if (filters.minClarity > 0 && c.clarityScore < filters.minClarity) return false
      if (filters.syllabusOnly && !c.syllabusAvailable) return false
      return true
    })
  }, [courses, filters])

  const chips = buildChips(filters)
  const hasActiveFilters = chips.length > 0

  function toggleSchool(school: School) {
    setFilters((f) => ({
      ...f,
      schools: f.schools.includes(school) ? f.schools.filter((s) => s !== school) : [...f.schools, school],
    }))
  }

  return (
    <div className="min-h-screen bg-nyu-light-gray dark:bg-surface-dark-base transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-ink-primary dark:text-ink-dark-primary">Course Catalog</h1>
            <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary mt-1">
              {loading ? 'Loading...' : `Showing ${filtered.length} of ${courses.length} courses`}
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs font-medium text-nyu-violet dark:text-nyu-light-violet-1 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-nyu-light-violet-2 dark:bg-surface-dark-subtle text-nyu-violet dark:text-nyu-light-violet-1"
              >
                {chip.label}
                <button
                  onClick={() => setFilters(chip.clear())}
                  aria-label={`Remove ${chip.label} filter`}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-6 items-start">
          {/* Filter Sidebar */}
          <aside className="w-56 shrink-0 bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-5 flex flex-col gap-6 sticky top-24">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-primary dark:text-ink-dark-primary">
              <SlidersHorizontal className="w-4 h-4 text-nyu-violet dark:text-nyu-light-violet-1" />
              Filters
            </div>

            {/* Search */}
            <div>
              <p className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary uppercase tracking-wider mb-2">Search</p>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-tertiary dark:text-ink-dark-tertiary" />
                <input
                  type="text"
                  placeholder="Code, name, professor…"
                  value={filters.query}
                  onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-nyu-gray-3 dark:border-surface-dark-muted bg-nyu-light-gray dark:bg-surface-dark-base text-ink-primary dark:text-ink-dark-primary placeholder-ink-tertiary dark:placeholder-ink-dark-tertiary focus:outline-none focus:ring-2 focus:ring-nyu-violet/40"
                />
              </div>
            </div>

            {/* School */}
            <div>
              <p className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary uppercase tracking-wider mb-2">School</p>
              <div className="flex flex-col gap-1.5">
                {SCHOOLS.map((school) => (
                  <label key={school} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.schools.includes(school)}
                      onChange={() => toggleSchool(school)}
                      className="w-3.5 h-3.5 accent-nyu-violet rounded"
                    />
                    <span className="text-xs text-ink-secondary dark:text-ink-dark-secondary group-hover:text-ink-primary dark:group-hover:text-ink-dark-primary transition-colors">
                      {school}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mandatory Attendance */}
            <div>
              <p className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary uppercase tracking-wider mb-2">Attendance</p>
              <div className="flex flex-col gap-1.5">
                {(['any', 'required', 'not-required'] as AttendanceFilter[]).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="attendance"
                      checked={filters.attendance === opt}
                      onChange={() => setFilters((f) => ({ ...f, attendance: opt }))}
                      className="w-3.5 h-3.5 accent-nyu-violet"
                    />
                    <span className="text-xs text-ink-secondary dark:text-ink-dark-secondary group-hover:text-ink-primary dark:group-hover:text-ink-dark-primary transition-colors">
                      {opt === 'any' ? 'Any' : opt === 'required' ? 'Required' : 'Not Required'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Recording Policy */}
            <div>
              <p className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary uppercase tracking-wider mb-2">Recording</p>
              <div className="flex flex-col gap-1.5">
                {(['any', 'Asynchronous Friendly', 'In-Person Only'] as RecordingFilter[]).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="recording"
                      checked={filters.recording === opt}
                      onChange={() => setFilters((f) => ({ ...f, recording: opt }))}
                      className="w-3.5 h-3.5 accent-nyu-violet"
                    />
                    <span className="text-xs text-ink-secondary dark:text-ink-dark-secondary group-hover:text-ink-primary dark:group-hover:text-ink-dark-primary transition-colors">
                      {opt === 'any' ? 'Any' : opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Textbook Cost */}
            <div>
              <p className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary uppercase tracking-wider mb-2">Textbook Cost</p>
              <div className="flex flex-col gap-1.5">
                {([
                  { value: 'any', label: 'Any' },
                  { value: 'free', label: 'Free' },
                  { value: 'under50', label: 'Under $50' },
                  { value: '50to100', label: '$50 – $100' },
                  { value: 'over100', label: 'Over $100' },
                ] as { value: CostBucket; label: string }[]).map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="cost"
                      checked={filters.cost === value}
                      onChange={() => setFilters((f) => ({ ...f, cost: value }))}
                      className="w-3.5 h-3.5 accent-nyu-violet"
                    />
                    <span className="text-xs text-ink-secondary dark:text-ink-dark-secondary group-hover:text-ink-primary dark:group-hover:text-ink-dark-primary transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Min Clarity Score */}
            <div>
              <p className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary uppercase tracking-wider mb-2">Min Clarity Score</p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setHoverClarity(i)}
                    onMouseLeave={() => setHoverClarity(0)}
                    onClick={() => setFilters((f) => ({ ...f, minClarity: f.minClarity === i ? 0 : i }))}
                    aria-label={`Minimum ${i} star${i !== 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-5 h-5 transition-colors duration-100 ${
                        i <= (hoverClarity || filters.minClarity)
                          ? 'fill-nyu-yellow text-nyu-yellow'
                          : 'fill-nyu-gray-3 text-nyu-gray-2 dark:fill-surface-dark-subtle dark:text-surface-dark-muted'
                      }`}
                    />
                  </button>
                ))}
                {filters.minClarity > 0 && (
                  <span className="ml-1 text-xs text-ink-tertiary dark:text-ink-dark-tertiary">+</span>
                )}
              </div>
            </div>

            {/* Syllabus Available */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.syllabusOnly}
                  onChange={(e) => setFilters((f) => ({ ...f, syllabusOnly: e.target.checked }))}
                  className="w-3.5 h-3.5 accent-nyu-violet rounded"
                />
                <span className="text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary group-hover:text-ink-primary dark:group-hover:text-ink-dark-primary transition-colors">
                  Syllabus Available
                </span>
              </label>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1 min-w-0">
            <CourseGrid courses={filtered} query={filters.query} loading={loading} showAll />
          </div>
        </div>
      </main>

    </div>
  )
}
