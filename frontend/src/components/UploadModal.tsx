import { useState, useRef } from 'react'
import { X, UploadCloud } from 'lucide-react'

interface UploadModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [agreed, setAgreed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setFileName(file.name)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  function handleSubmit() {
    onClose()
    onSuccess()
  }

  const inputClass = 'w-full px-3 py-2 text-sm bg-nyu-light-gray dark:bg-surface-dark-subtle border border-nyu-gray-3 dark:border-surface-dark-muted rounded-lg text-ink-primary dark:text-ink-dark-primary placeholder-ink-tertiary dark:placeholder-ink-dark-tertiary focus:outline-none focus:ring-2 focus:ring-nyu-violet/20 focus:border-nyu-violet dark:focus:border-nyu-medium-violet-1 transition-colors duration-150'

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

        <div className="p-7 flex flex-col gap-4">
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
                <p className="text-sm font-medium text-ink-secondary dark:text-ink-dark-secondary">Drop PDF here or click to browse</p>
                <p className="text-xs text-ink-tertiary dark:text-ink-dark-tertiary">Syllabi, notes, study guides only</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="h-px bg-nyu-gray-3 dark:bg-surface-dark-subtle" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">Course Code</label>
              <input type="text" placeholder="e.g. CS-UY 2124" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">Professor</label>
              <input type="text" placeholder="Last name" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">Semester</label>
              <select className={inputClass}>
                <option>Spring 2026</option>
                <option>Fall 2025</option>
                <option>Spring 2025</option>
                <option>Fall 2024</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">Textbook Cost ($)</label>
              <input type="number" min="0" placeholder="0" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary mb-1">Recording Policy</label>
            <select className={inputClass}>
              <option>Asynchronous Friendly</option>
              <option>In-Person Only</option>
            </select>
          </div>

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
            disabled={!agreed}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-nyu-violet text-white hover:bg-nyu-deep-violet dark:hover:bg-nyu-medium-violet-1 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
          >
            Submit to NexusShare
          </button>
        </div>
      </div>
    </div>
  )
}
