import { useParams, useNavigate } from 'react-router'
import { useCart } from '@/hooks/useCart'
import {
  ArrowLeft, Clock, MapPin, Calendar, ShoppingBag, Check, Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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

function loadPlan(id: string): CustomPlan | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const plans: CustomPlan[] = JSON.parse(stored)
    return plans.find(p => p.id === id) || null
  } catch { return null }
}

export default function ViewCustomPlan() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { addItem, isInCart } = useCart()
  const plan = planId ? loadPlan(planId) : null

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Plan not found</h2>
          <p className="text-gray-500 mb-4">This plan may have been deleted.</p>
          <Button onClick={() => navigate('/create-plan')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl">
            Create a New Plan
          </Button>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    const text = `Check out my "${plan.title}" plan on Companiio! ${plan.stops.length} stops.`
    if (navigator.share) {
      await navigator.share({ title: plan.title, text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1A1A2E]">{plan.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{plan.city || 'Various cities'}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{plan.stops.length} stops</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(plan.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {plan.stops.map((stop, i) => (
            <div key={i} className="flex gap-4">
              {/* Time column */}
              <div className="w-20 shrink-0 text-right">
                <p className="text-sm font-semibold text-[#1A1A2E]">{stop.time}</p>
                {i < plan.stops.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 ml-auto mr-3 mt-2" />
                )}
              </div>

              {/* Connector dot */}
              <div className="relative flex flex-col items-center shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#FF6B4A] flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
                {i < plan.stops.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                )}
              </div>

              {/* Card */}
              <div className="flex-1 pb-6">
                <button
                  onClick={() => navigate(`/venue/${stop.venueSlug}`)}
                  className="w-full text-left bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="flex">
                    <div className="w-20 h-20 shrink-0">
                      <img src={stop.venueImage} alt={stop.venueName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-3 min-w-0">
                      <h3 className="font-semibold text-[#1A1A2E] group-hover:text-[#FF6B4A] transition-colors truncate">{stop.venueName}</h3>
                      <p className="text-xs text-gray-500">{stop.venueCity} &middot; {stop.venueCategory}</p>
                      {stop.notes && <p className="text-xs text-gray-400 mt-1 italic">{stop.notes}</p>}
                    </div>
                  </div>
                </button>

                {/* Add to plan button */}
                <button
                  onClick={() => {
                    if (!isInCart(stop.venueId)) {
                      addItem({
                        venueId: stop.venueId,
                        venueName: stop.venueName,
                        venueSlug: stop.venueSlug,
                        venueImage: stop.venueImage,
                        venueCity: stop.venueCity,
                        venueCategory: stop.venueCategory,
                        priceLevel: 2,
                      })
                    }
                  }}
                  className={`mt-2 flex items-center gap-1 text-xs font-medium rounded-lg px-3 py-1.5 transition-colors ${
                    isInCart(stop.venueId)
                      ? 'bg-green-100 text-green-600'
                      : 'bg-[#FF6B4A]/10 text-[#FF6B4A] hover:bg-[#FF6B4A]/20'
                  }`}
                >
                  {isInCart(stop.venueId) ? (
                    <><Check className="w-3 h-3" /> Added to plan</>
                  ) : (
                    <><ShoppingBag className="w-3 h-3" /> Add to My Plan</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex gap-3">
          <Button
            onClick={() => {
              plan.stops.forEach(s => {
                if (!isInCart(s.venueId)) {
                  addItem({ venueId: s.venueId, venueName: s.venueName, venueSlug: s.venueSlug, venueImage: s.venueImage, venueCity: s.venueCity, venueCategory: s.venueCategory, priceLevel: 2 })
                }
              })
            }}
            className="flex-1 bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl"
          >
            <ShoppingBag className="w-4 h-4 mr-2" /> Add All to My Plan
          </Button>
          <Button onClick={handleShare} variant="outline" className="rounded-xl border-gray-200">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
