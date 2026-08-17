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
  // Payload's own default access (no explicit `access` block at all) only
  // checks Boolean(req.user) — true for ANY authenticated session,
  // regardless of which collection it belongs to. Since Members also has
  // auth: true, a logged-in church Member satisfied that check and could
  // POST directly to /api/users to create themselves a real admin
  // account — confirmed and fixed after being asked how admin access
  // actually works. Payload's own "create first user" bootstrap screen
  // (shown only when this collection is completely empty) uses a
  // separate mechanism and is unaffected by this — it still works
  // correctly for creating the very first admin.
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    read: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
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
