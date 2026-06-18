import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import {
  ArrowLeft, Sparkles, Calendar, Heart, Cake, Wine,
  Star, PartyPopper, Users, Flame, ChevronRight,
  MapPin, Coffee,
} from 'lucide-react'
import { Link } from 'react-router'
import { mockVenues } from '@/lib/mockData'

const eventCollections = [
  {
    id: 'fathers-day',
    title: "Father's Day 2026",
    subtitle: "Sunday, June 21",
    description: "Steakhouses, breweries, and BBQ spots to celebrate Dad.",
    icon: <Users className="w-6 h-6" />,
    color: "#2D6A4F",
    gradient: "from-[#2D6A4F] to-[#40916C]",
    venueSlugs: ["joe-fortes", "chateau-frontenac", "canoe-toronto"],
    specialOffer: { title: "Dad Eats Free", desc: "Buy 2 entrees, Dad's meal is on us at partner steakhouses.", code: "DAD2026", discount: "FREE" },
    tags: ["Steakhouse", "Brewery", "BBQ", "Whisky Bar"],
    featured: true,
  },
  {
    id: 'date-night',
    title: "Date Night",
    subtitle: "Any night",
    description: "Romantic restaurants, wine bars, and intimate spots for two.",
    icon: <Heart className="w-6 h-6" />,
    color: "#E63946",
    gradient: "from-[#E63946] to-[#F4A261]",
    venueSlugs: ["miku-vancouver", "alo-toronto", "st-lawrence", "bar-raval"],
    specialOffer: { title: "Date Night Special", desc: "Free dessert with any 2 entrees at romantic venues.", code: "DATENIGHT", discount: "DEAL" },
    tags: ["Romantic", "Wine Bar", "Rooftop", "Candlelit"],
    featured: true,
  },
  {
    id: 'birthday',
    title: "Birthday Celebrations",
    subtitle: "Make it unforgettable",
    description: "Group-friendly spots with birthday perks and private rooms.",
    icon: <Cake className="w-6 h-6" />,
    color: "#9B5DE5",
    gradient: "from-[#9B5DE5] to-[#F15BB5]",
    venueSlugs: ["ten-foot-henry", "el-catrin", "joe-fortes"],
    specialOffer: { title: "Birthday Perk", desc: "Free birthday cake + champagne toast at partner venues.", code: "BDAY26", discount: "FREE" },
    tags: ["Private Room", "Group Friendly", "Late Night", "Cocktails"],
    featured: true,
  },
  {
    id: 'anniversary',
    title: "Anniversary",
    subtitle: "Celebrate your love",
    description: "Fine dining and luxury experiences for your special milestone.",
    icon: <Heart className="w-6 h-6" />,
    color: "#C9A227",
    gradient: "from-[#C9A227] to-[#F4D03F]",
    venueSlugs: ["published-on-main", "alo-toronto", "maido-ottawa"],
    specialOffer: { title: "Anniversary Package", desc: "Complimentary wine pairing with tasting menu.", code: "ANNI26", discount: "DEAL" },
    tags: ["Fine Dining", "Tasting Menu", "Wine Pairing", "Private"],
    featured: true,
  },
  {
    id: 'brewery-tour',
    title: "Brewery & Distillery Tour",
    subtitle: "Weekend adventures",
    description: "Craft breweries, distilleries, and beer gardens across Canada.",
    icon: <Wine className="w-6 h-6" />,
    color: "#E67E22",
    gradient: "from-[#E67E22] to-[#F39C12]",
    venueSlugs: ["bar-raval", "joe-fortes", "el-catrin"],
    specialOffer: { title: "Tour Pass", desc: "3 brewery tastings for $35 on weekends.", code: "BREW35", discount: "$35" },
    tags: ["Craft Beer", "Distillery", "Tastings", "Weekend"],
    featured: false,
  },
  {
    id: 'brunch-weekend',
    title: "Weekend Brunch",
    subtitle: "Saturdays & Sundays",
    description: "Best brunch spots with mimosas, eggs benny, and patio vibes.",
    icon: <Coffee className="w-6 h-6" />,
    color: "#FF6B4A",
    gradient: "from-[#FF6B4A] to-[#FF8F6B]",
    venueSlugs: ["schwartzs-deli", "ten-foot-henry", "jam-cafe"],
    specialOffer: { title: "Brunch for Two", desc: "Free mimosa carafe with any 2 brunch entrees.", code: "BRUNCH2", discount: "FREE" },
    tags: ["Patio", "Mimosas", "Eggs Benedict", "Weekend"],
    featured: false,
  },
  {
    id: 'girls-night',
    title: "Girls' Night Out",
    subtitle: "Squad up",
    description: "Cocktail bars, wine lounges, and share-plate restaurants.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "#FF006E",
    gradient: "from-[#FF006E] to-[#8338EC]",
    venueSlugs: ["bar-raval", "el-catrin", "ten-foot-henry"],
    specialOffer: { title: "Squad Deal", desc: "4th cocktail free when you bring 3 friends.", code: "SQUAD4", discount: "BOGO" },
    tags: ["Cocktails", "Wine", "Share Plates", "Instagrammable"],
    featured: false,
  },
  {
    id: 'business-lunch',
    title: "Business Lunch",
    subtitle: "Impress your clients",
    description: "Professional settings with quick, quality lunch service.",
    icon: <Briefcase className="w-6 h-6" />,
    color: "#457B9D",
    gradient: "from-[#457B9D] to-[#1D3557]",
    venueSlugs: ["canoe-toronto", "miku-vancouver", "chateau-frontenac"],
    specialOffer: { title: "Express Lunch", desc: "30-minute express lunch menu with 10% off for 4+ people.", code: "LUNCH10", discount: "10%" },
    tags: ["Quick Service", "Private Booth", "WiFi", "Central"],
    featured: false,
  },
]

// Need Briefcase icon
function Briefcase({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}

export default function Events() {
  const navigate = useNavigate()
  const { data: apiVenues } = trpc.venue.list.useQuery({})
  const venues = apiVenues && apiVenues.length > 0 ? apiVenues : mockVenues as any[]

  const getVenueBySlug = (slug: string) => venues.find((v: any) => v.slug === slug || v.name?.toLowerCase().includes(slug.replace(/-/g, ' ')))

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B4A] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FF6B4A]/10 rounded-full px-4 py-1.5 mb-4">
            <Calendar className="w-4 h-4 text-[#FF6B4A]" />
            <span className="text-sm font-medium text-[#FF6B4A]">Curated Collections</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1A1A2E] mb-3">
            Events & <span className="text-[#FF6B4A]">Occasions</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Perfect plans for every moment — from Father's Day to first dates, birthdays to anniversaries.
          </p>
        </div>

        {/* Featured Events - Horizontal Scroll */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-5 flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF6B4A]" /> Trending Now
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {eventCollections.filter(e => e.featured).map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="group flex-shrink-0 w-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all text-left hover-lift"
              >
                <div className={`relative h-48 bg-gradient-to-br ${event.gradient} p-6 flex flex-col justify-end`}>
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
                    {event.icon}
                  </div>
                  {event.specialOffer && (
                    <span className="absolute top-4 right-4 bg-white text-sm font-bold rounded-full px-3 py-1 shadow-lg" style={{ color: event.color }}>
                      {event.specialOffer.discount}
                    </span>
                  )}
                  <h3 className="text-white font-bold text-xl mb-1">{event.title}</h3>
                  <p className="text-white/80 text-sm">{event.subtitle}</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                  {event.specialOffer && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-[#1A1A2E]">{event.specialOffer.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{event.specialOffer.desc}</p>
                      <span className="inline-block mt-1.5 text-xs font-mono bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-md px-2 py-0.5">{event.specialOffer.code}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* All Events Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-5 flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-[#FF6B4A]" /> All Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventCollections.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all text-left hover-lift"
              >
                <div className={`h-32 bg-gradient-to-br ${event.gradient} p-4 flex flex-col justify-between relative`}>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                      {event.icon}
                    </div>
                    {event.specialOffer && (
                      <span className="bg-white text-xs font-bold rounded-full px-2.5 py-1 shadow-sm" style={{ color: event.color }}>
                        {event.specialOffer.discount}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{event.title}</h3>
                    <p className="text-white/70 text-xs">{event.subtitle}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-400 rounded-md px-2 py-0.5">{tag}</span>
                      ))}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF6B4A] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Event Detail Preview - Show venues for featured events */}
        {eventCollections.slice(0, 2).map((event) => {
          const eventVenues = event.venueSlugs.map(slug => getVenueBySlug(slug)).filter(Boolean)
          if (!eventVenues.length) return null
          return (
            <div key={event.id} className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                  {event.icon}
                  <span style={{ color: event.color }}>{event.title}</span> — Handpicked Venues
                </h2>
                <button onClick={() => navigate(`/events/${event.id}`)} className="text-sm text-[#FF6B4A] font-medium hover:underline flex items-center gap-1">
                  See all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {eventVenues.slice(0, 3).map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/venue/${v.slug}`)}
                    className="group text-left bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all hover-lift"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={v.image || v.photoUrl} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                        <span className="glass rounded-full px-2 py-0.5 flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="font-semibold">{v.rating}</span>
                        </span>
                        <span className="bg-[#FF6B4A] text-white text-xs font-bold rounded-full px-2 py-0.5">
                          {'$'.repeat(v.priceLevel || 2)}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm text-[#1A1A2E] group-hover:text-[#FF6B4A] transition-colors">{v.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{v.neighborhood}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
