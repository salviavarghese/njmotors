import config from '@payload-config'
import { getPayload } from 'payload'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export const getPayloadClient = async () => {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}

export const getCompanySettings = async () => {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'company-settings' })
  } catch {
    return null
  }
}
