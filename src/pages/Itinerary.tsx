import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Clock, DollarSign, ArrowRight, CalendarDays } from 'lucide-react'
import { mockPlans } from '@/lib/mockData'

export default function Itinerary() {
  const navigate = useNavigate()
  const { data: apiPlans } = trpc.itinerary.list.useQuery({})
  const plans = apiPlans && apiPlans.length > 0 ? apiPlans : mockPlans as any[]

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FF6B4A]/10 rounded-full px-3 py-1 mb-4">
            <CalendarDays className="w-4 h-4 text-[#FF6B4A]" />
            <span className="text-sm text-[#FF6B4A] font-medium">Curated for you</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-2">1-Day Plans</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Full-day itineraries planned for you. Restaurant, activity, cafe, dinner, and more all mapped out.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {plans?.map(plan => (
            <button key={plan.id} onClick={() => navigate(`/plans/${plan.slug}`)} className="group glass-card overflow-hidden hover-lift p-0 text-left">
              <div className="relative h-52 overflow-hidden">
                <img src={plan.image || ''} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="glass text-xs font-medium text-gray-700 rounded-full px-3 py-1 capitalize">{plan.occasion?.replace(/-/g, ' ')}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl mb-2">{plan.title}</h3>
                  <div className="flex items-center gap-4 text-white/80 text-xs">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{plan.totalDuration}</span>
                    {plan.estimatedCost && <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />~{plan.estimatedCost}/person</span>}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>
                <span className="inline-flex items-center gap-1 text-[#FF6B4A] text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                  View Full Plan <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
