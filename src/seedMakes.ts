import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

const MAKES: Record<string, string[]> = {
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'Q2', 'Q3', 'Q5', 'Q7', 'TT', 'e-tron'],
  BMW: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', 'X1', 'X3', 'X5', 'i4', 'M3'],
  Ford: ['Fiesta', 'Focus', 'Puma', 'Kuga', 'Mondeo', 'Mustang', 'Transit'],
  Volkswagen: ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc', 'ID.3', 'ID.4'],
  Mercedes: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'CLA'],
  Toyota: ['Aygo', 'Yaris', 'Corolla', 'C-HR', 'RAV4', 'Prius'],
  Vauxhall: ['Corsa', 'Astra', 'Mokka', 'Grandland', 'Crossland'],
  Nissan: ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf'],
  Honda: ['Jazz', 'Civic', 'CR-V', 'HR-V'],
  Hyundai: ['i10', 'i20', 'i30', 'Tucson', 'Kona', 'Ioniq'],
  Kia: ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Niro', 'EV6'],
  Peugeot: ['208', '308', '2008', '3008', '5008'],
  Renault: ['Clio', 'Captur', 'Megane', 'Kadjar'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  Mazda: ['Mazda2', 'Mazda3', 'CX-30', 'CX-5', 'MX-5'],
  Skoda: ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'],
  Seat: ['Ibiza', 'Leon', 'Arona', 'Ateca'],
  Land_Rover: ['Defender', 'Discovery', 'Range Rover', 'Range Rover Evoque'],
  Jaguar: ['XE', 'XF', 'F-Pace', 'E-Pace', 'I-Pace'],
  Volvo: ['XC40', 'XC60', 'XC90', 'V60', 'S60'],
  Mini: ['Hatch', 'Clubman', 'Countryman'],
  Fiat: ['500', 'Panda', 'Tipo'],
  Citroen: ['C1', 'C3', 'C4', 'C5 Aircross'],
  Suzuki: ['Swift', 'Vitara', 'Ignis'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
}

const run = async () => {
  const payload = await getPayload({ config })
  for (const [name, models] of Object.entries(MAKES)) {
    const cleanName = name.replace('_', ' ')
    // Skip if it already exists
    const existing = await payload.find({
      collection: 'makes',
      where: { name: { equals: cleanName } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`Skipped (exists): ${cleanName}`)
      continue
    }
    await payload.create({
      collection: 'makes',
      data: { name: cleanName, models: models.map((m) => ({ model: m })) },
    })
    console.log(`Added: ${cleanName}`)
  }
  console.log('Done.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
