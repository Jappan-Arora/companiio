import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import {
  Search, MapPin, Star, UtensilsCrossed, Coffee, Wine, Heart, Sun,
  Gamepad2, Mountain, Music, Trophy, Palette, ArrowRight,
  CalendarDays, Users, Zap, Ticket, ChevronRight, Check,
  Compass, Clock, ShoppingBag, Target, Sparkles,
} from 'lucide-react'
import { mockCategories, mockVenues, mockDeals, mockPlans, mockCities, activityTypes } from '@/lib/mockData'

const iconMap: Record<string, React.ReactNode> = {
  utensils: <UtensilsCrossed className="w-6 h-6" />, coffee: <Coffee className="w-6 h-6" />,
  wine: <Wine className="w-6 h-6" />, heart: <Heart className="w-6 h-6" />, sun: <Sun className="w-6 h-6" />,
  gamepad: <Gamepad2 className="w-6 h-6" />, mountain: <Mountain className="w-6 h-6" />,
  music: <Music className="w-6 h-6" />, trophy: <Trophy className="w-6 h-6" />, palette: <Palette className="w-6 h-6" />,
}

function SpecialOfferPopup({ onClose }: { onClose: () => void }) {
  const { data: apiDeals } = trpc.deal.list.useQuery()
  const deals = apiDeals && apiDeals.length > 0 ? apiDeals : mockDeals as any[]
  const topDeal = deals?.[0]
  if (!topDeal) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative glass-strong rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"><Sparkles className="w-5 h-5 text-gray-400" /></button>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF6B4A]/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#FF6B4A]/5 rounded-full" />
        <div className="relative">
          <div className="w-12 h-12 bg-coral-gradient rounded-xl flex items-center justify-center mb-4 shadow-coral"><Ticket className="w-6 h-6 text-white" /></div>
          <span className="text-xs font-bold text-[#FF6B4A] uppercase tracking-wider">Limited Time</span>
          <h3 className="text-xl font-bold text-[#1A1A2E] mt-1 mb-2">{topDeal.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{topDeal.description}</p>
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-[#FF6B4A]/10 text-[#FF6B4A] font-mono text-sm font-bold rounded-lg px-3 py-1.5">{topDeal.code}</span>
            <span className="text-xs text-gray-400">at {topDeal.venue?.name || topDeal.venueName}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { onClose(); window.location.hash = `/venue/${topDeal.venue?.slug || topDeal.venueSlug || ''}` }} className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl shadow-coral">Claim Deal</Button>
            <Button onClick={onClose} variant="outline" className="rounded-xl border-gray-200">Dismiss</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { addItem, isInCart } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [showPopup, setShowPopup] = useState(true)
  const { data: apiCities } = trpc.city.list.useQuery()
  const { data: apiCategories } = trpc.category.list.useQuery()
  const { data: apiFeatured } = trpc.venue.featured.useQuery({ limit: 8 })
  const { data: apiDeals } = trpc.deal.list.useQuery()
  const { data: apiPlans } = trpc.itinerary.list.useQuery({})

  const cities = apiCities && apiCities.length > 0 ? apiCities : mockCities as any[]
  const categories = apiCategories && apiCategories.length > 0 ? apiCategories : mockCategories as any[]
  const featuredVenues = apiFeatured && apiFeatured.length > 0 ? apiFeatured : mockVenues.filter(v => v.isFeatured).slice(0, 8) as any[]
  const deals = apiDeals && apiDeals.length > 0 ? apiDeals : mockDeals as any[]
  const plans = apiPlans && apiPlans.length > 0 ? apiPlans : mockPlans as any[]

  useEffect(() => { setHeroLoaded(true) }, [])
  useEffect(() => { const timer = setTimeout(() => setShowPopup(false), 8000); return () => clearTimeout(timer) }, [])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  const handleAddToPlan = (v: any) => {
    if (isInCart(v.id)) return
    addItem({
      venueId: v.id, venueName: v.name, venueSlug: v.slug,
      venueImage: v.image || v.photoUrl || '', venueCity: v.city || v.neighborhood || '',
      venueCategory: v.cuisine || v.subcategories?.[0] || 'Venue', priceLevel: v.priceLevel || 2,
    })
  }

  return (
    <div>
      {showPopup && <SpecialOfferPopup onClose={() => setShowPopup(false)} />}

      {/* Hero — Mirror Glass */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/venues/mission-hill-winery.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E]/85 via-[#1A1A2E]/50 to-[#1A1A2E]" />
        </div>
        <div className={`relative z-10 max-w-4xl mx-auto px-4 text-center transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-6 mirror-shine">
            <Star className="w-4 h-4 text-[#FF6B4A]" />
            <span className="text-sm text-white/90 font-medium">Discover. Plan. Experience.</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
            Never run out of <span className="gradient-text">plans</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Real restaurants, real activities, real experiences across Canada. Plan your perfect day and book it all in one place.
          </p>

          <form onSubmit={onSearch} className="max-w-2xl mx-auto glass rounded-2xl p-2 flex items-center gap-2 mb-8 shadow-glass mirror">
            <div className="flex items-center flex-1 px-4">
              <Search className="w-5 h-5 text-white/50 mr-3 shrink-0" />
              <input type="text" placeholder="Search restaurants, activities, experiences..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 py-3" />
            </div>
            <Button type="submit" className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl px-6 py-6 shadow-coral font-semibold">
              <Search className="w-5 h-5 mr-2" /> Search
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {cities?.slice(0,6).map(c => (
              <button key={c.id} onClick={() => navigate(`/discover?city=${c.id}`)} className="glass-button">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />{c.name}
              </button>
            ))}
            <button onClick={() => navigate('/surprise-me')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full px-4 py-2 text-sm font-medium transition-all shadow-coral flex items-center gap-1">
              <Zap className="w-4 h-4" /> Surprise Me
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5"><div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" /></div>
        </div>
      </section>

      {/* Quick Actions — Glass Cards */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: CalendarDays, label: 'Day Plans', desc: 'Curated itineraries', to: '/plans', color: 'from-amber-400 to-orange-500' },
              { icon: Zap, label: 'Surprise Me', desc: 'Random adventure', to: '/surprise-me', color: 'from-purple-500 to-pink-500' },
              { icon: Ticket, label: 'Live Deals', desc: 'Save on outings', to: '/deals', color: 'from-green-400 to-emerald-500' },
              { icon: ShoppingBag, label: 'My Plan', desc: 'View your cart', to: '/my-plan', color: 'from-blue-400 to-cyan-500' },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.to)} className="group glass-card p-5 text-left hover-lift mirror-shine">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-[#1A1A2E] text-sm">{item.label}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — Glass Grid */}
      <section className="py-14 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-2">What are you in the mood for?</h2>
            <p className="text-gray-500">Browse by category to find your perfect plan</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories?.map((cat) => (
              <button key={cat.id} onClick={() => navigate(`/discover?category=${cat.id}`)} className="group glass-card p-5 hover-lift mirror-shine transition-all text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-white group-hover:scale-110 transition-transform" style={{ backgroundColor: cat.color || '#FF6B4A' }}>
                  {iconMap[cat.icon || ''] || <Compass className="w-6 h-6" />}
                </div>
                <h3 className="font-semibold text-sm text-[#1A1A2E] mb-0.5">{cat.name}</h3>
                <p className="text-xs text-gray-400">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Types — Horizontal Mirror Scroll */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-1">Activities & Experiences</h2>
              <p className="text-gray-500">From golf to comedy, find your next adventure</p>
            </div>
            <button onClick={() => navigate('/discover')} className="hidden sm:flex items-center gap-1 text-[#FF6B4A] font-medium text-sm hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {activityTypes.map((type) => (
              <button
                key={type.slug}
                onClick={() => navigate(`/discover?activity=${type.slug}`)}
                className="group flex-shrink-0 w-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all text-left mirror-shine"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={type.image} alt={type.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-sm">{type.name}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues — Mirror Cards with Real Photos */}
      <section className="py-14 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-1">Trending Now</h2>
              <p className="text-gray-500">Most popular venues this week \u2014 all real, all verified</p>
            </div>
            <button onClick={() => navigate('/discover')} className="hidden sm:flex items-center gap-1 text-[#FF6B4A] font-medium text-sm hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredVenues?.map(v => (
              <div key={v.id} className="group text-left bg-white rounded-2xl overflow-hidden border border-gray-100/80 hover:shadow-xl transition-all hover-lift mirror-shine">
                <button onClick={() => navigate(`/venue/${v.slug}`)} className="w-full text-left">
                  <div className="relative h-48 overflow-hidden">
                    <img src={v.image || v.photoUrl || ''} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {v.isVerified && (
                      <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs font-medium text-white">Verified</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div className="glass rounded-full px-2.5 py-1 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-white">{v.rating}</span>
                        <span className="text-xs text-white/60">({v.reviewCount?.toLocaleString() || 0})</span>
                      </div>
                      <span className="bg-[#FF6B4A] text-white text-xs font-bold rounded-full px-2.5 py-1">
                        {'$'.repeat(v.priceLevel || 2)}
                      </span>
                    </div>
                  </div>
                </button>
                <div className="p-4">
                  <button onClick={() => navigate(`/venue/${v.slug}`)} className="w-full text-left">
                    <h3 className="font-semibold text-[#1A1A2E] group-hover:text-[#FF6B4A] transition-colors line-clamp-1">{v.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />{v.neighborhood}, {v.city}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(v.subcategories || v.features || []).slice(0, 3).map((f: string, i: number) => (
                        <span key={i} className="text-xs bg-gray-50 text-gray-500 rounded-md px-2 py-0.5 border border-gray-100">{f}</span>
                      ))}
                    </div>
                  </button>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    {v.bookedToday ? (
                      <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <Target className="w-3 h-3" /> Booked {v.bookedToday}x today
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Open today</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToPlan(v) }}
                      className={`p-1.5 rounded-lg transition-colors ${isInCart(v.id) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-[#FF6B4A]/10 hover:text-[#FF6B4A]'}`}
                      title={isInCart(v.id) ? 'Added to plan' : 'Add to plan'}
                    >
                      {isInCart(v.id) ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1-Day Plans */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-1">Curated Day Plans</h2>
              <p className="text-gray-500">Full-day itineraries planned for you</p>
            </div>
            <button onClick={() => navigate('/plans')} className="hidden sm:flex items-center gap-1 text-[#FF6B4A] font-medium text-sm hover:underline">
              All plans <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {plans?.slice(0,4).map(plan => (
              <button key={plan.id} onClick={() => navigate(`/plans/${plan.slug}`)} className="group glass-card overflow-hidden hover-lift p-0 text-left mirror-shine">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#1A1A2E] to-[#FF6B4A]/30">
                  <img src={plan.image || '/venues/mission-hill-winery.jpg'} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg mb-1">{plan.title}</h3>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{plan.totalDuration || plan.duration}</span>
                      {plan.estimatedCost && <span className="flex items-center gap-1"><span className="text-[#FF8F6B]">{plan.estimatedCost}</span></span>}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>
                  <span className="inline-flex items-center gap-1 text-[#FF6B4A] text-sm font-medium mt-2 group-hover:gap-2 transition-all">
                    View Plan <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Deals — Glass Dark */}
      <section className="py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#1A1A2E] to-[#2D2D44]" />
        <div className="absolute inset-0 noise opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Live Now</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Save on your next outing</h2>
              <p className="text-gray-400">Exclusive deals from partner venues</p>
            </div>
            <button onClick={() => navigate('/deals')} className="hidden sm:flex items-center gap-1 text-[#FF6B4A] font-medium hover:underline">All deals <ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals?.slice(0,6).map(d => (
              <button key={d.id} onClick={() => navigate(`/venue/${d.venueSlug}`)} className="group text-left glass-card-dark p-5 mirror-shine">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-[#FF6B4A] rounded-xl px-3 py-1.5">
                    <span className="text-white font-bold text-sm">{d.discount?.includes('%') || d.discount?.includes('$') ? d.discount + ' OFF' : d.discount}</span>
                  </div>
                  <Ticket className="w-5 h-5 text-white/40 group-hover:text-[#FF6B4A] transition-colors" />
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-[#FF8F6B] transition-colors">{d.title}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{d.description}</p>
                {d.code && <span className="text-xs text-[#FF6B4A] font-medium bg-[#FF6B4A]/10 rounded-full px-2.5 py-1">Code: {d.code}</span>}
                <p className="text-xs text-gray-500 mt-2">at {d.venueName || d.venue?.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Mirror Cards */}
      <section className="py-14 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-2">How Companiio works</h2>
            <p className="text-gray-500">Plan your perfect outing in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, title: 'Discover', desc: 'Browse real restaurants, activities & experiences' },
              { icon: ShoppingBag, title: 'Build Your Plan', desc: 'Add venues to your custom itinerary' },
              { icon: Zap, title: 'Book', desc: 'Reserve your spot with one tap' },
              { icon: Users, title: 'Show Up', desc: 'Invite friends and enjoy your day' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="relative inline-flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-coral-gradient flex items-center justify-center text-white shadow-coral mirror">
                    <s.icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#1A1A2E] rounded-full flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
                </div>
                <h3 className="font-semibold text-[#1A1A2E] mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Mirror Glass */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6B] rounded-3xl p-8 sm:p-12 text-center overflow-hidden mirror">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to make plans?</h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">Join thousands of Canadians who use Companiio to discover and book real venues across the country.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/discover')} className="bg-white text-[#FF6B4A] hover:bg-white/90 rounded-full px-8 py-6 font-semibold shadow-lg">
                  Start Exploring <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={() => navigate('/partner')} variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 font-semibold">
                  List Your Venue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
