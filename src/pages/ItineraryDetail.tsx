import { useParams, useNavigate } from 'react-router'
import { mockPlans, mockPlanItems, mockVenues } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Clock, MapPin, ArrowRight } from 'lucide-react'

export default function ItineraryDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const plan = mockPlans.find(p => p.slug === slug)
  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Plan not found</h2>
          <Button onClick={() => navigate('/plans')} className="mt-4 bg-[#FF6B4A] rounded-full">Browse Plans</Button>
        </div>
      </div>
    )
  }

  const items = mockPlanItems.filter(i => i.planId === plan.id)

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6B4A] mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
          <img src={plan.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop'} alt={plan.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-3xl font-bold text-white mb-1">{plan.title}</h1>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{plan.totalDuration}</span>
              <span>{plan.estimatedCost}</span>
              <span className="bg-[#FF6B4A] text-white text-xs rounded-full px-2 py-0.5">{plan.occasion}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-8">{plan.description}</p>

        <div className="space-y-4">
          {items.map((item, index) => {
            const venue = item.venueId ? mockVenues.find(v => v.id === item.venueId) : null
            return (
              <div key={item.id} className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF6B4A] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <Clock className="w-3 h-3" /> {item.timeOfDay}
                    </div>
                    {venue ? (
                      <>
                        <h3
                          className="font-semibold text-[#1A1A2E] hover:text-[#FF6B4A] cursor-pointer"
                          onClick={() => navigate(`/venue/${venue.slug}`)}
                        >
                          {venue.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{venue.neighborhood}
                        </p>
                      </>
                    ) : (
                      <h3 className="font-semibold text-[#1A1A2E]">{item.notes?.split('—')[0] || 'Activity'}</h3>
                    )}
                    <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/discover')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full px-8">
            Explore Venues <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
