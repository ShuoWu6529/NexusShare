import type { Course, Resource } from './data/mockCourses'

const BASE = '/api'

interface BackendResource {
  id: string
  course_id: string
  type: 'Syllabus' | 'Lecture_Link' | 'Study_Guide'
  url: string
  uploader_netid: string
  votes: number
}

interface BackendCourse {
  id: string
  code: string
  name: string
  professor_name: string
  recording_status: 'Confirmed' | 'Peer-Only' | 'Not Recorded'
  avg_textbook_cost: number
  resource_readiness_score: number
  resources: BackendResource[]
}

function adaptResource(r: BackendResource): Resource {
  return {
    id: r.id,
    title: r.type.replace(/_/g, ' '),
    type: r.type,
    url: r.url,
    votes: r.votes,
  }
}

function adaptCourse(c: BackendCourse): Course {
  return {
    id: c.id,
    code: c.code,
    name: c.name,
    professor: c.professor_name,
    syllabusAvailable: c.resources.some((r) => r.type === 'Syllabus'),
    recordingPolicy:
      c.recording_status === 'Confirmed' ? 'Asynchronous Friendly' : 'In-Person Only',
    textbookCost: c.avg_textbook_cost,
    clarityScore: Math.round(c.resource_readiness_score * 5),
    verifiedCount: c.resources.reduce((sum, r) => sum + r.votes, 0),
    resources: c.resources.map(adaptResource),
  }
}

export async function fetchCourses(query = ''): Promise<Course[]> {
  const url = query ? `${BASE}/courses?query=${encodeURIComponent(query)}` : `${BASE}/courses`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch courses')
  const data: BackendCourse[] = await res.json()
  return data.map(adaptCourse)
}

export async function fetchCourse(id: string): Promise<Course> {
  const res = await fetch(`${BASE}/courses/${id}`)
  if (!res.ok) throw new Error('Course not found')
  const data: BackendCourse = await res.json()
  return adaptCourse(data)
}

export async function uploadResource(formData: FormData): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? 'Upload failed')
  }
  return res.json()
}

export async function verifyResource(resourceId: string): Promise<{ votes: number }> {
  const res = await fetch(`${BASE}/resources/${resourceId}/verify`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to verify resource')
  return res.json()
}
