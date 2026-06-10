import Link from 'next/link'
import { Phone } from 'lucide-react'
import { getCompanySettings } from '@/lib/payload'

export default async function Header() {
  const settings = await getCompanySettings()
  const phone = settings?.phone

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded bg-[var(--brand)] font-bold text-white">
            NJ
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[var(--brand)]">
            {settings?.companyName || 'NJ Motors'}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link href="/stock" className="hover:text-[var(--brand-accent)]">Stock</Link>
          <Link href="/sold" className="hover:text-[var(--brand-accent)]">Recently Sold</Link>
          <Link href="/about" className="hover:text-[var(--brand-accent)]">About</Link>
          <Link href="/contact" className="hover:text-[var(--brand-accent)]">Contact</Link>
        </nav>

        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <Phone size={16} />
            <span className="hidden sm:inline">{phone}</span>
            <span className="sm:hidden">Call</span>
          </a>
        )}
      </div>
    </header>
  )
}
