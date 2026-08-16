import type { CollectionConfig } from 'payload'

// Foundational, not a content type: this just gives every future collection
// somewhere to store and relate to uploaded images. Storage currently
// defaults to local disk (fine for this dev pass) — swap to Supabase
// Storage via @payloadcms/storage-s3 pointed at Supabase's S3-compatible
// endpoint before deploying to Vercel, since its filesystem is ephemeral.
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // images need to be publicly readable by the frontend
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
