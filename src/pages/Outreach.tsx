import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Copy, Check, ChevronLeft, Send, Star, DollarSign } from 'lucide-react'
import { mockVenues } from '@/lib/mockData'

const catNames: Record<number, string> = {
  1: 'Restaurants', 2: 'Cafes', 3: 'Bars & Lounges',
  4: 'Date Night', 5: 'Brunch', 6: 'Arcades & Games',
  7: 'Sports & Adventure', 8: 'Entertainment', 9: 'Experiences', 10: 'Outdoor',
}

function getBody(v: typeof mockVenues[0]): string {
  if (v.categoryId === 6 || v.categoryId === 7) {
    return `Hi ${v.name} Team,\n\nI discovered ${v.name} and immediately knew our users would love it. Companiio is Canada's fastest-growing platform for discovering and booking activities — from axe throwing and escape rooms to bowling and go-karts — and ${v.name} is exactly what people are looking for.\n\nTHE PROBLEM WE SOLVE:\nPeople want to plan fun group outings (birthdays, corporate events, date nights) but don't know where to go or how to book. We make it effortless — they find you, see your availability, and book in one tap.\n\nWHAT PARTNERING MEANS FOR YOU:\n• Direct bookings — No more phone tag. Users book sessions through Companiio\n• Group event leads — We promote venues for birthdays, bachelor parties, corporate team building\n• 5% commission only on completed bookings — No monthly fees, no setup costs\n• Featured in activity collections — "Best Group Activities in ${v.city}", "Birthday Party Ideas"\n• Deal spotlight — Run promotions that reach thousands of local users\n\nTHE NUMBERS:\nActivity venues on our platform average 15-25 additional bookings per month from users who wouldn't have found them otherwise.\n\nNEXT STEP:\nCan we schedule a 10-minute call this week? I'll show you exactly how your venue page looks. No pressure, no commitment.\n\nBook a time: reply to this email or call (604) 555-0147\n\nYour partner dashboard: https://companiio.ca/partner\n\nCheers,\nThe Companiio Team\ncontactcompaniio@gmail.com\nhttps://companiio.ca\n\nP.S. — First 50 partners get 3% commission (not 5%) for the first 3 months.`
  }
  if (v.categoryId === 8 || v.categoryId === 9) {
    return `Hi ${v.name} Team,\n\nI'm a fan of what you've built at ${v.name} — it's exactly the kind of authentic Canadian experience people are hungry for. I'm reaching out from Companiio, a new platform connecting venues like yours with thousands of people planning their next night out.\n\nWHAT WE DO DIFFERENTLY:\nUnlike generic event sites, Companiio curates experiences. We don't just list venues — we create "complete night out" itineraries that include ${v.name}.\n\nHOW YOU BENEFIT:\n• Ticket / reservation integration — Users book directly through our platform\n• Bundled experiences — Your venue gets included in curated day/night plans\n• 5% commission, no fixed costs — We win only when you win\n• Instagram-worthy promotion — We create Reels/TikToks featuring partner venues\n• Analytics dashboard — Track views, saves, bookings, and revenue in real-time\n\nREAL RESULTS:\nEntertainment partners on Companiio see an average 20% increase in weeknight traffic — the hardest slots to fill.\n\nLET'S TALK:\nI'd love to show you what your venue page looks like. Are you free for a quick 10-minute call Tuesday or Wednesday?\n\nReply here or reach me directly at contactcompaniio@gmail.com\n\nBest,\nThe Companiio Team\nhttps://companiio.ca/partner\n\nP.S. — Early partners lock in 3% commission for 90 days.`
  }
  return `Hi ${v.name} Team,\n\nI'm reaching out because ${v.name} is exactly the kind of venue our users are searching for on Companiio — Canada's new discovery and booking platform for restaurants, activities, and experiences.\n\nWHAT COMPANIO DOES:\nWe connect people looking for their next great outing with verified local venues like yours. Think of us as OpenTable meets TripAdvisor — but built specifically for Canadian venues.\n\nWHY PARTNER WITH US:\n• New customers, zero upfront cost — We only earn when we send you diners (5% commission, no monthly fees)\n• Featured placement — Your venue appears at the top of search results in ${v.city}\n• Deal promotion — Feature your happy hour or special offer to thousands of local users\n• One-tap reservations — Users book directly, you get confirmed reservations with guest details\n• No setup fees, no contracts — Cancel anytime. We're only valuable if we bring you business.\n\nWHAT WE OFFER IN RETURN:\n• Your venue page on Companiio with direct booking links\n• Inclusion in our curated "Best of ${v.city}" collections\n• Social media promotion to our growing follower base\n• Detailed analytics: views, saves, bookings, and revenue\n\nI'd love to jump on a quick 10-minute call to show you what your venue page would look like.\n\nYour dedicated partner page: https://companiio.ca/partner\n\nBest regards,\nThe Companiio Team\ncontactcompaniio@gmail.com\nhttps://companiio.ca\n\nP.S. — We're offering our first 50 partner venues a reduced 3% commission rate for the first 3 months. No commitment required.`
}

export default function Outreach() {
  const navigate = useNavigate()
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [copiedSubj, setCopiedSubj] = useState<number | null>(null)

  const copyBody = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }
  const copySubj = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSubj(id)
    setTimeout(() => setCopiedSubj(null), 2000)
  }
  const send = (venue: typeof mockVenues[0]) => {
    const s = `Partner with Companiio — Let's drive more customers to ${venue.name}`
    const b = getBody(venue)
    window.open(`mailto:?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6B4A] mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">Venue Outreach</h1>
        <p className="text-gray-500 mb-8">Professional pitch emails for {mockVenues.length} verified Canadian venues</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Venues', value: mockVenues.length },
            { label: 'Emails Ready', value: mockVenues.length },
            { label: 'Commission', value: '3-5%' },
            { label: 'Est. Monthly', value: '$500+' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-4">
              <p className="text-2xl font-bold text-[#1A1A2E]">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 glass-card p-6 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D44]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#FF6B4A]" /> Your Revenue Projection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div><p className="text-3xl font-bold text-[#FF6B4A]">$1,500</p><p className="text-sm text-gray-400 mt-1">Month 1 (10 venues)</p></div>
            <div><p className="text-3xl font-bold text-[#FF8F6B]">$5,000</p><p className="text-sm text-gray-400 mt-1">Month 3 (30 venues)</p></div>
            <div><p className="text-3xl font-bold text-white">$12,000+</p><p className="text-sm text-gray-400 mt-1">Month 6 (50+ venues)</p></div>
          </div>
        </div>

        <div className="space-y-4">
          {mockVenues.map(v => {
            const body = getBody(v)
            const subj = `Partner with Companiio — Let's drive more customers to ${v.name}`
            const isCopiedBody = copiedId === v.id
            const isCopiedSubj = copiedSubj === v.id
            const cat = catNames[v.categoryId] || 'Venue'
            return (
              <div key={v.id} className="glass-card p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{cat}</span>
                        <h3 className="font-semibold text-[#1A1A2E] text-lg">{v.name}</h3>
                        <p className="text-sm text-gray-500">{v.city}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 rounded-full px-2 py-0.5 shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold">{v.rating}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                      <span className="text-sm text-gray-600 font-medium truncate block">{subj}</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{body}</pre>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => send(v)} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full" size="sm">
                        <Send className="w-4 h-4 mr-1.5" /> Open in Email
                      </Button>
                      <Button onClick={() => copyBody(v.id, body)} variant="outline" className="rounded-full border-gray-200" size="sm">
                        {isCopiedBody ? <Check className="w-4 h-4 mr-1.5 text-green-500" /> : <Copy className="w-4 h-4 mr-1.5" />}
                        {isCopiedBody ? 'Copied!' : 'Copy Body'}
                      </Button>
                      <Button onClick={() => copySubj(v.id, subj)} variant="outline" className="rounded-full border-gray-200" size="sm">
                        {isCopiedSubj ? <Check className="w-4 h-4 mr-1.5 text-green-500" /> : <Copy className="w-4 h-4 mr-1.5" />}
                        {isCopiedSubj ? 'Copied!' : 'Copy Subject'}
                      </Button>
                      {v.website && (
                        <a href={v.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#FF6B4A] hover:underline px-3 py-1.5">
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
