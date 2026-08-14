import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Members } from './collections/Members'
import { WorshipRota } from './collections/WorshipRota'
import { Groups } from './collections/Groups'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { PrayerRequests } from './collections/PrayerRequests'
import { VisitPlans } from './collections/VisitPlans'
import { VolunteerInterests } from './collections/VolunteerInterests'
import { LeadershipInterests } from './collections/LeadershipInterests'
import { EventRegistrations } from './collections/EventRegistrations'
import { JoinRequests } from './collections/JoinRequests'
import { Donations } from './collections/Donations'
import { Ministries } from './collections/Ministries'
import { Leadership } from './collections/Leadership'
import { Sermons } from './collections/Sermons'
import { Events } from './collections/Events'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import { MinistriesPage } from './globals/MinistriesPage'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { SermonsPage } from './globals/SermonsPage'
import { EventsPage } from './globals/EventsPage'
import { SchedulePage } from './globals/SchedulePage'
import { LivePage } from './globals/LivePage'
import { VisitPage } from './globals/VisitPage'
import { DirectionsPage } from './globals/DirectionsPage'
import { PrayerPage } from './globals/PrayerPage'
import { RotaPage } from './globals/RotaPage'
import { VolunteerPage } from './globals/VolunteerPage'
import { GroupsPage } from './globals/GroupsPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Foundation collections (Users, Media), plus every content type built
  // so far: Homepage, Ministries + MinistriesPage, Leadership + AboutPage,
  // Contact, Sermons + SermonsPage, Events + EventsPage, Schedule, Live,
  // Visit, Directions, Prayer. Every page built to date is now fully wired
  // — no remaining mock-only sections anywhere on the site.
  // Users (CMS admin, via /admin) and Members (public site accounts) are
  // deliberately two separate auth-enabled collections — mixing admin and
  // public-visitor auth would be a real security mistake, not just messy.
  // Only Users can access /admin (see the `admin.user` setting below).
  collections: [
    Users,
    Media,
    Ministries,
    Leadership,
    Sermons,
    Events,
    Members,
    WorshipRota,
    Groups,
    ContactSubmissions,
    PrayerRequests,
    VisitPlans,
    VolunteerInterests,
    LeadershipInterests,
    EventRegistrations,
    JoinRequests,
    Donations,
  ],
  globals: [
    Homepage,
    SiteSettings,
    MinistriesPage,
    AboutPage,
    ContactPage,
    SermonsPage,
    EventsPage,
    SchedulePage,
    LivePage,
    VisitPage,
    DirectionsPage,
    PrayerPage,
    RotaPage,
    VolunteerPage,
    GroupsPage,
  ],

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Isolates every table Payload creates (users, media, homepage, plus
    // Payload's own internal tables) under a dedicated schema rather than
    // the default "public" one. Given this Supabase project already has
    // tables from other work, this guarantees zero naming collisions
    // regardless of what those tables are called — safer than manually
    // auditing table names before every migration.
    schemaName: 'payload',
  }),

  // Locales match src/i18n/routing.ts exactly. Any collection field marked
  // `localized: true` will store one value per locale automatically —
  // that's the mechanism the architecture guide's Phase 6 (i18n) described
  // for CMS content, as opposed to static UI strings which live in
  // messages/*.json instead.
  localization: {
    locales: ['en', 'ta', 'kn'],
    defaultLocale: 'en',
  },

  sharp,
})
