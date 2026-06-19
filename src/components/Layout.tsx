import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import {
  Search, MapPin, User, Menu, X, LogOut, LogIn, ChevronDown,
  Compass, Ticket, CalendarDays, Zap, PartyPopper, ShoppingBag,
  Heart, Send, Plus, Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const CITIES = [
  { id: 'toronto', name: 'Toronto, ON' },
  { id: 'vancouver', name: 'Vancouver, BC' },
  { id: 'montreal', name: 'Montreal, QC' },
  { id: 'calgary', name: 'Calgary, AB' },
  { id: 'ottawa', name: 'Ottawa, ON' },
  { id: 'edmonton', name: 'Edmonton, AB' },
  { id: 'quebec-city', name: 'Quebec City, QC' },
  { id: 'winnipeg', name: 'Winnipeg, MB' },
  { id: 'halifax', name: 'Halifax, NS' },
  { id: 'victoria', name: 'Victoria, BC' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cityOpen, setCityOpen] = useState(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navGlass = scrolled || !isHome ? 'glass-nav shadow-sm' : 'glass-nav-transparent'
  const navText = scrolled || !isHome ? 'text-gray-700' : 'text-white'
  const navTextHover = scrolled || !isHome ? 'hover:bg-gray-100' : 'hover:bg-white/10'

  return (
    <div className="min-h-screen flex flex-col">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navGlass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-coral-gradient flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold tracking-tight ${navText}`}>Companiio</span>
            </Link>

            <form onSubmit={onSearch} className={`hidden md:flex items-center flex-1 max-w-md mx-6 rounded-full px-4 py-2 transition-all ${
              scrolled || !isHome ? 'bg-gray-100 focus-within:ring-2 focus-within:ring-[#FF6B4A]/20' : 'bg-white/15 border border-white/20'
            }`}>
              <Search className={`w-4 h-4 mr-2 ${scrolled || !isHome ? 'text-gray-400' : 'text-white/60'}`} />
              <input
                type="text"
                placeholder="Search venues, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent outline-none text-sm w-full ${scrolled || !isHome ? 'placeholder:text-gray-400 text-gray-900' : 'placeholder:text-white/50 text-white'}`}
              />
            </form>

            <div className="hidden md:flex items-center gap-0.5">
              <Link to="/discover" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>Discover</Link>
              <Link to="/plans" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />Plans</span>
              </Link>
              <Link to="/create-plan" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                <span className="flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Create</span>
              </Link>
              <Link to="/surprise-me" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" />Surprise</span>
              </Link>
              <Link to="/events" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                <span className="flex items-center gap-1"><PartyPopper className="w-3.5 h-3.5" />Events</span>
              </Link>
              <Link to="/deals" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                <span className="flex items-center gap-1"><Ticket className="w-3.5 h-3.5" />Deals</span>
              </Link>

              <div className="relative ml-1">
                <button onClick={() => setCityOpen(!cityOpen)} className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                  <MapPin className="w-3.5 h-3.5" /> Cities <ChevronDown className="w-3 h-3" />
                </button>
                {cityOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setCityOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-56 glass-strong rounded-2xl py-2 z-50">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Select City</div>
                      {CITIES.map(c => (
                        <button
                          key={c.id}
                          onClick={() => { navigate(`/discover?city=${c.id}`); setCityOpen(false) }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FF6B4A]/10 flex items-center gap-2 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" /> {c.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Link to="/outreach" className={`hidden lg:flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                <Send className="w-4 h-4" /> Outreach
              </Link>
              <Link to="/my-plan" className={`relative flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                <ShoppingBag className="w-4 h-4" /> My Plan
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B4A] text-white text-xs rounded-full flex items-center justify-center font-bold">{itemCount}</span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-1 ml-2">
                  <Link to="/profile" className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${navText} ${navTextHover}`}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="max-w-20 truncate">{user?.name || 'Profile'}</span>
                  </Link>
                  <button onClick={logout} className={`p-2 rounded-full transition-colors ${navTextHover} ${scrolled || !isHome ? 'text-gray-400' : 'text-white/60'}`}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="ml-2">
                  <Button size="sm" className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-full px-5 shadow-coral">
                    <LogIn className="w-4 h-4 mr-1.5" /> Sign In
                  </Button>
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || !isHome ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              <form onSubmit={onSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 mb-3">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full text-gray-900"
                />
              </form>
              {[
                { to: '/discover', label: 'Discover', icon: Compass },
                { to: '/plans', label: 'Day Plans', icon: CalendarDays },
                { to: '/create-plan', label: 'Create Plan', icon: Plus },
                { to: '/surprise-me', label: 'Surprise Me', icon: Zap },
                { to: '/list-your-venue', label: 'List Your Venue', icon: Building2 },
                { to: '/events', label: 'Events', icon: PartyPopper },
                { to: '/deals', label: 'Deals', icon: Ticket },
                { to: '/outreach', label: 'Outreach', icon: Send },
                { to: '/my-plan', label: 'My Plan', icon: ShoppingBag },
              ].map(item => (
                <Link key={item.to} to={item.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <item.icon className="w-5 h-5 text-[#FF6B4A]" /> {item.label}
                </Link>
              ))}
              {CITIES.slice(0, 5).map(c => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/discover?city=${c.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 text-sm text-left"
                >
                  <MapPin className="w-5 h-5 text-[#FF6B4A]" /> {c.name}
                </button>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 text-sm">
                      <User className="w-5 h-5 text-[#FF6B4A]" />My Profile
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 text-sm">
                      <LogOut className="w-5 h-5 text-[#FF6B4A]" />Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#FF6B4A] font-medium text-sm">
                    <LogIn className="w-5 h-5" />Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-[#1A1A2E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-coral-gradient flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Companiio</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Never run out of plans. Discover, plan, and book the best experiences across Canada.</p>
              <p className="text-sm text-gray-500">contactcompaniio@gmail.com</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Cities</h4>
              <ul className="space-y-2">
                {CITIES.slice(0, 6).map(c => (
                  <li key={c.id}>
                    <button onClick={() => navigate(`/discover?city=${c.id}`)} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/partner" className="text-sm text-gray-400 hover:text-white transition-colors">Partner with Us</Link></li>
                <li><Link to="/list-your-venue" className="text-sm text-gray-400 hover:text-white transition-colors">List Your Venue</Link></li>
                <li><Link to="/outreach" className="text-sm text-gray-400 hover:text-white transition-colors">Venue Outreach</Link></li>
                <li><Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Venue Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Discover</h4>
              <ul className="space-y-2">
                <li><Link to="/discover" className="text-sm text-gray-400 hover:text-white transition-colors">All Venues</Link></li>
                <li><Link to="/plans" className="text-sm text-gray-400 hover:text-white transition-colors">Day Plans</Link></li>
                <li><Link to="/create-plan" className="text-sm text-gray-400 hover:text-white transition-colors">Create Your Plan</Link></li>
                <li><Link to="/surprise-me" className="text-sm text-gray-400 hover:text-white transition-colors">Surprise Me</Link></li>
                <li><Link to="/events" className="text-sm text-gray-400 hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/deals" className="text-sm text-gray-400 hover:text-white transition-colors">Deals</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Companiio Inc. All rights reserved.</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Heart className="w-3 h-3 text-[#FF6B4A]" /> Made with care in Canada
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
