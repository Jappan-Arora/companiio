import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Building2, Upload, MapPin, Phone, Mail, Globe, Instagram, Facebook,
  Check, ArrowLeft, Clock, DollarSign, Star, ChevronDown, ImageIcon, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockCities, mockCategories } from '@/lib/mockData'

const PRICE_LEVELS = [
  { level: 1, label: '$', desc: 'Budget-friendly' },
  { level: 2, label: '$$', desc: 'Moderate' },
  { level: 3, label: '$$$', desc: 'Upscale' },
  { level: 4, label: '$$$$', desc: 'Fine dining' },
]

const FEATURES = [
  'Waterfront View', 'Patio', 'Live Music', 'Dog Friendly',
  'Gluten Free Options', 'Vegan Options', 'Private Dining', 'Full Bar',
  'Free Wi-Fi', 'Parking', 'Wheelchair Accessible', 'Outdoor Seating',
  'Reservations', 'Takeout', 'Delivery', 'Happy Hour',
]

const CUISINES = [
  'Italian', 'Japanese', 'Chinese', 'Indian', 'Mexican', 'French',
  'Thai', 'Korean', 'Vietnamese', 'Greek', 'Mediterranean', 'American',
  'Seafood', 'Steakhouse', 'Sushi', 'Pizza', 'Burger', 'BBQ',
  'Fusion', 'Vegetarian', 'Vegan', 'Brunch', 'Bar', 'Pub',
  'Cafe', 'Bakery', 'Dessert', 'Ice Cream', 'Bubble Tea', 'Coffee',
]

export default function VenueSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    cuisine: '',
    description: '',
    address: '',
    city: '',
    province: '',
    neighborhood: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
    facebook: '',
    priceLevel: 2,
    features: [] as string[],
    hours: {
      mon: { open: '11:00', close: '22:00', closed: false },
      tue: { open: '11:00', close: '22:00', closed: false },
      wed: { open: '11:00', close: '22:00', closed: false },
      thu: { open: '11:00', close: '22:00', closed: false },
      fri: { open: '11:00', close: '23:00', closed: false },
      sat: { open: '10:00', close: '23:00', closed: false },
      sun: { open: '10:00', close: '21:00', closed: false },
    },
    images: [] as string[],
  })

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }))

  const toggleFeature = (f: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (form.images.length < 6) {
          setForm(f => ({ ...f, images: [...f.images, ev.target?.result as string] }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (i: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    // Store in localStorage for now (will be sent to admin for approval)
    const submissions = JSON.parse(localStorage.getItem('venue-submissions') || '[]')
    submissions.push({ ...form, id: 'venue_' + Date.now(), submittedAt: new Date().toISOString(), status: 'pending' })
    localStorage.setItem('venue-submissions', JSON.stringify(submissions))
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  const requiredFilled = () => {
    if (step === 1) return form.name && form.categoryId && form.cuisine && form.description && form.address && form.city
    if (step === 2) return form.phone && form.email
    return true
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">Application Submitted!</h1>
          <p className="text-gray-500 mb-2">Thank you for joining Companiio.</p>
          <p className="text-sm text-gray-400 mb-6">Our team will review your venue within 24-48 hours. You'll receive an email at {form.email} once approved.</p>
          <div className="glass-card p-4 mb-6 text-left">
            <h3 className="font-semibold text-[#1A1A2E] mb-2">What happens next?</h3>
            <ol className="space-y-2 text-sm text-gray-500">
              <li className="flex gap-2"><span className="text-[#FF6B4A] font-bold">1.</span> We review your submission</li>
              <li className="flex gap-2"><span className="text-[#FF6B4A] font-bold">2.</span> You receive an approval email</li>
              <li className="flex gap-2"><span className="text-[#FF6B4A] font-bold">3.</span> Your venue goes live on Companiio</li>
              <li className="flex gap-2"><span className="text-[#FF6B4A] font-bold">4.</span> Start receiving bookings!</li>
            </ol>
          </div>
          <Button onClick={() => navigate('/')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full px-8">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1A1A2E]">List Your Venue</h1>
            <p className="text-xs text-gray-500">Step {step} of 3</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-8 h-1.5 rounded-full ${s <= step ? 'bg-[#FF6B4A]' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-coral-gradient rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#1A1A2E]">Tell us about your venue</h2>
              <p className="text-sm text-gray-500">Basic information to get started</p>
            </div>

            <div className="glass-card p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Venue Name *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g., Joe Fortes Seafood & Chop House" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                  <div className="relative">
                    <select value={form.categoryId} onChange={e => update('categoryId', e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20">
                      <option value="">Select</option>
                      {mockCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cuisine/Type *</label>
                  <div className="relative">
                    <select value={form.cuisine} onChange={e => update('cuisine', e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20">
                      <option value="">Select</option>
                      {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe your venue, atmosphere, specialties..." rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                <input type="text" value={form.address} onChange={e => update('address', e.target.value)} placeholder="123 Main Street" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <div className="relative">
                    <select value={form.city} onChange={e => update('city', e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20">
                      <option value="">Select</option>
                      {mockCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Neighborhood</label>
                  <input type="text" value={form.neighborhood} onChange={e => update('neighborhood', e.target.value)} placeholder="e.g., Downtown" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Level</label>
                <div className="flex gap-2">
                  {PRICE_LEVELS.map(p => (
                    <button key={p.level} onClick={() => update('priceLevel', p.level)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${form.priceLevel === p.level ? 'bg-[#FF6B4A] text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact & Social */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-coral-gradient rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#1A1A2E]">Contact & Social</h2>
              <p className="text-sm text-gray-500">How guests can reach you</p>
            </div>

            <div className="glass-card p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(416) 555-0123" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="hello@yourvenue.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="url" value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://yourvenue.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" value={form.instagram} onChange={e => update('instagram', e.target.value)} placeholder="@yourvenue" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook</label>
                <div className="relative">
                  <Facebook className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" value={form.facebook} onChange={e => update('facebook', e.target.value)} placeholder="facebook.com/yourvenue" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features & Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {FEATURES.map(f => (
                    <button key={f} onClick={() => toggleFeature(f)} className={`px-3 py-1.5 rounded-full text-xs transition-all ${form.features.includes(f) ? 'bg-[#FF6B4A] text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
                      {form.features.includes(f) && <Check className="w-3 h-3 inline mr-1" />}{f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos & Hours */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-coral-gradient rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#1A1A2E]">Photos & Hours</h2>
              <p className="text-sm text-gray-500">Showcase your venue</p>
            </div>

            <div className="glass-card p-5 space-y-5">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Photos ({form.images.length}/6)</label>
                <div className="grid grid-cols-3 gap-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 6 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B4A] hover:bg-[#FF6B4A]/5 transition-all">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-400">Add photo</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                <div className="space-y-2">
                  {Object.entries(form.hours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-10 text-sm font-medium text-gray-600 capitalize">{day}</span>
                      <input type="checkbox" checked={!hours.closed} onChange={e => {
                        const h = { ...form.hours, [day]: { ...hours, closed: !e.target.checked } }
                        update('hours', h)
                      }} className="w-4 h-4 accent-[#FF6B4A]" />
                      {!hours.closed ? (
                        <>
                          <input type="time" value={hours.open} onChange={e => {
                            const h = { ...form.hours, [day]: { ...hours, open: e.target.value } }
                            update('hours', h)
                          }} className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs" />
                          <span className="text-gray-400">-</span>
                          <input type="time" value={hours.close} onChange={e => {
                            const h = { ...form.hours, [day]: { ...hours, close: e.target.value } }
                            update('hours', h)
                          }} className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs" />
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)} variant="outline" className="rounded-xl border-gray-200">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!requiredFilled()}
              className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl font-semibold shadow-coral disabled:opacity-50"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl font-semibold shadow-coral disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
