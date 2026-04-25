import { Upload } from 'lucide-react'

interface NavbarProps {
  onUploadClick: () => void
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  const tabs = ['Space', 'Items', 'Knowledge']

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <span className="text-xl font-bold text-nyu-violet tracking-tight whitespace-nowrap">
          NexusShare
        </span>

        <nav className="hidden sm:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === 'Knowledge'
                  ? 'bg-nyu-violet text-white'
                  : 'text-gray-600 hover:text-nyu-violet hover:bg-purple-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
            @nyu.edu Verified
          </span>
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-nyu-violet text-white text-sm font-medium rounded-lg hover:bg-nyu-violet-dark transition-colors"
          >
            <Upload className="w-4 h-4" />
            Knowledge Drop
          </button>
        </div>
      </div>
    </header>
  )
}
