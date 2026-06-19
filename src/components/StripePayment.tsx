import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, CheckCircle } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

interface StripePaymentProps {
  amount: number // in cents
  venueName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function StripePayment({ amount, venueName, onSuccess, onCancel }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const createIntent = trpc.stripe.createPaymentIntent.useMutation({
    onSuccess: (data) => {
      setClientSecret(data.clientSecret || '')
      setLoading(false)
    },
    onError: () => {
      setLoading(false)
    },
  })

  useEffect(() => {
    // Create payment intent when component mounts
    if (amount > 0 && !clientSecret) {
      setLoading(true)
      createIntent.mutate({
        amount,
        currency: 'cad',
        venueName,
        bookingId: `booking_${Date.now()}`,
      })
    }
  }, [amount, venueName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientSecret) return

    setLoading(true)

    // In test mode, simulate payment confirmation
    // In production, this would use Stripe Elements or redirect to Stripe Checkout
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      onSuccess?.()
    }, 1500)
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-[#1A1A2E]">Payment Successful!</h3>
        <p className="text-sm text-gray-500">Your reservation deposit has been processed.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
        <span className="text-sm text-gray-600">Reservation deposit</span>
        <span className="text-lg font-bold text-[#1A1A2E]">${(amount / 100).toFixed(2)} CAD</span>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
        <div className="relative">
          <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20"
            maxLength={19}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Test card: 4242 4242 4242 4242</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Expiry</label>
          <input
            type="text"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20"
            maxLength={7}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">CVC</label>
          <input
            type="text"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20"
            maxLength={4}
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading || !clientSecret}
          className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl h-11 font-semibold shadow-coral"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Pay $${(amount / 100).toFixed(2)}`}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-sm text-gray-400 hover:text-gray-600 mt-2 py-2"
        >
          Cancel
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-gray-300" />
          <path d="M6 14h2M6 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-300" />
        </svg>
        <span className="text-xs text-gray-400">Secured by Stripe</span>
      </div>
    </form>
  )
}
