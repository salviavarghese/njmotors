import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://njmotors.vercel.app'

  const staticPages = ['', '/stock', '/sold', '/about', '/contact'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }))


  try {
    const payload = await getPayloadClient()
    const vehicles = await payload.find({ collection: 'vehicles', limit: 200, depth: 0 })
    const vehiclePages = vehicles.docs
      .filter((v) => v.slug)
      .map((v) => ({ url: `${base}/stock/${v.slug}`, lastModified: new Date(v.updatedAt) }))
    return [...staticPages, ...vehiclePages]
  } catch {
    return staticPages
  }
}