import { useParams, useNavigate } from 'react-router'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import {
  MapPin, Star, Phone, Globe, Check, Calendar, ChevronLeft,
  Share2, Instagram, Mail, Ticket, ShoppingBag, Target,
  Clock, Users,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { mockVenues, mockDeals, getCancellationInfo } from '@/lib/mockData'

export default function VenueDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem, removeItem, isInCart } = useCart()
  const [copied, setCopied] = useState(false)
  const [ready, setReady] = useState(false)

  // Instant render — no backend wait
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(t)
  }, [slug])

  const mockVenue = slug ? mockVenues.find(v => v.slug === slug) : null
  const venue = mockVenue ? {
    ...mockVenue,
    priceRange: '$'.repeat(mockVenue.priceLevel),
    cuisineType: mockVenue.cuisine,
    shortDescription: mockVenue.description,
    acceptsReservations: true,
    gallery: [mockVenue.image],
    deals: mockDeals.filter(d => d.venueId === mockVenue.id),
  } as any : null

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FF6B4A] border-t-transparent" />
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Venue not found</h2>
          <Button onClick={() => navigate('/discover')} className="bg-[#FF6B4A] rounded-full">Browse</Button>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share && venue) {
      await navigator.share({ title: venue.name, text: venue.shortDescription || '', url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddToPlan = () => {
    if (!venue) return
    if (isInCart(venue.id)) {
      removeItem(venue.id)
      return
    }
    addItem({
      venueId: venue.id,
      venueName: venue.name,
      venueSlug: venue.slug,
      venueImage: venue.image || '',
      venueCity: venue.city || venue.neighborhood || '',
      venueCategory: venue.cuisine || venue.subcategories?.[0] || 'Venue',
      priceLevel: venue.priceLevel || 2,
    })
  }

  const gallery = venue.gallery as string[] || [venue.image]
  const inCart = isInCart(venue.id)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="relative h-[45vh] sm:h-[55vh]">
        <img src={venue.image || ''} alt={venue.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-20 left-4 sm:left-6 glass rounded-full p-2.5 hover:bg-white/30 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="absolute top-20 right-4 sm:right-6 flex gap-2">
          <button onClick={handleShare} className="glass rounded-full p-2.5 hover:bg-white/30 transition-colors">
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleAddToPlan}
            className={`rounded-full p-2.5 transition-colors ${inCart ? 'bg-green-500 text-white' : 'glass hover:bg-white/30'}`}
            title={inCart ? 'Remove from plan' : 'Add to plan'}
          >
            {inCart ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {venue.isVerified && (
                <span className="glass text-green-600 text-xs font-bold rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified
                </span>
              )}
              <span className="bg-[#FF6B4A] text-white text-xs font-bold rounded-full px-2.5 py-1">{venue.priceRange}</span>
              {venue.cuisineType && <span className="glass text-xs rounded-full px-2.5 py-1">{venue.cuisineType}</span>}
              {venue.bookedToday > 0 && (
                <span className="bg-green-500/90 text-white text-xs font-bold rounded-full px-2.5 py-1 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Booked {venue.bookedToday}x today
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">{venue.name}</h1>
            <p className="text-white/80 flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4" />{venue.address}, {venue.neighborhood}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="glass-strong rounded-2xl p-5 sm:p-6 shadow-glass">
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-amber-50 rounded-full px-3 py-1.5">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{venue.rating}</span>
              <span className="text-sm text-gray-500">({venue.reviewCount})</span>
            </div>
            {venue.cuisineType && <span className="text-sm bg-gray-50 rounded-full px-3 py-1.5">{venue.cuisineType}</span>}
            <span className="text-sm bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-full px-3 py-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {venue.bookedToday || 5} booked today
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">{venue.description}</p>
          </div>

          {gallery.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#1A1A2E] mb-3">Photos</h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {gallery.map((img: string, i: number) => (
                  <div key={i} className="flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden">
                    <img src={img} alt={`${venue.name} photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
                {gallery.length === 1 && venue.image && (
                  <div className="flex-shrink-0 w-60 h-40 rounded-xl overflow-hidden">
                    <img src={venue.image} alt={venue.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                )}
              </div>
            </div>
          )}

          {(venue.features as string[] || []).length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#1A1A2E] mb-3">Features & Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {(venue.features as string[]).map((f: string, i: number) => (
                  <span key={i} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5 text-sm text-gray-600">
                    <Check className="w-3.5 h-3.5 text-green-500" />{f.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-3">Contact</h2>
            <div className="space-y-2">
              {venue.phone && <a href={`tel:${venue.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF6B4A] py-1"><Phone className="w-4 h-4" />{venue.phone}</a>}
              {venue.website && <a href={venue.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF6B4A] py-1"><Globe className="w-4 h-4" />{venue.website.replace(/^https?:\/\//, '')}</a>}
              {venue.email && <a href={`mailto:${venue.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF6B4A] py-1"><Mail className="w-4 h-4" />{venue.email}</a>}
              {venue.instagram && <a href={`https://instagram.com/${venue.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF6B4A] py-1"><Instagram className="w-4 h-4" />{venue.instagram}</a>}
            </div>
          </div>

          {(venue.deals || []).length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#1A1A2E] mb-3 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#FF6B4A]" />Active Deals
              </h2>
              <div className="space-y-3">
                {(venue.deals || []).map((deal: any) => (
                  <div key={deal.id} className="bg-gradient-to-r from-[#FF6B4A]/5 to-[#FF8F6B]/5 border border-[#FF6B4A]/10 rounded-xl p-4">
                    <span className="bg-[#FF6B4A] text-white text-xs font-bold rounded-md px-2 py-0.5">
                      {typeof deal.discount === 'string' && (deal.discount.includes('%') || deal.discount.includes('$')) ? deal.discount + ' OFF' : deal.discount}
                    </span>
                    <h3 className="font-semibold text-[#1A1A2E] mt-2">{deal.title}</h3>
                    <p className="text-sm text-gray-500">{deal.description}</p>
                    {deal.code && <span className="text-xs font-mono bg-white border border-gray-200 rounded-md px-2 py-1 mt-2 inline-block">{deal.code}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {venue.cancellationPolicy && (
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 mb-6">
              {(() => {
                const info = getCancellationInfo(venue.cancellationPolicy as string)
                return (
                  <>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-green-600">{info.badge}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{info.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{info.description}</p>
                    </div>
                  </>
                )
              })()}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            {venue.acceptsReservations ? (
              <Button onClick={() => navigate(`/reserve/${venue.slug}`)} className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl py-6 font-semibold shadow-coral">
                <Calendar className="w-5 h-5 mr-2" /> Reserve Now
              </Button>
            ) : (
              <Button disabled variant="outline" className="flex-1 rounded-xl py-6">
                <Clock className="w-5 h-5 mr-2" /> Walk-in Only
              </Button>
            )}
            <Button
              onClick={handleAddToPlan}
              variant="outline"
              className={`flex-1 rounded-xl py-6 border-2 font-semibold transition-colors ${inCart ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-gray-200 hover:border-[#FF6B4A] hover:text-[#FF6B4A]'}`}
            >
              {inCart ? <><Check className="w-5 h-5 mr-2" /> Added to Plan</> : <><ShoppingBag className="w-5 h-5 mr-2" /> Add to My Plan</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
