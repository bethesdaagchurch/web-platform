import type { CollectionConfig } from 'payload'

export const LeadershipInterests: CollectionConfig = {
  slug: 'leadership-interests',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'areaOfInterest', 'status', 'createdAt'],
    description: 'Submissions from Ministries\u2019 members-only "Interested in Leading?" form. Unlike the other submission collections, create itself requires a real member session, not just public access — matching the UI gate all the way through.',
  },
  access: {
    // Only a logged-in Member can create — mirrors the MembersOnlyGate in
    // the UI rather than leaving the API more permissive than the page.
    create: ({ req }) => req.user?.collection === 'members',
    // Admins see everything; a member sees only their own submissions —
    // same per-document query-constraint pattern as JoinRequests, which
    // is what powers this showing up on a member's own Dashboard.
    read: ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'members') return { submittedByMember: { equals: req.user.id } }
      return false
    },
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'areaOfInterest', type: 'text', required: true },
    {
      name: 'submittedByMember',
      type: 'relationship',
      relationTo: 'members',
      admin: { readOnly: true, description: 'Set automatically from the logged-in session — never trusted from client input.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Placed', value: 'placed' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user?.collection === 'members') {
          data.submittedByMember = req.user.id
        }
        return data
      },
    ],
  },
}
