import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useCart } from '@/hooks/useCart'
import { Search, MapPin, Star, X, ChevronDown, Check, Filter, ShoppingBag, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockVenues, mockCities, mockCategories, activityTypes, getVenuesByActivityType } from '@/lib/mockData'

const prices = ['$', '$$', '$$$', '$$$$']
const occasions = ['Date Night', 'Friends', 'Birthday', 'Brunch', 'Business', 'Family', 'Special Occasion']
const features = ['Waterfront View', 'Patio', 'Live Music', 'Dog Friendly', 'Gluten Free', 'Vegan Options', 'Private Dining', 'Full Bar']

export default function Discover() {
  const navigate = useNavigate()
  const { addItem, isInCart } = useCart()
  const [params] = useSearchParams()

  // Filter states
  const [search, setSearch] = useState(params.get('search') || '')
  const [city, setCity] = useState<string | undefined>(params.get('city') || undefined)
  const [category, setCategory] = useState<number | undefined>(params.get('category') ? Number(params.get('category')) : undefined)
  const [activity, setActivity] = useState<string | undefined>(params.get('activity') || undefined)
  const [price, setPrice] = useState<string | undefined>()
  const [occasion, setOccasion] = useState<string | undefined>()
  const [feature, setFeature] = useState<string | undefined>()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating')

  // Convert price string ($, $$) to priceLevel number (1, 2)
  const priceToLevel = (p: string) => p.length

  // ALL CLIENT-SIDE FILTERING — works on static deploy without backend
  const filteredVenues = useMemo(() => {
    let results = [...mockVenues]

    // Text search (name, cuisine, subcategories, neighborhood, city, description)
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      results = results.filter(v =>
        v.name?.toLowerCase().includes(q) ||
        v.cuisine?.toLowerCase().includes(q) ||
        v.neighborhood?.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q) ||
        v.address?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.subcategories?.some((s: string) => s.toLowerCase().includes(q)) ||
        v.features?.some((f: string) => f.toLowerCase().includes(q))
      )
    }

    // City filter
    if (city) {
      results = results.filter(v => {
        const cityMatch = mockCities.find(c => c.slug === city || String(c.id) === city)
        return cityMatch ? v.city === cityMatch.name : false
      })
    }

    // Category filter
    if (category) {
      results = results.filter(v => v.categoryId === category)
    }

    // Activity type filter
    if (activity) {
      const activityVenues = getVenuesByActivityType(activity)
      const activityIds = new Set(activityVenues.map(v => v.id))
      results = results.filter(v => activityIds.has(v.id))
    }

    // Price filter
    if (price) {
      const level = priceToLevel(price)
      results = results.filter(v => v.priceLevel === level)
    }

    // Occasion filter (check subcategories and tags)
    if (occasion) {
      const q = occasion.toLowerCase()
      results = results.filter(v =>
        v.subcategories?.some((s: string) => s.toLowerCase().includes(q)) ||
        v.occasionTags?.some((t: string) => t.toLowerCase().includes(q))
      )
    }

    // Feature filter
    if (feature) {
      results = results.filter(v => v.features?.some((f: string) => f.toLowerCase() === feature.toLowerCase()))
    }

    return results
  }, [search, city, category, activity, price, occasion, feature])

  const clear = () => {
    setCategory(undefined); setPrice(undefined); setOccasion(undefined); setFeature(undefined)
    setSearch(''); setCity(undefined); setActivity(undefined)
  }
  const hasFilters = category || price || occasion || feature || search || city || activity

  const sortedVenues = useMemo(() => {
    return [...filteredVenues].sort((a, b) => {
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating)
      return (a.priceLevel || 2) - (b.priceLevel || 2)
    })
  }, [filteredVenues, sortBy])

  const handleAddToPlan = (e: React.MouseEvent, v: any) => {
    e.stopPropagation()
    if (isInCart(v.id)) return
    addItem({
      venueId: v.id,
      venueName: v.name,
      venueSlug: v.slug,
      venueImage: v.image || '',
      venueCity: v.city || v.neighborhood || '',
      venueCategory: v.cuisine || v.subcategories?.[0] || 'Venue',
      priceLevel: v.priceLevel || 2,
    })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="bg-white border-b border-gray-100 pt-20 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-4">
              <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search restaurants, activities, experiences..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none py-3 text-gray-900 placeholder:text-gray-400"
              />
              {search && (
                <button onClick={() => setSearch('')} className="p-1 hover:bg-gray-200 rounded-full shrink-0">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={city || ''}
                  onChange={(e) => setCity(e.target.value || undefined)}
                  className="appearance-none bg-gray-100 rounded-xl px-4 pr-10 py-3 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {mockCities.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? 'default' : 'outline'}
                className={`rounded-xl gap-2 ${showFilters ? 'bg-[#FF6B4A] text-white' : 'border-gray-200'}`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasFilters && (
                  <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {[category, price, occasion, feature, search, city, activity].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Activity Type Quick Filters */}
          {!showFilters && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 mb-2">
              <button
                onClick={() => setActivity(undefined)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${!activity ? 'bg-[#FF6B4A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All
              </button>
              {activityTypes.map(type => (
                <button
                  key={type.slug}
                  onClick={() => setActivity(activity === type.slug ? undefined : type.slug)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activity === type.slug ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={activity === type.slug ? { backgroundColor: type.color } : {}}
                >
                  {type.name}
                </button>
              ))}
            </div>
          )}

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="glass-card p-4 space-y-4 animate-fade-in-up mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {mockCategories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(category === c.id ? undefined : c.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${category === c.id ? 'bg-[#FF6B4A] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
                    >
                      {category === c.id && <Check className="w-3 h-3" />}{c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Price</label>
                <div className="flex flex-wrap gap-2">
                  {prices.map(p => (
                    <button
                      key={p}
                      onClick={() => setPrice(price === p ? undefined : p)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${price === p ? 'bg-[#FF6B4A] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Occasion</label>
                <div className="flex flex-wrap gap-2">
                  {occasions.map(o => (
                    <button
                      key={o}
                      onClick={() => setOccasion(occasion === o ? undefined : o)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${occasion === o ? 'bg-[#FF6B4A] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                      {occasion === o && <Check className="w-3 h-3 inline mr-1" />}{o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Features</label>
                <div className="flex flex-wrap gap-2">
                  {features.map(f => (
                    <button
                      key={f}
                      onClick={() => setFeature(feature === f ? undefined : f)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${feature === f ? 'bg-[#FF6B4A] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                      {feature === f && <Check className="w-3 h-3 inline mr-1" />}{f}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button onClick={clear} className="text-sm text-[#FF6B4A] hover:underline font-medium">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results count + sort */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{sortedVenues.length} venues found</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <button
                onClick={() => setSortBy('rating')}
                className={`text-sm font-medium px-3 py-1 rounded-full transition-all ${sortBy === 'rating' ? 'bg-[#FF6B4A]/10 text-[#FF6B4A]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Rating
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`text-sm font-medium px-3 py-1 rounded-full transition-all ${sortBy === 'price' ? 'bg-[#FF6B4A]/10 text-[#FF6B4A]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Price
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Venue Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedVenues.map(v => (
            <div key={v.id} className="group text-left bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <button onClick={() => navigate(`/venue/${v.slug}`)} className="w-full text-left">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={v.image || ''}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {v.isVerified && (
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-medium text-white">Verified</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-white">{v.rating}</span>
                      <span className="text-xs text-white/60">({v.reviewCount || 0})</span>
                    </div>
                    <span className="bg-[#FF6B4A] text-white text-xs font-bold rounded-full px-2.5 py-0.5">
                      {'$'.repeat(v.priceLevel || 2)}
                    </span>
                  </div>
                </div>
              </button>
              <div className="p-4">
                <button onClick={() => navigate(`/venue/${v.slug}`)} className="w-full text-left">
                  <h3 className="font-semibold text-[#1A1A2E] group-hover:text-[#FF6B4A] transition-colors line-clamp-1">
                    {v.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />{v.neighborhood}, {v.city}
                  </p>
                  {v.cuisine && <p className="text-xs text-gray-400 mt-1">{v.cuisine}</p>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(v.subcategories || []).slice(0, 3).map((s: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-500 rounded-md px-2 py-0.5">{s}</span>
                    ))}
                  </div>
                </button>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  {v.bookedToday ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Booked {v.bookedToday}x today
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Open today</span>
                  )}
                  <button
                    onClick={(e) => handleAddToPlan(e, v)}
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

        {sortedVenues.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No venues found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
            {hasFilters && <Button onClick={clear} variant="outline" className="rounded-full">Clear all filters</Button>}
          </div>
        )}
      </div>
    </div>
  )
}
