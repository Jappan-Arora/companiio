import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastCallback: ((toast: Omit<Toast, 'id'>) => void) | null = null

export function showToast(message: string, type: ToastType = 'success') {
  toastCallback?.({ message, type })
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    toastCallback = ({ message, type }) => {
      const id = Math.random().toString(36).substring(2, 10)
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3500)
    }
    return () => { toastCallback = null }
  }, [])

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const styles = {
    success: 'bg-white border-green-200',
    error: 'bg-white border-red-200',
    info: 'bg-white border-blue-200',
  }

  return (
    <div className="fixed top-20 right-4 z-[70] space-y-2 w-72">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`${styles[t.type]} border rounded-xl shadow-lg p-3 flex items-start gap-2.5 animate-fade-in-up`}
        >
          {icons[t.type]}
          <p className="text-sm text-gray-700 flex-1">{t.message}</p>
          <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
