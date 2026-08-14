import type { GlobalConfig } from 'payload'

export const VolunteerPage: GlobalConfig = {
  slug: 'volunteer-page',
  admin: {
    description: 'Content for /volunteer. The featured "high need" card\u2019s interest form (Name/Email) is static UI, not wired to a backend yet — same caveat as the Contact and Prayer forms.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true, required: true },
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'subtext', type: 'textarea', localized: true, required: true },
        { name: 'buttonLabel', type: 'text', localized: true, required: true },
        { name: 'buttonHref', type: 'text', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'areas',
      type: 'array',
      label: 'Areas of Service',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'plain',
          options: [
            { label: 'Wide with image + Sign Up link', value: 'image' },
            { label: 'Plain card', value: 'plain' },
            { label: 'Featured with interest form', value: 'featured' },
          ],
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Worship', value: 'worship' },
            { label: 'Hospitality', value: 'hospitality' },
            { label: 'Outreach', value: 'outreach' },
            { label: 'Kids', value: 'kids' },
          ],
        },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_, siblingData) => siblingData?.variant === 'image' },
        },
        {
          name: 'signUpLabel',
          type: 'text',
          localized: true,
          admin: { condition: (_, siblingData) => siblingData?.variant === 'image' },
        },
        {
          name: 'signUpHref',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.variant === 'image' },
        },
        {
          name: 'highNeedLabel',
          type: 'text',
          localized: true,
          admin: {
            description: 'e.g. "High Need" — leave blank to hide the badge',
            condition: (_, siblingData) => siblingData?.variant === 'featured',
          },
        },
      ],
    },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea', localized: true, required: true },
        { name: 'reference', type: 'text', required: true },
      ],
    },
  ],
}
