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
  hooks: {
    beforeChange: [
      ({ data }) => {
        // assignedMembers alone powers "My Serving Schedule" on a
        // member's Dashboard (a direct { assignedMembers: { in: [id] } }
        // query — see dashboard/page.tsx) — kept as a single field
        // specifically so that query stays a simple, fast lookup rather
        // than an OR across five separate relationship fields.
        //
        // Now fully internal (admin.hidden below) rather than something
        // an admin ever touches directly. Originally a manually-edited
        // catch-all, but once every realistic serving role — translator,
        // leader, choir, every special item person — had its own
        // dedicated field, having admins also maintain this one by hand
        // was redundant and, by their own account, confusing ("not sure
        // why we need this field"). Automatically merges every one of
        // those specific fields, plus whatever's manually added under
        // "Other Members Serving" (otherMembersServing) for roles with
        // no dedicated field of their own — sound techs, greeters, and
        // the like — deduplicated so nobody appears twice.
        const toId = (v: unknown): number | undefined => {
          if (typeof v === 'number') return v
          if (v && typeof v === 'object' && 'id' in v) return Number((v as { id: number }).id)
          return undefined
        }
        const toIds = (v: unknown): number[] => {
          if (!Array.isArray(v)) return []
          return v.map(toId).filter((id): id is number => id !== undefined)
        }

        const translatorId = toId(data.sermon?.translator)
        const leaderId = toId(data.worshipTeam?.leaderName)
        const choirIds = toIds(data.worshipTeam?.choirTeam)
        const specialItemIds = (data.specialItems ?? []).flatMap((item: { personName?: unknown }) => toIds(item?.personName))
        const otherIds = toIds(data.otherMembersServing)

        const merged = [
          ...new Set([
            ...(translatorId !== undefined ? [translatorId] : []),
            ...(leaderId !== undefined ? [leaderId] : []),
            ...choirIds,
            ...specialItemIds,
            ...otherIds,
          ]),
        ]
        data.assignedMembers = merged
        return data
      },
    ],
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
        {
          name: 'translator',
          type: 'relationship',
          relationTo: 'members',
          admin: { description: 'Optional. Select the member translating for this service, if any.' },
        },
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
        {
          name: 'leaderName',
          type: 'relationship',
          relationTo: 'members',
          required: true,
          admin: { description: 'Select the member leading worship for this entry.' },
        },
        {
          name: 'choirTeam',
          type: 'relationship',
          relationTo: 'members',
          hasMany: true,
          admin: { description: 'Optional. Select every member singing on the choir team for this entry.' },
        },
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
      name: 'otherMembersServing',
      type: 'relationship',
      relationTo: 'members',
      hasMany: true,
      admin: {
        description:
          'For anyone serving in a role with no dedicated field above \u2014 a sound tech, a greeter, and so on. Only ever contains exactly who\u2019s added here manually; the worship leader, choir, translator, and special-item people are already tracked automatically and don\u2019t need re-adding.',
      },
    },
    {
      name: 'assignedMembers',
      type: 'relationship',
      relationTo: 'members',
      hasMany: true,
      admin: {
        hidden: true,
        description:
          'Internal only \u2014 automatically derived from every serving-role field above (translator, leader, choir, special items, other members serving) on every save. Powers "My Serving Schedule" on a member\u2019s Dashboard. Not meant for direct editing; add people to the specific role field they actually serve in instead.',
      },
    },
    {
      name: 'specialItems',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Offering Song"' } },
        {
          name: 'personName',
          type: 'relationship',
          relationTo: 'members',
          hasMany: true,
          required: true,
          admin: { description: 'Select every member serving in this role \u2014 more than one is fine, e.g. two vocalists on the same song.' },
        },
        { name: 'roleLabel', type: 'text', admin: { description: 'e.g. "Vocalist" — optional' } },
      ],
    },
  ],
}
