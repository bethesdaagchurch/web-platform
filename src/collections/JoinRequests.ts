import type { CollectionConfig } from 'payload'

export const JoinRequests: CollectionConfig = {
  slug: 'join-requests',
  // Newest first, so a fresh (almost always pending) request is the very
  // first thing an admin sees on opening this collection — the closest
  // thing to a "notification" achievable without an email service
  // configured (see the newsletter/Brevo discussion elsewhere in this
  // project for why that's a separate, not-yet-built piece).
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['member', 'target', 'status', 'createdAt'],
    description:
      'Real, trackable requests to join a Ministry or Group — replaces the previous mailto: links, which nobody could confirm had actually been sent or seen. Pending requests need action; approving one automatically adds the member to that Ministry/Group (their Dashboard reflects it immediately) rather than requiring a separate manual step.',
  },
  access: {
    // Only a logged-in Member can request to join — mirrors EventRegistrations'
    // reasoning: the UI gate shouldn't be the only thing enforcing this.
    create: ({ req }) => req.user?.collection === 'members',
    // Admins see everything; a member sees only their own requests — same
    // per-document query-constraint pattern as EventRegistrations, which is
    // what powers "my request status" on the Dashboard without a separate
    // members-only API route.
    read: ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'members') return { member: { equals: req.user.id } }
      return false
    },
    // Approve/decline is an admin action only — members don't self-approve.
    update: ({ req }) => req.user?.collection === 'users',
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
    {
      name: 'target',
      type: 'relationship',
      relationTo: ['ministries', 'groups'],
      required: true,
      admin: { description: 'The specific Ministry or Group being requested.' },
    },
    // Snapshotted at request time, same reasoning as EventRegistrations —
    // lets an admin see who to contact without expanding the relationship,
    // and keeps a true record even if the member later changes their name.
    { name: 'memberName', type: 'text', required: true },
    { name: 'memberEmail', type: 'email', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Declined', value: 'declined' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user?.collection === 'members') {
          data.member = req.user.id
          data.memberName = req.user.name
          data.memberEmail = req.user.email
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Only act on the actual transition into 'approved' — not on every
        // subsequent save of an already-approved request, which would
        // otherwise keep re-running this on unrelated edits.
        if (doc.status !== 'approved' || previousDoc?.status === 'approved') return

        const memberId = typeof doc.member === 'object' ? doc.member.id : doc.member
        const targetId = typeof doc.target.value === 'object' ? doc.target.value.id : doc.target.value
        const fieldName = doc.target.relationTo === 'groups' ? 'myGroups' : 'myMinistries'

        const member = await req.payload.findByID({ collection: 'members', id: memberId, depth: 0 })
        const currentIds: number[] = (member[fieldName] || []) as number[]

        if (!currentIds.includes(targetId)) {
          await req.payload.update({
            collection: 'members',
            id: memberId,
            data: { [fieldName]: [...currentIds, targetId] },
          })
        }
      },
    ],
  },
}
