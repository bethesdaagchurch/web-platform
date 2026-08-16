import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    description: 'Site-wide identity, contact info, and office hours — used on the Footer, Contact page, Give page, and Homepage Visit Us section.',
  },
  fields: [
    { name: 'churchName', type: 'text', required: true },
    { name: 'tagline', type: 'textarea', localized: true, required: true },
    {
      name: 'address',
      type: 'array',
      label: 'Address lines',
      minRows: 1,
      maxRows: 4,
      fields: [{ name: 'line', type: 'text', required: true }],
    },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'mapEmbedUrl', type: 'text', admin: { description: 'Optional — leave blank to auto-generate a working map from the address above. Only paste a Google Maps embed URL here if you want a more precisely placed pin (Google Maps > Share > Embed a map > copy the src from the iframe code).' } },
    {
      name: 'officeHours',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'hours', type: 'text', required: true },
        { name: 'highlight', type: 'checkbox', defaultValue: false, admin: { description: 'Styles this row gold, e.g. for Sunday services' } },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
  ],
}
