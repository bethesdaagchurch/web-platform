import type { CollectionConfig } from 'payload'

export const Ministries: CollectionConfig = {
  slug: 'ministries',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { description: 'URL segment, e.g. "youth" for /ministries/youth' } },
    { name: 'description', type: 'textarea', localized: true, required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: [
        { label: 'Youth (rocket)', value: 'youth' },
        { label: 'Children (smile)', value: 'children' },
        { label: 'Women', value: 'women' },
        { label: 'Men', value: 'men' },
        { label: 'Worship (music)', value: 'worship' },
        { label: 'Outreach (hands)', value: 'outreach' },
        { label: 'Groups', value: 'groups' },
      ],
      admin: { description: 'Icon shown in the homepage "Find Your Place" band — separate from the filter categories below.' },
    },
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Adults', value: 'adults' },
        { label: 'Kids & Youth', value: 'kids-youth' },
        { label: 'Service', value: 'service' },
      ],
      admin: { description: 'A ministry can belong to more than one filter category' },
    },
    { name: 'ctaLabel', type: 'text', localized: true, defaultValue: 'Join Ministry' },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
      admin: { description: 'Powers a real mailto: link on "Join Ministry" — clicking it opens the visitor\u2019s email client to reach out directly, same pattern as Groups\u2019 "Join Group".' },
    },
  ],
}
