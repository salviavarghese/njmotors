import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // public site must be able to load images
  },
  admin: { group: 'Inventory' },
  upload: {
    // alt text is good for accessibility + SEO (people Google car images)
    // Sizes generate responsive variants so the stock grid loads fast.
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'large', width: 1400, height: undefined, position: 'centre' },
    ],
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Describe the image, e.g. "Front view of blue BMW 320d".' },
    },
  ],
}
