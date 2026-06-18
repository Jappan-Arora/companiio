import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { User, Calendar, Clock, Users, MapPin, ChevronRight, LogIn, Loader2, Ticket, Heart, Settings } from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { data: reservations, isLoading: resLoading } = trpc.reservation.myReservations.useQuery(undefined, { enabled: isAuthenticated })
  const upcoming = reservations?.filter(r => r.status === 'pending' || r.status === 'confirmed') || []
  const past = reservations?.filter(r => r.status === 'completed' || r.status === 'cancelled') || []

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B4A]" /></div>

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-md mx-auto px-4">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><User className="w-8 h-8 text-gray-400" /></div>
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Sign in to view your profile</h2>
          <p className="text-gray-500 mb-6">Access your reservations, saved venues, and exclusive deals.</p>
          <Button onClick={() => navigate('/login')} className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full px-8 py-5 font-semibold shadow-coral w-full"><LogIn className="w-5 h-5 mr-2" /> Sign In</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="glass-card p-6 mb-4">
          <div className="flex items-center gap-4">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-[#FF6B4A]/20" /> : <div className="w-16 h-16 bg-coral-gradient rounded-full flex items-center justify-center text-white text-xl font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#1A1A2E]">{user?.name || 'User'}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <Button onClick={logout} variant="outline" className="rounded-full border-gray-200 text-gray-500 hover:text-red-500">Sign Out</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-[#FF6B4A]">{upcoming.length}</p><p className="text-xs text-gray-500 mt-1">Upcoming</p></div>
          <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-[#1A1A2E]">{past.length}</p><p className="text-xs text-gray-500 mt-1">Past</p></div>
          <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-[#1A1A2E]">0</p><p className="text-xs text-gray-500 mt-1">Saved</p></div>
        </div>

        <div className="glass-card overflow-hidden mb-4">
          <div className="p-5 border-b border-gray-100"><h2 className="font-semibold text-[#1A1A2E] flex items-center gap-2"><Calendar className="w-5 h-5 text-[#FF6B4A]" />Upcoming Reservations</h2></div>
          {resLoading ? <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#FF6B4A] mx-auto" /></div> : upcoming.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {upcoming.map(r => (
                <div key={r.id} className="p-5 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"><img src={r.venueImage || ''} alt={r.venueName || ''} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div><h3 className="font-semibold text-[#1A1A2E] text-sm">{r.venueName}</h3><p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{r.venueAddress}</p></div>
                      <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${r.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{r.status === 'confirmed' ? 'Confirmed' : 'Pending'}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.time}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.partySize}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="p-8 text-center"><Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No upcoming reservations</p><button onClick={() => navigate('/discover')} className="text-[#FF6B4A] text-sm font-medium mt-1 hover:underline">Book your first experience</button></div>}
        </div>

        <div className="glass-card overflow-hidden">
          {[{to:'/deals',icon:Ticket,label:'My Deals'},{to:'/discover',icon:Heart,label:'Saved Venues'},{to:'/contact',icon:Settings,label:'Help & Support'}].map(item => (
            <Link key={item.to} to={item.to} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3"><item.icon className="w-5 h-5 text-[#FF6B4A]" /><span className="text-sm font-medium text-[#1A1A2E]">{item.label}</span></div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
