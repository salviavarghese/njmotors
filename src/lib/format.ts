export const formatPrice = (n?: number | null): string =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0,
      }).format(n)
    : 'POA'

export const formatMiles = (n?: number | null): string =>
  typeof n === 'number' ? `${new Intl.NumberFormat('en-GB').format(n)} miles` : '—'

export const formatDate = (d?: string | null): string =>
  d ? new Date(d).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : ''

// Pull a usable image URL from a Vehicle's images array.
// Each row is { image: <Media doc or id> }. We want the first one's URL.
type MediaLike = { url?: string | null; sizes?: Record<string, { url?: string | null }> }
export const getCoverUrl = (images?: { image?: MediaLike | string }[], size?: string): string | null => {
  const first = images?.[0]?.image
  if (!first || typeof first === 'string') return null
  if (size && first.sizes?.[size]?.url) return first.sizes[size]!.url ?? null
  return first.url ?? null
}
