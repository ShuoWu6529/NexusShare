import { Upload, Sun, Moon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

interface NavbarProps {
  onUploadClick?: () => void
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark-raised/80 backdrop-blur-md backdrop-saturate-150 border-b border-nyu-gray-3 dark:border-white/[0.06] shadow-navbar transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <NavLink to="/" end className="text-xl font-semibold text-nyu-violet dark:text-nyu-light-violet-1 tracking-tight whitespace-nowrap">
            NexusShare
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `text-sm font-medium pb-0.5 border-b-2 transition-colors duration-150 ${
                isActive
                  ? 'border-nyu-violet text-nyu-violet dark:border-nyu-light-violet-1 dark:text-nyu-light-violet-1'
                  : 'border-transparent text-ink-secondary dark:text-ink-dark-secondary hover:text-nyu-violet dark:hover:text-nyu-light-violet-1'
              }`
            }
          >
            Course Catalog
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-ink-secondary dark:text-ink-dark-secondary hover:text-nyu-violet dark:hover:text-nyu-light-violet-1 hover:bg-nyu-light-violet-2 dark:hover:bg-surface-dark-subtle transition-colors duration-150"
          >
            {theme === 'dark'
              ? <Sun className="w-5 h-5" />
              : <Moon className="w-5 h-5" />
            }
          </button>

          {onUploadClick && (
            <button
              onClick={onUploadClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-nyu-violet text-white text-sm font-medium rounded-lg hover:bg-nyu-deep-violet dark:hover:bg-nyu-medium-violet-1 transition-colors duration-150 active:scale-[0.97]"
            >
              <Upload className="w-4 h-4" />
              Knowledge Drop
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
