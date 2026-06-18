import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Shuffle, MapPin, Star, ChevronRight, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { mockVenues, mockCities } from '@/lib/mockData'

export default function SurpriseMe() {
  const navigate = useNavigate()
  const [cityId, setCityId] = useState<number | undefined>()
  const { data: apiCities } = trpc.city.list.useQuery()
  const { data: apiSurprises, refetch } = trpc.venue.surpriseMe.useQuery({ cityId }, { enabled: true })
  const [refreshing, setRefreshing] = useState(false)

  const cities = apiCities && apiCities.length > 0 ? apiCities : mockCities as any[]
  // Shuffle mock venues for surprise effect
  const shuffled = [...mockVenues].sort(() => Math.random() - 0.5).slice(0, 3)
  const surprises = apiSurprises && apiSurprises.length > 0 ? apiSurprises : shuffled as any[]

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D44] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-coral-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-coral animate-float">
            <Shuffle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Surprise Me</h1>
          <p className="text-white/60 max-w-md mx-auto">Let us pick your next adventure. We will curate a mix of venues for an unforgettable experience.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button onClick={() => setCityId(undefined)} className={`glass-button px-4 py-2 text-sm ${!cityId ? 'bg-white/30' : ''}`}>Any City</button>
          {cities?.slice(0, 6).map(c => (
            <button key={c.id} onClick={() => setCityId(cityId === c.id ? undefined : c.id)} className={`glass-button px-4 py-2 text-sm ${cityId === c.id ? 'bg-white/30' : ''}`}>{c.name}</button>
          ))}
        </div>

        <div className="space-y-4">
          {surprises?.map((v, i) => (
            <button key={v.id} onClick={() => navigate(`/venue/${v.slug}`)} className="w-full glass-card-dark p-0 overflow-hidden text-left hover:bg-black/40 transition-all group">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto shrink-0 relative">
                  <img src={v.image || ''} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-[#FF6B4A] text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-coral">#{i + 1}</div>
                </div>
                <div className="flex-1 p-5">
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#FF8F6B] transition-colors">{v.name}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mb-2"><MapPin className="w-3.5 h-3.5" />{v.neighborhood}</p>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{v.shortDescription || v.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-amber-400 text-sm"><Star className="w-4 h-4 fill-amber-400" />{v.rating}</span>
                    <span className="bg-white/10 text-white text-xs rounded-full px-2.5 py-0.5">{'$'.repeat(v.priceLevel || 2)}</span>
                    {v.cuisine && <span className="text-xs text-gray-400">{v.cuisine}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-[#FF6B4A] text-sm mt-3 font-medium">
                    Explore <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button onClick={handleRefresh} disabled={refreshing} className="glass-button px-8 py-5 text-base gap-2">
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} /> Surprise Me Again
          </Button>
        </div>
      </div>
    </div>
  )
}
