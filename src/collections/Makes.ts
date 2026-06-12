import type { CollectionConfig } from 'payload'

export const Makes: CollectionConfig = {
  slug: 'makes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
    group: 'Inventory',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. BMW, Audi, Ford' },
    },
    {
      name: 'models',
      type: 'array',
      labels: { singular: 'Model', plural: 'Models' },
      admin: { description: 'All models for this make, e.g. 320d, A4, Focus' },
      fields: [{ name: 'model', type: 'text', required: true }],
    },
  ],
}