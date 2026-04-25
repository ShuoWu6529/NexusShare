import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

interface ToastProps {
  message: string
  onDismiss: () => void
}

export default function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-nyu-dark-gray dark:bg-surface-dark-overlay text-nyu-white dark:text-ink-dark-primary px-5 py-3.5 rounded-xl shadow-modal dark:border dark:border-surface-dark-subtle text-sm font-medium toast-enter">
      <CheckCircle className="w-5 h-5 text-nyu-teal shrink-0" />
      {message}
    </div>
  )
}
