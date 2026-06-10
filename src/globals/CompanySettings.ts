import type { GlobalConfig } from 'payload'

// A Global = one single editable record (not a list). Perfect for site-wide
// contact details so they aren't hardcoded across pages.
export const CompanySettings: GlobalConfig = {
  slug: 'company-settings',
  access: { read: () => true },
  admin: { group: 'System' },
  fields: [
    { name: 'companyName', type: 'text', defaultValue: 'NJ Motors' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'textarea' },
    {
      name: 'openingHours',
      type: 'array',
      fields: [
        { name: 'days', type: 'text', admin: { description: 'e.g. "Mon–Fri"' } },
        { name: 'hours', type: 'text', admin: { description: 'e.g. "9:00–18:00"' } },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'whatsapp', type: 'text', admin: { description: 'Number in international format, e.g. 447123456789' } },
      ],
    },
  ],
}
