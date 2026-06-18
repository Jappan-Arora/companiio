import { Link } from 'react-router'
import { ArrowLeft, FileText } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B4A] mb-8"><ArrowLeft className="w-4 h-4" />Back</Link>
        <div className="flex items-center gap-3 mb-6"><FileText className="w-8 h-8 text-[#FF6B4A]" /><h1 className="text-3xl font-bold text-[#1A1A2E]">Terms of Service</h1></div>
        <p className="text-gray-500 text-sm mb-6">Last updated: June 2026</p>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">1. Acceptance</h2>
            <p>By using Companiio, you agree to these terms. If you do not agree, please do not use our service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">2. Reservations</h2>
            <p>You are entering into a direct agreement with the venue when you book. Companiio facilitates the reservation but is not responsible for the venue's service. Arrive on time. Late arrivals may forfeit your table.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">3. Payments</h2>
            <p>Companiio is free for users. You pay the venue directly for your meal. For certain prepaid experiences, we process payment securely through Stripe.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">4. Cancellations</h2>
            <p>Cancellations more than 24 hours in advance are fully refundable. Within 24 hours, the venue may charge a cancellation fee. No-shows may be charged.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">5. Content</h2>
            <p>By submitting reviews or photos, you grant Companiio a license to use that content. You must not submit false or misleading information.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">6. Limitation of Liability</h2>
            <p>Companiio is not liable for issues arising at venues. We are a discovery and booking platform, not the service provider.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">7. Governing Law</h2>
            <p>These terms are governed by the laws of British Columbia, Canada. Disputes shall be resolved in Vancouver courts.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-2">8. Contact</h2>
            <p>Questions? Reach us at <a href="mailto:contactcompaniio@gmail.com" className="text-[#FF6B4A] hover:underline">contactcompaniio@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
