import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

// Two-tier admin roles, introduced deliberately rather than left as the
// flat, single-tier model this collection started with — see the git
// history for the original "role-based permissions are a decision for
// the next pass" note. A super admin is the only role that can create,
// edit, or delete other admin accounts at all; a regular admin can only
// edit their own. The very first super admin is set by
// scripts/seed-first-admin.ts, the only way to create an account on a
// genuinely empty Users collection (see src/middleware.ts for why the
// public bootstrap screen is blocked entirely).
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
  // correctly for creating the very first admin, and the Local API used
  // by the seed script bypasses this access control entirely, same as
  // it bypasses every other collection's access rules.
  access: {
    // Only a super admin can create new admin accounts through the
    // normal UI/API — matches "admins are created by the super admin,"
    // not by any admin.
    create: ({ req }) => req.user?.collection === 'users' && req.user.role === 'super-admin',
    read: ({ req }) => req.user?.collection === 'users',
    // A super admin can update anyone. A regular admin can only update
    // their own record (e.g. changing their own password) — the query
    // constraint below scopes this at the database level, not just in
    // the admin UI, so it can't be bypassed via a direct API call either.
    update: ({ req }) => {
      if (req.user?.collection !== 'users') return false
      if (req.user.role === 'super-admin') return true
      return { id: { equals: req.user.id } }
    },
    // Only a super admin can delete any admin account — a regular admin
    // can't delete anyone, not even themselves. The deeper safeguard
    // (never deleting the LAST remaining super admin, so there's always
    // someone with ultimate control) is enforced in the beforeDelete
    // hook below, since that check needs to inspect the specific
    // document being deleted, which a collection-level access rule
    // can't do on its own.
    delete: ({ req }) => req.user?.collection === 'users' && req.user.role === 'super-admin',
  },
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const target = await req.payload.findByID({ collection: 'users', id, req })
        if (target.role !== 'super-admin') return

        const remaining = await req.payload.find({
          collection: 'users',
          where: { and: [{ role: { equals: 'super-admin' } }, { id: { not_equals: id } }] },
          limit: 1,
          req,
        })
        if (remaining.totalDocs === 0) {
          throw new APIError('Cannot delete the last remaining super admin — promote another admin first.', 400, undefined, true)
        }
      },
    ],
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        // Only relevant for an update that's actually changing role away
        // from super-admin — creation and every other field change are
        // unaffected.
        if (operation !== 'update') return data
        if (originalDoc?.role !== 'super-admin' || data.role === 'super-admin' || data.role === undefined) return data

        const remaining = await req.payload.find({
          collection: 'users',
          where: { and: [{ role: { equals: 'super-admin' } }, { id: { not_equals: originalDoc.id } }] },
          limit: 1,
          req,
        })
        if (remaining.totalDocs === 0) {
          throw new APIError('Cannot demote the last remaining super admin — promote another admin first.', 400, undefined, true)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super-admin' },
      ],
      admin: {
        description:
          'Only a super admin can create, edit, or delete other admin accounts \u2014 a regular admin can only edit their own. Only a super admin can change this field, including their own.',
      },
      // Field-level access, separate from the collection-level update
      // rule above — a regular admin can update their OWN record (e.g.
      // their password) but must never be able to promote themselves by
      // editing this one field, even though the rest of their own record
      // is otherwise editable by them.
      access: {
        update: ({ req }) => req.user?.collection === 'users' && req.user.role === 'super-admin',
      },
    },
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
