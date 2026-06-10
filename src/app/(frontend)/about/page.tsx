import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, MapPin, Handshake } from 'lucide-react'
import { getCompanySettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'NJ Motors is a local used car dealer built on straight talk and honest cars. Find out how we buy, prepare and sell every vehicle.',
}

export default async function AboutPage() {
  const s = await getCompanySettings()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[var(--brand)]">About NJ Motors</h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--ink)]">
        We started NJ Motors ...
      </p>
      <p className="mt-4 leading-relaxed text-[var(--muted)]">
        We sell hand picked, road tested and fully inspected cars before it goes up for
        sale. We&apos;re upfront about history, mileage and price.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] p-5">
          <ShieldCheck className="text-[var(--brand-accent)]" />
          <p className="mt-2 font-bold">Properly checked cars</p>
          <p className="text-sm text-[var(--muted)]">Inspected and prepared before it&apos;s listed.</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] p-5">
          <MapPin className="text-[var(--brand-accent)]" />
          <p className="mt-2 font-bold">Local</p>
          <p className="text-sm text-[var(--muted)]">{s?.address || 'Come and see us in person.'}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] p-5">
          <Handshake className="text-[var(--brand-accent)]" />
          <p className="mt-2 font-bold">Easy to deal with</p>
          <p className="text-sm text-[var(--muted)]">No pressure</p>
        </div>
      </div>

      <div className="mt-10 rounded-xl bg-[var(--brand)] p-8 text-center text-white">
        <p className="text-xl font-bold">Looking for something specific?</p>
        <p className="mt-1 text-white/80">Tell us what you&apos;re after and we&apos;ll keep an eye out.</p>
        <Link href="/contact" className="mt-4 inline-block rounded-full bg-[var(--brand-accent)] px-6 py-3 font-semibold">
          Get in touch
        </Link>
      </div>
    </div>
  )
}
