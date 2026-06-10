import Link from 'next/link'
import Image from 'next/image'
import { Gauge, Fuel, Cog, Calendar } from 'lucide-react'
import { formatPrice, formatMiles, getCoverUrl } from '@/lib/format'
import type { Vehicle } from '@/payload-types'

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const cover = getCoverUrl(vehicle.images as any, 'card')
  const sold = vehicle.status === 'Sold'

  return (
    <Link
      href={`/stock/${vehicle.slug}`}
      className="group block overflow-hidden rounded-xl border border-[var(--line)] bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-[var(--bg-soft)]">
        {cover ? (
          <Image
            src={cover}
            alt={vehicle.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-[var(--muted)]">No photo</div>
        )}
        {/* Status badge */}
        {vehicle.status !== 'Available' && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${
              sold ? 'bg-black/80' : 'bg-amber-500'
            }`}
          >
            {vehicle.status}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold leading-tight text-[var(--ink)]">{vehicle.title}</h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1"><Calendar size={13} />{vehicle.year}</span>
          <span className="flex items-center gap-1"><Gauge size={13} />{formatMiles(vehicle.mileage)}</span>
          <span className="flex items-center gap-1"><Fuel size={13} />{vehicle.fuelType}</span>
          <span className="flex items-center gap-1"><Cog size={13} />{vehicle.transmission}</span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          {/* Price is never hidden (CRO rule) */}
          <span className="text-xl font-extrabold text-[var(--brand)]">
            {sold && vehicle.soldPrice ? formatPrice(vehicle.soldPrice) : formatPrice(vehicle.price)}
          </span>
          <span className="text-sm font-semibold text-[var(--brand-accent)] group-hover:underline">
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}
