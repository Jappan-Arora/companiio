import { useNavigate } from 'react-router'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import {
  Trash2, MapPin, Clock, Calendar, ArrowRight,
  ShoppingBag, Utensils, Gamepad2, Wine, Music,
  CircleDot, Mountain, Trophy, Star, ChevronLeft,
} from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  restaurants: <Utensils className="w-4 h-4" />,
  cafes: <Wine className="w-4 h-4" />,
  bars: <Wine className="w-4 h-4" />,
  arcades: <Gamepad2 className="w-4 h-4" />,
  sports: <Trophy className="w-4 h-4" />,
  entertainment: <Music className="w-4 h-4" />,
  experiences: <Star className="w-4 h-4" />,
  outdoor: <Mountain className="w-4 h-4" />,
  default: <CircleDot className="w-4 h-4" />,
}

export default function MyPlan() {
  const navigate = useNavigate()
  const { items, removeItem, clearCart, itemCount } = useCart()

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6B4A] transition-colors mb-8">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
            <div className="w-20 h-20 bg-[#FF6B4A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#FF6B4A]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">Your Plan is Empty</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start building your perfect day by adding venues from our curated collection of restaurants, activities, and experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/discover')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full px-6">
                Browse Venues <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button onClick={() => navigate('/surprise-me')} variant="outline" className="rounded-full px-6 border-gray-200">
                Surprise Me
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const groupedByCity = items.reduce((acc, item) => {
    if (!acc[item.venueCity]) acc[item.venueCity] = []
    acc[item.venueCity].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6B4A] transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">My Plan</h1>
            <p className="text-gray-500 mt-1">{itemCount} venue{itemCount !== 1 ? 's' : ''} added</p>
          </div>
          <Button onClick={clearCart} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 rounded-full">
            <Trash2 className="w-4 h-4 mr-1" /> Clear All
          </Button>
        </div>

        {/* City Grouped List */}
        {Object.entries(groupedByCity).map(([city, cityItems]) => (
          <div key={city} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[#FF6B4A]" />
              <h2 className="font-semibold text-[#1A1A2E]">{city}</h2>
              <span className="text-xs text-gray-400">({cityItems.length})</span>
            </div>

            <div className="space-y-3">
              {cityItems.map((item, index) => (
                <div
                  key={item.venueId}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={item.venueImage} alt={item.venueName} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 w-6 h-6 bg-[#FF6B4A] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className="font-semibold text-[#1A1A2E] hover:text-[#FF6B4A] cursor-pointer transition-colors"
                          onClick={() => navigate(`/venue/${item.venueSlug}`)}
                        >
                          {item.venueName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            {categoryIcons[item.venueCategory] || categoryIcons.default}
                            {item.venueCategory}
                          </span>
                          <span className="text-xs text-gray-300">|</span>
                          <span className="text-xs text-gray-500">{'$'.repeat(item.priceLevel || 2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.venueId)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Suggest 2 hours</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Any day</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Build Your Day CTA */}
        <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6B] rounded-2xl p-6 text-center mt-8">
          <h3 className="text-xl font-bold text-white mb-2">Ready to book your experience?</h3>
          <p className="text-white/80 text-sm mb-4">Reserve each venue individually to build your perfect day.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {items.slice(0, 4).map(item => (
              <Button
                key={item.venueId}
                onClick={() => navigate(`/reserve/${item.venueSlug}`)}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full text-xs"
              >
                Book {item.venueName.split(' ').slice(0, 2).join(' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
