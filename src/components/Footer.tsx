import Link from 'next/link'
import { getCompanySettings } from '@/lib/payload'

export default async function Footer() {
  const s = await getCompanySettings()
  return (
    <footer className="mt-24 bg-[var(--brand)] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">{s?.companyName || 'NJ Motors'}</p>
          <p className="mt-2 max-w-xs text-sm text-white/70">
            Quality used cars, honestly sold. Every vehicle inspected before sale.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Get in touch</p>
          <ul className="mt-2 space-y-1 text-white/80">
            {s?.phone && <li><a href={`tel:${s.phone}`}>{s.phone}</a></li>}
            {s?.email && <li><a href={`mailto:${s.email}`}>{s.email}</a></li>}
            {s?.address && <li className="whitespace-pre-line">{s.address}</li>}
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Opening hours</p>
          <ul className="mt-2 space-y-1 text-white/80">
            {s?.openingHours?.map((o, i) => (
              <li key={i}>{o.days}: {o.hours}</li>
            ))}
          </ul>
          <div className="mt-4 flex gap-4">
            <Link href="/stock" className="underline">Browse stock</Link>
            <Link href="/contact" className="underline">Contact</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {s?.companyName || 'NJ Motors'}. All rights reserved.
      </div>
    </footer>
  )
}
