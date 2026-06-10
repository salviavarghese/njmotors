import type { Metadata } from 'next'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getCompanySettings } from '@/lib/payload'
import EnquiryForm from '@/components/EnquiryForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with NJ Motors. Call, email or send us a message and we’ll get straight back to you.',
}

export default async function ContactPage() {
  const s = await getCompanySettings()
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-extrabold text-[var(--brand)]">Get in touch</h1>
      <p className="mt-1 text-[var(--muted)]">Questions about a car, or after something specific? We’re happy to help.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {s?.phone && (
            <a href={`tel:${s.phone}`} className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-4">
              <Phone className="text-[var(--brand-accent)]" /> <span className="font-semibold">{s.phone}</span>
            </a>
          )}
          {s?.email && (
            <a href={`mailto:${s.email}`} className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-4">
              <Mail className="text-[var(--brand-accent)]" /> <span className="font-semibold">{s.email}</span>
            </a>
          )}
          {s?.address && (
            <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] p-4">
              <MapPin className="mt-1 text-[var(--brand-accent)]" /> <span className="whitespace-pre-line">{s.address}</span>
            </div>
          )}
        </div>
        <EnquiryForm intro="Drop us a message and we'll reply as soon as we can." />
      </div>
    </div>
  )
}
