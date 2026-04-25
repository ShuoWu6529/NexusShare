import { useState, useRef } from 'react'
import { X, UploadCloud, Link as LinkIcon } from 'lucide-react'
import { uploadResource } from '../api'
import type { Course } from '../data/mockCourses'

interface UploadModalProps {
  courses: Course[]
  onClose: () => void
  onSuccess: (msg?: string) => void
}

type ResourceType = 'Syllabus' | 'Lecture_Link' | 'Study_Guide'
type UploadMode = 'file' | 'url'

const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  Syllabus: 'Syllabus (PDF)',
  Lecture_Link: 'Lecture Link',
  Study_Guide: 'Study Guide (PDF)',
}

export default function UploadModal({ courses, onClose, onSuccess }: UploadModalProps) {
  const [courseId, setCourseId] = useState('')
  const [resourceType, setResourceType] = useState<ResourceType>('Syllabus')
  const [uploaderNetid, setUploaderNetid] = useState('')
  const [mode, setMode] = useState<UploadMode>('file')
  const [url, setUrl] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const isPdfType = resourceType === 'Syllabus' || resourceType === 'Study_Guide'

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) { setFile(f); setFileName(f.name) }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) { setFile(f); setFileName(f.name) }
  }

  async function handleSubmit() {
    setError(null)
    if (!courseId) { setError('Please select a course.'); return }
    if (!uploaderNetid.endsWith('@nyu.edu')) { setError('Email must end in @nyu.edu'); return }
    if (mode === 'file' && !file) { setError('Please attach a file.'); return }
    if (mode === 'url' && !url.trim()) { setError('Please enter a URL.'); return }

    const fd = new FormData()
    fd.append('course_id', courseId)
    fd.append('resource_type', resourceType)
    fd.append('uploader_netid', uploaderNetid)
    if (mode === 'file' && file) {
      fd.append('file', file)
    } else {
      fd.append('url', url.trim())
    }

    setSubmitting(true)
    try {
      await uploadResource(fd)
      onClose()
      onSuccess('Submitted for peer review!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-nyu-light-gray dark:bg-surface-dark-subtle border border-nyu-gray-3 dark:border-surface-dark-muted rounded-lg text-ink-primary dark:text-ink-dark-primary placeholder-ink-tertiary dark:placeholder-ink-dark-tertiary focus:outline-none focus:ring-2 focus:ring-nyu-violet/20 focus:border-nyu-violet dark:focus:border-nyu-medium-violet-1 transition-colors duration-150'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-nyu-white dark:bg-surface-dark-overlay rounded-2xl shadow-modal w-full max-w-md z-10 modal-enter dark:border dark:border-surface-dark-subtle">
        <div className="flex items-center justify-between p-6 border-b border-nyu-gray-3 dark:border-surface-dark-subtle">
          <h2 className="text-lg font-semibold text-ink-primary dark:text-ink-dark-primary">Knowledge Drop</h2>
          <button
            onClick={onClose}
            className="text-ink-tertiary dark:text-ink-dark-tertiary hover:text-ink-primary dark:hover:text-ink-dark-primary transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-7 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {/* Course */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">Course</label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClass}>
              <option value="">Select a course…</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Resource type */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">Resource Type</label>
            <select
              value={resourceType}
              onChange={(e) => { setResourceType(e.target.value as ResourceType); setMode('file'); setFile(null); setFileName(null); setUrl('') }}
              className={inputClass}
            >
              {(Object.entries(RESOURCE_TYPE_LABELS) as [ResourceType, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* NYU email */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">NYU Email</label>
            <input
              type="email"
              value={uploaderNetid}
              onChange={(e) => setUploaderNetid(e.target.value)}
              placeholder="netid@nyu.edu"
              className={inputClass}
            />
          </div>

          {/* File vs URL toggle for lecture links */}
          {resourceType === 'Lecture_Link' && (
            <div className="flex rounded-lg overflow-hidden border border-nyu-gray-3 dark:border-surface-dark-muted text-sm font-medium">
              {(['url', 'file'] as UploadMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 transition-colors duration-150 ${mode === m ? 'bg-nyu-violet text-white' : 'text-ink-secondary dark:text-ink-dark-secondary hover:bg-nyu-light-gray dark:hover:bg-surface-dark-subtle'}`}
                >
                  {m === 'url' ? 'URL' : 'File'}
                </button>
              ))}
            </div>
          )}

          {/* URL input */}
          {mode === 'url' && (
            <div>
              <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">
                YouTube or Google Drive URL
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary dark:text-ink-dark-tertiary" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          )}

          {/* File drop zone */}
          {(mode === 'file') && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors duration-150 ${
                dragging
                  ? 'border-nyu-violet bg-nyu-light-violet-2/40 dark:border-nyu-light-violet-1 dark:bg-surface-dark-subtle'
                  : 'border-nyu-gray-2 dark:border-surface-dark-muted hover:border-nyu-violet dark:hover:border-nyu-medium-violet-2 hover:bg-nyu-light-gray dark:hover:bg-surface-dark-subtle'
              }`}
            >
              <UploadCloud className={`w-10 h-10 transition-colors duration-150 ${dragging ? 'text-nyu-violet dark:text-nyu-light-violet-1' : 'text-nyu-gray-2 dark:text-surface-dark-muted'}`} />
              {fileName ? (
                <p className="text-sm font-medium text-nyu-violet dark:text-nyu-light-violet-1">{fileName}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink-secondary dark:text-ink-dark-secondary">
                    {isPdfType ? 'Drop PDF here or click to browse' : 'Drop file here or click to browse'}
                  </p>
                  <p className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary">Peer-study material only</p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept={isPdfType ? '.pdf' : undefined}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-nyu-magenta font-medium">{error}</p>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-nyu-violet"
            />
            <span className="text-xs text-ink-secondary dark:text-ink-dark-secondary leading-relaxed">
              I confirm this resource is supplementary peer-study material and follows{' '}
              <span className="font-medium text-ink-primary dark:text-ink-dark-primary">NYU Academic Integrity guidelines</span>.
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!agreed || submitting}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-nyu-violet text-white hover:bg-nyu-deep-violet dark:hover:bg-nyu-medium-violet-1 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
          >
            {submitting ? 'Submitting…' : 'Submit to NexusShare'}
          </button>
        </div>
      </div>
    </div>
  )
}
