/**
 * Seed script: inserts a few sample cars so you have data to build against.
 * Run with:  npm run seed
 *
 * It downloads stock car photos, uploads them to your Media collection (which
 * goes to Vercel Blob), then creates vehicles referencing them.
 * Safe to run once. Re-running will create duplicates.
 */
import { getPayload } from 'payload'
import config from './payload.config'

const SAMPLES = [
  {
    title: '2019 BMW 320d M Sport',
    make: 'BMW', model: '320d', variant: 'M Sport', year: 2019,
    price: 16995, mileage: 42000, fuelType: 'Diesel', transmission: 'Automatic',
    bodyType: 'Saloon', colour: 'Black Sapphire', engineSize: 2, doors: 4,
    previousOwners: 1, serviceHistory: 'Full', featured: true, status: 'Available',
    features: ['Heated seats', 'Apple CarPlay', 'Sat nav', 'Parking sensors'],
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80',
  },
  {
    title: '2020 Audi A4 S Line',
    make: 'Audi', model: 'A4', variant: 'S Line', year: 2020,
    price: 18450, mileage: 31500, fuelType: 'Petrol', transmission: 'Automatic',
    bodyType: 'Saloon', colour: 'Glacier White', engineSize: 2, doors: 4,
    previousOwners: 1, serviceHistory: 'Full', featured: true, status: 'Available',
    features: ['Virtual cockpit', 'LED headlights', 'Bang & Olufsen audio'],
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
  },
  {
    title: '2018 Ford Focus ST-Line',
    make: 'Ford', model: 'Focus', variant: 'ST-Line', year: 2018,
    price: 11250, mileage: 56000, fuelType: 'Petrol', transmission: 'Manual',
    bodyType: 'Hatchback', colour: 'Race Red', engineSize: 1, doors: 5,
    previousOwners: 2, serviceHistory: 'Part', featured: true, status: 'Available',
    features: ['Cruise control', 'DAB radio', 'Alloy wheels'],
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
  },
  {
    title: '2021 Tesla Model 3 Long Range',
    make: 'Tesla', model: 'Model 3', variant: 'Long Range', year: 2021,
    price: 24990, mileage: 28000, fuelType: 'Electric', transmission: 'Automatic',
    bodyType: 'Saloon', doors: 4, colour: 'Pearl White',
    previousOwners: 1, serviceHistory: 'Full', featured: false, status: 'Sold',
    soldPrice: 24500, soldDate: new Date().toISOString(),
    features: ['Autopilot', 'Glass roof', 'Heated seats'],
    img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80',
  },
]

const run = async () => {
  const payload = await getPayload({ config })

  // Make sure there's an admin user — create one if the DB is empty.
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@njmotors.test', password: 'changeme123' },
    })
    console.log('Created admin user: admin@njmotors.test / changeme123')
  }

  for (const s of SAMPLES) {
    const { img, features, ...data } = s
    // Download the photo and upload to Media
    let mediaId: number | string | undefined
    try {
      const resp = await fetch(img)
      const buf = Buffer.from(await resp.arrayBuffer())
      const media = await payload.create({
        collection: 'media',
        data: { alt: data.title },
        file: {
          data: buf,
          mimetype: 'image/jpeg',
          name: `${data.make}-${data.model}.jpg`.toLowerCase(),
          size: buf.length,
        },
      })
      mediaId = media.id
    } catch (e) {
      console.warn(`Could not upload image for ${data.title}:`, e)
    }

    await payload.create({
      collection: 'vehicles',
      data: {
        ...(data as any),
        features: features.map((f) => ({ feature: f })),
        images: mediaId ? [{ image: mediaId }] : [],
      },
    })
    console.log(`Seeded: ${data.title}`)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
