import { getPayloadClient } from '@/lib/payload'
import VehicleCard from '@/components/VehicleCard'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'Recently Sold Cars | NJ Motors Peterborough' },
  description:
    'A look at cars NJ Motors has recently sold in Peterborough. Our stock moves fast — get in touch early.',
  }

async function getSold() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'vehicles',
      where: { status: { equals: 'Sold' } },
      sort: '-soldDate',
      limit: 50,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

export default async function SoldPage() {
  const docs = await getSold()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[var(--brand)]">Recently sold</h1>
      <p className="mt-1 max-w-xl text-[var(--muted)]">
        These have all found new owners. Our stock moves quickly — if you see something you like on
        our forecourt, don&apos;t wait around.
      </p>
      {docs.length === 0 ? (
        <p className="mt-12 text-[var(--muted)]">Nothing here yet — check back soon.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      )}
    </div>
  )
}