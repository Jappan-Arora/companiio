import { useState } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import {
  Building2, Calendar, Users, TrendingUp, DollarSign,
  ArrowLeft, Loader2, QrCode, Mail, Phone,
  CheckCircle, XCircle, Clock,
} from 'lucide-react'

export default function PartnerDashboard() {
  const navigate = useNavigate()
  const [selectedVenueId, setSelectedVenueId] = useState(1)

  // Mock venue data - in production, fetch from API
  const venueName = 'Demo Venue'

  // Fetch booking requests for this venue
  const { data: bookings, isLoading: bookingsLoading } = trpc.bookingRequest.listByVenue.useQuery(
    { venueId: selectedVenueId },
    { retry: false }
  )

  // Fetch deal claim stats
  const { data: dealStats } = trpc.dealClaim.stats.useQuery(
    { venueId: selectedVenueId },
    { retry: false }
  )

  // Update booking status
  const updateStatus = trpc.bookingRequest.updateStatus.useMutation({
    onSuccess: () => {
      window.location.reload()
    },
  })

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || []
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed') || []

  const stats = [
    { label: 'Total Bookings', value: bookings?.length || 0, icon: Calendar, color: 'text-[#FF6B4A]', bg: 'bg-[#FF6B4A]/10' },
    { label: 'Pending', value: pendingBookings.length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Confirmed', value: confirmedBookings.length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Deal Claims', value: dealStats?.totalClaims || 0, icon: QrCode, color: 'text-blue-500', bg: 'bg-blue-50' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Partner Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your venue bookings and deal redemptions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="glass-card p-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue Section */}
        <div className="glass-card p-6 mb-8 bg-[#1A1A2E]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#FF6B4A]" /> Revenue Overview
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-[#FF6B4A]">${(confirmedBookings.length * 85) + (dealStats?.totalRedeemed || 0) * 12}</p>
              <p className="text-sm text-gray-400 mt-1">Est. Monthly Revenue</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{dealStats?.conversionRate || 0}%</p>
              <p className="text-sm text-gray-400 mt-1">Deal Conversion</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{dealStats?.totalRedeemed || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Deals Redeemed</p>
            </div>
          </div>
        </div>

        {/* QR Code Scanner Section */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#FF6B4A]" /> Redeem Deal QR Code
          </h2>
          <p className="text-sm text-gray-500 mb-4">Enter the QR code from the customer's claimed deal to mark it as redeemed.</p>
          <QRRedeemForm />
        </div>

        {/* Booking Requests */}
        <div className="glass-card overflow-hidden mb-8">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-[#1A1A2E] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF6B4A]" /> Booking Requests
            </h2>
          </div>

          {bookingsLoading ? (
            <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#FF6B4A] mx-auto" /></div>
          ) : bookings && bookings.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {bookings.map(b => (
                <div key={b.id} className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#1A1A2E] text-sm">{b.userName}</h3>
                        <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${
                          b.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                          b.status === 'declined' ? 'bg-red-50 text-red-500' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{b.userEmail}</span>
                        {b.userPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.userPhone}</span>}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.time}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.partySize} guests</span>
                      </div>
                      {b.occasion && <p className="text-xs text-gray-400 mt-1">Occasion: {b.occasion}</p>}
                      {b.specialRequests && <p className="text-xs text-gray-400 mt-1">Note: {b.specialRequests}</p>}
                    </div>
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateStatus.mutate({ id: b.id, status: 'confirmed' })}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: b.id, status: 'declined' })}
                          className="text-red-500 border-red-200 hover:bg-red-50 rounded-lg text-xs"
                        >
                          <XCircle className="w-3 h-3 mr-1" /> Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No booking requests yet</p>
              <p className="text-xs text-gray-400 mt-1">Bookings will appear here when customers request a table</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// QR Code Redemption Form
function QRRedeemForm() {
  const [qrCode, setQrCode] = useState('')
  const [result, setResult] = useState<any>(null)
  const redeemMutation = trpc.dealClaim.redeem.useMutation({
    onSuccess: (data) => {
      setResult(data)
      if (data.success) setQrCode('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!qrCode.trim()) return
    setResult(null)
    redeemMutation.mutate({ qrCode: qrCode.trim() })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Enter QR code (e.g., CC9A2B1X)"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 uppercase"
        />
        <Button
          type="submit"
          disabled={redeemMutation.isPending || !qrCode.trim()}
          className="bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl px-6"
        >
          {redeemMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Redeem'}
        </Button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-xl ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <p className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.success ? `Deal redeemed! ${result.deal?.title} at ${result.venue?.name}` : result.error}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
