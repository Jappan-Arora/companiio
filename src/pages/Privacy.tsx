import { Link } from 'react-router'
import { ArrowLeft, Shield } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B4A] mb-8"><ArrowLeft className="w-4 h-4" />Back</Link>
        <div className="flex items-center gap-3 mb-6"><Shield className="w-8 h-8 text-[#FF6B4A]" /><h1 className="text-3xl font-bold text-[#1A1A2E]">Privacy Policy</h1></div>
        <p className="text-gray-500 text-sm mb-6">Last updated: June 2026</p>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">1. Information We Collect</h2>
            <p>We collect your name, email, phone number, and reservation details when you create an account or make a booking. We also collect usage data to improve our service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">2. How We Use Your Information</h2>
            <p>We use your information to process reservations, send confirmation emails, improve recommendations, and communicate important updates. We never sell your data to third parties.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">3. Sharing with Venues</h2>
            <p>When you make a reservation, we share your name, contact details, and booking information with the venue so they can prepare for your visit.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">4. Data Security</h2>
            <p>All data is transmitted over HTTPS and stored securely. Payment information is processed by Stripe and is never stored on our servers.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">5. Your Rights</h2>
            <p>You can access, correct, or delete your personal data at any time by contacting us at contactcompaniio@gmail.com.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">6. Contact</h2>
            <p>For privacy concerns, email us at <a href="mailto:contactcompaniio@gmail.com" className="text-[#FF6B4A] hover:underline">contactcompaniio@gmail.com</a> or through our <Link to="/contact" className="text-[#FF6B4A] hover:underline">Contact page</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
