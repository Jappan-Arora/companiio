import { useParams, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, Star, MapPin, Calendar, Copy, Check,
  ChevronRight, Gift, Ticket,
} from 'lucide-react'
import { useState } from 'react'
import { mockVenues } from '@/lib/mockData'

const eventCollections: Record<string, any> = {
  'fathers-day': {
    title: "Father's Day 2026",
    subtitle: "Sunday, June 21",
    description: "Celebrate Dad with the best steakhouses, breweries, and BBQ joints across Canada. From whisky flights to prime rib, make this Father's Day one to remember.",
    icon: "👔",
    color: "#2D6A4F",
    gradient: "from-[#2D6A4F] to-[#40916C]",
    venueSlugs: ["joe-fortes", "chateau-frontenac", "canoe-toronto", "bar-raval", "schwartzs-deli"],
    specialOffer: { title: "Dad Eats Free", desc: "Buy 2 entrees at any partner steakhouse, and Dad's meal is complimentary.", code: "DAD2026", discount: "DAD EATS FREE" },
    tips: ["Book early — Father's Day is the busiest Sunday of June", "Call ahead to confirm the Dad Eats Free promotion", "Ask about whisky pairings for the full experience"],
    tags: ["Steakhouse", "Brewery", "BBQ", "Whisky Bar", "Patio"],
  },
  'date-night': {
    title: "Date Night",
    subtitle: "Perfect for two",
    description: "Handpicked romantic restaurants, intimate wine bars, and rooftop lounges. Whether it's your first date or 50th anniversary, these spots set the mood.",
    icon: "💕",
    color: "#E63946",
    gradient: "from-[#E63946] to-[#F4A261]",
    venueSlugs: ["miku-vancouver", "alo-toronto", "st-lawrence", "maido-ottawa"],
    specialOffer: { title: "Date Night Special", desc: "Free shared dessert with any 2 entrees at romantic partner venues.", code: "DATENIGHT", discount: "FREE DESSERT" },
    tips: ["Reserve 3-5 days ahead for weekend dates", "Request a corner table or window seat", "Mention 'Date Night' when you arrive for your surprise"],
    tags: ["Romantic", "Wine Bar", "Rooftop", "Candlelit", "Waterfront"],
  },
  'birthday': {
    title: "Birthday Celebrations",
    subtitle: "Make it unforgettable",
    description: "Group-friendly restaurants with birthday perks, private rooms, and late-night options. From casual brunches to wild nightlife.",
    icon: "🎂",
    color: "#9B5DE5",
    gradient: "from-[#9B5DE5] to-[#F15BB5]",
    venueSlugs: ["ten-foot-henry", "el-catrin", "joe-fortes", "bar-raval"],
    specialOffer: { title: "Birthday Perk", desc: "Free birthday cake + complimentary champagne toast at partner venues when you show ID.", code: "BDAY26", discount: "FREE CAKE + BUBBLES" },
    tips: ["Book a private room for groups of 8+", "Let them know it's a birthday when reserving", "Bring ID to claim your birthday perk"],
    tags: ["Private Room", "Group Friendly", "Late Night", "Cocktails", "Share Plates"],
  },
  'anniversary': {
    title: "Anniversary",
    subtitle: "Celebrate your love",
    description: "Fine dining tasting menus, wine pairings, and luxury experiences. For couples celebrating milestones — 1 year or 50.",
    icon: "💍",
    color: "#C9A227",
    gradient: "from-[#C9A227] to-[#F4D03F]",
    venueSlugs: ["published-on-main", "alo-toronto", "maido-ottawa", "canoe-toronto"],
    specialOffer: { title: "Anniversary Package", desc: "Complimentary wine pairing upgrade with any tasting menu. Mention your anniversary year.", code: "ANNI26", discount: "WINE ON US" },
    tips: ["Book 1-2 weeks ahead for tasting menus", "Mention your anniversary milestone when booking", "Request the chef's table for the ultimate experience"],
    tags: ["Fine Dining", "Tasting Menu", "Wine Pairing", "Private", "Chef's Table"],
  },
  'brewery-tour': {
    title: "Brewery & Distillery Tour",
    subtitle: "Weekend adventures",
    description: "Craft breweries, distilleries, and beer gardens. Perfect for groups, dates, or solo explorers who love a good pour.",
    icon: "🍺",
    color: "#E67E22",
    gradient: "from-[#E67E22] to-[#F39C12]",
    venueSlugs: ["bar-raval", "joe-fortes", "el-catrin"],
    specialOffer: { title: "Tour Pass", desc: "3 brewery tastings for $35 every Saturday & Sunday. Hop on the Companiio beer trail.", code: "BREW35", discount: "3 FOR $35" },
    tips: ["Start early — breweries fill up by 2PM on weekends", "Book an Uber/Lyft — don't drive", "Ask about seasonal limited releases"],
    tags: ["Craft Beer", "Distillery", "Tastings", "Weekend", "Group"],
  },
  'brunch-weekend': {
    title: "Weekend Brunch",
    subtitle: "Saturdays & Sundays",
    description: "The best brunch spots from coast to coast. Mimosas, eggs benny, French toast, and sunny patios.",
    icon: "🥞",
    color: "#FF6B4A",
    gradient: "from-[#FF6B4A] to-[#FF8F6B]",
    venueSlugs: ["schwartzs-deli", "ten-foot-henry", "jam-cafe"],
    specialOffer: { title: "Brunch for Two", desc: "Free mimosa carafe with any 2 brunch entrees at partner venues. Saturdays & Sundays only.", code: "BRUNCH2", discount: "FREE MIMOSAS" },
    tips: ["Brunch spots fill up fast — book 2-3 days ahead", "Best patio seats go first on sunny days", "The mimosa deal is only valid before 1PM"],
    tags: ["Patio", "Mimosas", "Eggs Benedict", "Weekend", "Family Friendly"],
  },
  'girls-night': {
    title: "Girls' Night Out",
    subtitle: "Squad up",
    description: "Cocktail bars, wine lounges, and share-plate restaurants. The perfect spots for your crew to catch up and celebrate.",
    icon: "✨",
    color: "#FF006E",
    gradient: "from-[#FF006E] to-[#8338EC]",
    venueSlugs: ["bar-raval", "el-catrin", "ten-foot-henry"],
    specialOffer: { title: "Squad Deal", desc: "When you bring 3 friends, the 4th cocktail is on us. Because squad sticks together.", code: "SQUAD4", discount: "4TH FREE" },
    tips: ["Split share plates to try more dishes", "Happy hour is usually 3-6PM — plan accordingly", "Instagram the cocktails — tag us @companiio"],
    tags: ["Cocktails", "Wine", "Share Plates", "Instagrammable", "Late Night"],
  },
  'business-lunch': {
    title: "Business Lunch",
    subtitle: "Impress your clients",
    description: "Professional settings with quality lunch service, private booths, and central locations. Close deals over great food.",
    icon: "💼",
    color: "#457B9D",
    gradient: "from-[#457B9D] to-[#1D3557]",
    venueSlugs: ["canoe-toronto", "miku-vancouver", "chateau-frontenac"],
    specialOffer: { title: "Express Lunch", desc: "30-minute express lunch menu with 10% off for groups of 4 or more.", code: "LUNCH10", discount: "10% OFF" },
    tips: ["Book 30-min time slots for express lunch", "Request a quiet booth for confidential conversations", "The express menu changes weekly — ask your server"],
    tags: ["Quick Service", "Private Booth", "WiFi", "Central", "Group"],
  },
}

export default function EventDetail() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { data: apiVenues } = trpc.venue.list.useQuery({})
  const venues = apiVenues && apiVenues.length > 0 ? apiVenues : mockVenues as any[]

  const event = eventCollections[eventId || '']
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Event not found</h2>
          <Button onClick={() => navigate('/events')} className="bg-[#FF6B4A] rounded-full">Browse Events</Button>
        </div>
      </div>
    )
  }

  const eventVenues = event.venueSlugs.map((slug: string) => venues.find((v: any) => v.slug === slug || v.name?.toLowerCase().includes(slug.replace(/-/g, ' ')))).filter(Boolean)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${event.gradient} pt-20 pb-12`}>
        <button onClick={() => navigate('/events')} className="absolute top-20 left-4 sm:left-6 bg-white/20 backdrop-blur-sm text-white rounded-full p-2.5 hover:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-4">{event.icon}</div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{event.title}</h1>
          <p className="text-white/80 text-lg">{event.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        {/* Description Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.map((tag: string, i: number) => (
              <span key={i} className="text-xs font-medium rounded-full px-3 py-1" style={{ backgroundColor: event.color + '15', color: event.color }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Special Offer */}
        {event.specialOffer && (
          <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6B] rounded-2xl p-6 mb-8 text-white shadow-coral">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider opacity-80">Special Offer</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{event.specialOffer.title}</h3>
                <p className="text-white/80 text-sm mb-4">{event.specialOffer.desc}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <span className="text-xs opacity-70">PROMO</span>
                <p className="text-lg font-bold">{event.specialOffer.discount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-sm font-bold">{event.specialOffer.code}</span>
                <button onClick={() => copyCode(event.specialOffer.code)} className="p-1 hover:bg-white/20 rounded transition-colors">
                  {copiedCode === event.specialOffer.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-xs opacity-70">Show at venue</span>
            </div>
          </div>
        )}

        {/* Pro Tips */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" /> Pro Tips
          </h3>
          <div className="space-y-3">
            {event.tips.map((tip: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: event.color }}>{i + 1}</span>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Venues */}
        <h3 className="text-xl font-bold text-[#1A1A2E] mb-5 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-[#FF6B4A]" /> Handpicked Venues
        </h3>

        {eventVenues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {eventVenues.map((v: any) => (
              <button
                key={v.id}
                onClick={() => navigate(`/venue/${v.slug}`)}
                className="group text-left bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all hover-lift"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={v.image || v.photoUrl} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {v.isVerified && (
                    <div className="absolute top-3 left-3 glass rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="glass rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold">{v.rating}</span>
                      <span className="text-xs text-gray-400">({v.reviewCount || 0})</span>
                    </div>
                    <span className="bg-[#FF6B4A] text-white text-xs font-bold rounded-full px-2.5 py-0.5">
                      {'$'.repeat(v.priceLevel || 2)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-[#1A1A2E] group-hover:text-[#FF6B4A] transition-colors">{v.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />{v.neighborhood}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(v.features || v.subcategories || []).slice(0, 3).map((f: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-500 rounded-md px-2 py-0.5">{f}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 mb-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Loading venue recommendations...</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6B] rounded-2xl p-6 sm:p-8 text-center mb-12">
          <h3 className="text-xl font-bold text-white mb-2">Ready to plan your {event.title.toLowerCase()}?</h3>
          <p className="text-white/80 mb-4">Book a table at one of these handpicked venues.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/discover')} className="bg-white text-[#FF6B4A] hover:bg-white/90 rounded-xl px-6">
              Browse All Venues <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button onClick={() => navigate('/reserve/' + (eventVenues[0]?.slug || ''))} variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6">
              Reserve Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
