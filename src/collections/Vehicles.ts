import type { CollectionConfig } from 'payload'

// Helper: turn "2019 BMW 320d M Sport" -> "2019-bmw-320d-m-sport"
const slugify = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // strip punctuation
    .trim()
    .replace(/[\s_-]+/g, '-') // spaces/underscores -> single hyphen

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'mileage', 'year'],
    group: 'Inventory',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.title && !data.slug) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "2019 BMW 320d M Sport"' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-filled from the title. Leave blank.',
      },
    },
    // --- Core identity ---
    {
      type: 'row',
      fields: [
        {
          name: 'make',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'BMW, Audi, Ford...' },
        },
        {
          name: 'model',
          type: 'text',
          required: true,
          admin: { width: '50%', description: '320d, A4, Focus...' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'variant', type: 'text', admin: { width: '50%', description: 'M Sport, S line... (optional)' } },
        { name: 'year', type: 'number', required: true, admin: { width: '50%' } },
      ],
    },
    // --- Money + condition ---
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', required: true, admin: { width: '50%', description: 'In £' } },
        { name: 'mileage', type: 'number', required: true, admin: { width: '50%' } },
      ],
    },
    // --- Spec selects ---
    {
      type: 'row',
      fields: [
        {
          name: 'fuelType',
          type: 'select',
          required: true,
          options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'PHEV', 'Mild Hybrid'],
          admin: { width: '50%' },
        },
        {
          name: 'transmission',
          type: 'select',
          required: true,
          options: ['Manual', 'Automatic'],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'bodyType',
          type: 'select',
          required: true,
          options: ['Hatchback', 'Saloon', 'Estate', 'SUV', 'Coupe', 'Convertible', 'MPV', 'Pickup', 'Van'],
          admin: { width: '50%' },
        },
        { name: 'colour', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'registration',
      type: 'text',
      admin: { description: 'Number plate, e.g. AB19 CDE' },
    },
    {
      type: 'row',
      fields: [
        { name: 'engineSize', type: 'number', admin: { width: '33%', description: 'Litres (optional)' } },
        { name: 'doors', type: 'number', admin: { width: '33%', description: '(optional)' } },
        { name: 'previousOwners', type: 'number', admin: { width: '34%', description: '(optional)' } },
      ],
    },
    {
      name: 'serviceHistory',
      type: 'select',
      options: ['Full', 'Part', 'None'],
      admin: { description: '(optional)' },
    },
    // Features and description 
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Feature', plural: 'Features' },
      fields: [{ name: 'feature', type: 'text', required: true }],
      admin: { description: 'e.g. "Heated seats", "Apple CarPlay"' },
    },
    {
      name: 'description',
      type: 'richText',
      admin: { description: 'Free-text write-up shown on the detail page.' },
    },
    // Images
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Image', plural: 'Images' },
      admin: { description: 'First image is the main/cover photo.' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    // Sidebar: the fields that control behaviour 
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'Available',
      options: ['Available', 'Reserved', 'Sold'],
      admin: {
        position: 'sidebar',
        description: 'Available/Reserved → Stock page. Sold → Recently Sold page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the homepage.' },
    },
    {
      name: 'warranty',
      type: 'select',
      options: ['None', '3 months', '6 months', '12 months'],
      admin: { position: 'sidebar', description: 'Warranty included.' },
    },
    {
      name: 'vatQualifying',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'VAT qualifying vehicle.' },
    },
    {
      name: 'soldPrice',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: '(optional)',
        condition: (data) => data?.status === 'Sold',
      },
    },
    {
      name: 'soldDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Used to order Recently Sold.',
        condition: (data) => data?.status === 'Sold',
      },
    },
  ],
}