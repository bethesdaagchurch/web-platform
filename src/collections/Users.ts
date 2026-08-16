import type { CollectionConfig } from 'payload'

// The one collection Payload requires to exist for admin login. No extra
// fields yet — role-based permissions (e.g. "editor" vs "admin") are a
// content-modeling decision for the next pass, not foundation plumbing.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'notificationsSeenAt',
      type: 'date',
      admin: {
        hidden: true,
        description:
          'Internal bookkeeping for the "Needs Attention" dashboard panel \u2014 the timestamp of this admin\u2019s last visit to /admin. Items created before this stop showing until a new one arrives, even if still pending. Not meant for manual editing.',
      },
    },
  ],
}
