import type { GlobalConfig } from 'payload'

export const DirectionsPage: GlobalConfig = {
  slug: 'directions-page',
  admin: {
    description: 'Content for /directions. Address, phone, and email are NOT here — they come from Site Settings, so there\u2019s one place to update them, not two.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'subtext', type: 'textarea', localized: true, required: true },
      ],
    },
    {
      name: 'serviceTimes',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'time', type: 'text', required: true },
      ],
    },
    {
      name: 'needHelp',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
      ],
    },
    {
      name: 'drivingDirections',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true, admin: { description: 'e.g. "From the North (City Center)"' } },
        { name: 'text', type: 'textarea', localized: true, required: true },
      ],
    },
    {
      name: 'parkingItems',
      type: 'array',
      label: 'Parking & Accessibility items',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Car', value: 'car' },
            { label: 'Accessibility', value: 'accessibility' },
            { label: 'Bus', value: 'bus' },
          ],
        },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
      ],
    },
  ],
}
