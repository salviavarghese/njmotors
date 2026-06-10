import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { formatPrice, formatMiles, getCoverUrl } from '@/lib/format'
import EnquiryForm from '@/components/EnquiryForm'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

async function getVehicle(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'vehicles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] || null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const v = await getVehicle(slug)
  if (!v) return { title: 'Car not found' }
  return {
    title: `${v.title} — ${formatPrice(v.price)}`,
    description: `${v.year} ${v.make} ${v.model} for sale at NJ Motors. ${formatMiles(
      v.mileage,
    )}, ${v.fuelType}, ${v.transmission}. ${formatPrice(v.price)}. Enquire today.`,
  }
}

export default async function VehicleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const v = await getVehicle(slug)
  if (!v) notFound()

  const images = (v.images as any[]) || []
  const cover = getCoverUrl(images, 'large')

  const specs: [string, string | number | null | undefined][] = [
    ['Year', v.year],
    ['Mileage', formatMiles(v.mileage)],
    ['Fuel', v.fuelType],
    ['Transmission', v.transmission],
    ['Body', v.bodyType],
    ['Colour', v.colour],
    ['Registration', v.registration],
    ['Engine', v.engineSize ? `${v.engineSize}L` : null],
    ['Doors', v.doors],
    ['Owners', v.previousOwners],
    ['Service history', v.serviceHistory],
    ['Warranty', v.warranty],
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <a href="/stock" className="text-sm text-[var(--brand-accent)] hover:underline">← Back to stock</a>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* LEFT: gallery + specs */}
        <div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-[var(--bg-soft)]">
            {cover ? (
              <Image src={cover} alt={v.title} fill sizes="66vw" className="object-cover" priority />
            ) : (
              <div className="grid h-full place-items-center text-[var(--muted)]">No photo</div>
            )}
            {v.status !== 'Available' && (
              <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-sm font-bold text-white">
                {v.status}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(0, 10).map((row, i) => {
                const url = getCoverUrl([row], 'thumbnail')
                return url ? (
                  <div key={i} className="relative aspect-[3/2] overflow-hidden rounded-lg bg-[var(--bg-soft)]">
                    <Image src={url} alt={`${v.title} photo ${i + 1}`} fill sizes="20vw" className="object-cover" />
                  </div>
                ) : null
              })}
            </div>
          )}

          {/* Description */}
          {v.description && (
            <div className="prose mt-8 max-w-none text-[var(--ink)]">
              <h2 className="text-xl font-bold text-[var(--brand)]">About this car</h2>
              <RichText data={v.description as any} />
            </div>
          )}

          {/* Spec table */}
          <h2 className="mt-8 text-xl font-bold text-[var(--brand)]">Specification</h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
            {specs
              .filter(([, val]) => val !== null && val !== undefined && val !== '')
              .map(([label, val]) => (
                <div key={label} className="flex justify-between border-b border-[var(--line)] py-2 text-sm">
                  <dt className="text-[var(--muted)]">{label}</dt>
                  <dd className="font-semibold">{val}</dd>
                </div>
              ))}
          </dl>

          {/* Features */}
          {v.features && v.features.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-bold text-[var(--brand)]">Features</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {v.features.map((f: any, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-[var(--brand-accent)]" /> {f.feature}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* RIGHT: sticky price + enquiry (the one obvious action) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-[var(--line)] p-5">
            <h1 className="text-2xl font-extrabold text-[var(--brand)]">{v.title}</h1>
            <p className="mt-2 text-3xl font-extrabold text-[var(--brand-accent)]">{formatPrice(v.price)}</p>
            <ul className="mt-4 space-y-1 text-sm text-[var(--muted)]">
              {v.previousOwners ? <li className="flex items-center gap-2"><Check size={14} /> {v.previousOwners} previous owner{v.previousOwners > 1 ? 's' : ''}</li> : null}
              {v.serviceHistory ? <li className="flex items-center gap-2"><Check size={14} /> {v.serviceHistory} service history</li> : null}
              <li className="flex items-center gap-2"><Check size={14} /> Inspected before sale</li>
            </ul>
          </div>

          <div className="mt-4">
            <EnquiryForm
              vehicleId={String(v.id)}
              vehicleTitle={v.title}
              intro="Send us your details and we'll get straight back to you about this car."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
