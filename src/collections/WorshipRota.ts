import type { CollectionConfig } from 'payload'

export const WorshipRota: CollectionConfig = {
  slug: 'worship-rota',
  admin: { useAsTitle: 'date', defaultColumns: ['date', 'ministry', 'sermon'] },
  access: {
    // Unlike Sermons/Events/Ministries (public read), rota entries are
    // internal scheduling info. Requiring a session here means the raw
    // REST/GraphQL API isn't scrapable by an anonymous visitor — on top
    // of the page itself hard-redirecting logged-out visitors to /login.
    // Note: server-rendered pages use Payload's Local API, which bypasses
    // access control by default (documented Payload behavior) — this
    // specifically protects the public-facing API, not our own page's
    // server-side fetch.
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'date', type: 'date', required: true },
    {
      name: 'ministry',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Main Service" — powers the Ministry filter dropdown, derived automatically from existing entries rather than a fixed list.' },
    },
    { name: 'serviceTime', type: 'text', required: true, admin: { description: 'e.g. "10:00 AM"' } },
    {
      name: 'sermon',
      type: 'group',
      fields: [
        { name: 'speakerName', type: 'text', required: true },
        { name: 'speakerPhoto', type: 'upload', relationTo: 'media' },
        { name: 'isGuest', type: 'checkbox', defaultValue: false, admin: { description: 'Shows "(Guest)" next to the name' } },
        { name: 'title', type: 'text', required: true, admin: { description: 'Sermon title or topic' } },
      ],
    },
    {
      name: 'worshipTeam',
      type: 'group',
      fields: [
        { name: 'teamName', type: 'text', required: true },
        { name: 'leaderName', type: 'text', required: true },
        { name: 'badge', type: 'text', admin: { description: 'Optional small pill, e.g. "Full Ensemble"' } },
        {
          name: 'members',
          type: 'array',
          maxRows: 12,
          admin: { description: 'Team member photos — the page shows up to 3 with a "+N" overflow for the rest.' },
          fields: [{ name: 'photo', type: 'upload', relationTo: 'media', required: true }],
        },
      ],
    },
    {
      name: 'assignedMembers',
      type: 'relationship',
      relationTo: 'members',
      hasMany: true,
      admin: {
        description:
          'Real member accounts serving on this rota entry (leader, team, or anyone else scheduled) — separate from the photo-only team display above. This is what powers "my serving schedule" on a member\u2019s Dashboard; the photo grid is purely visual and doesn\u2019t need to match this list exactly.',
      },
    },
    {
      name: 'specialItems',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Offering Song"' } },
        { name: 'personName', type: 'text', required: true },
        { name: 'roleLabel', type: 'text', admin: { description: 'e.g. "Vocalist" — optional' } },
      ],
    },
  ],
}
