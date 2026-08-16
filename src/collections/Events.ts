import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'startDate'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL segment, e.g. "awaken-2026" for /events/awaken-2026 \u2014 lowercase, hyphens instead of spaces, no punctuation.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Youth', value: 'youth' },
        { label: 'Missions', value: 'missions' },
        { label: 'Conferences', value: 'conferences' },
        { label: 'Worship', value: 'worship' },
      ],
      admin: { description: 'Drives the filter, the badge color/label, and the calendar — no separate fields needed for those.' },
    },
    { name: 'startDate', type: 'date', required: true },
    {
      name: 'endDate',
      type: 'date',
      admin: { description: 'Leave blank for a single-day event. Setting this marks every day in the range gold on the calendar (multi-day conference/retreat) instead of a single navy dot.' },
    },
    { name: 'time', type: 'text', localized: true, required: true, admin: { description: 'e.g. "7:00 PM - 9:00 PM" or "All Day"' } },
    { name: 'location', type: 'text', localized: true, required: true },
    {
      name: 'cost',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "Free Registration" or "$25 per person" — shown on the event detail page\u2019s info bar.' },
    },
    { name: 'description', type: 'textarea', localized: true, required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Not shown on the /events archive card itself, but used by the Homepage\'s "Upcoming at Bethesda" cards.' },
    },
    {
      name: 'actions',
      type: 'array',
      label: 'Buttons',
      minRows: 1,
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'solid',
          options: [
            { label: 'Solid (navy)', value: 'solid' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
    {
      name: 'requiresRegistration',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'When checked, the event detail page shows a real, members-only registration form (name/email pre-filled from the session, an explicit attendance confirmation, and a real record members can see and cancel from their Dashboard) instead of just the Buttons above. Leave unchecked for events that only need an informational link — e.g. "Learn More" pointing somewhere external.',
      },
    },
  ],
}
