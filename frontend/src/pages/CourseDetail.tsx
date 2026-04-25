import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Users,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Star,
  MessageSquare,
  Send,
} from 'lucide-react'
import { fetchCourse, verifyResource } from '../api'
import type { Course } from '../data/mockCourses'
import StarRating from '../components/StarRating'

interface CourseReview {
  id: string
  author: string
  rating: number
  comment: string
  date: string
  major: string
}

const FAKE_REVIEWS: CourseReview[] = [
  {
    id: '1',
    author: 'Alex M.',
    rating: 5,
    comment: 'One of the best CS courses I have taken at NYU. The professor explains concepts really clearly and the assignments are challenging but fair. Highly recommend taking this early in your CS career.',
    date: 'Mar 2026',
    major: 'CS Junior',
  },
  {
    id: '2',
    author: 'Priya S.',
    rating: 4,
    comment: 'Great course overall. The material on trees and graphs was especially well taught. Office hours are very helpful — go early in the semester before it gets crowded.',
    date: 'Feb 2026',
    major: 'Math/CS Sophomore',
  },
  {
    id: '3',
    author: 'Jordan K.',
    rating: 3,
    comment: 'The workload is heavier than expected, but you learn a lot. Make sure to start projects early — the last few assignments take more time than the rubric suggests. Lecture slides are solid.',
    date: 'Jan 2026',
    major: 'CS Sophomore',
  },
  {
    id: '4',
    author: 'Mei L.',
    rating: 5,
    comment: 'Really enjoyed how the professor connected data structures to real-world applications. The linked list and hash table units were my favorites. The study guides shared on here were a lifesaver.',
    date: 'Dec 2025',
    major: 'CS/Economics Junior',
  },
  {
    id: '5',
    author: 'Daniel R.',
    rating: 4,
    comment: 'Solid course. Exams are tricky but fair — focus on understanding time complexity for everything. The peer study sessions helped me a lot.',
    date: 'Nov 2025',
    major: 'CS Freshman',
  },
]

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [reviews, setReviews] = useState<CourseReview[]>(FAKE_REVIEWS)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchCourse(id)
      .then(setCourse)
      .catch(() => setCourse(null))
      .finally(() => setLoading(false))
  }, [id])

  function handleSubmitReview() {
    if (userRating === 0 || newComment.trim() === '') return
    const newReview: CourseReview = {
      id: `user-${Date.now()}`,
      author: 'You',
      rating: userRating,
      comment: newComment.trim(),
      date: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      major: 'NYU Student',
    }
    setReviews((prev) => [newReview, ...prev])
    setUserRating(0)
    setNewComment('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  async function handleVerify(resourceId: string) {
    if (!resourceId || votedIds.has(resourceId)) return
    try {
      await verifyResource(resourceId)
      setVotedIds((prev) => new Set(prev).add(resourceId))
      setCourse((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          resources: prev.resources.map((r) =>
            r.id === resourceId ? { ...r, votes: (r.votes ?? 0) + 1 } : r
          ),
          verifiedCount: prev.verifiedCount + 1,
        }
      })
    } catch {
      // silently ignore
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nyu-light-gray dark:bg-surface-dark-base">
        <div className="w-8 h-8 border-4 border-nyu-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

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

  const grading = course.gradingBreakdown
    ? [
        { label: 'Exams', value: course.gradingBreakdown.exams, color: 'bg-nyu-violet' },
        { label: 'Projects', value: course.gradingBreakdown.projects, color: 'bg-nyu-blue' },
        { label: 'Homework', value: course.gradingBreakdown.homework, color: 'bg-nyu-yellow' },
        { label: 'Participation', value: course.gradingBreakdown.participation, color: 'bg-nyu-teal' },
      ]
    : null

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
                    <a
                      href={course.resources.find((r) => r.type === 'Syllabus')?.url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-nyu-violet dark:text-nyu-light-violet-1 font-semibold hover:underline"
                    >
                      View PDF
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-ink-tertiary dark:text-ink-dark-tertiary">No syllabus uploaded yet</p>
                )}
              </div>
            </div>

            {grading && (
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
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <div className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-6">
              <h2 className="text-base font-semibold text-ink-primary dark:text-ink-dark-primary mb-4">Community Resources</h2>
              {course.resources.length === 0 ? (
                <p className="text-sm text-ink-tertiary dark:text-ink-dark-tertiary py-4 text-center">No resources uploaded yet.</p>
              ) : (
                <div className="flex flex-col divide-y divide-nyu-gray-3 dark:divide-surface-dark-subtle">
                  {course.resources.map((resource) => (
                    <div key={resource.id ?? resource.url} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-primary dark:text-ink-dark-primary truncate">{resource.title}</p>
                        {resource.votes !== undefined && (
                          <p className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary mt-0.5">{resource.votes} vote{resource.votes !== 1 ? 's' : ''}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {resource.id && (
                          <button
                            onClick={() => handleVerify(resource.id!)}
                            disabled={votedIds.has(resource.id)}
                            title="Verify this resource"
                            className="p-1.5 rounded-lg text-ink-tertiary dark:text-ink-dark-tertiary hover:text-nyu-teal hover:bg-nyu-teal/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nyu-light-violet-2 dark:bg-surface-dark-subtle text-nyu-violet dark:text-nyu-light-violet-1 text-xs font-semibold hover:bg-nyu-light-violet-1 dark:hover:bg-surface-dark-muted transition-colors duration-150"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

        {/* Student Reviews Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Write a Review */}
          <div className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="w-5 h-5 text-nyu-violet dark:text-nyu-light-violet-1" />
              <h2 className="text-base font-semibold text-ink-primary dark:text-ink-dark-primary">Rate This Course</h2>
            </div>

            <div className="mb-4">
              <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary mb-2 font-medium">Your Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(i)}
                    className="transition-transform duration-100 hover:scale-110 active:scale-95"
                    aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors duration-100 ${
                        i <= (hoverRating || userRating)
                          ? 'fill-nyu-yellow text-nyu-yellow'
                          : 'fill-nyu-gray-3 text-nyu-gray-2 dark:fill-surface-dark-subtle dark:text-surface-dark-muted'
                      }`}
                    />
                  </button>
                ))}
                {(hoverRating || userRating) > 0 && (
                  <span className="ml-2 text-sm font-medium text-ink-secondary dark:text-ink-dark-secondary">
                    {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][hoverRating || userRating]}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary mb-2 font-medium">Comment</p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this course..."
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-nyu-gray-3 dark:border-surface-dark-muted bg-nyu-light-gray dark:bg-surface-dark-base text-ink-primary dark:text-ink-dark-primary placeholder-ink-tertiary dark:placeholder-ink-dark-tertiary focus:outline-none focus:ring-2 focus:ring-nyu-violet/40 dark:focus:ring-nyu-light-violet-1/40 resize-none transition-colors duration-150"
              />
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={userRating === 0 || newComment.trim() === ''}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-nyu-violet text-white text-sm font-semibold hover:bg-nyu-deep-violet disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 active:scale-[0.97]"
            >
              <Send className="w-4 h-4" />
              Submit Review
            </button>

            {submitted && (
              <p className="mt-3 text-sm text-nyu-teal font-medium">Your review was posted!</p>
            )}
          </div>

          {/* Average Rating Summary */}
          <div className="bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-6">
            <h2 className="text-base font-semibold text-ink-primary dark:text-ink-dark-primary mb-5">Overall Rating</h2>
            {(() => {
              const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
              const rounded = Math.round(avg * 10) / 10
              return (
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-ink-primary dark:text-ink-dark-primary leading-none">{rounded.toFixed(1)}</p>
                    <div className="flex justify-center gap-0.5 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= Math.round(avg)
                              ? 'fill-nyu-yellow text-nyu-yellow'
                              : 'fill-nyu-gray-3 text-nyu-gray-2 dark:fill-surface-dark-subtle dark:text-surface-dark-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-4 text-right text-ink-tertiary dark:text-ink-dark-tertiary">{star}</span>
                          <Star className="w-3 h-3 fill-nyu-yellow text-nyu-yellow shrink-0" />
                          <div className="flex-1 h-2 bg-nyu-gray-3 dark:bg-surface-dark-subtle rounded-full overflow-hidden">
                            <div
                              className="h-full bg-nyu-yellow rounded-full transition-[width] duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-4 text-ink-tertiary dark:text-ink-dark-tertiary">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Review List */}
        <div className="mt-6 bg-nyu-white dark:bg-surface-dark-raised border border-nyu-gray-3 dark:border-surface-dark-subtle rounded-xl shadow-card p-6">
          <h2 className="text-base font-semibold text-ink-primary dark:text-ink-dark-primary mb-5">Student Reviews</h2>
          <div className="flex flex-col divide-y divide-nyu-gray-3 dark:divide-surface-dark-subtle">
            {reviews.map((review) => (
              <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-nyu-light-violet-2 dark:bg-surface-dark-subtle flex items-center justify-center text-nyu-violet dark:text-nyu-light-violet-1 text-xs font-bold shrink-0">
                      {review.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-primary dark:text-ink-dark-primary">{review.author}</p>
                      <p className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary">{review.major} · {review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= review.rating
                            ? 'fill-nyu-yellow text-nyu-yellow'
                            : 'fill-nyu-gray-3 text-nyu-gray-2 dark:fill-surface-dark-subtle dark:text-surface-dark-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary leading-relaxed pl-10">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
