import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, MapPin, Handshake } from 'lucide-react'
import { getCompanySettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: { absolute: 'About NJ Motors — Trusted Used Car Dealer in Peterborough' },
  description: 'A local used car dealer built on straight talk and honest cars.',
}

export default async function AboutPage() {
  const s = await getCompanySettings()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[var(--brand)]">About NJ Motors</h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--ink)]">
        Buying a used car shouldn&apos;t be stressful or
        confusing. Too many dealers leave you guessing. We&apos;d rather be straight with you from
        the first conversation.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-[var(--ink)]">
        Every car we sell is hand-picked, road-tested and fully inspected before it&apos;s listed.
        The price you see is the price, no hidden fees, no games. And if a car isn&apos;t the right
        fit, we&apos;ll say so. Repeat customers matter to us more than a quick sale.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] p-5">
          <ShieldCheck className="text-[var(--brand-accent)]" />
          <p className="mt-2 font-bold">Properly checked</p>
          <p className="text-sm text-[var(--muted)]">Inspected and prepared before it&apos;s listed.</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] p-5">
          <MapPin className="text-[var(--brand-accent)]" />
          <p className="mt-2 font-bold">Local &amp; reachable</p>
          <p className="text-sm text-[var(--muted)]">{s?.address || 'Come and see us in person.'}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] p-5">
          <Handshake className="text-[var(--brand-accent)]" />
          <p className="mt-2 font-bold">Easy to deal with</p>
          <p className="text-sm text-[var(--muted)]">No pressure, no pushy sales.</p>
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