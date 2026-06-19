import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { mockVenues } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import {
  Calendar, Clock, Users, ArrowLeft, Check, Loader2,
  Mail, Phone, MessageSquare, PartyPopper,
} from 'lucide-react'

export default function Reserve() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const venue = mockVenues.find(v => v.slug === slug)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [occasion, setOccasion] = useState('')
  const [requests, setRequests] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const createBooking = trpc.bookingRequest.create.useMutation({
    onSuccess: (data) => {
      setSubmitted(true)
      // Store in localStorage for user reference
      const bookings = JSON.parse(localStorage.getItem('companiio-bookings') || '[]')
      bookings.push({
        venueName: venue?.name,
        venueImage: venue?.image,
        date, time, partySize, status: 'pending',
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('companiio-bookings', JSON.stringify(bookings))
    },
    onError: (err) => {
      setError(err.message || 'Something went wrong. Please try again.')
    },
  })

  if (!venue) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12 text-center">
        <h2 className="text-xl font-bold text-[#1A1A2E]">Venue not found</h2>
        <Button onClick={() => navigate('/discover')} className="mt-4">Browse Venues</Button>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !date || !time) {
      setError('Please fill in all required fields')
      return
    }
    createBooking.mutate({
      venueId: venue.id,
      userName: name,
      userEmail: email,
      userPhone: phone || undefined,
      date,
      time,
      partySize,
      occasion: occasion || undefined,
      specialRequests: requests || undefined,
    })
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Booking Request Sent!</h1>
          <p className="text-gray-500 mb-6">
            Your booking request for <strong>{venue.name}</strong> on {date} at {time} has been sent.
          </p>

          <div className="glass-card p-5 text-left mb-6">
            <h3 className="font-semibold text-[#1A1A2E] mb-3">What happens next?</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span><strong>{venue.name}</strong> receives your request via email</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>They review availability and confirm or decline</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>You get an email with their response</span>
              </li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => navigate(`/venue/${slug}`)} variant="outline" className="flex-1 rounded-xl">
              Back to Venue
            </Button>
            <Button onClick={() => navigate('/discover')} className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl">
              Browse More
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Time slots
  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
  ]

  const occasions = ['Date Night', 'Birthday', 'Anniversary', 'Business', 'Friends', 'Family', 'Other']

  // Min date = today
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6B4A] mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Venue Card */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
            <img src={venue.image || ''} alt={venue.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1A1A2E]">Reserve at {venue.name}</h1>
            <p className="text-xs text-gray-500">{venue.neighborhood}, {venue.city}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E]">Your Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(416) 555-0123" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E]">Booking Details</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} min={today} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests *</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select value={partySize} onChange={e => setPartySize(Number(e.target.value))} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${time === slot ? 'bg-[#FF6B4A] text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
              <div className="flex flex-wrap gap-2">
                {occasions.map(o => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOccasion(occasion === o ? '' : o)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${occasion === o ? 'bg-[#FF6B4A] text-white' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <textarea value={requests} onChange={e => setRequests(e.target.value)} placeholder="Birthday cake, window seat, dietary restrictions..." rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 resize-none" />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{error}</p>
          )}

          <Button
            type="submit"
            disabled={createBooking.isPending}
            className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl h-12 font-semibold shadow-coral disabled:opacity-50"
          >
            {createBooking.isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending Request...</>
            ) : (
              <>Send Booking Request</>
            )}
          </Button>

          <p className="text-xs text-center text-gray-400">
            By submitting, you agree to our terms. The venue will contact you to confirm.
          </p>
        </form>
      </div>
    </div>
  )
}
