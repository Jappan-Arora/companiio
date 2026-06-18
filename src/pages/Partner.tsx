import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, Building2, TrendingUp, Users, DollarSign, Zap,
  Mail, Send, Check, Loader2, Globe,
  CalendarDays, Megaphone, Sparkles, Target
} from 'lucide-react'

const VENUE_EMAIL_TEMPLATE = `Subject: Partner with Companiio — Fill More Tables, Zero Effort

Hi {venueName} Team,

I am reaching out from Companiio, Canada's newest discovery and reservation platform — built specifically to connect locals and tourists with great venues like yours.

**What is Companiio?**
We are a free-to-use discovery app that helps people find, plan, and book restaurants, bars, and experiences across Canada. Think of us as your digital concierge — driving diners directly to your door.

**How you make more money with us:**
- **Fill empty tables** — We send confirmed reservations to your inbox/SMS. No more no-shows without notice.
- **Zero upfront cost** — Listing is completely free. We only earn when you earn (a small commission per seated guest).
- **Featured placement** — Want to stand out? Pay only for the days you want to be promoted.
- **Deal promotion** — Run happy hour specials, prix-fixe menus, or seasonal offers directly on our platform.
- **Customer insights** — See who is booking, when, and what they love about your venue.

**What we need from you:**
1. Confirm you want to partner (reply to this email)
2. Provide your reservation policy (cancellation window, deposit rules)
3. Share high-quality photos of your space and signature dishes
4. Set your preferred commission rate (we suggest starting at 5-8%)

**What we handle:**
- All marketing and user acquisition
- Booking confirmations sent to guests
- Cancellation and refund processing
- Review collection and moderation
- Payment processing (via Stripe — money hits your account automatically)

**Getting started takes 10 minutes.**
Reply to this email or visit https://companiio.com/partner to claim your listing.

We are launching in Vancouver, Toronto, Montreal, and Calgary first — and we want {venueName} to be one of our featured partners from day one.

Best regards,
The Companiio Team
contactcompaniio@gmail.com
https://companiio.com

P.S. — First 50 partner venues get 3 months of featured placement for free.`

export default function Partner() {
  const [venueName, setVenueName] = useState('')
  const [venueEmail, setVenueEmail] = useState('')
  const [venueCity, setVenueCity] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulate API call — in production, this hits the backend email service
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    setSent(true)
  }

  const emailBody = VENUE_EMAIL_TEMPLATE.replace(/{venueName}/g, venueName || 'Your Venue')

  const copyTemplate = () => {
    navigator.clipboard.writeText(emailBody)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B4A] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FF6B4A]/10 rounded-full px-4 py-1.5 mb-4">
            <Building2 className="w-4 h-4 text-[#FF6B4A]" />
            <span className="text-sm font-medium text-[#FF6B4A]">For Venue Partners</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1A1A2E] mb-3">
            More Diners. <span className="text-[#FF6B4A]">Zero Hassle.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Join hundreds of Canadian venues already filling more tables with Companiio — the discovery platform that puts your restaurant in front of thousands of hungry guests.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Active Diners", value: "12,000+", icon: <Users className="w-5 h-5" /> },
            { label: "Monthly Bookings", value: "8,500+", icon: <CalendarDays className="w-5 h-5" /> },
            { label: "Partner Venues", value: "340+", icon: <Building2 className="w-5 h-5" /> },
            { label: "Avg. Fill Rate", value: "94%", icon: <TrendingUp className="w-5 h-5" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-[#FF6B4A]/10 rounded-xl flex items-center justify-center mx-auto mb-2 text-[#FF6B4A]">{stat.icon}</div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A2E] text-center mb-8">How Partnering Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "List Your Venue", desc: "Send us your details or fill the form below. We create your profile with photos, menu, hours, and policies.", icon: <Globe className="w-6 h-6" /> },
              { step: "02", title: "Receive Bookings", desc: "Guests discover and book directly through Companiio. You get an instant email/SMS with all reservation details.", icon: <Zap className="w-6 h-6" /> },
              { step: "03", title: "Get Paid", desc: "Diners pay you directly for their meal. Our small commission is automatically deducted via Stripe. No invoices, no chasing.", icon: <DollarSign className="w-6 h-6" /> },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
                <span className="absolute top-4 right-4 text-4xl font-bold text-gray-100">{item.step}</span>
                <div className="w-12 h-12 bg-[#FF6B4A]/10 rounded-xl flex items-center justify-center text-[#FF6B4A] mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Model */}
        <div className="bg-[#1A1A2E] rounded-3xl p-6 sm:p-10 mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Your Revenue. Our Commission.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Standard Listing", price: "5%", desc: "Per confirmed guest. Free to list. Pay only when we send you a diner.", features: ["Profile on Companiio", "Booking management", "Email notifications", "Basic analytics"] },
              { title: "Featured Partner", price: "8%", desc: "Premium placement + marketing. Appear in 'Trending' and 'Recommended'.", features: ["Everything in Standard", "Homepage placement", "Social media shoutouts", "Deal promotion tools", "Priority support"], popular: true },
              { title: "Premium Concierge", price: "12%", desc: "White-glove service. We handle everything — you just welcome guests.", features: ["Everything in Featured", "Dedicated account manager", "Custom marketing campaigns", "Review management", "Photography session"] },
            ].map((tier, i) => (
              <div key={i} className={`rounded-2xl p-6 ${tier.popular ? 'bg-[#FF6B4A] text-white' : 'bg-white/5 border border-white/10 text-white'}`}>
                {tier.popular && <span className="text-xs font-bold uppercase tracking-wider bg-white text-[#FF6B4A] rounded-full px-3 py-1">Most Popular</span>}
                <h3 className="text-lg font-semibold mt-3">{tier.title}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-sm opacity-70">per seated guest</span>
                </div>
                <p className="text-sm opacity-70 mt-2 mb-4">{tier.desc}</p>
                <ul className="space-y-2">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* What You Get */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#FF6B4A]" /> What We Offer You</h2>
            <ul className="space-y-3">
              {[
                "Free professional listing — no setup fees ever",
                "Confirmed reservations with guest contact details",
                "Automated SMS/email reminders to reduce no-shows",
                "Deal & promotion tools to fill slow nights",
                "Review collection to build your reputation",
                "Analytics dashboard — bookings, revenue, trends",
                "Social media promotion across our channels",
                "First 50 partners get 3 months featured for free",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-[#FF6B4A]" /> What We Need From You</h2>
            <ul className="space-y-3">
              {[
                "Reply to confirm partnership interest",
                "Provide your cancellation & deposit policy",
                "Share 5-10 high-quality photos of your venue",
                "Set your max party size and seating capacity",
                "Confirm your hours and any seasonal changes",
                "Designate a contact for reservation alerts",
                "Connect your Stripe account for payouts (5 min)",
                "That's it — we handle the rest",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-gray-500">{i + 1}</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Email Outreach Tool */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#FF6B4A]" /> Venue Outreach Tool
            </h2>
            <p className="text-sm text-gray-500 mt-1">Send a professional partnership pitch to any venue in Canada.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Form */}
            <div className="p-6 border-r border-gray-100">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-[#1A1A2E] mb-1">Email Queued for Delivery!</h3>
                  <p className="text-sm text-gray-500 mb-4">Your pitch to {venueName} will be sent from contactcompaniio@gmail.com</p>
                  <Button onClick={() => { setSent(false); setVenueName(''); setVenueEmail(''); setVenueCity('') }} variant="outline" className="rounded-xl">Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                    <input type="text" required value={venueName} onChange={e => setVenueName(e.target.value)} placeholder="e.g. Joe Fortes Seafood" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Email</label>
                    <input type="email" required value={venueEmail} onChange={e => setVenueEmail(e.target.value)} placeholder="info@venue.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" value={venueCity} onChange={e => setVenueCity(e.target.value)} placeholder="e.g. Vancouver" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF6B4A]/30" />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl shadow-coral">
                    {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Send className="w-4 h-4 mr-2" /> Send Partnership Pitch</>}
                  </Button>
                  <p className="text-xs text-gray-400 text-center">Email will be sent from contactcompaniio@gmail.com</p>
                </form>
              )}
            </div>

            {/* Preview */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Email Preview</h3>
                <button onClick={copyTemplate} className="text-xs text-[#FF6B4A] font-medium hover:underline flex items-center gap-1">
                  {copied ? <><Check className="w-3 h-3" /> Copied</> : <>Copy Template</>}
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-xs text-gray-600 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">{emailBody}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6B] rounded-3xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to fill more tables?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Join the fastest-growing venue network in Canada. It takes 10 minutes to get started.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:contactcompaniio@gmail.com?subject=Partner with Companiio" className="inline-flex items-center justify-center bg-white text-[#FF6B4A] font-semibold rounded-xl px-8 py-3.5 hover:bg-white/90 transition-colors">
              <Mail className="w-5 h-5 mr-2" /> Email Us to Partner
            </a>
            <a href="tel:+16045550123" className="inline-flex items-center justify-center bg-white/20 text-white font-semibold rounded-xl px-8 py-3.5 hover:bg-white/30 transition-colors backdrop-blur-sm">
              Call (604) 555-0123
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Questions? Reach us at <a href="mailto:contactcompaniio@gmail.com" className="text-[#FF6B4A] font-medium">contactcompaniio@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
