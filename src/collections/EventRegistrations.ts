import type { CollectionConfig } from 'payload'

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'event', 'numberOfAttendees', 'status', 'createdAt'],
    description:
      'Real event registrations, member-only. Unlike the other submission collections, both read and update are restricted per-document — a member can only see/cancel their own registrations, not everyone\u2019s.',
  },
  access: {
    // Only a logged-in Member can register — mirrors LeadershipInterests'
    // reasoning: the UI gate (MembersOnlyGate on the registration form)
    // shouldn't be the only thing enforcing this.
    create: ({ req }) => req.user?.collection === 'members',
    // Admins see everything; a member sees only documents where `member`
    // matches their own session — Payload accepts a query constraint
    // object here instead of a plain boolean, which is what actually
    // powers "my registered events" on the Dashboard without needing a
    // separate members-only API route.
    read: ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'members') return { member: { equals: req.user.id } }
      return false
    },
    // Same per-document restriction for update — this is what lets a
    // member cancel (set status to 'cancelled') their own registration
    // without being able to touch anyone else's.
    update: ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'members') return { member: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      admin: { readOnly: true, description: 'Set automatically from the logged-in session — never trusted from client input.' },
    },
    { name: 'event', type: 'relationship', relationTo: 'events', required: true },
    // Snapshotted at registration time rather than always reading live off
    // the member relationship — keeps a true historical record even if
    // the member later changes their details, and lets admins scan the
    // list without needing to expand each relationship. Pre-filled from
    // the member's session on the form, but editable there in case
    // they're registering with different contact details than their
    // account (e.g. a family phone number).
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    {
      name: 'numberOfAttendees',
      type: 'select',
      required: true,
      defaultValue: '1',
      options: [
        { label: '1 (Just me)', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5+', value: '5+' },
      ],
    },
    { name: 'specialRequests', type: 'textarea', admin: { description: 'Dietary requirements or other special requests \u2014 optional.' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'registered',
      options: [
        { label: 'Registered', value: 'registered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user?.collection === 'members') {
          data.member = req.user.id
        }
        return data
      },
    ],
  },
}
