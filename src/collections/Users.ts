import type { CollectionConfig } from 'payload'

// The owner's login. auth: true gives email/password + the /admin login.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'System' },
  auth: true,
  fields: [],
}
