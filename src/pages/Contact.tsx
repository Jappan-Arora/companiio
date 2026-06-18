import { Link } from 'react-router'
import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, MapPin, Send, MessageSquare, Check, Loader2, Building2, User } from 'lucide-react'

export default function Contact() {
  const [formType, setFormType] = useState<'contact'|'venue'|'waitlist'>('contact')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [city, setCity] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submitContact = trpc.contact.submit.useMutation({ onSuccess: () => { setSubmitted(true); setName(''); setEmail(''); setSubject(''); setMessage('') } })
  const joinWaitlist = trpc.contact.joinWaitlist.useMutation({ onSuccess: () => { setSubmitted(true); setEmail(''); setCity('') } })
  const isSubmitting = submitContact.isPending || joinWaitlist.isPending

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formType === 'contact' || formType === 'venue') submitContact.mutate({ name, email, subject, message })
    else joinWaitlist.mutate({ email, city, userType: 'user' })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B4A] mb-8"><ArrowLeft className="w-4 h-4" />Back</Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-2">Get in Touch</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Have questions, want to partner, or want Companiio in your city? We would love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="glass-card p-5">
              <div className="w-10 h-10 bg-[#FF6B4A]/10 rounded-xl flex items-center justify-center mb-3"><Mail className="w-5 h-5 text-[#FF6B4A]" /></div>
              <h3 className="font-semibold text-[#1A1A2E] mb-1">Email</h3>
              <a href="mailto:contactcompaniio@gmail.com" className="text-sm text-[#FF6B4A] font-medium hover:underline">contactcompaniio@gmail.com</a>
            </div>
            <div className="glass-card p-5">
              <div className="w-10 h-10 bg-[#FF6B4A]/10 rounded-xl flex items-center justify-center mb-3"><MapPin className="w-5 h-5 text-[#FF6B4A]" /></div>
              <h3 className="font-semibold text-[#1A1A2E] mb-1">HQ</h3>
              <p className="text-sm text-gray-500">Vancouver, BC, Canada</p>
            </div>
            <div className="glass-card p-5">
              <div className="w-10 h-10 bg-[#FF6B4A]/10 rounded-xl flex items-center justify-center mb-3"><Building2 className="w-5 h-5 text-[#FF6B4A]" /></div>
              <h3 className="font-semibold text-[#1A1A2E] mb-1">For Venues</h3>
              <p className="text-sm text-gray-500 mb-2">List your venue, reach new customers.</p>
              <button onClick={() => { setFormType('venue'); setSubmitted(false) }} className="text-sm text-[#FF6B4A] font-medium hover:underline">Partner with us</button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="glass-card overflow-hidden">
              <div className="flex border-b border-gray-100">
                {[{k:'contact',l:'General',i:MessageSquare},{k:'venue',l:'List Venue',i:Building2},{k:'waitlist',l:'City Waitlist',i:User}].map(t => (
                  <button key={t.k} onClick={() => { setFormType(t.k as any); setSubmitted(false) }} className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${formType === t.k ? 'text-[#FF6B4A] border-b-2 border-[#FF6B4A]' : 'text-gray-500 hover:text-gray-700'}`}>
                    <t.i className="w-4 h-4" />{t.l}
                  </button>
                ))}
              </div>
              <div className="p-5 sm:p-6">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-7 h-7 text-green-600" /></div>
                    <h3 className="text-lg font-semibold text-[#1A1A2E]">{formType === 'waitlist' ? 'You are on the list!' : 'Message Sent!'}</h3>
                    <p className="text-gray-500 text-sm">{formType === 'waitlist' ? "We will notify you when Companiio launches in your city." : "We will get back to you within 24 hours."}</p>
                    <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4 rounded-full">Send Another</Button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    {(formType === 'contact' || formType === 'venue') && (<>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{formType === 'venue' ? 'Business Name' : 'Your Name'} *</label><input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full glass-input-dark py-3" placeholder={formType === 'venue' ? 'Your Restaurant' : 'John Doe'} /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full glass-input-dark py-3" placeholder="you@example.com" /></div>
                      {formType === 'contact' && <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full glass-input-dark py-3" placeholder="What is this about?" /></div>}
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{formType === 'venue' ? 'Tell us about your venue' : 'Message'} *</label><textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full glass-input-dark resize-none" placeholder={formType === 'venue' ? 'Venue type, location, seats...' : 'How can we help?'} /></div>
                    </>)}
                    {formType === 'waitlist' && (<>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full glass-input-dark py-3" placeholder="you@example.com" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full glass-input-dark py-3" placeholder="Which city?" /></div>
                    </>)}
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[#FF6B4A] hover:bg-[#E55A3A] text-white rounded-xl py-5 font-semibold shadow-coral">
                      {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending...</> : <><Send className="w-4 h-4 mr-2" />{formType === 'waitlist' ? 'Join Waitlist' : formType === 'venue' ? 'Apply' : 'Send'}</>}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
