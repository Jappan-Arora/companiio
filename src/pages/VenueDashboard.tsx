import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Building2, Calendar, Users, Star, TrendingUp, DollarSign, ArrowLeft, Loader2, LogIn } from 'lucide-react'

export default function VenueDashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: reservations, isLoading: resLoading } = trpc.reservation.myReservations.useQuery(undefined, { enabled: isAuthenticated })

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B4A]" /></div>
  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12 flex items-center justify-center">
      <div className="glass-card p-8 text-center max-w-sm">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Venue Partner Portal</h2>
        <p className="text-gray-500 mb-4">Sign in to manage your venue dashboard.</p>
        <Button onClick={() => navigate('/login')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full px-8 py-5 shadow-coral w-full"><LogIn className="w-5 h-5 mr-2" /> Sign In</Button>
      </div>
    </div>
  )

  const stats = [
    { label: 'Total Reservations', value: reservations?.length || 0, icon: Calendar, color: 'text-[#FF6B4A]', bg: 'bg-[#FF6B4A]/10' },
    { label: 'Total Guests', value: reservations?.reduce((a, r) => a + r.partySize, 0) || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Confirmed', value: reservations?.filter(r => r.status === 'confirmed').length || 0, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Est. Revenue', value: `$${(reservations?.length || 0) * 85}`, icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B4A] mb-6"><ArrowLeft className="w-4 h-4" />Back</Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-coral-gradient rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-[#1A1A2E]">Venue Dashboard</h1><p className="text-sm text-gray-500">Manage your venue performance</p></div>
          </div>
          <Button onClick={() => navigate('/contact')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full shadow-coral">Claim Your Venue</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="glass-card p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold text-[#1A1A2E] flex items-center gap-2"><Calendar className="w-5 h-5 text-[#FF6B4A]" />Recent Reservations</h2></div>
          {resLoading ? <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#FF6B4A] mx-auto" /></div> : reservations && reservations.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {reservations.slice(0, 10).map(r => (
                <div key={r.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"><img src={r.venueImage || ''} alt="" className="w-full h-full object-cover" /></div>
                  <div className="flex-1"><p className="font-medium text-sm text-[#1A1A2E]">{r.guestName}</p><p className="text-xs text-gray-500">{r.partySize} people at {r.venueName}</p></div>
                  <div className="text-right"><p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</p><p className="text-xs font-medium">{r.time}</p></div>
                  <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${r.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{r.status}</span>
                </div>
              ))}
            </div>
          ) : <div className="p-8 text-center"><p className="text-gray-500">No reservations yet. This is a preview of your dashboard.</p></div>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-[#1A1A2E] mb-2">How it works for venues</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span className="text-[#FF6B4A] font-bold">1.</span>List your venue for free</li>
              <li className="flex items-start gap-2"><span className="text-[#FF6B4A] font-bold">2.</span>Receive confirmed reservations</li>
              <li className="flex items-start gap-2"><span className="text-[#FF6B4A] font-bold">3.</span>Guests pay you directly</li>
              <li className="flex items-start gap-2"><span className="text-[#FF6B4A] font-bold">4.</span>We earn 8% per booking</li>
            </ul>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-[#1A1A2E] mb-2">Features included</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />Real-time reservation management</li>
              <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />Guest analytics and insights</li>
              <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />Deal promotion tools</li>
              <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />Featured listing options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
