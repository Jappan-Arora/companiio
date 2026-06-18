import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, Check, MapPin, Loader2, PartyPopper } from 'lucide-react'

const occasions = ['Birthday', 'Date Night', 'Anniversary', 'Business Meal', 'Friends Gathering', 'Family Dinner', 'Celebration', 'Casual Dining']

export default function Reserve() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const { data: venue, isLoading } = trpc.venue.getBySlug.useQuery({ slug: slug || '' }, { enabled: !!slug })
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [occasion, setOccasion] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const create = trpc.reservation.create.useMutation({ onSuccess: () => { setDone(true); utils.reservation.myReservations.invalidate() } })

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return { value: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }
  })
  const timeSlots: string[] = []
  for (let h = 11; h <= 14; h++) for (const m of ['00', '30']) timeSlots.push(`${h}:${m}`)
  for (let h = 17; h <= 21; h++) for (const m of ['00', '30']) timeSlots.push(`${h}:${m}`)

  const onSubmit = async () => {
    if (!venue) return
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    await create.mutateAsync({
      venueId: venue.id, date, time, partySize, partyName: occasion, occasion,
      specialRequests, guestName, guestEmail, guestPhone, depositRequired: false, depositAmount: 0,
    })
    setIsSubmitting(false)
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B4A]" /></div>
  if (!venue) return <div className="min-h-screen flex items-center justify-center"><h2 className="text-xl font-semibold">Venue not found</h2></div>

  if (done) return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="glass-strong rounded-2xl p-8 text-center shadow-glass">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-600" /></div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Reservation Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your reservation at <strong>{venue.name}</strong> has been confirmed.</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
            <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-[#FF6B4A]" /><div><p className="text-xs text-gray-400">Date</p><p className="text-sm font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p></div></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-[#FF6B4A]" /><div><p className="text-xs text-gray-400">Time</p><p className="text-sm font-medium">{time}</p></div></div>
            <div className="flex items-center gap-3"><Users className="w-5 h-5 text-[#FF6B4A]" /><div><p className="text-xs text-gray-400">Party</p><p className="text-sm font-medium">{partySize} {partySize === 1 ? 'person' : 'people'}</p></div></div>
            {occasion && <div className="flex items-center gap-3"><PartyPopper className="w-5 h-5 text-[#FF6B4A]" /><div><p className="text-xs text-gray-400">Occasion</p><p className="text-sm font-medium">{occasion}</p></div></div>}
          </div>
          <p className="text-sm text-gray-500 mb-6">A confirmation has been sent to <strong>{guestEmail}</strong></p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate('/profile')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl py-5 font-semibold">View My Reservations</Button>
            <Button onClick={() => navigate('/')} variant="outline" className="rounded-xl py-5 border-gray-200">Back to Home</Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-strong rounded-2xl overflow-hidden mb-4 shadow-glass">
          <div className="relative h-32">
            <img src={venue.image || ''} alt={venue.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <h1 className="text-lg font-bold">{venue.name}</h1>
              <p className="text-xs text-white/70 flex items-center gap-1"><MapPin className="w-3 h-3" />{venue.neighborhood}</p>
            </div>
            <button onClick={() => navigate(`/venue/${venue.slug}`)} className="absolute top-3 left-3 glass rounded-full p-1.5"><ChevronLeft className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s < step ? 'bg-green-500 text-white' : s === step ? 'bg-[#FF6B4A] text-white' : 'bg-gray-200 text-gray-400'}`}>{s < step ? <Check className="w-4 h-4" /> : s}</div>
              {s < 3 && <div className={`flex-1 h-1 rounded-full ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-2xl p-5 sm:p-6 shadow-glass">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A2E] mb-1">Select Date</h2>
                <p className="text-sm text-gray-500 mb-3">Choose when you want to visit</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                  {dates.map(d => (
                    <button key={d.value} onClick={() => setDate(d.value)} className={`flex-shrink-0 w-20 py-3 rounded-xl text-center transition-all border ${date === d.value ? 'bg-[#FF6B4A] text-white border-[#FF6B4A] shadow-coral' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                      <p className="text-xs opacity-70">{d.label.split(' ')[0]}</p>
                      <p className="text-lg font-bold">{d.label.split(' ')[2]}</p>
                      <p className="text-xs opacity-70">{d.label.split(' ')[1]}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A2E] mb-1">Select Time</h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {timeSlots.map(t => {
                    const avail = Math.random() > 0.3
                    return <button key={t} onClick={() => avail && setTime(t)} disabled={!avail} className={`py-2.5 rounded-xl text-sm font-medium transition-all ${time === t ? 'bg-[#FF6B4A] text-white shadow-coral' : avail ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200' : 'bg-gray-100 text-gray-300 line-through'}`}>{t}</button>
                  })}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A2E] mb-1">Party Size</h2>
                <div className="flex items-center gap-4">
                  <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">-</button>
                  <div className="flex-1 text-center"><span className="text-3xl font-bold text-[#1A1A2E]">{partySize}</span><p className="text-sm text-gray-400">{partySize === 1 ? 'person' : 'people'}</p></div>
                  <button onClick={() => setPartySize(Math.min(20, partySize + 1))} className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">+</button>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A2E] mb-1">Occasion</h2>
                <div className="flex flex-wrap gap-2">
                  {occasions.map(o => <button key={o} onClick={() => setOccasion(occasion === o ? '' : o)} className={`px-4 py-2 rounded-full text-sm transition-all ${occasion === o ? 'bg-[#FF6B4A] text-white' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>{o}</button>)}
                </div>
              </div>
              <Button onClick={() => setStep(2)} disabled={!date || !time || partySize < 1} className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl py-6 font-semibold shadow-coral disabled:opacity-50">Continue <ChevronRight className="w-5 h-5 ml-2" /></Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div><h2 className="text-lg font-semibold text-[#1A1A2E]">Your Details</h2><p className="text-sm text-gray-500">We need this to confirm your reservation</p></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label><input type="text" required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="John Doe" className="w-full glass-input-dark py-3" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label><input type="email" required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="john@example.com" className="w-full glass-input-dark py-3" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label><input type="tel" required value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="(604) 555-0123" className="w-full glass-input-dark py-3" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests</label><textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Allergies, seating preferences..." rows={3} className="w-full glass-input-dark resize-none" /></div>
              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 rounded-xl py-5 border-gray-200"><ChevronLeft className="w-4 h-4 mr-2" />Back</Button>
                <Button onClick={() => setStep(3)} disabled={!guestName || !guestEmail || !guestPhone} className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl py-5 font-semibold shadow-coral disabled:opacity-50">Continue <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div><h2 className="text-lg font-semibold text-[#1A1A2E]">Confirm Reservation</h2><p className="text-sm text-gray-500">Review your booking</p></div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-200"><span className="text-gray-500">Venue</span><span className="font-medium">{venue.name}</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-500">Date</span><span className="font-medium">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-500">Time</span><span className="font-medium">{time}</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-500">Party</span><span className="font-medium">{partySize}</span></div>
                {occasion && <div className="flex justify-between py-1"><span className="text-gray-500">Occasion</span><span className="font-medium">{occasion}</span></div>}
                <div className="flex justify-between py-1 border-t border-gray-200 pt-2"><span className="text-gray-500">Name</span><span className="font-medium">{guestName}</span></div>
              </div>
              <p className="text-xs text-gray-400">By confirming, you agree to our cancellation policy. The venue will charge you directly for your meal.</p>
              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1 rounded-xl py-5 border-gray-200" disabled={isSubmitting}><ChevronLeft className="w-4 h-4 mr-2" />Back</Button>
                <Button onClick={onSubmit} disabled={isSubmitting} className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl py-5 font-semibold shadow-coral">
                  {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</> : <><Check className="w-5 h-5 mr-2" />Confirm</>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
