import { useParams, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Clock, MapPin, Ticket, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function QRCodeDisplay() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [qrImage, setQrImage] = useState('')

  // Generate QR code image from the code
  useEffect(() => {
    if (code) {
      // In production, this would fetch the actual QR image from the API
      // For now, generate a placeholder
      import('qrcode').then(QRCode => {
        QRCode.toDataURL(code.toUpperCase(), {
          width: 400,
          margin: 2,
          color: { dark: '#1A1A2E', light: '#FFFFFF' },
        }).then(setQrImage)
      })
    }
  }, [code])

  const dealInfo = {
    title: 'Happy Hour Special',
    venue: 'Joe Fortes Seafood & Chop House',
    address: '777 Thurlow St, Vancouver, BC',
    discount: '20% OFF',
    expiresIn: '6 days',
    validDays: 'Mon-Fri, 3PM-6PM',
  }

  const handleDownload = () => {
    if (qrImage) {
      const link = document.createElement('a')
      link.href = qrImage
      link.download = `companiio-deal-${code}.png`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Your Deal</h1>
        </div>

        {/* QR Code Card */}
        <div className="glass-card overflow-hidden">
          {/* Deal Header */}
          <div className="bg-[#1A1A2E] p-6 text-white text-center">
            <Ticket className="w-8 h-8 text-[#FF6B4A] mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-1">{dealInfo.title}</h2>
            <p className="text-sm text-gray-400">{dealInfo.venue}</p>
          </div>

          {/* QR Code */}
          <div className="p-8 text-center">
            {qrImage ? (
              <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
                <img src={qrImage} alt="Deal QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-2xl mx-auto animate-pulse" />
            )}
            <p className="text-2xl font-mono font-bold text-[#1A1A2E] mt-4 tracking-wider">
              {code?.toUpperCase()}
            </p>
            <p className="text-sm text-gray-500 mt-2">Show this code at the venue</p>
          </div>

          {/* Deal Details */}
          <div className="px-6 pb-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-[#FF6B4A]" />
              {dealInfo.address}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-[#FF6B4A]" />
              {dealInfo.validDays}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-[#FF6B4A]" />
              Expires in {dealInfo.expiresIn}
            </div>
            <div className="bg-[#FF6B4A]/10 rounded-xl p-3 text-center mt-4">
              <p className="text-lg font-bold text-[#FF6B4A]">{dealInfo.discount}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 space-y-3">
            <Button
              onClick={handleDownload}
              className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" /> Save QR Code
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/deals')}
              className="w-full rounded-xl border-gray-200"
            >
              Back to Deals
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
