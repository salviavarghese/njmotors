import Link from 'next/link'
import { ShieldCheck, FileCheck2, Handshake, Search } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import VehicleCard from '@/components/VehicleCard'
import Reveal from '@/components/Reveal'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()

  const featured = await payload.find({
    collection: 'vehicles',
    where: {
      and: [{ featured: { equals: true } }, { status: { not_equals: 'Sold' } }],
    },
    limit: 3,
    depth: 1,
  })

  const sold = await payload.find({
    collection: 'vehicles',
    where: { status: { equals: 'Sold' } },
    sort: '-soldDate',
    limit: 3,
    depth: 1,
  })

  // Fallback: if nothing is flagged featured, just show latest available cars.
  let cards = featured.docs
  if (cards.length === 0) {
    const latest = await payload.find({
      collection: 'vehicles',
      where: { status: { not_equals: 'Sold' } },
      limit: 3,
      depth: 1,
    })
    cards = latest.docs
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[var(--brand)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Used cars you can trust
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
            The right car, the honest way.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Every car on our forecourt is hand-picked and fully inspected before it goes up for
            sale. No pressure, no hidden costs — just quality cars and a straight answer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/stock"
              className="flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-6 py-3 font-semibold hover:opacity-90"
            >
              <Search size={18} /> Browse our stock
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"
            >
              Make an enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BLOCK */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Inspected before sale', body: 'Every vehicle is checked over by us before it reaches the forecourt.' },
            { icon: FileCheck2, title: 'Full history, no surprises', body: 'Clear service history and honest mileage on every car we list.' },
            { icon: Handshake, title: 'No pushy sales', body: 'Tell us what you need. We point you to the right car — or tell you straight if we haven’t got it.' },
          ].map((b, i) => (
            <Reveal key={i} delay={i * 100} className="rounded-xl border border-[var(--line)] p-6">
              <b.icon className="text-[var(--brand-accent)]" />
              <h3 className="mt-3 font-bold">{b.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED STOCK */}
      {cards.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-extrabold text-[var(--brand)]">In stock now</h2>
            <Link href="/stock" className="text-sm font-semibold text-[var(--brand-accent)] hover:underline">
              See all stock →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((v) => (
              <Reveal key={v.id}><VehicleCard vehicle={v} /></Reveal>
            ))}
          </div>
        </section>
      )}

      {/* RECENTLY SOLD - urgency */}
      {sold.docs.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--brand)]">Recently sold</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">These found new homes. The next one could be yours — don&apos;t miss out.</p>
            </div>
            <Link href="/sold" className="text-sm font-semibold text-[var(--brand-accent)] hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sold.docs.map((v) => (
              <Reveal key={v.id}><VehicleCard vehicle={v} /></Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
