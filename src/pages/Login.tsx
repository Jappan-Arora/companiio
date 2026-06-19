import { useState } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth, setLocalToken } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Compass, Mail, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'

type AuthView = 'main' | 'email-signup' | 'email-login'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [view, setView] = useState<AuthView>('main')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // tRPC mutations
  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      setLocalToken(data.token)
      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
        role: data.user.role || 'user',
        provider: 'email',
      })
      window.location.href = '/#/profile'
    },
    onError: (err) => {
      setError(err.message || 'Registration failed')
      setIsSubmitting(false)
    },
  })

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      setLocalToken(data.token)
      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
        role: data.user.role || 'user',
        provider: 'email',
      })
      window.location.href = '/#/profile'
    },
    onError: (err) => {
      setError(err.message || 'Login failed')
      setIsSubmitting(false)
    },
  })

  const handleGoogleSignIn = () => {
    // For immediate deployment: create a demo Google user via the API
    registerMutation.mutate({
      name: 'Google User',
      email: `google_${Date.now()}@gmail.com`,
      password: Math.random().toString(36).slice(2) + 'A1!',
    })
  }

  const handleAppleSignIn = () => {
    registerMutation.mutate({
      name: 'Apple User',
      email: `apple_${Date.now()}@icloud.com`,
      password: Math.random().toString(36).slice(2) + 'A1!',
    })
  }

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setIsSubmitting(true)
    registerMutation.mutate({ name: name.trim(), email: email.trim(), password })
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password')
      return
    }
    setIsSubmitting(true)
    loginMutation.mutate({ email: email.trim(), password })
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setError('')
    setShowPassword(false)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#1A1A2E] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#FF6B4A] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF6B4A] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-coral-gradient flex items-center justify-center mx-auto mb-6">
            <Compass className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Companiio</h1>
          <p className="text-lg text-gray-400 mb-8">Never run out of plans.</p>
          <div className="space-y-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-[#FF6B4A]/20 flex items-center justify-center shrink-0">
                <span className="text-[#FF6B4A] text-sm font-bold">1</span>
              </div>
              <span className="text-sm">Discover 1000+ venues across Canada</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-[#FF6B4A]/20 flex items-center justify-center shrink-0">
                <span className="text-[#FF6B4A] text-sm font-bold">2</span>
              </div>
              <span className="text-sm">Build your perfect day plan</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-[#FF6B4A]/20 flex items-center justify-center shrink-0">
                <span className="text-[#FF6B4A] text-sm font-bold">3</span>
              </div>
              <span className="text-sm">Book & save exclusive deals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center bg-[#FAF8F5] px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-coral-gradient flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Companiio</h1>
          </div>

          {view === 'main' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Welcome back</h2>
                <p className="text-sm text-gray-500">Sign in to access your plans and deals</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={handleAppleSignIn}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-900 transition-all shadow-sm disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </button>

                <button
                  onClick={() => { setView('email-login'); resetForm() }}
                  className="w-full flex items-center justify-center gap-3 bg-[#FF6B4A] text-white font-medium py-3 px-4 rounded-xl hover:bg-[#E55A3A] transition-all shadow-coral"
                >
                  <Mail className="w-5 h-5" />
                  Continue with Email
                </button>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-500 hover:text-[#FF6B4A] transition-colors"
                >
                  Continue as guest
                </button>
              </div>

              <p className="mt-8 text-xs text-center text-gray-400">
                By signing in, you agree to our{' '}
                <button onClick={() => navigate('/terms')} className="text-[#FF6B4A] hover:underline">Terms</button>
                {' '}and{' '}
                <button onClick={() => navigate('/privacy')} className="text-[#FF6B4A] hover:underline">Privacy Policy</button>
              </p>
            </>
          )}

          {view === 'email-login' && (
            <>
              <button
                onClick={() => { setView('main'); resetForm() }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6B4A] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-1">Sign in</h2>
                <p className="text-sm text-gray-500">Enter your email to continue</p>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl h-11 font-semibold shadow-coral"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  onClick={() => { setView('email-signup'); resetForm() }}
                  className="text-[#FF6B4A] font-medium hover:underline"
                >
                  Sign up
                </button>
              </p>
            </>
          )}

          {view === 'email-signup' && (
            <>
              <button
                onClick={() => { setView('main'); resetForm() }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6B4A] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-1">Create account</h2>
                <p className="text-sm text-gray-500">Join Companiio today</p>
              </div>

              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl h-11 font-semibold shadow-coral"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  onClick={() => { setView('email-login'); resetForm() }}
                  className="text-[#FF6B4A] font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
