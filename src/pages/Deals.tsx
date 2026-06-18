import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Ticket, Copy, Check, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { mockDeals } from '@/lib/mockData'

export default function Deals() {
  const navigate = useNavigate()
  const { data: apiDeals, isLoading } = trpc.deal.list.useQuery()
  const deals = apiDeals && apiDeals.length > 0 ? apiDeals : mockDeals as any[]
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (code: string) => { navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 2000) }

  const label = (d: any) => {
    if (d.discountType) {
      switch (d.discountType) { case 'percentage': return `${d.discountValue}% OFF`; case 'fixed_amount': return `$${d.discountValue} OFF`; case 'bogo': return 'BUY 1 GET 1'; case 'free_item': return 'FREE ITEM'; default: return 'DEAL' }
    }
    const disc = d.discount || 'DEAL'
    if (disc.includes('%') || disc.includes('$')) return disc + ' OFF'
    return disc
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-3 py-1 mb-4"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-sm text-green-700 font-medium">Live Now</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-2">Exclusive Deals</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Save on your next outing with exclusive deals from partner venues across Canada.</p>
        </div>

        {isLoading ? <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B4A] border-t-transparent" /></div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {deals?.map(d => (
              <div key={d.id} className="glass-card overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-40">
                  <img src={d.venueImage || d.venue?.image || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop`} alt={d.venueName || d.venue?.name || ''} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 bg-[#FF6B4A] text-white text-sm font-bold rounded-xl px-3 py-1.5 shadow-coral">{label(d)}</div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <button onClick={() => navigate(`/venue/${d.venueSlug || d.venue?.slug || ''}`)} className="text-white font-semibold text-sm hover:underline flex items-center gap-1">{d.venueName || d.venue?.name}<ArrowRight className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#1A1A2E] mb-1">{d.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{d.description}</p>
                  {d.code && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="font-mono text-sm font-semibold text-[#FF6B4A]">{d.code}</span>
                        <button onClick={() => copy(d.code!)} className="p-1 hover:bg-gray-200 rounded transition-colors">{copied === d.code ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}</button>
                      </div>
                    </div>
                  )}
                  <button onClick={() => navigate(`/venue/${d.venueSlug || d.venue?.slug || ''}`)} className="w-full bg-[#FF6B4A]/10 hover:bg-[#FF6B4A]/20 text-[#FF6B4A] font-medium rounded-xl py-2.5 text-sm transition-colors flex items-center justify-center gap-1"><Ticket className="w-4 h-4" />Claim at Venue</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deals?.length === 0 && !isLoading && <div className="text-center py-16"><Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-700">No active deals</h3><p className="text-gray-400">Check back soon for new offers.</p></div>}
      </div>
    </div>
  )
}
