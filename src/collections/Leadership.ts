import type { CollectionConfig } from 'payload'

export const Leadership: CollectionConfig = {
  slug: 'leadership',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { description: 'URL segment for the bio page, e.g. "david-mitchell" for /about/david-mitchell' } },
    { name: 'roleLabel', type: 'text', localized: true, required: true, admin: { description: 'e.g. "Lead Pastor"' } },
    { name: 'photo', type: 'upload', relationTo: 'media', required: true },
    { name: 'bio', type: 'textarea', localized: true, required: true },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'photo-top',
      options: [
        { label: 'Photo left (wide card)', value: 'photo-left' },
        { label: 'Photo top (standard card)', value: 'photo-top' },
        { label: 'Avatar (text-only card)', value: 'avatar' },
      ],
      admin: { description: 'Controls which of the three card layouts renders on the About page bento grid.' },
    },
    { name: 'hasFullBio', type: 'checkbox', defaultValue: false, admin: { description: 'Shows a "Read Full Bio" link pointing at this person\'s /about/[slug] page.' } },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Controls bento-grid position. The current layout assumes exactly 4 leaders (positions 0-3); revisit the layout if the team grows beyond that.' },
    },
  ],
}
