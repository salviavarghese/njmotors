import { getPayloadClient } from '@/lib/payload'
import VehicleCard from '@/components/VehicleCard'
import type { Metadata } from 'next'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Used Cars in Stock',
  description:
    'Browse our current range of quality used cars. Full specs, clear pricing and honest history on every vehicle. Find your next car with NJ Motors.',
}

type SearchParams = Promise<{ [k: string]: string | undefined }>

export default async function StockPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const payload = await getPayloadClient()

  // Build the Payload query from filter params.
  const and: Where[] = [{ status: { not_equals: 'Sold' } }]
  if (sp.make) and.push({ make: { equals: sp.make } })
  if (sp.fuel) and.push({ fuelType: { equals: sp.fuel } })
  if (sp.transmission) and.push({ transmission: { equals: sp.transmission } })
  if (sp.maxPrice) and.push({ price: { less_than_equal: Number(sp.maxPrice) } })

  const result = await payload.find({
    collection: 'vehicles',
    where: { and },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })

  // Distinct makes for the filter dropdown.
  const allAvailable = await payload.find({
    collection: 'vehicles',
    where: { status: { not_equals: 'Sold' } },
    limit: 200,
    depth: 0,
  })
  const makes = [...new Set(allAvailable.docs.map((v) => v.make))].sort()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[var(--brand)]">Cars in stock</h1>
      <p className="mt-1 text-[var(--muted)]">
        {result.totalDocs} {result.totalDocs === 1 ? 'car' : 'cars'} available right now.
      </p>

      {/* FILTERS - plain GET form, no JS needed */}
      <form className="mt-6 grid gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] p-4 sm:grid-cols-4">
        <select name="make" defaultValue={sp.make || ''} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
          <option value="">Any make</option>
          {makes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="fuel" defaultValue={sp.fuel || ''} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
          <option value="">Any fuel</option>
          {['Petrol', 'Diesel', 'Hybrid', 'Electric', 'PHEV'].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select name="transmission" defaultValue={sp.transmission || ''} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
          <option value="">Any gearbox</option>
          {['Manual', 'Automatic'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex gap-2">
          <input
            name="maxPrice"
            type="number"
            placeholder="Max £"
            defaultValue={sp.maxPrice || ''}
            className="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white">Filter</button>
        </div>
      </form>

      {result.docs.length === 0 ? (
        <p className="mt-12 text-center text-[var(--muted)]">
          No cars match those filters right now. <a href="/stock" className="text-[var(--brand-accent)] underline">Clear filters</a> or
          {' '}<a href="/contact" className="text-[var(--brand-accent)] underline">tell us what you&apos;re after</a>.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.docs.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      )}
    </div>
  )
}
