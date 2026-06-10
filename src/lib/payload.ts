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
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'company-settings' })
}
