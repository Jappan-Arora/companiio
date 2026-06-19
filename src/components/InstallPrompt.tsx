import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Share, ChevronUp } from 'lucide-react'

type InstallType = 'chrome' | 'ios' | 'safari-desktop' | 'samsung' | null

export default function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installType, setInstallType] = useState<InstallType>(null)
  const [installSuccess, setInstallSuccess] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true
    if (isStandalone) return

    // Check if dismissed
    const dismissed = localStorage.getItem('companiio-install-dismissed')
    const dismissDate = dismissed ? parseInt(dismissed) : 0
    // Re-show after 7 days if dismissed
    if (dismissed && Date.now() - dismissDate < 7 * 24 * 60 * 60 * 1000) return

    // Detect browser/platform
    const ua = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isSafari = /safari/.test(ua) && !/chrome/.test(ua)
    const isChrome = /chrome/.test(ua) && !/edg/.test(ua) && !/opr/.test(ua)
    const isSamsung = /samsungbrowser/.test(ua)

    if (isIOS) {
      setInstallType('ios')
    } else if (isSamsung) {
      setInstallType('samsung')
    } else if (isChrome) {
      setInstallType('chrome')
    } else if (isSafari) {
      setInstallType('safari-desktop')
    } else {
      setInstallType('chrome') // default
    }

    // Listen for the beforeinstallprompt event (Chrome/Edge)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setInstallType('chrome')
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Show after 8 seconds of engagement
    const timer = setTimeout(() => {
      if (!isStandalone) setShow(true)
    }, 8000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [])

  const handleInstall = async () => {
    if (installType === 'ios') {
      // iOS: show instructions
      return
    }

    if (deferredPrompt) {
      ;(deferredPrompt as any).prompt()
      const { outcome } = await (deferredPrompt as any).userChoice
      if (outcome === 'accepted') {
        setInstallSuccess(true)
        setTimeout(() => setShow(false), 2000)
      }
      setDeferredPrompt(null)
    } else if (installType === 'chrome' || installType === 'samsung') {
      // Chrome without deferred prompt: show manual instructions
      alert('To install:\n1. Click the menu (3 dots) in the top right\n2. Select "Install Companiio" or "Add to Home screen"')
    }
  }

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('companiio-install-dismissed', Date.now().toString())
  }

  const neverShow = () => {
    setShow(false)
    localStorage.setItem('companiio-install-dismissed', '9999999999999')
  }

  if (!show || !installType) return null

  // iOS Install Instructions Modal
  if (installType === 'ios') {
    return (
      <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={dismiss}>
        <div className="bg-white rounded-t-3xl p-6 max-w-sm w-full mx-auto animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1A1A2E]">Add to Home Screen</h3>
            <button onClick={dismiss} className="p-1.5 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FF6B4A]/10 rounded-full flex items-center justify-center shrink-0">
                <Share className="w-4 h-4 text-[#FF6B4A]" />
              </div>
              <p className="text-sm text-gray-600"><strong>Step 1:</strong> Tap the <strong>Share button</strong> at the bottom of Safari</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FF6B4A]/10 rounded-full flex items-center justify-center shrink-0">
                <ChevronUp className="w-4 h-4 text-[#FF6B4A]" />
              </div>
              <p className="text-sm text-gray-600"><strong>Step 2:</strong> Scroll down and tap <strong>"Add to Home Screen"</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FF6B4A]/10 rounded-full flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-[#FF6B4A]" />
              </div>
              <p className="text-sm text-gray-600"><strong>Step 3:</strong> Tap <strong>Add</strong> and Companiio will appear on your home screen</p>
            </div>
            <button onClick={dismiss} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 text-sm font-medium transition-colors mt-2">
              Got it
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Android Chrome / Samsung / Desktop Chrome Banner
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] max-w-sm mx-auto">
      <div className="bg-[#1A1A2E] text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-fade-in-up">
        <img src="/icon-192.png" alt="Companiio" className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Install Companiio</p>
          <p className="text-xs text-gray-400">Add to home screen for quick access</p>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={handleInstall}
            className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white text-xs font-medium rounded-lg px-3 py-2 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Install
          </button>
          <button onClick={dismiss} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            Maybe later
          </button>
        </div>
      </div>
      {installSuccess && (
        <div className="mt-2 bg-green-500 text-white text-xs text-center rounded-xl py-2 px-3 animate-fade-in">
          Companiio installed successfully! Check your home screen.
        </div>
      )}
    </div>
  )
}
