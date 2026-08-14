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
  fields: [],
}
