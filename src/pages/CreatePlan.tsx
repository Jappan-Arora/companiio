import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useCart } from '@/hooks/useCart'
import {
  Search, MapPin, Star, X, Check, ChevronDown, Clock, ArrowLeft,
  GripVertical, Trash2, Plus, Calendar, Save, Compass, ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockVenues, mockCities, mockCategories, activityTypes, getVenuesByActivityType } from '@/lib/mockData'

const STORAGE_KEY = 'companiio-custom-plans'

interface PlanStop {
  venueId: number
  venueName: string
  venueSlug: string
  venueImage: string
  venueCity: string
  venueCategory: string
  time: string
  notes: string
}

interface CustomPlan {
  id: string
  title: string
  city: string
  stops: PlanStop[]
  createdAt: string
}

function loadPlans(): CustomPlan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function savePlans(plans: CustomPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export default function CreatePlan() {
  const navigate = useNavigate()
  const { addItem } = useCart()

  // Plan meta
  const [title, setTitle] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [step, setStep] = useState<'meta' | 'build' | 'saved'>('meta')

  // Builder state
  const [stops, setStops] = useState<PlanStop[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<number | undefined>()
  const [activity, setActivity] = useState<string | undefined>()
  const [savedPlans, setSavedPlans] = useState<CustomPlan[]>(loadPlans)

  // Filter venues for the builder
  const availableVenues = useMemo(() => {
    let results = mockVenues.filter(v => !selectedCity || v.city === selectedCity)

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      results = results.filter(v =>
        v.name?.toLowerCase().includes(q) ||
        v.cuisine?.toLowerCase().includes(q) ||
        v.subcategories?.some((s: string) => s.toLowerCase().includes(q))
      )
    }
    if (category) {
      results = results.filter(v => v.categoryId === category)
    }
    if (activity) {
      const matched = getVenuesByActivityType(activity)
      const ids = new Set(matched.map(v => v.id))
      results = results.filter(v => ids.has(v.id))
    }
    // Exclude already added venues
    const addedIds = new Set(stops.map(s => s.venueId))
    results = results.filter(v => !addedIds.has(v.id))

    return results
  }, [search, category, activity, stops, selectedCity])

  const addStop = (venue: typeof mockVenues[0]) => {
    const defaultTimes = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM', '10:00 PM']
    const time = defaultTimes[stops.length] || '6:00 PM'
    setStops([...stops, {
      venueId: venue.id,
      venueName: venue.name,
      venueSlug: venue.slug,
      venueImage: venue.image || '',
      venueCity: venue.city || venue.neighborhood || '',
      venueCategory: venue.cuisine || venue.subcategories?.[0] || 'Venue',
      time,
      notes: '',
    }])
  }

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index))
  }

  const moveStop = (from: number, to: number) => {
    if (to < 0 || to >= stops.length) return
    const arr = [...stops]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setStops(arr)
  }

  const updateStopTime = (index: number, time: string) => {
    const arr = [...stops]
    arr[index] = { ...arr[index], time }
    setStops(arr)
  }

  const updateStopNotes = (index: number, notes: string) => {
    const arr = [...stops]
    arr[index] = { ...arr[index], notes }
    setStops(arr)
  }

  const handleSave = () => {
    if (!title.trim() || stops.length === 0) return
    const plan: CustomPlan = {
      id: 'plan_' + Date.now(),
      title: title.trim(),
      city: selectedCity,
      stops,
      createdAt: new Date().toISOString(),
    }
    const updated = [plan, ...savedPlans]
    setSavedPlans(updated)
    savePlans(updated)
    setStep('saved')
  }

  const deletePlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id)
    setSavedPlans(updated)
    savePlans(updated)
  }

  const addPlanToCart = (plan: CustomPlan) => {
    plan.stops.forEach(stop => {
      addItem({
        venueId: stop.venueId,
        venueName: stop.venueName,
        venueSlug: stop.venueSlug,
        venueImage: stop.venueImage,
        venueCity: stop.venueCity,
        venueCategory: stop.venueCategory,
        priceLevel: 2,
      })
    })
  }

  // ─── STEP 1: Plan Meta ───
  if (step === 'meta') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
        <div className="max-w-lg mx-auto px-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6B4A] mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-coral-gradient flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Create Your Day Plan</h1>
            <p className="text-sm text-gray-500 mt-1">Build a custom itinerary from scratch</p>
          </div>

          {/* Saved Plans */}
          {savedPlans.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Your Saved Plans ({savedPlans.length})</h3>
              <div className="space-y-3">
                {savedPlans.map(plan => (
                  <div key={plan.id} className="glass-card p-4">
                    <div className="flex items-start justify-between">
                      <div onClick={() => navigate(`/plan/${plan.id}`)} className="cursor-pointer flex-1 min-w-0">
                        <h4 className="font-semibold text-[#1A1A2E] truncate">{plan.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{plan.city || 'Various'}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{plan.stops.length} stops</span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => addPlanToCart(plan)}
                          className="p-1.5 bg-gray-100 hover:bg-[#FF6B4A]/10 text-gray-500 hover:text-[#FF6B4A] rounded-lg transition-colors"
                          title="Add all to plan"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Plan Form */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-[#1A1A2E] mb-4">Start a New Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Title</label>
                <input
                  type="text"
                  placeholder="e.g., My Toronto Birthday Bash"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20"
                  >
                    <option value="">All cities</option>
                    {mockCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <Button
                onClick={() => setStep('build')}
                disabled={!title.trim()}
                className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl h-11 font-semibold shadow-coral disabled:opacity-50"
              >
                <Plus className="w-5 h-5 mr-2" /> Start Building
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── STEP 2: Plan Builder ───
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-16 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('meta')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-[#1A1A2E]">{title}</h1>
                <p className="text-xs text-gray-500">{stops.length} stops added</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={stops.length === 0}
              className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl shadow-coral disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Plan
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Venue Browser */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4">
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search venues to add..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none py-2.5 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
              <div className="relative">
                <select
                  value={category || ''}
                  onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : undefined)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-3 pr-8 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20"
                >
                  <option value="">All Categories</option>
                  {mockCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Activity quick filters */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 -mx-1 px-1">
              {activityTypes.slice(0, 8).map(type => (
                <button
                  key={type.slug}
                  onClick={() => setActivity(activity === type.slug ? undefined : type.slug)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activity === type.slug ? 'text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
                  style={activity === type.slug ? { backgroundColor: type.color } : {}}
                >
                  {type.name}
                </button>
              ))}
            </div>

            {/* Venue Grid */}
            <p className="text-xs text-gray-400 mb-3">{availableVenues.length} venues available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableVenues.map(v => (
                <div key={v.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all flex">
                  <div className="w-24 h-24 shrink-0">
                    <img
                      src={v.image || ''}
                      alt={v.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' }}
                    />
                  </div>
                  <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
                    <div className="min-w-0">
                      <h4 className="font-medium text-[#1A1A2E] text-sm truncate">{v.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />{v.neighborhood}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-500">{v.rating}</span>
                        <span className="text-xs text-gray-400 ml-1">{'$'.repeat(v.priceLevel || 2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addStop(v)}
                      className="self-start mt-1 flex items-center gap-1 text-xs font-medium text-[#FF6B4A] hover:bg-[#FF6B4A]/10 rounded-lg px-2 py-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add to plan
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {availableVenues.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No venues match your filters</p>
                <button onClick={() => { setSearch(''); setCategory(undefined); setActivity(undefined) }} className="text-[#FF6B4A] text-sm mt-1 hover:underline">Clear filters</button>
              </div>
            )}
          </div>

          {/* Right: Plan Timeline */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-32">
              <div className="glass-card p-4">
                <h3 className="font-semibold text-[#1A1A2E] mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#FF6B4A]" /> Your Itinerary
                </h3>

                {stops.length === 0 ? (
                  <div className="text-center py-8">
                    <Plus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Click "Add to plan" on venues to build your itinerary</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stops.map((stop, i) => (
                      <div key={`${stop.venueId}-${i}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="flex">
                          <div className="w-16 h-16 shrink-0">
                            <img src={stop.venueImage} alt={stop.venueName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 p-2 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0">
                                <p className="font-medium text-[#1A1A2E] text-xs truncate">{stop.venueName}</p>
                                <p className="text-xs text-gray-400">{stop.venueCity}</p>
                              </div>
                              <button onClick={() => removeStop(i)} className="p-1 hover:bg-red-50 rounded ml-1 shrink-0">
                                <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="px-3 pb-2 flex items-center gap-2">
                          <div className="relative">
                            <Clock className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={stop.time}
                              onChange={(e) => updateStopTime(i, e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg pl-6 pr-2 py-1 text-xs w-24 outline-none focus:ring-1 focus:ring-[#FF6B4A]/30"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Notes..."
                            value={stop.notes}
                            onChange={(e) => updateStopNotes(i, e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-[#FF6B4A]/30"
                          />
                          <div className="flex flex-col gap-0.5">
                            <button onClick={() => moveStop(i, i - 1)} className="p-0.5 hover:bg-gray-100 rounded" disabled={i === 0}>
                              <ChevronDown className="w-3 h-3 text-gray-400 rotate-180" />
                            </button>
                            <button onClick={() => moveStop(i, i + 1)} className="p-0.5 hover:bg-gray-100 rounded" disabled={i === stops.length - 1}>
                              <ChevronDown className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
                      <Clock className="w-3 h-3" />
                      <span>Total: {stops.length} stops</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved confirmation */}
      {step === 'saved' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Plan Saved!</h3>
            <p className="text-sm text-gray-500 mb-4">"{title}" has been saved. You can view it anytime.</p>
            <div className="flex gap-3">
              <Button onClick={() => { setStep('meta'); setStops([]); setTitle('') }} variant="outline" className="flex-1 rounded-xl">
                Create Another
              </Button>
              <Button onClick={() => navigate('/plans')} className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl">
                View Plans
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
