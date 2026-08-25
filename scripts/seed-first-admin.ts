// One-time script: creates the first admin account directly against
// whatever database DATABASE_URI currently points to.
//
// Why this exists: Payload's public "create first user" screen at
// /admin is only safe for the brief moment between a fresh deploy and
// someone actually claiming it — if anyone else finds that URL first
// (a bot scanning for exposed admin panels, for instance), they claim
// the admin account instead, and that bootstrap door locks permanently
// the moment it's used. This script closes that window entirely: the
// admin account gets created server-side, before the site is ever
// shared with anyone, so there's nothing left for a stranger to claim.
//
// This account is always created as super-admin — the account this
// script creates is the church's own, ultimate account, not one of
// potentially several regular admins it will go on to create through
// the normal /admin UI once logged in.
//
// Run this LOCALLY, with your production DATABASE_URI set in the
// environment you run it from — right after running migrations, before
// sharing the URL with anyone. Never commit real credentials.
//
// Usage:
//   FIRST_ADMIN_EMAIL=you@yourdomain.com FIRST_ADMIN_PASSWORD=... \
//     node --env-file=.env.local --import tsx scripts/seed-first-admin.ts

import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

const email = process.env.FIRST_ADMIN_EMAIL
const password = process.env.FIRST_ADMIN_PASSWORD

if (!email || !password) {
  console.error('Set FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD before running this.')
  process.exit(1)
}

// Guards against accidentally running this against a database that
// already has an admin — this script is only meant for a genuinely
// empty Users collection, the same condition Payload's own bootstrap
// screen requires.
const existing = await payload.find({ collection: 'users', limit: 1 })
if (existing.totalDocs > 0) {
  console.error('An admin already exists on this database — aborting. This script is only for a genuinely empty Users collection.')
  process.exit(1)
}

await payload.create({ collection: 'users', data: { email, password, role: 'super-admin' } })
console.log(`Super admin account created: ${email}`)
process.exit(0)
