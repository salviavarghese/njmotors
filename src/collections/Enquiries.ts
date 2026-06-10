import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'vehicle', 'createdAt'],
    group: 'Leads',
  },
  access: {
    // The public form needs to CREATE enquiries, so allow create for everyone.
    // Reading them is admin-only (no read: () => true here).
    create: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      name: 'vehicle',
      type: 'relationship',
      relationTo: 'vehicles',
      admin: { description: 'The car this enquiry is about (if any).' },
    },
  ],
  timestamps: true, // gives us createdAt automatically
}
