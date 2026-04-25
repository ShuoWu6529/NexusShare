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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Knowledge Drop</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
              dragging ? 'border-nyu-violet bg-purple-50' : 'border-gray-200 hover:border-nyu-violet/60 hover:bg-gray-50'
            }`}
          >
            <UploadCloud className={`w-10 h-10 ${dragging ? 'text-nyu-violet' : 'text-gray-300'}`} />
            {fileName ? (
              <p className="text-sm font-medium text-nyu-violet">{fileName}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600">Drop PDF here or click to browse</p>
                <p className="text-xs text-gray-400">Syllabi, notes, study guides only</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Course Code</label>
              <input
                type="text"
                placeholder="e.g. CS-UY 2124"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyu-violet/30 focus:border-nyu-violet"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Professor</label>
              <input
                type="text"
                placeholder="Last name"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyu-violet/30 focus:border-nyu-violet"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyu-violet/30 focus:border-nyu-violet bg-white">
                <option>Spring 2026</option>
                <option>Fall 2025</option>
                <option>Spring 2025</option>
                <option>Fall 2024</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Textbook Cost ($)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyu-violet/30 focus:border-nyu-violet"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Recording Policy</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyu-violet/30 focus:border-nyu-violet bg-white">
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
            <span className="text-xs text-gray-600 leading-relaxed">
              I confirm this resource is supplementary peer-study material and follows{' '}
              <span className="font-medium text-gray-800">NYU Academic Integrity guidelines</span>.
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-nyu-violet text-white hover:bg-nyu-violet-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit to NexusShare
          </button>
        </div>
      </div>
    </div>
  )
}
