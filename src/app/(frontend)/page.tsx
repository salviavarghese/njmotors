import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, FileText, ThumbsUp } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import VehicleCard from '@/components/VehicleCard'
import Reveal from '@/components/Reveal'
import type { Vehicle } from '@/payload-types'

export const metadata: Metadata = {
  title: { absolute: 'NJ Motors — Quality Used Cars in Peterborough' },
  description:
    'Hand-picked, fully inspected used cars from NJ Motors in Peterborough. Browse current stock, see recently sold vehicles, and enquire today. Honest pricing, no pressure.',
}

async function getFeatured(): Promise<Vehicle[]> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'vehicles',
      where: { and: [{ featured: { equals: true } }, { status: { not_equals: 'Sold' } }] },
      sort: '-createdAt',
      limit: 6,
      depth: 2,
    })
    return res.docs as Vehicle[]
  } catch {
    return []
  }
}

async function getRecentlySold(): Promise<Vehicle[]> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'vehicles',
      where: { status: { equals: 'Sold' } },
      sort: '-soldDate',
      limit: 3,
      depth: 2,
    })
    return res.docs as Vehicle[]
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featured, sold] = await Promise.all([getFeatured(), getRecentlySold()])

  return (
    <>
      {/* 1 — HERO */}
      <section className="bg-[var(--brand)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-accent)]">
            Used cars you can trust
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
            The right car, the honest way.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Every car on our forecourt is hand-picked and fully inspected before it goes up for
            sale. No pressure, no hidden costs — just quality cars and a straight answer.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/stock"
              className="rounded-full bg-[var(--brand-accent)] px-7 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Browse our stock
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Make an enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — TRUST BLOCK */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--line)] p-6">
            <ShieldCheck className="text-[var(--brand-accent)]" />
            <h3 className="mt-3 font-bold">Inspected before sale</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Every vehicle is checked over by us before it reaches the forecourt.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] p-6">
            <FileText className="text-[var(--brand-accent)]" />
            <h3 className="mt-3 font-bold">Full history, no surprises</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Clear service history and honest mileage on every car we list.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] p-6">
            <ThumbsUp className="text-[var(--brand-accent)]" />
            <h3 className="mt-3 font-bold">No pushy sales</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Tell us what you need. We&apos;ll point you to the right car — or tell you straight if
              we haven&apos;t got it.
            </p>
          </div>
        </Reveal>
      </section>

      {/* 3 — FEATURED STOCK */}
      {featured.length > 0 && (
        <section className="bg-[var(--bg-soft)] py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-extrabold text-[var(--brand)] md:text-3xl">In stock now</h2>
              <Link href="/stock" className="font-semibold text-[var(--brand-accent)] hover:underline">
                See all stock →
              </Link>
            </div>
            <Reveal className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* 4 — WHY BUY FROM US */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-[var(--brand)] md:text-3xl">
            Why buy from NJ Motors
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--ink)]">
            Buying a used car shouldn&apos;t feel like a gamble. We hand-pick every car, check it
            over properly, and price it fairly — then we tell you everything we know about it. What
            you see is what you get. If a car isn&apos;t right for you, we&apos;ll say so. We&apos;d
            rather you came back than sell you the wrong thing once.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-[var(--muted)]">
            <span>Hand-picked stock</span>
            <span>Fully inspected</span>
            <span>Honest, upfront pricing</span>
            <span>No-pressure approach</span>
          </div>
        </Reveal>
      </section>

      {/* 5 — RECENTLY SOLD */}
      {sold.length > 0 && (
        <section className="bg-[var(--bg-soft)] py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--brand)] md:text-3xl">Recently sold</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  These found new homes. The next one could be yours — don&apos;t miss out.
                </p>
              </div>
              <Link href="/sold" className="font-semibold text-[var(--brand-accent)] hover:underline">
                View all →
              </Link>
            </div>
            <Reveal className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sold.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* 6 — CONTACT CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-2xl bg-[var(--brand)] px-6 py-14 text-center text-white">
          <h2 className="text-2xl font-extrabold md:text-3xl">Found one you like?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">
            Send us a quick message and we&apos;ll get straight back to you — usually the same day.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-[var(--brand-accent)] px-8 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Make an enquiry
          </Link>
        </div>
      </section>
    </>
  )
}