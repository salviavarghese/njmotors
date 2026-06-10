import config from '@payload-config'
import { getPayload } from 'payload'

// Cache a single Payload instance across requests in dev/serverless.
let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export const getPayloadClient = async () => {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}

export const getCompanySettings = async () => {
  // The company-settings table may not exist yet on a fresh database (first
  // deploy). If the query fails, return null so pages can still render.
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'company-settings' })
  } catch {
    return null
  }
}
