import { Phone, MessageCircle } from 'lucide-react'
import { getCompanySettings } from '@/lib/payload'

// Sticky mobile call/WhatsApp bar (CRO: contact always reachable).
export default async function StickyContact() {
  const s = await getCompanySettings()
  const phone = s?.phone?.replace(/\s/g, '')
  const wa = s?.social?.whatsapp?.replace(/\D/g, '')
  if (!phone && !wa) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex border-t border-[var(--line)] bg-white md:hidden">
      {phone && (
        <a href={`tel:${phone}`} className="flex flex-1 items-center justify-center gap-2 py-3 font-semibold text-[var(--brand)]">
          <Phone size={18} /> Call
        </a>
      )}
      {wa && (
        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 bg-green-600 py-3 font-semibold text-white"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
      )}
    </div>
  )
}
