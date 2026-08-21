import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  auth: {
    // Real forgot-password email now — the church's own template, with a
    // real reset link, sent via the Brevo email adapter (payload.config.ts,
    // src/lib/brevo-email-adapter.ts) rather than Payload's generic
    // default copy. NEXT_PUBLIC_SITE_URL is the site's own stable base
    // URL — deliberately not derived from the incoming request the way
    // the newsletter's redirect URL is, since this callback runs inside
    // Payload's own auth operation, not a Next.js route handler with
    // direct request access.
    forgotPassword: {
      generateEmailSubject: () => 'Reset your Bethesda AG Church password',
      generateEmailHTML: (args) => {
        const { token, user } = args ?? {}
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const resetUrl = `${baseUrl}/reset-password?token=${token}`
        const firstName = (user && 'name' in user && typeof user.name === 'string' ? user.name.split(' ')[0] : null) || 'there'
        return `
          <p>Hi ${firstName},</p>
          <p>We received a request to reset your Bethesda AG Church account password. Click the link below to choose a new one — this link expires in 1 hour.</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you didn't request this, you can safely ignore this email — your password won't be changed.</p>
          <p>With care,<br>Bethesda AG Church</p>
        `
      },
    },
  },
  admin: {
    useAsTitle: 'name',
    description: 'Public site member accounts — separate from Users (CMS admin accounts). Members cannot log into /admin.',
  },
  access: {
    // Members can read/update their own record; admins manage the rest via /admin.
    read: () => true,
    create: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'users') return true // CMS admins, editing via /admin
      return { id: { equals: req.user.id } } // members can only edit their own record
    },
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'myGroups',
      type: 'join',
      collection: 'groups',
      on: 'members',
      label: 'Groups this member belongs to',
      admin: {
        description:
          'Read-only here \u2014 automatically reflects whichever Groups have this member in their own "Members" field. To change a member\u2019s group membership, edit it from the Group\u2019s own page instead, or approve/decline their Join Request.',
      },
    },
    {
      name: 'myMinistries',
      type: 'relationship',
      relationTo: 'ministries',
      hasMany: true,
      label: 'Ministries this member belongs to',
      admin: {
        description:
          'Populated automatically when a Join Request for this member is approved — see the Join Requests collection. Editable here directly too, if a membership needs adding or removing outside that flow.',
      },
    },
    {
      name: 'volunteerShift',
      type: 'group',
      label: 'Upcoming volunteer shift',
      admin: { description: 'Leave the role blank if this member has no upcoming shift — the dashboard hides the card entirely rather than showing an empty one.' },
      fields: [
        { name: 'dayLabel', type: 'text', admin: { description: 'e.g. "This Sunday"' } },
        { name: 'role', type: 'text', admin: { description: 'e.g. "Greeter Team"' } },
        { name: 'time', type: 'text', admin: { description: 'e.g. "9:00 AM"' } },
        { name: 'location', type: 'text', admin: { description: 'e.g. "Main Entrance, South Wing"' } },
      ],
    },
  ],
}
