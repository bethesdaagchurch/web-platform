# Bethesda AG Church — Website

Full site build with English/Tamil/Kannada routing structure and the Payload CMS foundation
wired in. Pages still run on static mock data — swapping that for real Payload queries is the
next phase, collection by collection.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URI and PAYLOAD_SECRET, see below
npm run dev
```

Open `http://localhost:3000` for the site, `http://localhost:3000/admin` for the CMS.

```bash
npm run build   # production build, same one used to verify this codebase
npm run lint    # ESLint check
```

## Payload CMS — setup

Payload needs two env vars in `.env.local` (never commit real values — `.env.local` is
already gitignored):

- **`DATABASE_URI`** — a Postgres connection string. Point this at your Supabase project's
  connection string (Supabase dashboard → Settings → Database → Connection string → URI; use
  the pooled `pgbouncer` one for serverless deploys on Vercel). Use a staging/dev Supabase
  project locally, never production.
- **`PAYLOAD_SECRET`** — any long random string, e.g. `openssl rand -base64 32`.

Once both are set:

```bash
npx payload migrate:create   # generates SQL migrations from src/collections/*.ts
npx payload migrate           # applies them to DATABASE_URI
npm run dev                   # then visit /admin — first run prompts you to create an admin user
```

**Optional — testing without touching Supabase at all:** `@payloadcms/db-sqlite` is already
installed. Temporarily swap the `db:` adapter in `src/payload.config.ts` from `postgresAdapter`
to `sqliteAdapter` pointed at a local file to iterate on collections without a live database —
this is exactly how the foundation itself was verified before shipping. Swap back to
`postgresAdapter` before committing.

### What exists so far

- `src/collections/Users.ts` — required for admin login
- `src/collections/Media.ts` — baseline upload handling most future collections relate to
- `src/globals/Homepage.ts` — Hero, Quick Links, Service Times, Pastor Welcome, Giving breakdown
- `src/globals/SiteSettings.ts` — church identity, address, phone, email, office hours, social
  links. Powers the Footer (self-fetching, see below), Contact page, and Homepage's Visit Us.
- `src/collections/Ministries.ts` + `src/globals/MinistriesPage.ts` — each ministry is its own
  document with its own `/ministries/[slug]` page; the page-level hero and Small Groups section
  are a separate global
- `src/collections/Leadership.ts` + `src/globals/AboutPage.ts` — same split: each leader is a
  document (with an `order` field controlling bento-grid position — the layout still assumes
  exactly 4 leaders), page-level hero/Core Values/Journey timeline are the global
- `src/globals/ContactPage.ts` — hero and form subject options; address/phone/office hours
  intentionally come from SiteSettings instead of being duplicated here
- `src/collections/Sermons.ts` + `src/globals/SermonsPage.ts` — each sermon is its own document;
  the featured hero banner and podcast CTA are the separate page-level global, matching the
  same split used everywhere else. Filter dropdown options (Series/Speaker/Topic) on `/sermons`
  are **derived automatically** from whatever sermons actually exist, rather than requiring a
  separately-maintained list — no way for a filter option to drift out of sync with real data.
- `src/collections/Events.ts` + `src/globals/EventsPage.ts` — same collection/page-global split.
  `category` (Youth/Missions/Conferences/Worship) drives the filter, the badge color, *and* the
  calendar widget's markers — categoryLabel/badgeStyle are derived from it rather than stored
  as separate fields. The calendar itself needed no new data model: it reads `startDate`/
  `endDate` directly off the same Events collection that powers the list, so a multi-day
  conference and a single-day service are both just one document with (or without) an end date.
- `src/globals/SchedulePage.ts`, `LivePage.ts`, `VisitPage.ts`, `DirectionsPage.ts`,
  `PrayerPage.ts` — wired in priority order based on how often the content actually needs to
  change: **Schedule** (Special Services like "First Fridays" genuinely rotate monthly) and
  **Live** (this week's sermon title/speaker and the `isLive` toggle change every Sunday) first,
  then Visit, Directions, and Prayer. `LivePage`'s sample chat messages and sermon notes are
  deliberately NOT in Payload — see that file's `admin.description` for why (they're decorative
  placeholder UI for a chat feature with no real backend, and putting fake messages in a CMS
  just confuses editors about what's real). `DirectionsPage` doesn't duplicate address/phone/
  email — those come from `SiteSettings`, and fixing `DirectionsMap`/`NeedHelpCard` to actually
  use that adapter (they were still reading the static mock) was part of this pass.

**All pages built so far are now fully wired to Payload — no remaining mock-only sections,
including on the homepage.** Every content type above was verified the same way: seeded
distinctly-labeled test content through Payload's local API, rebuilt, and confirmed via
headless browser that the real pages — not just the admin panel — switched from mock data to
that seeded content, field by field. Also confirmed: a nonexistent slug on `/ministries/[slug]`,
`/about/[slug]`, `/sermons/[slug]`, and `/events/[slug]` correctly 404s rather than silently
falling back to a mock item (an actual bug caught and fixed during the Ministries/About pass —
see the `*-adapter.ts` comments), that Tamil/Kannada pages correctly show Payload's own
locale-fallback content when no translation exists yet rather than breaking, that Sermons'
search/filters/pagination work against real data, that Events' calendar correctly renders a
navy marker for a real single-day event and gold markers across all three days of a real
multi-day event (checked by reading the actual CSS classes Playwright found on those calendar
cells), and — for Live specifically — that the `isLive` toggle works in **both directions**:
seeded `true` and confirmed the "Live Now" badge shows, then flipped it to `false` and
confirmed the badge disappears while the sermon title stays put. That's the actual "toggle it
on Sunday morning" workflow the page was built for, not just a schema that compiles.

**`Footer` is now a self-fetching async Server Component** rather than reading static mock
data — it calls `getPayloadClient()` directly instead of accepting props, since it renders on
every page via `(site)/layout.tsx` and threading site-settings through every single page.tsx
would be needless plumbing. The request-level caching in `src/lib/payload.ts` means this
doesn't cause duplicate queries when a page has already fetched site-settings itself.

**How the fallback works:** each `src/lib/*-adapter.ts` maps the real Payload global to each
component's existing props, falling back to `src/data/homepage-mock.ts` per field (not
per-section) if the CMS document is empty or partially filled in. This means the site renders
correctly from the moment `/admin` exists, even before an editor has touched every field —
confirmed by testing with a completely empty Homepage global (full mock fallback) and again
after seeding only some fields (mixed CMS + mock, section by section).

### Two things worth knowing if a future Payload upgrade breaks the build

- `package.json` has `"type": "module"` — required for the Payload CLI (`migrate`, etc.) to
  load `payload.config.ts` without crashing on `@payloadcms/richtext-lexical`'s ESM/top-level-await
  build. If a future Payload version removes that requirement, this can likely stay regardless.
- `next.config.mjs` imports `withPayload` from `@payloadcms/next/withPayload`, not
  `@payloadcms/next/config` — the latter doesn't exist in this installed version despite being
  a common pattern in older examples. Check `node_modules/@payloadcms/next/package.json`'s
  `exports` field directly if this ever errors after an upgrade, rather than guessing.

## What's built

All pages below exist as real, working routes:

Home, About, Ministries (+ detail), Sermons (+ detail), Events (+ detail), Contact, Give,
Privacy Policy, Terms of Service, Cookie Policy, Sitemap, Prayer Request, Live, Login, Plan
Your Visit, Worship Schedule, and Directions all have real designs implemented. `/blog` is
still a placeholder pending design. A handful of other footer/nav targets (`/groups`,
`/volunteer`, `/forgot-password`, `/create-account`) are also placeholders — reachable, not
yet designed.

**Login lives outside the main site layout.** `src/app/[locale]/(auth)/` is a separate route
group (sibling to `(site)`, same "multiple layouts" technique used for the Payload admin
panel) with no Header/Footer — the design is a deliberately isolated full-bleed screen, and
forcing the standard site chrome onto it would have fought the design rather than matched it.

**Login is now real member authentication**, wired to a separate `src/collections/Members.ts`
(`auth: true`) — kept completely apart from the CMS admin `Users` collection, exactly the
separation flagged as a requirement before this was built. Members can never access `/admin`.

- `src/lib/get-member.ts` — `getCurrentMember()`, the single source of truth for "is a member
  logged in right now." Uses Payload's `payload.auth({ headers })` against the incoming
  request's real headers (via `next/headers`), and explicitly distinguishes a Members session
  from a CMS admin (`Users`) session — a `Users` login browsing the public site is never
  mistaken for a logged-in member.
- `src/components/auth/LoginForm.tsx` — posts to Payload's auto-generated
  `/api/members/login` REST endpoint (already served by the existing catch-all route from the
  Payload foundation pass — no new API routes needed). Payload sets the session as an httpOnly
  cookie automatically; `router.refresh()` re-runs every Server Component's data fetching so
  the Header and gated pages pick up the new session without a full page reload.
- `src/components/auth/MemberMenu.tsx` — shown in the Header instead of "Login" once
  authenticated; posts to `/api/members/logout` and refreshes.
- `src/components/auth/MembersOnlyGate.tsx` — the reusable gating pattern: pass it the current
  member and it either renders its children or a "Sign in to access this" prompt linking to
  `/login`. Used on Ministries' "Interested in Leading?" form and Live's chat panel. Prayer's
  "Join a Prayer Group" link uses a lighter inline version of the same idea instead — the full
  gate box would look oversized inside that small card, so only the action itself (not the
  card's heading/description, which stay visible to everyone) is gated.
- `(site)/layout.tsx` fetches the current member **once**, in the layout, and passes it into
  `Header` as a prop — not every page independently re-deriving auth state.

**Verified by actually logging in, not just by the schema compiling:** created a real test
member, submitted the real login form, and confirmed the Header swapped from "Login" to the
member's name; confirmed Ministries/Live/Prayer all correctly showed the sign-in prompt while
logged out and the real gated content once logged in; logged out and confirmed all three
re-locked; and confirmed a wrong password is rejected with Payload's own error message and
never creates a session.

**Public registration (`/create-account`) is now built.** `CreateAccountForm.tsx` creates the
Member via Payload's REST create endpoint (`Members.access.create` was already public), then
immediately logs them in — signing up feels like one step, not "register, then separately go
sign in with what you just typed." A few things worth knowing:

- Duplicate-email handling required tracing Payload's actual error response shape rather than
  guessing: the top-level `errors[0].message` is a generic "The following field is invalid:
  email," but the genuinely useful message ("A user with the given email is already
  registered.") is nested one level deeper, at `errors[0].data.errors[0].message`. The form
  prefers the specific message when present.
- Already-logged-in members visiting `/create-account` are redirected home, matching Login's
  own pattern.
- **Verified by actually registering, not just reading the code**: submitted the real form,
  confirmed the Header updated with the new member's name (a real session, not a redirect to
  go log in separately); confirmed password mismatch is caught client-side before any request
  fires; confirmed a duplicate email is rejected with the specific, correct message; confirmed
  the already-logged-in redirect. One genuine snag along the way: an early verification pass
  kept failing even after the fix looked correct in isolation (confirmed with a standalone Node
  script hitting the same API) — a `next build` had silently failed to actually recompile,
  the same class of silent failure seen earlier in this project with `payload migrate`. Caught
  it by grepping the compiled `.next` output directly for the fix and finding it genuinely
  absent, rather than continuing to doubt code that was already correct.

**Volunteer (`/volunteer`) and Groups (`/groups`) are now built.**

- `VolunteerPage` global uses a variant system (`image` / `plain` / `featured`) for its bento-grid
  "Areas of Service," with Payload's `admin.condition` showing only the fields relevant to each
  card's variant in the CMS. The featured "high need" card's interest form now submits for
  real — see the form-wiring section below.
- `Groups` collection, with a fixed code-owned category set (same reasoning as Events/
  Ministries' category selects). Real search and category filtering, with an "Active Filters"
  row genuinely derived from current state — not decorative. The "Filters" button is
  intentionally inert: no filter-panel design exists, so it's visually present without
  fabricating a UI nobody designed.
- **"Join Group" is member-gated**, per the explicit instruction earlier in this project that
  joining a group should be members-only — using the existing `MembersOnlyGate` component. For
  a logged-in member, it's a real `mailto:` link built from the group's `contactEmail` field
  (verified the generated link is correctly formed and URL-encoded), not a dead button — a
  pragmatic middle ground given no request-to-join backend exists.
- One real bug caught before it ever built: shorthand `<>` fragments inside a `.map()` can't
  take a `key` prop — fixed by switching to `Fragment key={...}`.
- **Verified with real seeded data across both pages**: category filter and search narrowing
  results correctly in both directions, the "Join Group" gate confirmed locked while logged out
  and confirmed unlocked (with the correct mailto link) once logged in, and both pages' CMS
  content confirmed reaching the real frontend, not just the admin panel.

**Form submissions are now wired for real** — Contact, Prayer Request, Plan Your Visit,
Volunteer Interest (the Volunteer page's featured card), and Small Groups' Leadership Interest
form. Each gets its own collection: `ContactSubmissions`, `PrayerRequests`, `VisitPlans`,
`VolunteerInterests`, `LeadershipInterests`.

- **All five are `create: public, read: admin-only`** — anyone can submit, but the data (names,
  emails, sometimes a "keep private" prayer request) is readable only via `/admin`, never
  exposed on the public API and never readable by other members. Verified directly: an
  anonymous request to `/api/contact-submissions` returns `403`, and — the guarantee that
  actually matters — a *real logged-in member's own session* also gets `403` reading
  `/api/prayer-requests`. Admin-only means admin-only, not "admin-only unless you happen to
  have any account."
- **`LeadershipInterests` goes further**, since the UI form was already members-only:
  `access.create` itself requires a real member session, not just public access, so the API
  can't be used to bypass the page's gate. `submittedByMember` is set server-side via a
  `beforeChange` hook that reads the session directly — never trusted from client input.
  Verified all three angles: an anonymous `curl` POST is rejected with `403`; a real member's
  submission succeeds and shows a success state; and querying the database afterward confirmed
  the hook attached the correct member, not something spoofable.
- Every form follows the same shape: real client state, a loading state, server error messages
  surfaced when present (not just a generic fallback), and a success state that replaces the
  form rather than a silent no-op or a full-page redirect.
- One real bug caught before it ever shipped: rewriting `SmallGroups.tsx`'s form to use
  `useState` required adding `'use client'`, which the file didn't have — it was a plain Server
  Component before, since the old static form needed no interactivity. Next's build failed
  loudly and correctly; fixed immediately.
- **Give's payment flow was deliberately not touched** — different category of thing entirely
  (real money, pending Razorpay KYC), not a lead-capture form like the other five.

**Member Dashboard** (`/dashboard`) is now built — Welcome header, My Groups, Volunteer
Shifts, and Recent Sermons (reusing the existing Sermons collection, no new schema needed for
that part). A few things worth knowing:

- Unlike Ministries/Live/Prayer (public pages with a members-only *section*), the Dashboard
  page is entirely member content — logged-out visitors get a hard redirect to `/login` via
  next-intl's locale-aware `redirect()`, not a gate prompt sitting on an otherwise-empty page.
- `Members.myGroups` **is now a real relationship to the Groups collection** (`hasMany:
  true`), not a manually-typed array — this was explicitly flagged as a planned upgrade in
  the field's own admin description from the earlier lightweight-MVP pass, and now that a
  real Groups collection exists, that upgrade has landed. Admins select from a real dropdown
  in `/admin` instead of typing a group name, schedule, and location by hand; the Dashboard
  now pulls `title`/`schedule`/`location` straight from the related Group document instead of
  duplicated manual entry. **Important for anyone with an existing production database**:
  this is a genuine schema change (array → relationship), not additive — it needs a real
  migration (`npx payload migrate:create` then `npx payload migrate`) run against your actual
  database, and any groups that were previously typed into a member's record by hand won't
  carry over automatically; they'll need re-selecting from the new dropdown. Verified with a
  full round-trip in a real browser: logged into `/admin`, selected a real seeded group from
  the dropdown, saved, then logged in as that member on the public site and confirmed the
  Dashboard showed the group's actual title/schedule/location pulled from the Group document,
  not stale placeholder text.
- `Members.volunteerShift` remains a simple manually-entered field (one optional shift) —
  deliberately not part of this upgrade, since there's no comparable "real Shifts collection"
  it should point to yet. The Volunteer Shifts card still hides itself entirely (rather than
  rendering empty) when a member has no `role` set.
- `MemberMenu` in the header is now a real dropdown (avatar or initials fallback, name,
  chevron) linking to the Dashboard — upgraded from a plain name+logout, since there was
  finally somewhere for it to link to.
- **Verified by actually testing the dynamic-rendering behavior, not just trusting the build
  output.** The build labeled `/dashboard` as statically prerendered, which would be a real
  problem for a page doing a per-request auth check — rather than assume that label was
  accurate, it was tested directly: confirmed a logged-out visit redirects to `/login`, and
  that a logged-in visit immediately after shows that member's real data, not a stale
  prerendered redirect or another member's cached page.

**Worship Rota** (`/ministries/rota`) is now built — the last piece from the original two
member-feature designs. A few decisions worth knowing about:

- `WorshipRota` is the **first collection with restricted API read access** — every other
  collection so far (Sermons, Events, Ministries...) is publicly readable, since that content
  is meant to be public. Rota data is internal scheduling info, so `access.read` requires an
  authenticated session (`Boolean(req.user)`). Verified directly: an anonymous request to
  `/api/worship-rota` returns a real `403`, not just a page-level redirect that a determined
  visitor could route around by hitting the API directly.
- The Month and Ministry filter dropdowns are **derived from real rota entries**, same
  reasoning as Sermons' Series/Speaker/Topic filters — no separately-maintained list to drift
  out of sync. The "Worship Rota – [Month Year]" heading is generated client-side from
  whichever month is selected, not stored as CMS text.
- `RotaBanner` on the Ministries page is the actual entry point into this feature — visible
  only to logged-in members (not even a "sign in to see this" prompt for logged-out visitors,
  since advertising an internal scheduling tool to the public isn't useful the way advertising
  Small Groups is).
- **"Edit Rota" links straight to `/admin/collections/worship-rota`** rather than a custom
  in-app editor, as planned. One real bug caught here: the link initially used a plain `<a>`
  tag, which Next's linter correctly flagged — but the fix wasn't next-intl's locale-aware
  `Link` (that would have wrongly tried to prefix `/admin` with a locale, since `/admin` is
  deliberately excluded from locale routing entirely). Plain `next/link` was the correct fix.
- **"Edit Rota" is admin-only — genuinely absent from the page for members, not just
  disabled or CSS-hidden.** `src/lib/get-admin.ts` (`getCurrentAdminUser()`) mirrors
  `get-member.ts` but checks for a CMS admin (`Users`) session instead. This also fixed a real
  gap: before this, a CMS admin browsing the public site couldn't reach `/ministries/rota` at
  all, since the page's gate only recognized Members sessions — an admin would get redirected
  to `/login` just like a logged-out visitor. Confirmed by reading Payload's own `extractJWT`
  source that it uses a single project-wide session cookie (not one scoped per collection), so
  a browser only ever holds one active session — Member *or* admin, never both at once —
  meaning there's no ambiguity in which one a given request represents.
- Verified end-to-end with **both** a real Member and a real CMS admin account: the member
  reaches the page and sees content, but `Edit Rota` is confirmed absent from the raw HTML
  (not just hidden), not merely the rendered text; the admin — logged in the normal way via
  `/admin/login` — reaches the same public page, sees the button, and clicking it lands on the
  real, working Payload collection view showing the actual seeded entry.
- Verified end-to-end with a real logged-in member: gating on both the Rota page and the
  Ministries banner, the Ministry filter actually narrowing results in both directions (not
  just rendering without erroring), and the dynamic heading reflecting the real current month.

**Directions' map uses a real, working Google Maps search link** (`DirectionsMap.tsx`),
built from `siteSettings`' actual address rather than a placeholder — the source design had a
generic map graphic with a fake business name baked into the image, not something worth
literally recreating.

**The embedded map iframes (Directions and Contact) auto-generate a working map from your
address, no configuration required.** Both had been showing a "not set" placeholder since day
one — `SiteSettings.mapEmbedUrl` required an admin to manually get a Google Maps *embed* URL
(Share > Embed a map > copy the iframe src out of the HTML), a genuinely confusing step for a
non-technical church admin, and it had simply never been done.

- `resolveMapEmbedUrl()` in `site-settings-adapter.ts` derives a real, working embed
  automatically from `churchName` + `address` — the same data already powering the "Get
  Directions" links — using Google's keyless `?output=embed` query format. No API key, no
  billing account, matching this project's free-tools-only constraint. `mapEmbedUrl` is kept
  as an optional override for a church that wants a precisely-placed pin via Google's own
  Embed UI; it takes precedence whenever it's set.
- Verified both directions of that logic directly: with the field empty, the iframe correctly
  shows the auto-derived URL built from the mock address; with a manual override value set,
  the iframe correctly uses that instead.
- **One honest limitation, not glossed over**: this sandbox's network egress blocks
  `google.com` outright (the same restriction that's blocked Google Fonts all project), so the
  actual map *tiles* rendering couldn't be visually confirmed from inside this environment —
  only that the URL is correctly constructed and the fallback/override logic behaves
  correctly. The `?output=embed` technique is a long-standing, widely-used, keyless approach,
  but worth an explicit check once deployed rather than assuming it's pixel-perfect on faith.

**Live's chat is UI only, honestly.** The Live Chat / Sermon Notes tab switch is real
interactivity (client-side state, verified working both directions) — but the chat feed itself
is static sample messages and the message input has no backend to send to. A real
implementation needs actual real-time infrastructure (websockets or similar), well beyond a
Payload content pass.

**"Join Ministry" now actually lets you join** (`MinistryCard.tsx`, the ministry detail page).
It previously just navigated to the detail page, which literally said "sign-up flow hasn't
been designed yet" — a real functional gap, not just an incomplete design. Fixed the same way
as Groups' "Join Group": added a `contactEmail` field to each ministry, and the button is now
a real `mailto:` link with a pre-filled subject line. The card now has two distinct
affordances instead of one overloaded link — the image/title still navigate to the detail
page (view more), while the CTA button is the actual join action. Not gated to members, unlike
Small Groups' leadership form — ministries are the kind of thing a newcomer should be able to
reach out about too. Verified on both the card and the detail page: real mailto hrefs with
correctly URL-encoded subjects, and that clicking the title (not the button) still reaches the
detail page correctly.

**`/blog` and `/resources` links are commented out, not deleted, until each has a real
design.** Both routes still exist as reachable `PagePlaceholder` pages — only the *links*
pointing to them were removed:

- `/blog` was linked from exactly one place: the Sitemap's "Church Blog & Announcements"
  entry. Commented out in `sitemap-mock.ts`'s structural data (a single list item, not a
  restructure) — uncommenting it is a one-line change once a design exists.
- `/resources` was linked from `WorshipGuidelinesCard` on the members-only Rota page. Given
  that card's *only* purpose is linking to Resources (heading + description + one button, no
  independent content), commenting out just the link would have left a dead-end card with no
  working action — so the whole card's render call is commented out in `RotaExplorer.tsx`
  instead, not just the link inside it. The `guidelines` prop and `WorshipGuidelinesCard`
  import are both kept (with lint-disable comments, confirmed to produce zero warnings) so
  restoring this is uncommenting two lines, not re-threading data from the page.
- This was also the cleaner fix for a subtlety worth knowing: `RotaPage.linkHref` is a real
  CMS field, not just a mock-data fallback — an admin could have already set it to something
  else in the live database, which a mock-only fix wouldn't have caught. Hiding the whole card
  sidesteps that regardless of what's actually stored.
- Verified directly: confirmed the Sitemap page no longer contains "Church Blog" or any
  `<a href="/blog">`, and confirmed the Rota page (as a real logged-in member) no longer shows
  "Worship Guidelines" or any `<a href="/resources">`, with the sidebar layout still looking
  correct — no awkward gap where the card used to be.

**A real cross-request-consistency bug was found and fixed in the member-auth helpers**,
reported as "I'm logged in as a member (header shows my name) but a member-gated section
still asks me to sign in." `getCurrentMember()`/`getCurrentAdminUser()` were plain async
functions, not deduped — meaning the shared `(site)/layout.tsx` (for the Header) and an
individual page like Prayer (for `IntercedeCard`) each triggered their own independent
`payload.auth()` call, each its own database lookup, within a single request, with nothing
guaranteeing the two would agree. Fixed by wrapping both in React's `cache()`, the same
pattern `getPayloadClient()` already used — every call within one request now resolves to
the exact same result, eliminating the possibility of disagreement entirely.

- Also added `export const dynamic = 'force-dynamic'` to every member-gated page (Prayer,
  Dashboard, Groups, Live, Ministries, Rota) while investigating — worth knowing this turned
  out to be a dead end, not the actual fix: checking real HTTP response headers showed every
  page under `(site)` was *already* `Cache-Control: private, no-cache, no-store` before this
  change, because the layout's own `headers()` usage was already forcing dynamic rendering
  site-wide. Kept as a harmless explicit safety net, but the `cache()` fix above is the one
  that actually addresses the reported symptom.
- Verified thoroughly: logged in as a real member and hit all six affected pages in one
  continuous session (20+ page loads), confirming the header showed the member's name and no
  page incorrectly showed a sign-in gate. For Prayer specifically: confirmed the real "Join a
  Prayer Group" link appears (not just that the prompt disappears) and that clicking it
  actually lands on `/groups`, not just that the href looks right.

**Events now automatically appear on `/schedule`'s "Special Services" section — no more
double-entry.** `SchedulePage.specialServices` was a completely separate, manually-typed CMS
array with zero connection to the real `Events` collection; creating an event never made it
show up on Schedule, and an admin had to re-type the same announcement in both places to get
it on both pages. Fixed via a new adapter function, `adaptSpecialServicesFromEvents()`, that
converts real upcoming Events documents into the same shape Special Services already expects
— the Schedule page now queries events where `startDate >= today`, sorted soonest-first, and
uses those preferentially. The original manually-typed `specialServices` array remains as a
genuine fallback, used only when there are no real upcoming events (so a slow season doesn't
show an empty section). Verified with a real seeded event: created one distinctly-named event
in the sandbox, confirmed it appeared on `/events` as expected, then confirmed the *same*
event — with its real date, time, and description, not placeholder text — appeared on
`/schedule` too, with no second entry required anywhere.

**Real event registration is now built — `/events/[slug]` has a genuine, working RSVP flow,
not just an admin-typed link.** New `Events.requiresRegistration` toggle (per-event, not every
event needs this) and a new `EventRegistrations` collection. Design was iterated live against a
real reference screenshot partway through the build — the first pass captured just name/email
plus a confirmation checkbox; the final version matches the provided design: separate
First/Last Name, Email, Phone, Number of Attendees, and an optional Special Requests field,
plus a redesigned event hero with a Date/Location/Cost info bar (`Events.cost` is a new
optional field powering that last one).

- **Member-only, enforced at the API level, not just the UI** — `access.create` on
  `EventRegistrations` requires a real member session, same reasoning as `LeadershipInterests`.
  Goes further than that collection on read/update: instead of a plain boolean, these use
  Payload's query-constraint access control (`{ member: { equals: req.user.id } }`) so a member
  can only ever see or cancel *their own* registrations — this is what actually powers "my
  registered events" on the Dashboard without a separate members-only API route.
- Fields are pre-filled from the member's session (name, email) but stay editable, since the
  attendee's registration details can legitimately differ from their account profile (e.g. a
  family phone number). No explicit "I confirm attendance" checkbox in the final version —
  submitting the form itself is the confirmation, matching the reference design.
- Cancelling is real, not cosmetic: sets `status: 'cancelled'` (kept for an audit trail, not
  deleted) via the same per-document access control, reachable identically from the event page
  itself or from the Dashboard's "My Registered Events" card — verified both paths independently.
- **Two real bugs were caught and fixed via actual testing, not just written and assumed
  correct**: (1) the `event` relationship was sent to Payload as a string ID instead of a
  number, failing every registration attempt with a validation error — this is a genuinely new
  category of bug for this project, since every other collection's relationships get set
  server-side via hooks, never submitted directly by the client, so this exact mistake was
  never previously possible; (2) after a successful registration, `loading` was never reset to
  `false`, so the "You're Registered" success view inherited the stale value and its Cancel
  button showed "Cancelling..." despite never being clicked — caught by actually looking at a
  screenshot after each step rather than trusting a boolean check, fixed by refactoring both
  handlers to use `finally` blocks instead of scattering `setLoading(false)` across multiple
  return paths.
- Verified end-to-end with real screenshots at each step, not just code review: logged-out
  visitor correctly gated; registration persists across page loads and sessions (revisiting
  later correctly shows "You're Registered" instead of the form again); cancelling from the
  event page immediately shows the form again on the same page, no reload needed; cancelling
  from the Dashboard immediately removes the entry and shows the correct empty state; and the
  full flow (form labels, hero info bar, sign-in prompt, Dashboard section, empty state)
  confirmed correctly translated in Tamil.

**`Events.slug` had zero admin guidance on the expected format — traced back to a real
"Register" 404 report.** A user reported that clicking "Register" on an event landed on a 404.
Rather than guess, reproduced the exact scenario: seeded an event with a slug matching the
likely mistake (`"Awaken 2026"` — spaces, capital letters) and confirmed clicking Register
does genuinely 404 (`/events/Awaken%202026`, no match against the stored value). Fixed the
slug to `awaken-2026` on the same event and confirmed that alone resolves it — the real
registration form loads correctly. The actual fix shipped here is narrower than "handle any
slug format": added the same `admin.description` hint every other slug field in this project
already has (Ministries, Sermons, Groups) — `Events.slug` was the one collection missing it,
which is the most likely reason this particular mistake happened in the first place.

**The Events page's featured hero (`EventsPage.hero`) was upgraded from manually-typed content
to a real relationship — this is the third instance of the same class of bug, and this time
the fix eliminates the bug class entirely rather than adding another hint.** The previous fix
(adding an `admin.description` hint to `primaryButtonHref`) genuinely worked when the value
was typed correctly, but a follow-up report showed the same event still couldn't be registered
for or found on `/schedule` — because the hero's heading/subtext/button were always
independent, hand-typed content, never actually connected to a real `Event` document. Getting
the button URL right made the *link* work, but the hero itself still wasn't describing a real,
registerable event.

- **The fix**: `hero.featuredEvent` is now a required `relationship` to `events`, replacing
  `heading`, `subtext`, `primaryButtonLabel/Href`, `secondaryButtonLabel/Href`, and
  `backgroundImage` entirely. The hero's title, description, image, and button all derive
  directly from whichever event you select — there's no href to type, so the "doesn't match
  the slug" bug is now structurally impossible, not just hinted against. Simplified from two
  buttons to one in the process: both previously pointed at the same event anyway, and the
  single button's label now reflects reality — "Register Now" if the featured event actually
  requires registration, "Learn More" otherwise, rather than always implying registration is
  possible.
- **Verified the full, real user journey in one pass**, not just the click-through: seeded a
  real upcoming event, featured it via the new relationship (no href typed anywhere), then
  confirmed — as a real logged-in member — that the hero correctly displays that event's own
  title, that the button correctly reads "Register Now" and points to the right page, that
  clicking through reaches a real (non-404) page, that completing the registration form
  actually succeeds, and that the same event correctly appears on `/schedule` — all from the
  one real event record, with nothing re-typed anywhere. Also confirmed the button label
  renders correctly in Tamil.
- `EventsPage.hero.badge` is the one field that's still manually typed — a short decorative
  label like "Featured" or "Major Conference" that doesn't correspond to any real event data,
  so there was nothing to connect it to.

## Sermons and Live video — real embeds, not placeholders

This was raised as a genuine planning question before any code was touched: video files are
GB-sized, and self-hosting them (uploading to Payload's media storage, serving via
Vercel/Supabase) isn't viable on a free-tools budget — Vercel's function payload limits, no
adaptive-bitrate streaming, and bandwidth costs that would blow through any free tier almost
immediately. **The answer is YouTube**, which is free, handles live streaming (the one thing
nothing else on the free tier offers), and auto-transcodes to every device — the tradeoff
being Google's branding in the embed, which is the right trade for "working and free" over
"fully custom."

**What this surfaced: a genuinely incomplete refactor from earlier work, not just missing
features.** Investigating turned up real, substantial groundwork already in place —
`src/lib/youtube.ts` (URL parsing for both video IDs and channel IDs, handling every realistic
copy-paste format), `Sermons.youtubeUrl`, `LivePage.stream.youtubeChannelId`, and
`SermonsPage.hero.featuredSermon`/`EventsPage.hero.featuredEvent`-style relationships — but the
refactor had stalled partway. Concretely:

- The sermon detail page's video section was still a literal placeholder: *"video embed...
  hasn't been designed yet"* — the schema and validation were ready, but nothing actually
  rendered a player.
- `adaptSermonHero`, `adaptSermonEntries`, and `adaptHomepageSermons` were all silently
  reading field names that no longer exist on the schema (`hero.watchHref`, `hero.speakerName`,
  `hero.dateISO`) — meaning the featured sermon's real data was never actually reaching any
  page; every one of these silently fell back to mock content instead, with no error or
  warning that anything was wrong.
- `SermonEntry` and `SermonHeroData`'s types already required `youtubeUrl`/`slug`, but the
  adapter functions and mock data were never updated to actually provide them — this only
  surfaced as a build failure once the missing embed was finally wired up, not before.

**What's now genuinely fixed, not just patched over:**

- Built `SermonVideoPlayer.tsx` — a real YouTube embed, shared between the featured hero
  sermon and every regular sermon's own detail page.
- Fixed all three broken adapter functions to correctly derive from the real
  `featuredSermon`/entry data instead of nonexistent fields.
- Simplified `SermonHero` from two buttons (Watch/Listen, the latter never actually leading
  anywhere audio-specific) to one "Watch Now" button, matching the same simplification applied
  to the Events hero earlier — always correct by construction, derived from the real sermon's
  slug rather than separately-typed hrefs.
- Live's channel-embed (`LiveStreamPlayer.tsx`) was already correctly built and required no
  code changes — verified it thoroughly rather than assuming, since a user report directly
  contradicted what the code appeared to already do.

**Verified everything directly, not just the parts that were new:** seeded a real featured
sermon with a real YouTube URL and confirmed the hero's "Watch Now" button leads to a real,
correctly-sourced video embed (not a 404, not the placeholder text); seeded a second,
non-featured archive sermon using a *different* YouTube URL format (`youtu.be/...` vs.
`watch?v=...`) specifically to confirm the parser handles both, and confirmed its own detail
page and archive-card link both work correctly; confirmed the Live page's channel-embed
renders a real `youtube.com/embed/live_stream` iframe with the correct channel ID; and checked
both `/admin` screens directly — the Sermons "Youtube Url" field and the Live page's "Youtube
Channel Id" field — to confirm the guidance text and validation are genuinely visible to
whoever configures this, not just present in the schema.

## Dashboard: "My Serving Schedule" (real Worship Rota assignments)

Reported directly: a member assigned to serve on the Worship Rota couldn't see that
assignment anywhere on their own Dashboard. The cause was the same pattern fixed repeatedly
elsewhere in this project — `WorshipRota.worshipTeam.leaderName` and `specialItems.personName`
are free text, and the existing `worshipTeam.members` array is photos *only*, with no name
field at all, let alone a connection to a real Member account. There was no way to query
"which rota entries is this member part of," because nothing on a rota entry pointed at a
real Member to begin with.

- **The fix**: a new `assignedMembers` field on `WorshipRota` — a real, multi-select
  relationship to Members, separate from the existing photo-only team display. Deliberately
  *not* replacing the photo grid or forcing every visual team member to have a full site
  account — an admin can keep the lightweight photo display for visual flair while separately
  marking which entries correspond to real, logged-in members. This is what actually powers
  the new Dashboard card; the photo grid doesn't need to match it exactly.
- New "My Serving Schedule" card, mirroring `MyGroupsCard`'s structure — display-only, no
  cancel action like `MyEventsCard` has, since removing yourself from a serving commitment is
  a real conversation with a ministry leader, not a self-service toggle.
- **Verified the isolation, not just that data shows up**: seeded two members and two rota
  entries, each entry assigned to a *different* member, then logged in as Member A and
  confirmed their Dashboard shows only their own assignment (team name, date, service time)
  and specifically does **not** show Member B's entry — the check that actually matters for a
  per-document relationship query like this, not just "does something appear." Also confirmed
  the `/admin` experience directly: the new "Assigned Members" field renders as a real
  multi-select showing the actual selected member, with its guidance text visible, and
  confirmed the card's heading renders correctly in Tamil.

## Real join requests for Ministries and Groups — replacing mailto: links entirely

Both "Join Group" (on `/groups`) and "Join Ministry" (on `/ministries`) previously opened a
mailto: link — nothing confirmed the message was ever sent, nothing sat anywhere for an admin
to review, and there was no way to track a request's status. Replaced with a real, trackable
system across both collections, following the explicit plan agreed on before any code was
written: member-only requests, admin approve/decline, tracked through the member's real
account email rather than an outbound message, and the listing pages themselves reflecting
whether the member has already requested, is already a member, or hasn't asked yet.

- **New `JoinRequests` collection**, with a polymorphic relationship (`relationTo: ['ministries',
  'groups']`) so one unified system covers both, matching what was explicitly asked for rather
  than building two parallel collections. Member-only `create`, enforced at the API level (not
  just hidden in the UI) — same reasoning as `EventRegistrations`. Per-document `read` access
  (a member sees only their own requests) via the same query-constraint pattern used
  throughout this project's other member-owned records.
- **Approve and assign are one action, not two.** An `afterChange` hook fires exactly once on
  the transition into `approved` and automatically adds the member to `myGroups` or
  `myMinistries` (a new field added to Members, mirroring `myGroups` exactly) — there's no
  separate manual step an admin could forget.
- **Ministries is now member-gated for the first time** — previously anyone could email to
  join a ministry; this was an explicit, deliberate change requested alongside the rest of
  this feature, not an oversight.
- **The listing pages show one of three states per card**: Join (never requested, or a past
  request was declined — a decline doesn't permanently block a fresh request, deliberately),
  Request Pending (already asked, prevents duplicate submissions while nobody's reviewed it
  yet), or "You're Already a Member" (approved). Both pages fetch the member's own request
  history in one query and compute each card's status from it — no per-card round trip.
- **Two new Dashboard cards**: "My Ministries" (mirrors the existing "My Groups"), and a
  unified "My Requests" showing pending/declined items across both types together, since
  "still waiting to hear back" is the same concept regardless of which one it is — per the
  explicit requirement that members should see that status too, not just approvals.
- **Admin "notification" is realistic about what's actually buildable here**: there's no
  email-sending service configured in this project (the same gap that came up during the
  newsletter/Brevo discussion), so a literal push or email alert to the admin isn't something
  this pass could build without also standing that up. What's shipped instead: `JoinRequests`
  sorts newest-first by default, so a fresh (almost always pending) request is the very first
  thing an admin sees on opening the collection — flagged clearly as the realistic version of
  "notification" rather than overstating what was built.
- **Two real bugs caught during the build, not glossed over**: the join-status lookup was
  initially built as a JavaScript `Map`, which can't cross the Server-to-Client component
  boundary in Next.js — `GroupsExplorer`/`MinistriesExplorer` are client components receiving
  this as a prop, so this would have broken at runtime, not at build time; fixed by switching
  to a plain `Record`. Separately, `defaultSort` was first written under `admin` in the
  collection config — the build's type-checker caught that it's actually a top-level property,
  not an admin-panel option.
- **Verified the complete lifecycle for real, not just each piece in isolation**: submitted an
  actual request as a member, confirmed it persisted after a full page reload (not just local
  state), confirmed it appeared correctly in `/admin`, approved it, then *directly queried the
  database* to confirm the hook had actually updated `myGroups` — not just that the UI looked
  right afterward — before confirming that flowed through to both the Dashboard and the
  listing page's new "Already a Member" state. Repeated the entire cycle a second time for
  Ministries specifically, since it's a genuinely different collection and target type where a
  subtle bug could easily hide, and separately tested the decline path (Dashboard shows a
  "Declined" badge; the listing page correctly allows a fresh request afterward). Confirmed
  every new piece of UI text renders correctly in Tamil.

## Event list cards now reflect the viewer's own registration status

The event detail page's registration form already correctly showed "You're Registered" for
an event a member had signed up for — but the `/events` **list** page's cards never checked
this at all. Every card with `requiresRegistration` showed "Register" unconditionally,
regardless of whether the viewer had already registered — the exact same class of gap fixed
for the Ministries/Groups join-request cards, just not caught in that pass since Events uses
a separate registration system.

- The Events list page now fetches the current member's own active registrations (one query,
  `depth: 0` since only the event IDs are needed) and passes a plain `string[]` of registered
  event IDs down to `EventsExplorer` — deliberately not a `Set`, for the same
  crosses-the-Server/Client-boundary reason the Ministries/Groups status lookup uses a
  `Record` instead of a `Map`.
- `EventCard` now renders one of two states per event that requires registration: "Register"
  (unchanged) or "Already Registered" (new, non-interactive, with a checkmark) — member-gating
  for the registration action itself is unchanged, already enforced on the detail page.
- Added `export const dynamic = 'force-dynamic'` to the Events list page — this state depends
  on the viewer's session, so a cached response would leak one visitor's registrations onto
  everyone else's screen.
- **Verified the distinction is genuinely per-event, not a blanket toggle**: seeded two
  registration-required events and registered the test member for only one, then confirmed
  the registered event's card shows "Already Registered" while the *other* event's card still
  correctly shows "Register" — the check that actually matters here, since a bug that just
  flipped both cards together would have passed a less careful test. Confirmed the label
  renders correctly in Tamil.

## Login/Create Account visual redesign — and a real asset gap found along the way

Updated to match a provided reference screenshot. Most of the design was already close —
the mail/lock icons inside the inputs, "Forgot Password?" sitting alongside the "Password"
label, the "Remember me" checkbox, the white card with rounded corners, all of it already
matched before touching anything. The one genuinely different piece was the background
photo treatment: it had been flattened to `opacity-15` (barely visible), while the reference
shows a clearly recognizable photo with a soft white vignette fading toward the edges.
Replaced the flat opacity with a radial-gradient overlay (transparent-ish in the center,
fading to near-white at the edges) — the correct CSS technique for that look — and applied
the identical treatment to Create Account for consistency, since the two pages are clearly
meant to look the same.

**A real, separate finding surfaced while verifying the result, not glossed over**:
`/images/login-background.jpg` is a flat placeholder color (labeled "login-background" in
one corner), not an actual photo — confirmed by viewing the raw file directly, not just the
rendered page. The gradient overlay code is correct and ready for a real photo, but there's
no photographic detail underneath it to actually reveal right now, so the live result won't
show the sanctuary interior visible in the reference until a real photo is supplied.
Deliberately not generating a fake or stock "church interior" image to paper over this — a
real business's website showing a photo of a space that may not be their actual building
isn't something to fabricate silently.

Verified the change didn't break anything real underneath the new visuals: created a genuine
test member and confirmed the login flow still authenticates correctly end-to-end with the
redesigned form.

**Update: the real photo has since been supplied and is now in place.** The placeholder flat
color at `/images/login-background.jpg` has been replaced with an actual photo of the
sanctuary (wooden ceiling beams, pews, tall windows), used on both Login and Create Account.
The gradient overlay work from the previous round needed no changes — it was built correctly
in anticipation of exactly this. One thing worth flagging: the supplied photo is 512×286,
noticeably lower resolution than typical full-screen background images; it renders cleanly at
standard viewport sizes but may show slight softness on very large displays, since
`object-cover` has to scale it up further to fill the viewport. Not a blocking issue, just
worth knowing if a higher-resolution version becomes available later. Re-verified the login
flow still authenticates correctly with the real photo in place, not just that it displays.

## Homepage hero background video (optional, with a real static-image fallback)

Discussed before building anything: self-hosting is impractical for full-length sermons (GB
files, real bandwidth costs), but that reasoning doesn't automatically carry over to a short
looping banner clip — a well-compressed 5-15 second muted loop is a fundamentally different
scale, genuinely a few hundred KB to a few MB, well within a free-tools budget. Separately,
YouTube — the right call for Sermons/Live — turns out to be the *wrong* fit here specifically:
iframe autoplay is unreliable (especially on mobile), looping a single video needs a flaky
`playlist` parameter workaround, and there's always a visible loading flash before an iframe's
content appears, unlike a native `<video>`'s instant poster-frame fallback.

**What shipped**: `Homepage.hero` gained two optional upload fields —
`backgroundVideo` (MP4/H.264, the safe universal fallback) and `backgroundVideoWebm` (VP9,
usually smaller at equal quality, offered first when present). `backgroundImage` stays
required — it's both the video's poster frame during load and the fallback for the ~5% of
visitors who have `prefers-reduced-motion` set at the OS level. New `HeroBackground.tsx` is a
small, deliberately isolated Client Component (the rest of `Hero.tsx` stays server-rendered)
that checks the reduced-motion media query in JS — not just CSS — specifically so those
visitors' browsers never even request the video file, rather than downloading it and hiding it
with CSS.

**Real footage was supplied and compressed properly, not just linked to.** A 4K (3840×2160)
11MB stock clip was downscaled to 1080p and re-encoded for both formats — 671KB (MP4) and
562KB (WebM), both from a clean ~6.3-second loop, both checked directly for banding on the
sunset-gradient background frame (none visible) before being used anywhere.

**A real, non-obvious testing snag, worked through rather than glossed over**: initial
playback checks reported `NETWORK_NO_SOURCE` despite the file serving correctly (verified
directly — proper `206 Partial Content`, `Accept-Ranges: bytes`, correct `Content-Type`, all
present). Traced this to Playwright's bundled Chromium lacking licensed H.264 decoding
(`canPlayType` returned empty for H.264, `'probably'` for VP9) — a testing-sandbox-specific gap,
not something real-world users hit, since actual Chrome/Safari/Firefox/Edge all support H.264
natively. Rather than just accept "can't verify in this sandbox," encoding both formats turned
out to be the right call anyway — it let the full pipeline actually be proven end-to-end via
the WebM path, and it's a genuine best practice independent of the testing constraint that
surfaced it.

**Verified for real, not just that the build succeeded**: uploaded both compressed files
through the Media collection directly (accepted with zero schema changes needed — Payload's
default `upload: true` already permits any file type); confirmed the browser actually picks
WebM automatically and that `currentTime` genuinely advances over a real wait (1.52s → 3.53s
across a 2-second pause) rather than just checking `paused === false`, which a stalled load
can still report; separately loaded the page with `prefers-reduced-motion: reduce` emulated
and confirmed the `<video>` element isn't rendered at all — the static image shows instead, by
design; and checked both new admin fields directly in `/admin`, including their guidance text.

**A real, unusual sandbox-specific finding worth documenting for future work in this
environment**: background server processes started via `(cmd &)` only reliably persist for
tool calls made *within* the same call that started them — attempting to reuse a
previously-backgrounded server from a separate, later call produced confusing, inconsistent
403/404 errors that had nothing to do with the actual code. Every verification in this round
was restructured to start-and-test within a single combined call once this was identified.

**Delivered separately from the code zip, since it's data, not code**: the two compressed
video files aren't included in the zip below — a git-style code export can't carry database
content, and the actual video needs uploading through `/admin` on the real deployed site, the
same as any other media. Provided as separate downloads instead.

## Newsletter subscription — real double opt-in via Brevo

Both newsletter forms (Homepage's `StayConnected`, Events' `NewsletterCta`) were static markup
with a comment literally saying "submitting does nothing yet." Wired to a real, working double
opt-in flow through Brevo — the provider already in use for this project (same one considered
earlier for this exact purpose).

- **New API route** (`/api/newsletter/subscribe`) calls Brevo's dedicated double opt-in
  endpoint server-side — the API key never reaches the client, only this route ever sees it.
  Double opt-in means submitting the form doesn't actually subscribe anyone; it triggers
  Brevo's own confirmation email, and the person isn't really on the list until they click the
  link in it.
- **New confirmation landing page** (`/newsletter-confirmed`) — where Brevo's `redirectionUrl`
  sends someone after they click that confirmation link. Built locale-aware: the redirect URL
  is constructed from the incoming request's own locale, so a Tamil or Kannada visitor who
  confirms lands on the matching version of the page, not always the English one.
  `BREVO_LIST_ID` and `BREVO_TEMPLATE_ID` are configurable via env vars (defaulting to 3 and 1
  respectively, matching what's already set up in Brevo) rather than hardcoded, so
  staging/production could point at different lists later without a code change.
- **Shared submission logic** (`useNewsletterSubscribe` hook) — the two forms look genuinely
  different (white background/navy button vs. navy background/white button) so weren't merged
  into one shared component, but both do the exact same fetch/loading/error/success handling,
  kept in one place rather than duplicated.
- **A real, non-obvious bug caught by testing in Tamil specifically, not glossed over**: the
  error message showed in English even on the Tamil page. Traced to the hook preferring the
  API route's raw error text (`data?.error`) over its own translated fallback — but the
  server-side route has no access to the visitor's locale without significantly more plumbing,
  so its error strings are unavoidably hardcoded English. Fixed by having the client always
  use its own translated message for any failure, never surfacing the server's raw text
  directly. This wouldn't have been caught testing only in English.
- **What could and couldn't be verified from this sandbox, stated plainly rather than
  glossed over**: `api.brevo.com` isn't in this environment's network allowlist, so an actual
  successful Brevo call — confirming Brevo genuinely accepts this exact request shape and
  sends a real confirmation email — can't be verified here and needs confirming on the real
  deployment. What *was* verified directly: the route correctly rejects a request with no
  `BREVO_API_KEY` configured (graceful 500, not a crash); correctly validates a missing email
  and malformed JSON with distinct, specific error responses; correctly returns a graceful
  error when the Brevo call itself fails (proven for real, since Brevo is genuinely
  unreachable from this sandbox — not simulated); the same failure surfaces correctly through
  the actual UI, not just via a raw request; and a build-output check confirmed the new
  `/api/newsletter/subscribe` route is genuinely distinct from Payload's own `/api/[...slug]`
  catch-all, not accidentally shadowed by it.

## Giving / Razorpay — audited and hardened, not built from scratch

Found substantial existing work already in place — the `/give` form's full Razorpay Checkout
integration, both API routes (`create-order`, `verify`), and the `Donations` collection all
already existed. Given the stakes of real payment code, this got the same thorough audit as
Sermons/Live rather than being trusted at a glance.

- **Signature verification confirmed cryptographically correct**, not just read and trusted:
  computed a real HMAC-SHA256 signature locally and confirmed the verify route's exact logic
  (including the `crypto.timingSafeEqual` comparison) correctly accepts a valid signature and
  rejects a tampered, wrong-length, or empty one — no network dependency needed for this part,
  since it's pure local cryptography.
- **`Donations.create: () => false` confirmed to actually work, not just read correctly**:
  attempted a direct POST of a fake donation straight to the public REST API and got a clean
  rejection — confirming donations are genuinely unreachable except through the trusted
  server-side verify route using Payload's Local API.
- **A real edge case found and fixed**: if the payment success callback ever fires twice for
  the same payment (a network retry, a slow connection causing a client-side re-send), the
  original code would hit the collection's unique constraint on `razorpayPaymentId` and
  surface "Your payment succeeded, but we had trouble recording it" — misleading, since it
  actually *was* recorded correctly the first time. Fixed with an explicit check-before-create
  (query for an existing record with that payment ID before attempting to create one) rather
  than relying on catching and pattern-matching the constraint error, which would have been
  more fragile. Verified directly: simulated the exact duplicate-call scenario and confirmed
  it now returns success with exactly one donation record in the database, not two.
- **Admin read-only-ness confirmed empirically**: logged in as an admin and confirmed there's
  genuinely no Save or Delete option on a donation record — matches the sensitivity financial
  records deserve.
- **Tamil translations checked specifically** for the give form and its error state, given the
  localization bug found in the newsletter feature — confirmed this one doesn't have the same
  issue; every error path already used the client's own translated message correctly.
- **Same honest limitation as Brevo**: `api.razorpay.com` isn't reachable from this sandbox,
  so an actual successful order creation against real test-mode keys can't be verified here —
  that needs confirming on your own deployment with your real Razorpay test credentials.

**A real sandbox-hygiene issue surfaced and resolved during this round, documented here
rather than quietly worked around**: while restoring the production database config at the
end of this round, the on-disk `payload.config.ts` was found to already be SQLite-configured
before this round's own testing setup began — leftover from earlier work with reduced
visibility into exactly how it got there. Rather than trust it, the production config was
rebuilt from the last independently-verified-correct Postgres backup (confirmed via the
`postgresAdapter` import and the `schemaName: 'payload'` setting, both load-bearing and easy
to silently lose), with the `Donations` collection import and registration re-added to match
the current source tree exactly. Verified line-by-line before restoring, not assumed correct.

## Supabase Storage — Media uploads now persist on Vercel

The `Media` collection had a TODO from very early in this project flagging that local disk
storage (Payload's default) doesn't survive on Vercel — its serverless functions have no
persistent filesystem, so anything an admin uploaded would work for one request and then be
gone. Wired up `@payloadcms/storage-s3` against Supabase's S3-compatible Storage API to fix
this for real.

- **Two genuine pre-existing dependency problems surfaced and fixed while installing this**,
  neither caused by this change: `graphql@17.0.2` was installed while Payload 3.87.1 requires
  `^16.8.1` — a real major-version mismatch, fixed by installing `16.14.2` explicitly. Separately,
  `@payloadcms/next`'s declared peer range for Next.js has a gap that excludes 15.5.x
  entirely (jumps from `<15.5.0` straight to `>=16.2.6`) — confirmed this is a benign
  declared-range lag rather than a real incompatibility, since this exact Next.js version has
  built and run successfully throughout this entire project, and proceeded past it deliberately
  rather than downgrading Next.js or leaving the install broken.
- **The plugin is conditional on real credentials being present** (`SUPABASE_S3_ACCESS_KEY_ID`,
  `SUPABASE_S3_SECRET_ACCESS_KEY`, `SUPABASE_S3_ENDPOINT`, `SUPABASE_S3_BUCKET`) — falls back to
  local disk automatically when they're not set, so local development and this project's own
  SQLite-based sandbox testing keep working without needing real Supabase credentials.
  `forcePathStyle: true` is set on the S3 client config, which Supabase's compatibility layer
  specifically requires — without it, requests resolve to the wrong URL shape.
- **A real, non-obvious bug found and fixed during testing**: the admin panel failed to load
  entirely on first test, with a console error that the plugin's own upload-handler component
  wasn't found in Payload's import map. Plugins that add admin UI components need that map
  regenerated (`payload generate:importmap`) — not obvious from the plugin's own setup
  instructions. Regenerated it, confirmed the new component appeared, and confirmed the admin
  panel loads correctly afterward.
- **Verified both the "on" and "off" paths, not just one**: a full build with zero Supabase env
  vars set succeeds cleanly (confirming the fallback works); a full build with fake-but-present
  credentials also succeeds, and the admin panel loads correctly with the plugin active.
  Attempted an actual file upload against those fake credentials and got a clean "Something
  went wrong" toast rather than a crash — confirming the plugin genuinely attempts the real
  Supabase connection instead of silently no-opping, which is the correct failure mode given
  Supabase isn't reachable from this sandbox.
- **Same honest limitation as Brevo and Razorpay**: a real, successful upload landing in your
  actual Supabase bucket can't be verified from here — that needs confirming on your own
  deployment with your real credentials in place.

## Volunteer page: "Sign Up" hidden entirely for logged-in members

Reported directly: the volunteer "image" variant cards (the wide cards with a background
photo) always showed "Sign Up" regardless of whether the visitor was already a logged-in
member — a plain, static link with zero session awareness. For a member who's already part of
the church, "Sign Up" reads like creating a new account, which isn't what they'd be doing.

**This went through two iterations, worth documenting since the second is simpler and better
for right now.** The first version swapped the label to a translated "Join the Volunteer Team"
for logged-in members while keeping the same underlying link. Discussing the actual
destination surfaced a real gap: that link currently just points wherever the admin has typed
(commonly a generic `/contact` form), with no connection to the real, trackable
join-request system already built for Ministries. A precise fix — linking each volunteer area
to its specific matching ministry — was considered and intentionally deferred; the simpler,
better-for-now choice was to remove the link for logged-in members entirely rather than show a
relabeled button that still doesn't lead anywhere meaningful.

- **The button is now hidden completely for a logged-in member** — not relabeled, not
  disabled, just absent. Logged-out visitors see the admin's existing configured label (or
  "Sign Up" if unset) exactly as before; nothing about that per-area customization changed.
- Removed the now-unused `joinTeam` translation key from all three languages and the
  `getTranslations` call it required, since `ServiceAreasGrid` no longer needs any
  translation lookups at all — kept the component as simple as the actual behavior calls for,
  rather than leaving unused scaffolding in place.
- `export const dynamic = 'force-dynamic'` on the Volunteer page (added in the previous pass,
  confirmed still correct here) remains necessary — the page still depends on session state to
  decide whether to render this button at all, so a cached response could still leak one
  visitor's login state onto someone else's screen without it.
- Verified both states directly on the real page, not assumed: a logged-out visitor still
  sees "Sign Up" exactly as before; logged in as a real seeded member, the same card shows no
  sign-up link at all, with the card's layout still reading cleanly (title and description,
  no awkward empty space where the button used to be) — confirmed visually, not just via a
  text-content check.

## Back button on Events and Ministries detail pages

Reported directly: no way to get back to the Events list from an individual event page,
expecting this to already exist since the request compared it to Ministries. Checked first
rather than assuming the comparison was accurate — Ministries didn't actually have one either,
anywhere in the project. Rather than build against a false premise, added it to both pages
consistently, since a visitor landing on either would reasonably expect the same behavior.

- A simple "← Back to Events" / "← Back to Ministries" link now sits at the top of each detail
  page, linking back to the respective listing page.
- Translated into all three languages, added under the existing `events.detail` namespace
  (already used for the Date/Location/Cost labels on that page) and a new `ministries` key,
  matching each page's established translation structure rather than introducing a new
  ad-hoc namespace.
- **Verified by actually clicking the link, not just checking the text renders**: seeded a
  real event and a real ministry, loaded each detail page, clicked the back link, and
  confirmed the browser genuinely lands on `/events` and `/ministries` respectively — not just
  that "Back to Events" appears somewhere in the page text. Confirmed both render correctly in
  Tamil as well.

## Forgot Password — a real screen, honestly not wired up yet

Discussed before building: real password-reset email requires domain authentication with
Brevo, which Gmail cannot satisfy (Brevo explicitly refuses to authenticate free email
provider domains) and which isn't possible at all without an owned domain — still on a
vercel.app URL at time of writing. Rather than build nothing, or build something that fakes
success, landed on a middle path: a real screen matching the Login/Create Account design
exactly, with an honest message once submitted rather than a "check your email" confirmation
that would never actually deliver anything.

- Replaced the generic `PagePlaceholder` that previously sat at `/forgot-password` (the
  "Forgot Password?" link on the login form already correctly pointed here — it was the
  destination page itself that was never built).
- **Deliberately does not call Payload's real `forgot-password` endpoint.** That endpoint
  would technically "succeed" today — Payload generates a reset token regardless of whether
  an email adapter is configured — but with no email adapter in place, the reset email would
  silently never arrive. Showing a fake success message for something that can't actually
  happen would be worse than being upfront that it isn't ready.
- Instead, submitting shows a clear "Online reset isn't available yet" message alongside the
  church's **real, admin-configured** phone number and email (pulled from the same
  `SiteSettings` global used throughout the rest of the site, not hardcoded) — so anyone
  locked out still has a genuine, working way to get help in the meantime.
- Verified the real data flows through correctly, not just that the page renders: seeded
  `SiteSettings` with distinctive test contact info, clicked the actual "Forgot Password?"
  link from the real Login page (rather than navigating directly), and confirmed both the
  church name and the exact seeded phone/email appear on the resulting message — proving this
  reads live data, not a placeholder. Also confirmed the full flow renders correctly in Tamil.
- **When the domain is ready**: wiring this up for real means adding Brevo SMTP credentials as
  an email adapter in `payload.config.ts` (the same conversation already had, just pending the
  domain) and swapping this form's submit handler to call Payload's real endpoint instead of
  showing the static message — the screen and its design won't need to change, just the one
  handler function.

## Missing translation audit: Volunteer page's "Areas of Service" heading

Asked to check for translations missed in earlier work, rather than pointed at a specific
known spot. Searched systematically across every component with no translation import at all
(the clearest signal of a missed spot) rather than just re-reading files from memory.

- **Found and fixed**: `ServiceAreasGrid.tsx`'s "Areas of Service" heading, its subtext, and
  the "Sign Up" fallback label were all hardcoded English, never wired to the translation
  system — left behind across the several rounds of work on this exact component (the
  Sign-Up-vs-Join-the-Volunteer-Team changes) without ever being caught, since the component
  worked correctly in English the whole time.
- **A second finding, correctly triaged rather than treated the same way**: `LoadingScreen.tsx`
  also has hardcoded English text ("Preparing a space for worship…"), but a search across the
  entire `src` directory confirmed it's imported nowhere at all — genuinely dead code no real
  visitor can ever see. Left as-is rather than "fixed," since translating text nobody
  encounters isn't a real improvement, and noted here for visibility rather than silently
  left for someone to wonder about later.
- Verified in all three languages on the real page, not just checked that new keys exist:
  confirmed the heading renders correctly in English, Tamil, and Kannada, and specifically
  confirmed the English fallback text is completely absent on the Tamil/Kannada versions —
  the check that actually matters, since a broken translation key can silently fall back to
  showing English without erroring.

## Three coordinated updates: Leadership Interest tracking, Group coordination, admin visibility

**1. Leadership Interest now shows on the member's Dashboard.** The `LeadershipInterests`
collection already tracked status (New/Contacted/Placed) and who submitted it — the only real
gap was that `read` access was admin-only, so nothing could ever show it back to the member
who submitted it. Extended access to the same per-document pattern `JoinRequests` already
uses, added a new `MyLeadershipInterestCard`, wired it into the Dashboard. Confirmed the
form's own immediate "thank you" already existed before touching anything — the actual,
reported gap was specifically the missing persistent visibility, not the initial
acknowledgment.

**2. Groups now have a real detail page, with member coordination — privacy-gated.** There was
no `/groups/[slug]` page at all before this, just the listing. Built one showing group info to
everyone, and — only for a member confirmed to actually be part of that specific group — a
list of fellow members. Deliberately names only, not email or phone numbers, since that's
contact info nobody explicitly agreed to share with the whole group just by joining it.
Wired `GroupCard`'s title to actually link there, since nothing did before. Caught and fixed a
sloppy leftover of my own mid-build: an invisible, functionally pointless `sr-only` tag sitting
where the leader's photo should have actually been rendered.

- **Verified the privacy gating specifically, not just that the feature works for the right
  person**: seeded two members in the same group and a third, unrelated member, then confirmed
  both group members see each other correctly — but also confirmed a logged-out visitor *and*
  a logged-in member who isn't in that group both see neither name, with a clear explanatory
  message instead. The negative case is the one that actually matters for a privacy feature
  like this.

**3. A real "Needs Attention" panel on the admin dashboard.** Real email alerts to the admin
still aren't possible without the domain-authenticated Brevo email setup discussed earlier —
this is the realistic, buildable version in the meantime. Verified Payload's exact
`beforeDashboard` component API directly from its own type definitions rather than guessing,
built a server component that queries pending Join Requests and new Leadership Interest
submissions and surfaces them right at the top of `/admin`, above the collection list, the
moment it's opened.

- **A genuinely new lesson for this project, worth remembering**: any Payload admin panel
  component registered this way needs `payload generate:importmap` re-run afterward, or the
  admin panel fails to load entirely — the same class of issue first discovered with the
  Supabase Storage plugin's own upload-handler component, now confirmed to apply to
  hand-built admin components too, not just third-party plugins.
- A real lint error surfaced and fixed properly during this build: plain `<a>` tags triggered
  Next.js's own `no-html-link-for-pages` rule, since this widget genuinely does live within
  the same Next.js app — fixed with real `next/link` rather than suppressing the warning.
- **Verified by actually clicking through, not just reading the panel's text**: seeded a real
  pending join request and a real new leadership interest, confirmed the panel shows the
  correct combined count and both individual counts, then clicked the join-request link
  specifically and confirmed it lands on the correctly pre-filtered admin list showing that
  exact request — not just that a link with the right label exists on the page.

## Group Members: a real bug found and fixed, and a "seen" notification behavior built as discussed

**Group Members turned out to already exist** — `Groups.members` (a real, admin-editable
relationship field, with `Members.myGroups` correctly set up as a derived, read-only `join`
field pointing back to it) and the Join Request approval hook already wrote to it correctly.
This was from earlier work not fully visible going into this round. Rather than assume it
worked and move on, it got the same scrutiny as everything else in this project.

- **A real, would-have-crashed-at-runtime bug found and fixed in three places.** A `join`
  field like `myGroups` returns `{docs, hasNextPage, totalDocs}`, not a plain array — but
  three separate places (`adaptGroups` on the Dashboard, `getJoinStatus`'s "already a member"
  check, and the group detail page's own membership check) all called array methods
  (`.length`, `.filter`, `.some`) directly on it, which the build's own type checker caught
  as a genuine compile error once types were regenerated. Fixed by reading `.docs` instead —
  the array is one level deeper than the earlier code assumed. Simplified the group detail
  page's fellow-members list to read `doc.members` directly from the already-fetched group
  document too, removing a redundant second query that existed only because the correct,
  simpler path hadn't been used.
- **Re-verified the whole pipeline afterward using data seeded exactly the way an admin
  actually would** — directly setting `Groups.members` on creation, not through any
  member-side workaround — and confirmed a member in that group sees their group correctly
  on the Dashboard, sees themselves and their fellow member on the group's own page, and
  that a logged-out visitor *and* a logged-in outsider both see neither name, tested with
  fresh, isolated browser sessions specifically to rule out any session-carryover false
  positives in the test itself.

**The admin "Needs Attention" panel now behaves exactly as discussed and confirmed**: once an
admin has seen a pending item, it stops appearing on their next visit — even though it's still
genuinely unresolved — until something new comes in. This was a deliberate choice made after
flagging the real trade-off (an admin could forget about something once it's no longer
visible); implemented as asked, not overridden.

- Added a `notificationsSeenAt` timestamp to admin accounts specifically (not a global,
  shared setting), so multiple admins each get their own independent "have I seen this" state
  rather than one admin's visit silently clearing it for everyone else.
- **Verified the full three-visit sequence for real, not just the mechanism in isolation**:
  seeded one pending request, confirmed the first admin visit shows it; reloaded the
  dashboard and confirmed that same still-pending request correctly disappeared on the second
  visit; then seeded a second, genuinely new request and confirmed the panel reappeared
  showing exactly that one new item — not both, proving the already-seen one correctly stayed
  suppressed rather than the whole mechanism just resetting.
- A real type error surfaced and fixed along the way: an empty-object fallback for "no prior
  visit yet" didn't satisfy Payload's `Where` query type — fixed by building the query
  conditionally instead of always including a possibly-empty clause.

## Group member roster moved to the Groups listing cards themselves

Clarified directly: the member roster belongs on each Group's own card on the `/groups`
listing page, positioned specifically between "Led by" and the Join/Already-a-Member button —
not on the separate detail page built two rounds ago, which stays as-is for browsing a
group's full info.

- Added `members` to `GroupListing` (the type each card renders from) and the groups adapter,
  reading directly from `Groups.members` — the same real, admin-editable field already
  confirmed working last round, no new backend piece needed here.
- **The privacy gating is computed per-card, not per-page** — a member could be shown several
  groups at once on this same listing, and should only see the roster for the ones they're
  actually part of. Verified this specifically, not just the single-group case: seeded two
  separate groups with different members, logged in as someone in only one of them, and
  confirmed their fellow group member's name appears on that group's card while the *other*
  group's card — visible on the same page, at the same time — shows no roster at all, going
  straight from "Led by" to "Join Group" exactly as it would for someone who'd never
  logged in. Also confirmed a fully logged-out visitor sees no roster on either card.

## Critical fix: mobile navigation was completely inaccessible

Reported directly from checking the live site on a real phone: the entire header menu was
hidden, no way to navigate anywhere. Confirmed the cause immediately in the code — `<nav
className="hidden items-center gap-8 md:flex">` hides the nav completely below the `md`
breakpoint (768px, effectively every phone), with no mobile alternative ever built. Worth
being honest about rather than glossing over: this slipped through this project's entire
history of testing because every Playwright check throughout has used desktop-sized viewports
— nothing was ever actually checked at a phone-sized width until this was reported.

- Added a standard hamburger menu, visible only below `md`, opening a full-width panel with
  every nav link, Login or the member's name, Dashboard, Log out, the language switcher, and
  Give — everything the desktop header offers, not just the page links.
- **A second, related bug found and fixed while testing this, not assumed to just work**:
  reusing the existing `MemberMenu` dropdown inside the new mobile panel technically worked,
  but its member-name text had `hidden ... sm:inline` baked in from when it was only ever
  shown in the compact desktop header — on a real phone-width screen, a logged-in member's
  name silently didn't appear at all inside their own mobile menu. Beyond that, reusing a
  dropdown-that-requires-a-tap-to-open inside a panel that's already the "opened" state would
  have meant two taps to reach Dashboard or Log out. Rebuilt this section to show the name,
  Dashboard, and Log out directly and stacked instead, matching the rest of the mobile panel,
  with its own logout handler rather than nesting the desktop dropdown component inside it.
- Verified thoroughly at an actual mobile viewport width (375\u00d7812), not just that the code
  compiled: confirmed the hamburger appears and the nav is genuinely reachable, confirmed
  clicking a link actually navigates and the menu auto-closes afterward, confirmed a
  logged-in member's real name now appears correctly with working Dashboard and Log out
  (tested by actually logging out and confirming the session really ended, not just that the
  button existed), and separately confirmed desktop is completely unaffected \u2014 the hamburger
  stays hidden there and the original horizontal nav still shows directly with no interaction
  needed. Also confirmed the mobile menu labels render correctly in Tamil.

## Full mobile compatibility audit across the site

Requested after the header fix, with an explicit constraint: fix mobile without touching the
desktop experience at all. Approached in two passes — a static code search for the exact bug
pattern that caused the header issue (content hidden below a breakpoint with no alternative
shown), then systematic visual testing at a real 375px mobile viewport across every major page,
since layout and spacing problems don't show up in a code search the way visibility bugs do.

**The static search found no other instances of the header's specific bug** — two files matched
the search pattern, and both turned out to be non-issues on inspection: one was a false-positive
regex match on "overflow-hidden" (an unrelated CSS utility that happens to contain the substring
"hidden"), and the other was a deliberately documented, genuinely safe choice — a decorative
timeline connector line hidden on mobile, with none of the actual milestone content affected.

**Three real, distinct bugs found through the visual pass and fixed**, all verified on both
mobile and desktop afterward, not just re-read in code:

- **Dashboard cards had no minimum spacing between title and link** — "My Registered
  EventsBrowse Events" was visibly running together, since `justify-between` alone provides no
  spacing floor once combined text length eats up the available width. Fixed consistently
  across all five dashboard cards sharing this exact header pattern (Events, Groups, Ministries,
  Rota, Volunteer Shift) with `flex-wrap` plus an explicit gap, not just the one card that
  happened to visibly break — the others could fail the same way under longer Tamil or Kannada
  translations even though English text fit today.
- **The Groups listing page showed its filter sidebar above the page's own hero and title on
  mobile** — a visitor would see filter buttons before knowing what page they were even on.
  Root cause: a two-column desktop grid collapsing to a single column naturally stacks in DOM
  order unless explicitly told otherwise. Fixed with the standard CSS `order` utility pattern —
  sidebar shows after the main content on mobile, stays visually first (left) on desktop
  exactly as before.
- **The Worship Rota page (`/ministries/rota`) had this identical sidebar-ordering bug** — found
  by systematically checking every component sharing the same fixed-width-sidebar grid pattern
  rather than assuming the issue was unique to Groups. Fixed the same way.
- **A fourth, smaller spacing bug** on the group detail page: "Back to Groups" and the category
  badge were crowding onto the same line with no space between them, since both were inline-level
  elements and a margin-bottom alone doesn't force a line break between inline siblings. Checked
  whether the Events detail page had the same issue (it uses an identical-looking pattern) and
  confirmed it didn't — Events wraps its back-link in its own block-level container, which
  already forces the break; Groups' link and badge were direct siblings with no such wrapper.
  Fixed by changing the link from `inline-flex` to a `flex w-fit` block-level element instead.

**Every fix was screenshotted on both a real mobile viewport and desktop afterward**, specifically
to catch any accidental impact on the desktop experience given that was an explicit requirement
going in — every desktop screenshot came back visually identical to before each fix.

## Critical security fix: any logged-in Member could grant themselves full admin access

Found while answering a direct question about how admin access actually works — asked, then
verified rather than just explained from memory, since the stakes of being wrong either
direction (falsely reassuring or falsely alarming) were too high to guess at.

**The `Users` (admin) collection had no explicit `access` block at all.** Payload's own default
access rule for a collection with none specified is `Boolean(req.user)` — true for *any*
authenticated session, regardless of which collection it belongs to. Since `Members` also has
`auth: true`, a regular church member logging in through the public `/create-account` flow — with
zero admin intent — satisfied that same check. Confirmed this for real, not just reasoned about
it: created a genuine test Member account, logged in as that member (no admin privileges granted
anywhere), and sent one direct `fetch` request to `/api/users` from the browser console. It
returned `201 Created` with a brand-new, fully-privileged admin account using credentials of the
attacker's own choosing. No admin panel access, no special tooling — just a logged-in member and
one API call.

- **Fixed by adding explicit access control** requiring `req.user?.collection === 'users'` for
  `create`, `read`, `update`, and `delete` — matching the same pattern already used throughout
  this project for sensitive collections like `Donations`. This collection had been treated as
  "foundational plumbing" from very early on and never gotten the same access-control review as
  more feature-oriented collections since.
- **Re-ran the identical attack after the fix and confirmed it now correctly fails** — the exact
  same request now returns `403 Forbidden`, "You are not allowed to perform this action."
- **Three separate legitimate-use checks, specifically to confirm nothing else broke while fixing
  this**: confirmed an existing, genuine admin can still log in and view the Users collection
  normally; confirmed Payload's own built-in "create first user" bootstrap screen — the intended,
  one-time way to create the very first admin account on a brand-new deployment — still appears
  correctly for a genuinely empty `Users` collection and completes successfully end to end;
  and confirmed that bootstrap door correctly stays permanently shut on a second visit once an
  admin account exists, exactly as it did before this change. This bootstrap mechanism uses a
  separate code path from the normal `create` access rule (verified directly in Payload's own
  source), so it was never at risk from either the original vulnerability or this fix.

For anyone reading this who deployed before this fix landed: it's worth checking your production
Users collection for any account you don't recognize.

## First-admin race condition — a real follow-up concern, closed with a script

A sharp, well-reasoned follow-up to the access-control fix above: Payload's public "create
first admin" screen is only safe for the brief window between a fresh deploy going live and
someone actually claiming it. If anyone else — a bot scanning for exposed `/admin` panels, for
instance — finds that URL first, they claim the admin account instead, and since that bootstrap
door locks permanently the instant it's used, the real owner would be genuinely locked out with
no way back in through that path. This is a real, documented class of vulnerability, not
something to dismiss as unlikely.

**The fix isn't a code change — it's eliminating the window entirely.** Added
`scripts/seed-first-admin.ts`, a one-time utility that creates the admin account directly via
Payload's Local API, meant to be run immediately after migrations, before the site is ever
shared with anyone. By the time a stranger could possibly find the URL, there's nothing left
for them to claim — the bootstrap door is already closed.

- **A real mistake caught and corrected immediately, not left standing**: initially suggested a
  `payload create-first-user` CLI command without verifying it actually existed. Checked
  Payload's real CLI command list directly afterward and confirmed no such command exists —
  corrected this immediately with the actual, verified approach (the Local API script) rather
  than let an unverified command stand as guidance for a security-sensitive operation.
- **The script includes its own safety guard**: refuses to run at all if the Users collection
  already has any record, so it can't accidentally be pointed at a database that already has a
  real admin and create a redundant or conflicting account.
- **Verified end to end against a genuinely fresh, empty test database**: ran the script once
  and confirmed it created a real, working admin account; ran it again immediately afterward
  and confirmed the safety guard correctly refused, with a clear message explaining why; then
  logged in through the actual admin panel using the seeded account's credentials and confirmed
  it works exactly like any normally-created admin — not just that the database record existed,
  but that real authentication succeeds with it.
- **This is a reusable tool for this project going forward**, not a one-off fix — the same race
  condition would apply again for any future fresh database (a new staging environment, or
  production ever being rebuilt from scratch), and this script is meant to be the standard way
  to handle that moment from now on rather than relying on the public bootstrap screen.

## Closing the race condition for real: the public bootstrap path is now blocked entirely

A sharp, correct follow-up to the section above: the seed script only helps you *win* the race
against the public bootstrap screen — it doesn't remove the screen itself. Asked directly
whether it had been removed, and the honest answer was no. Fixed properly this round, in
`src/middleware.ts`, with two real bugs found and fixed along the way through direct testing
rather than assumption.

- **First attempt caused a genuine infinite redirect loop.** Redirecting the blocked page to
  another `/admin/*` path (specifically `/admin/login`) resulted in a blank, non-functional
  page. Investigated with real navigation tracking rather than guessing — confirmed over 60
  rapid navigations to the same URL in seconds. Payload's own client-side admin code sees the
  Users collection is still empty and keeps trying to route back to the bootstrap screen,
  fighting the redirect forever. Fixed by redirecting to the homepage instead, entirely outside
  Payload's own admin route tree, which sidesteps that fight completely — confirmed with the
  same navigation tracking that it now resolves in exactly two clean navigations.
- **Blocking the page alone was confirmed insufficient — not assumed to be enough.** Directly
  tested whether the underlying API endpoint the page itself calls
  (`/api/users/first-register`) could still be reached with a raw request, bypassing the UI
  entirely. It could — the exact same attack from two rounds ago succeeded again, just through
  a different door. Fixed by blocking that specific API path in the same middleware, returning
  a plain 404 rather than any response that would hint at what it's protecting.
- **Every legitimate path re-verified afterward, together, on a genuinely fresh empty
  database**: confirmed the bootstrap page redirects cleanly with no loop, confirmed the API
  endpoint correctly returns 404, confirmed `scripts/seed-first-admin.ts` still successfully
  creates a real admin account, and confirmed that seeded account still logs in normally through
  the real admin panel — the full, correct sequence working end to end with both blocks in
  place, not just each piece checked in isolation.

With this in place, the only way to create the first admin account on a fresh database is now
`scripts/seed-first-admin.ts` — there is no public path left to race against.

## One more edge case checked directly: bare /admin, not just the bootstrap sub-path

Asked directly to confirm this understanding rather than assumed correct: does the block also
cover someone simply visiting `/admin` itself, not the specific `/admin/create-first-user`
URL? Worth checking specifically, since the middleware's matcher excludes all of `/admin` by
default, with only that one sub-path carved out as an exception.

- **Confirmed correct, but only after catching a real bug along the way**: the first test of
  this showed a genuine server-side crash ("Application error") rather than a clean result.
  Investigated the actual server log rather than accepting the crash as some kind of
  coincidence — the real cause was unrelated to this fix, a sandbox database that had lost its
  tables between test rounds. Restored it properly and re-tested rather than reporting the
  crash as if it reflected the real, shipped behavior.
- **With the database properly in its intended state**, visiting bare `/admin` on a fresh,
  empty database correctly redirects all the way to the homepage — Payload's own internal
  logic for that root path depends on the same resources already blocked, so the protection
  extends there without any additional code needed.
- **Confirmed the full, correct sequence together, not each piece in isolation**: bare `/admin`
  redirects safely before any admin exists; running `scripts/seed-first-admin.ts` still
  succeeds; and after that, `/admin` correctly shows Payload's genuine login screen — confirmed
  visually, not just by checking the URL — with that seeded account logging in successfully.

## Two-tier admin roles: super admin and admin

Proposed directly, with a clear governance model already sketched out: a super admin created
only by the seed script, regular admins created by that super admin, and a super admin
protected from being edited or deleted by anyone else. Discussed three real open questions
before building (can regular admins manage each other, can a super admin promote someone else,
should a super admin be blocked from deleting themselves) rather than assuming answers to
decisions that would be awkward to reverse later.

- **Only a super admin can create new admin accounts** through the normal UI/API — a regular
  admin attempting this gets a clean 403, verified directly with a real API call, not assumed
  from reading the access rule.
- **A regular admin can only update their own record** — enforced as a database-level query
  constraint, not just a UI restriction, so it holds even against a direct API call bypassing
  the admin panel entirely. Verified a regular admin genuinely cannot update the super admin's
  record, and genuinely can update their own.
- **Field-level protection against self-promotion, verified against the actual database, not
  just the API response**: a regular admin can update other fields on their own record (their
  email, for instance) but their `role` field specifically is protected — Payload's real
  behavior here is to silently drop the unauthorized field from the update rather than reject
  the whole request, so the self-promotion attempt actually returns a `200` with the *rest* of
  the update applied. Caught this nuance by checking the stored role directly in the database
  afterward rather than trusting the API's response body, which could have looked like success.
- **Only a super admin can delete any admin account**, and a regular admin can't delete anyone,
  including themselves.
- **A super admin can promote a regular admin to super admin** — confirmed this works, and
  confirmed the resulting account genuinely has elevated permissions afterward, not just the
  label.
- **The "never lose the last super admin" safeguard**, built as two hooks (`beforeDelete` and
  `beforeChange`) rather than a simpler blanket rule, specifically because the real risk is
  reaching zero super admins, not any single action in isolation — with two super admins,
  demoting one back to a regular admin correctly succeeds; with only one remaining, both
  deleting *and* demoting that account are correctly blocked. Tested both paths specifically,
  not just one, since deletion and demotion are two different routes to the same dangerous
  outcome.
- **A real bug found and fixed while testing this specific safeguard**: the blocking logic
  itself worked correctly from the first version, but the error shown to whoever triggered it
  was a generic "Something went wrong" rather than an explanation — Payload sanitizes plain
  `Error` throws from hooks by default, for good reason (avoiding leaking internal details),
  but that meant a legitimate, informative message was being silently discarded too. Fixed
  using Payload's own `APIError` class with `isPublic: true`, and re-verified the exact same
  blocked action now returns the specific, correct explanation instead.
- **`scripts/seed-first-admin.ts` updated** to explicitly create its account as `super-admin`
  rather than relying on the field's default — the account this script creates is the church's
  own permanent, ultimate account, not one of what may become several regular admins created
  through the normal UI afterward.
- **The full set of legitimate, everyday operations re-confirmed working correctly alongside
  all of the above**, not assumed unaffected by these restrictions: creating a regular admin,
  a regular admin updating their own email, and deleting a regular (non-super) admin account
  all still succeed normally — the new rules only affect the specific actions they're meant to.

## Automated confirmation emails for Prayer Requests and Visit Plans

Requested directly: a "thank you" email sent automatically to whoever submits either form.
Checked the actual collections first rather than assuming they captured what was needed — both
already required an email field, so this was genuinely buildable without any schema change.

**This doesn't depend on the domain/SMTP setup discussed for password reset** — it uses Brevo's
transactional email API directly with the same `BREVO_API_KEY` already in use for the
newsletter, sending inline HTML content rather than a Brevo template (a deliberate choice,
made directly rather than assumed, after presenting both options).

- **One real, well-sourced deliverability concern raised before building, not glossed over**:
  the requested sender is a Gmail address, and Brevo's own documentation confirms that sending
  from an unauthenticated free-email address gets automatically replaced with a generic,
  unfamiliar-looking address at send time — not just a vague "might go to spam" caveat, a
  specific, sourced mechanism. Proceeded anyway per explicit instruction, with the sender
  address stored in `BREVO_SENDER_EMAIL`/`BREVO_SENDER_NAME` env vars specifically so it can be
  swapped to a real domain later with zero code changes, matching the stated plan to update it
  once a domain is registered.
- **New shared helper** (`src/lib/send-transactional-email.ts`) wrapping Brevo's general
  transactional endpoint, kept deliberately separate from the newsletter's template-based flow
  since this uses a different Brevo API. Failures are caught and logged, never thrown — a
  failed confirmation email must never make a form submission that actually succeeded look
  broken to the person who submitted it.
- **Hooked in at the collection level** (`afterChange` on both `PrayerRequests` and
  `VisitPlans`), not inside the form components or API routes — this fires consistently no
  matter how a record gets created, not just through the specific public form.
- **Explicitly guarded against re-firing on later edits** — an admin moving a prayer request
  from "New" to "Praying," or a visit plan from "New" to "Confirmed," must not re-send the
  original confirmation. Verified this directly: updated an existing record's status and
  confirmed zero send attempt was made, not just assumed the `operation !== 'create'` check
  would hold.
- **Verified by actually submitting both real forms through a real browser**, not just
  reasoning about the hook code: captured the exact payload each one builds and confirmed the
  sender, the recipient's name and email pulled correctly from the form, the subject line, and
  the personalized wording were all correct — including the visit date rendering as "Friday,
  December 25, 2026" rather than a raw ISO string, and the conditional "we'll have someone
  ready to greet you" sentence appearing only when that checkbox is actually checked, tested
  both ways.
- **The sandbox's network restrictions turned into a genuine, useful test rather than a
  blocker**: `api.brevo.com` isn't reachable from this environment, so every test send failed
  for real — confirming the graceful-failure design actually holds. The form still showed a
  successful confirmation to the person submitting it, and the underlying Prayer Request and
  Visit Plan records were confirmed saved directly in the database despite the email failing,
  not just assumed to be unaffected.
- **A temporary debug log used during testing was removed before shipping**, specifically
  because it would have written names and email addresses into production logs — added
  deliberately to verify the exact request payload, then confirmed removed with a final rebuild
  and smoke test afterward.

## Forgot Password — now genuinely wired, not just a real screen

A direct, well-reasoned challenge to the earlier "isn't possible without a domain" framing:
since the Prayer Request confirmation emails already prove a Gmail sender works with Brevo
(with the acknowledged deliverability caveat), why not the same approach here? The honest
answer, checked rather than assumed: that earlier reasoning was overstated. Verified directly
against Payload's own `EmailAdapter` type definition — it's a generic interface (just a
`sendEmail` function), not SMTP-specific, so `@payloadcms/email-nodemailer` is only one possible
implementation of it, not a requirement.

- **`src/lib/brevo-client.ts`** — the shared, low-level Brevo call, refactored out of the
  existing `sendTransactionalEmail` so both this and the new password-reset path build on the
  same tested foundation, with one deliberate difference: this one throws on failure rather
  than swallowing it.
- **`src/lib/brevo-email-adapter.ts`** — a custom Payload `EmailAdapter` wrapping that shared
  client, registered via `payload.config.ts`'s `email:` option. Traced directly through
  Payload's own `forgotPassword` operation source
  (`node_modules/payload/dist/auth/operations/forgotPassword.js`) to confirm `sendEmail` is
  awaited with no inner try/catch — a thrown error here correctly fails the whole operation,
  which is the right behavior specifically for this email: staying silent (as the Prayer
  Request emails deliberately do) would leave someone waiting indefinitely for a reset link
  that never arrives, with no signal anything went wrong.
- **A second, genuinely separate gap identified and closed, not assumed already handled**:
  confirmed directly that no page existed anywhere to actually receive a reset link and let
  someone set a new password. Built `/reset-password` and its form, using Payload's own
  `resetPassword` operation (`/api/members/reset-password`) — traced its source too, confirming
  it resets the password *and* establishes a new session in one step, so the form doesn't need
  a separate "now go sign in" step afterward.
- **`Members.ts`** now has real, warm `forgotPassword` email content — the church's own tone,
  with a genuine reset link — rather than Payload's generic default copy.
- **Verified far beyond "the form submits," through the actual, complete lifecycle**: captured
  and confirmed the exact email payload Brevo would receive (correct sender, recipient, subject,
  and a genuinely working reset link with a real token — verified using a temporary debug log,
  removed before shipping); confirmed that same real token — captured from a request that
  Brevo's own send had failed on — still worked to actually reset the password, a genuinely
  interesting confirmation that the token persists independently of the email send outcome;
  confirmed the new password works for a completely fresh login afterward, in a separate browser
  session, and that the *old* password is genuinely and permanently rejected; confirmed a
  missing token, a fake token, and — the security property that matters most here — reusing an
  *already-consumed* token are all correctly rejected, each tested as its own distinct case
  rather than assumed equivalent.
- **One real type error caught during the build**: Payload's callback argument for the custom
  email content is optional as a whole object, not just its individual properties — destructuring
  it directly failed the type checker, caught and fixed before this ever reached testing.
- **A misleading build label, not trusted at face value** — the same class of issue caught once
  before in this project with the Dashboard page: `/reset-password` was labeled statically
  prerendered in the build output despite reading a per-request `token` from the URL. Rather
  than trust the label, tested three genuinely different token states (a real one, a fake one,
  none at all) across separate requests and confirmed each produced its own correct, distinct
  result — proving the page reads its token fresh every time regardless of what the build
  output implied.
- Uses the same temporary Gmail sender as the Prayer Request/Visit Plan confirmations, with the
  same acknowledged, heightened deliverability caveat for this specific email type — see that
  section above for the full reasoning.

## Four requested changes: Worship Rota dropdowns, social media links fix, Contact confirmation email

Requested together, confirmed understood correctly before starting, then implemented and
verified as four genuinely distinct pieces of work — one real bug found along the way, not
assumed already working.

**Worship Rota — `leaderName` and `personName` converted from free text to real Member
relationships.** Traced through the adapter and the display component first to confirm the
blast radius stayed contained — the component only ever wanted a display string, so the fix
lived entirely in the schema and the adapter, extracting `.name` from the now-populated
relationship rather than touching the UI layer at all. **A real schema-change consequence
flagged upfront, not discovered after the fact**: since free-text names can't automatically map
to a Member record, any existing Worship Rota entries in production lose those two specific
field values on this migration — they'll need re-selecting from the new dropdown afterward,
nothing else on those entries is affected.

- Verified in the actual admin panel, not just by reading the schema: logged in, opened a real
  entry, confirmed both fields show the correct member as a real relationship chip, then
  specifically clicked the dropdown open and confirmed it genuinely lists other real members as
  selectable options — catching a test-script mistake along the way (an imprecise selector
  first opened a "Create New Member" modal by accident, which could have produced a false
  positive if the resulting page text hadn't been checked carefully).
- Verified on the public-facing Worship Rota page too, logged in as a real member: both names
  render correctly ("Led by: Sarah Worship Leader," "David Vocalist (Vocalist)"), with no
  fallback placeholder or leaked raw ID anywhere on the page.

**Social media links — a real, found bug, not a misconfiguration.** Checked the actual code
before assuming anything, and found the root cause directly: the Footer's social icons were
hardcoded `<span>` elements with no `href` at all, and the adapter never even read the
`socialLinks` field from Payload in the first place. No value entered in `/admin` could ever
have reached the rendered page — this wasn't about what was entered, it was that nothing on the
other end was wired to receive it.

- Fixed both pieces: the adapter now exposes real URLs, and the Footer wraps each icon in an
  actual link, showing only the icons whose URL is actually filled in.
- Verified with real, seeded data — Facebook and Instagram set, YouTube deliberately left
  blank — and checked precisely, not just visually: the exact `href` values match what was
  seeded, `target="_blank"` and `rel="noopener noreferrer"` are present for safe external
  links, and the YouTube icon is confirmed genuinely absent from the DOM (not just visually
  hidden) when its URL is empty.

**Contact form confirmation email**, applying the exact same proven hook pattern from Prayer
Request, Visit Plan, and Forgot Password — fires once on creation, confirmed via the same
temporary-debug-log-then-remove approach used in every prior email feature, since Brevo is
unreachable from this sandbox and every test send fails for real, which doubles as a genuine
test of the graceful-failure path. Confirmed the submission record saves successfully despite
the email failing, and confirmed a later status change does not re-fire the email.

- **One thing noticed and flagged, deliberately left out of scope**: the confirmation email's
  wording pulls the subject dropdown's raw stored value ("general") rather than its
  human-readable label, since the field is stored as plain text at the Payload level, not a
  proper select with separate label/value pairs. Not a bug in what was built here — the hook
  correctly uses whatever value the form actually submits — but worth a follow-up if the exact
  wording matters, rather than silently changing the underlying field's behavior without asking.

## Worship Rota: leaders and special-item people weren't tracking on their own Dashboard

Reported directly, right after the previous round's leaderName/personName dropdown work:
members assigned as the worship leader or under a Special Item weren't showing up on their own
"My Serving Schedule" — only members explicitly added to the separate `assignedMembers` field
were. Root cause confirmed by re-reading both sides directly rather than assumed: the
Dashboard's serving-schedule query is a direct `{ assignedMembers: { in: [member.id] } }`
lookup, and `assignedMembers` has always been a completely separate field from `leaderName` and
`specialItems.personName` — even before last round's change from free text to real
relationships. Selecting someone as the worship leader never had any connection to that same
person's `assignedMembers` entry; nothing was newly broken, but the previous round's change from
free text to real Member references made the gap far more likely to actually matter in practice
than it ever had before.

- **Fixed at the root, not documented as a workaround.** Rather than just tell the admin to
  remember to separately add the same person to `assignedMembers` too — an easy thing to
  forget, and exactly what caused this report — added a `beforeChange` hook on `WorshipRota`
  that automatically folds the current `leaderName` and every `specialItems` `personName` into
  `assignedMembers` on every save, deduplicated against whatever's already there. The double
  entry is now structurally impossible to forget, not just less likely.
- **A deliberate, worth-stating-clearly design choice**: the hook only ever *adds*, never
  removes. Confirmed directly — changing an entry's leader from one member to another leaves
  the previous leader on `assignedMembers` rather than silently dropping them, since the hook
  has no way to know whether that person is still serving in some other, unlisted capacity.
  Solves exactly the reported problem (people missing who should be there) without introducing
  a new, more surprising failure mode (people silently disappearing). If someone genuinely needs
  removing from `assignedMembers` entirely, that's still a direct, manual edit to that field
  itself — this hook only guarantees the minimum, not an exclusive source of truth.
- **Verified against the exact reported scenario, not a simplified stand-in**: created a rota
  entry with a real leader and a real special-item person, deliberately leaving
  `assignedMembers` completely unset, and confirmed directly in the database that both were
  automatically included — then confirmed both actually see the entry on their own real
  Dashboard, with the special-item person specifically checked since that's the exact case
  originally reported broken.
- **Two further, more surgical tests, not assumed from the main case alone**: confirmed a third
  member — referenced nowhere in this entry at all — correctly does *not* see it on their
  Dashboard, ruling out accidental over-inclusion; and confirmed updating an existing entry's
  leader later correctly re-runs the sync and adds the new leader, not just a fresh `create`.
- A real TypeScript error surfaced and fixed during the build, caught by the compiler rather
  than at runtime: `data`'s nested array fields aren't fully inferred inside a `beforeChange`
  hook's loosely-typed `data` parameter, requiring explicit type annotations through the
  `map`/`filter` chain rather than relying on inference.

## Worship Rota: Translator, Choir Team, multi-select Special Items, and rethinking assignedMembers

Feedback given directly, right after the previous round's serving-schedule fix: the rota needed
finer-grained roles, and — a genuinely good question raised alongside the specific asks —
whether `assignedMembers` still made sense at all once every real role had its own field.

**Four schema changes**, each a real relationship to Members, not free text:

- **Translator** — new, optional single-select field under Sermon, right after Speaker Name.
- **Choir Team** — new, optional multi-select field under Worship Team, right after Leader Name.
- **Special Items' Person Name** — converted from single-select to multi-select, so more than
  one person (two vocalists on the same offering song, for instance) can be credited for the
  same item.

**On `assignedMembers` — answered directly, not just acted on.** Explained clearly what it
actually does (the sole thing the Dashboard's serving-schedule query checks) before touching
anything, then proposed a specific redesign rather than just picking removing-it or keeping-it
unilaterally: once Translator, Choir Team, and multi-select Special Items covered nearly every
realistic serving role, having admins also separately, manually maintain `assignedMembers` was
redundant — and, by direct account, actively confusing. Asked one clarifying question before
building anything, since the two paths genuinely diverge: hide the field entirely, or keep a way
to manually add someone in a role with no dedicated field (a sound tech, a greeter). Given the
latter answer, kept `assignedMembers` as the Dashboard's underlying index — fast, single-field
query, unchanged — but made it fully internal (`admin.hidden: true`, in `WorshipRota.ts`) and
added a new, genuinely separate `otherMembersServing` field that only ever contains exactly who
an admin explicitly adds there. Deliberately did *not* reuse one field for both purposes — an
admin seeing Translator, Leader, and Choir names appear in a field meant for manual "other"
entries would just recreate the original confusion in a new shape.

- **The auto-sync hook (built last round for leaderName/personName) extended to cover every new
  source**: Translator, Choir Team, every Special Item person (now plural), and
  `otherMembersServing` are all automatically folded into the hidden `assignedMembers` on every
  save, deduplicated. Nothing new to remember, same principle as the original fix.
- **Verified with a genuinely comprehensive seed, not a simplified stand-in**: created one entry
  referencing seven different members across every source field, deliberately leaving
  `assignedMembers` completely unset, and confirmed directly in the database that exactly those
  seven — and no others — were present with zero duplicates.
- **Checked five real member Dashboards individually, not just the aggregate result**: the
  translator, a choir member, one of the two special-item vocalists, the manually-added "other"
  server, and one entirely unrelated member, confirming each did or didn't see the entry exactly
  as expected — covering every new/changed source field plus the negative case in one pass.
- **Confirmed directly in the real admin panel**, not just from reading the schema, that
  `assignedMembers` is genuinely absent from the edit form and `otherMembersServing` is there in
  its place, and confirmed the public Rota page renders "Translated by," "Choir," and both
  vocalist names on the same special item, matching the existing card's visual style with no
  new component logic needed beyond two added lines.
- **A real, honestly-flagged data-loss risk for existing production data**, reasoned through
  rather than assumed away: converting `personName` from single- to multi-select changes its
  underlying storage structure, the same category of change that lost data on this exact field
  two rounds ago when it first became a relationship. This couldn't be directly tested against
  a populated database in this sandbox (every migration here ran against a fresh one) — flagged
  as a likely, not just possible, risk on that basis, consistent with the earlier, confirmed
  case, rather than presented as safe without genuine evidence either way.

## Weekly sermon notes and event reminders: a new architectural capability

Raised as an open question — "how do we achieve this?" — rather than a specific spec, so the
first real work was explaining what kind of feature this actually was before building anything.
Every email built on this project until now fires because something just happened (a form
submission). Sermon notes and event reminders fire because of the *passage of time*, with
nothing to trigger them — a genuinely new capability, not a variation on the existing pattern.

**Researched the actual cost before committing to an approach**, rather than assuming a paid
tier would be needed: confirmed directly that Vercel's free Hobby plan allows daily-frequency
cron jobs, which is sufficient for both "weekly" and "3 days before" without needing Pro. Two
real design questions — who can subscribe, and what should trigger an event reminder — were
asked directly rather than assumed, since both genuinely changed the implementation shape.

- **Two new, dedicated Brevo lists**, extending the existing newsletter double opt-in rather
  than building a second, parallel signup system. Two new checkboxes ("Weekly sermon notes,"
  "Event reminders"), default-checked, added to both places the newsletter form already
  appears — verified both directions directly: submitting with both checked included all three
  Brevo lists in the request, and unchecking one correctly excluded just that one.
- **A new, secured daily cron route** (`/api/cron/send-digest`), authenticated using Vercel's
  own documented `CRON_SECRET` pattern — verified directly, not assumed: no auth header and a
  wrong secret both correctly return 401, the real secret returns 200.
- **`Events.reminderSentAt`** so no event can be reminded about twice — verified by running the
  cron twice against the same seeded event: the first run sent reminders and set the field, the
  second run correctly sent nothing.
- **Sermon notes only send on Mondays**, verified using a temporary, clearly-marked day-check
  override (reverted immediately after): confirmed the job correctly stays silent on a
  non-Monday, and correctly sends — with the real sermon's title showing up correctly in the
  email subject — when the day matches.
- **A real build error hit and fixed during testing, not glossed over**: an early attempt to
  temporarily stub the Brevo list-fetch function for testing left genuinely unreachable code
  behind a `return` statement, which confused TypeScript's control-flow narrowing into a type
  error. Fixed by replacing the function body cleanly instead of layering a stub on top of the
  real implementation, confirmed with a clean rebuild.
- **A small, genuine inefficiency noticed and fixed along the way**: the event-reminder job was
  fetching the full subscriber list even on days with zero events to remind about — now only
  fetches when there's actually a reminder to send.
- **`.env.example` brought fully up to date**, a genuinely pre-existing gap discovered while
  adding the new Brevo/cron variables — the file had been stale since before Brevo, Razorpay,
  and the email adapter existed, missing every variable added since. Rebuilt by searching the
  actual codebase for every `process.env` reference in real use, rather than guessing from
  memory, so it now reflects what the project genuinely needs, not what it needed originally.
- **All temporary test code confirmed fully removed before shipping** — a project-wide search
  for the debug markers used during testing came back empty, checked explicitly rather than
  assumed clean from memory of having removed them.

## Worship Rota: an empty database no longer shows fabricated schedule data

Reported directly: with zero real Worship Rota entries in the database, the public page fell
back to `rota-mock.ts`'s placeholder content — a made-up preacher, a made-up worship leader, a
made-up time — displayed as if it were real. Agreed this was a genuine problem, not a stylistic
preference: every other mock fallback on this project stands in for generic page copy (a hero
heading, a placeholder image) where showing something reasonable-looking is harmless. This was
categorically different — specific, factual, time-sensitive claims about who is actually
serving on a given date, which could genuinely mislead a visitor into expecting a pastor or
service that doesn't exist.

- **Checked where else this same pattern might apply before fixing just the one spot** — the
  Dashboard's own "My Serving Schedule" card was confirmed to already handle this correctly (an
  empty result there is an honest "you have no upcoming assignments," never a fallback), so the
  fix is scoped precisely to the one place it was actually needed.
- **`adaptRotaEntries` no longer falls back to mock data at all** — an empty database now
  produces a genuinely empty list, with a real, worded explanation of why (see below), not a
  silent substitution.
- **Two genuinely different empty states, kept distinct rather than merged into one generic
  message**: a database with zero entries at all now shows "There is currently no service
  assigned," with the filters sidebar removed entirely (empty dropdowns next to an empty state
  would look broken, not helpful). Selecting a specific month/ministry combination that happens
  to match nothing — while other real entries exist elsewhere — still shows the original,
  separate "no entries for this selection" message, with the filters still available, since
  other selections do have something to show.
- **Verified both paths directly, not just the one reported**: confirmed the genuinely-empty
  case shows the new message with no fake data and no filters sidebar; then seeded two real
  entries in different months and ministries and confirmed a legitimate zero-match filter
  selection still shows the original message with the filters sidebar intact — proving the two
  states are correctly, distinctly triggered rather than one accidentally masking the other.

## The same fix applied to Ministries, Groups, Events, and Sermons

Requested directly as a follow-up to the Rota fix: the same fabricated-data problem existed on
four more pages. Rather than treat each collection as a one-off, the same underlying principle
from Rota was applied consistently: specific, factual claims about real things (a ministry that
supposedly exists, a group that supposedly meets, an event on a real date, a sermon that was
actually preached) never fall back to mock data — an empty database means an honest empty state,
not a fabricated one.

- **Ministries and Groups** — `adaptMinistryItems`, `adaptHomepageMinistries`, and
  `adaptGroupListings` no longer fall back to mock data. Both listing pages already had *some*
  empty-state handling for a filtered-to-zero search, reused rather than rebuilt — extended with
  a second, more accurate message specifically for a genuinely empty database, since "no results
  in this category" reads oddly when there was never any real data to filter in the first place.
- **Events and Sermons needed a genuinely different fix, not just the same pattern copied over.**
  Both pages showcase one specific "featured" item in a large hero section, previously falling
  back to an entirely fabricated event or sermon — fake title, fake date, fake image. Forcing an
  "empty" version of a layout built around showcasing one specific thing would have looked
  broken rather than honest, so `adaptEventsHero`/`adaptSermonHero` now return `null` instead,
  and both pages simply skip rendering that hero section entirely when there's nothing real to
  feature.
- **A real, more-than-just-missing-fallback problem, found and fixed properly rather than
  patched over**: the homepage's featured-sermon widget didn't just fall back to mock data when
  nothing was explicitly marked "featured" — it fabricated an entire sermon, complete with an
  invented pastor name ("Rev. Dr. Abraham Thomas") that doesn't exist. Reworked
  `adaptHomepageSermons` to promote the most recently dated *real* sermon into that slot instead
  when nothing's explicitly featured — still entirely honest, just repurposed real data, only
  falling back to an empty result when there's truly nothing real to show at all. Verified this
  specific scenario directly: seeded one real, unfeatured sermon and confirmed its real title
  and real speaker name appear correctly, with no trace of the fabricated name anywhere.
- **Two real, would-be-shipped bugs caught during testing, not discovered afterward.**
  `LatestSermons.tsx` did `sermons.find(...) ?? sermons[0]` and immediately read `.id` off the
  result — this would have crashed outright the moment a homepage genuinely had zero sermons,
  since the old mock fallback had always silently guaranteed at least one entry existed. Fixed by
  skipping that section entirely on an empty result. Separately, the sermon detail page had its
  own special-cased branch for the featured sermon's specific URL that assumed
  `adaptSermonHero` always returned a real object — this surfaced immediately as a genuine
  TypeScript build failure the moment that function was made nullable, caught by the compiler
  before it ever reached manual testing.
- Checked the two other homepage sections drawing from these same collections
  (`FindYourPlace`/ministries, `UpcomingEvents`) for the same "heading rendered over an empty
  grid" risk — neither would have crashed, but both were updated to skip rendering entirely on
  an empty result, consistent with the Latest Sermons and Events Hero decisions above.
- **Verified against a genuinely fresh, empty database across all four collections at once, not
  each in isolation** — confirmed directly at the database level that every table was actually
  empty before testing, then visually confirmed each of the four public pages, plus the
  homepage's three affected sections, all render cleanly and honestly with zero fabricated
  content. Two results that initially looked like failures turned out, on direct inspection of
  the actual rendered page rather than trusting a keyword match alone, to be false positives
  from imprecise test terms — not real problems: "Small Group" matched the Ministries page's
  own, deliberately-kept generic marketing copy about small groups, and "Upcoming" matched an
  unrelated Quick Links card elsewhere on the homepage. Confirmed each directly before ruling
  either one out.

## A real crash found after emptying tables directly in Supabase, tracked down to its actual root cause

Reported directly: after clearing the Sermons, Ministries, and Groups tables from Supabase's own
dashboard rather than through Payload, logged-in members hit a full-page "Application error"
specifically after clicking through to the Groups or Ministries page — the public site itself
was unaffected. Diagnosed properly rather than guessed at, since several plausible-sounding
theories turned out to be wrong on direct testing.

**First theory, tested and ruled out**: a member's own reference to a group/ministry left
dangling after the group/ministry itself was deleted. Reproduced this exact state twice — once
against SQLite, then, since production runs Postgres and the two engines can genuinely behave
differently, installed a real, local Postgres 16 instance specifically to test against the
actual database engine in use. Both came back clean, no crash either way — worth noting since it
would have been easy to stop at the SQLite result and ship the wrong fix.

**The actual root cause, found by installing Postgres locally and reading its own
constraints**: the tables linking a member to their groups/ministries turned out to already have
`ON DELETE CASCADE` — confirmed directly by deleting a real, referenced row and separately by
running `TRUNCATE ... CASCADE`, a common way dashboard UIs implement "empty this table." Both
correctly, automatically cleaned up the member's side too. This ruled out the dangling-reference
theory entirely — that specific inconsistency cannot occur through any normal Postgres delete,
no matter how it's triggered.

**Kept digging rather than stopping at "can't reproduce it."** The real cause turned out to be
one relationship away: `JoinRequests.target` is a *polymorphic* relationship (it can point at
either a group or a ministry), stored in its own separate join-table row — and that row *also*
has `ON DELETE CASCADE`, but only on the link itself, not on the parent `JoinRequests` record.
Deleting a group or ministry directly cascades away the connection describing what a pending
request was even for, while the request record survives with a completely missing `target`
field — not an unpopulated ID, but the field absent entirely. Confirmed this precisely: created a
real join request, deleted its target directly via SQL, queried the request back through
Payload, and found `target: undefined`. Visited the real Groups page as that member and
reproduced the exact same error and error digest shown on screen, with the server log pinpointing
the exact line: `TypeError: Cannot read properties of undefined (reading 'value')`.

- **Checked every place this same assumption appeared, not just the one that crashed** — the
  same "target always has a value" assumption existed in three separate places:
  `join-requests-adapter.ts` (the one that crashed), `dashboard-adapter.ts`'s pending-requests
  card (same crash risk, just not yet triggered), and `JoinRequests.ts`'s own approval hook
  (would have crashed the moment anyone tried to approve a broken request). All three fixed with
  the same defensive skip used everywhere else on this project — a missing `target` is treated
  as an orphaned, unusable request and skipped, not fatal.
- **Verified the fix against the exact same broken database state that caused the crash** — same
  local Postgres instance, same broken join-request record, same login. Confirmed the Groups
  page, the Dashboard, and the Ministries page all render correctly now, and specifically
  checked that an admin can still cleanly delete this kind of orphaned record afterward.
- **One more real, correct edge case confirmed rather than assumed away**: tried approving the
  broken request directly to see what would happen post-fix — Payload's own required-field
  validation correctly blocks it ("The following field is invalid: Target"), which is the right
  outcome, not a bug — there's nothing real to approve a member into.

## Live page: replacing decorative chat and sermon notes with the real thing

Raised as a direct question — YouTube already has live chat for streams, so why build a custom
one? — which led to a real architectural discussion rather than jumping straight to code.
YouTube's chat embed needs the exact video ID of the live stream, not just the channel ID the
video player already uses, and that's a genuine fork: automate finding it (a new YouTube API
integration) or have the admin paste the live video's URL in each week (simpler, but reintroduces
the kind of manual per-stream upkeep the channel-based video player was specifically built to
avoid). Given the choice directly rather than picked silently — the manual route was chosen.

- **New field, reusing existing validation rather than writing new**: `currentLiveVideoUrl` on
  the same `LivePage` global, validated with the same YouTube URL parser already used for
  Sermons' own video field, so it accepts the same range of pasted formats (share links,
  `/live/` URLs, bare IDs) as everywhere else on the site.
- **The old fake chat entirely removed, not just hidden** — the hardcoded "Alice M."/"Bob R."
  placeholder messages, their types, and the mock data are gone. Left blank, the panel now shows
  an honest "chat isn't open right now" message; filled in, it renders YouTube's real embedded
  chat for that specific stream.
- **A real, verified limitation, not assumed**: confirmed directly from YouTube's own help docs
  that live chat embeds don't work on mobile web at all. Built and tested a specific mobile
  fallback — a clear message plus a real "Watch on YouTube" link — checked at an actual mobile
  viewport width rather than just written and trusted.
- **Sermon notes got their own plain-text field** on the same global, next to the fields already
  updated weekly — no YouTube involvement at all, since notes are the church's own content.
  Blank shows an honest "not posted yet" message rather than the old static placeholder;
  filled in, each line renders as its own paragraph.
- **Verified precisely, not just visually** — inspected the actual rendered iframe's `src`
  directly to confirm the video ID and domain were both built correctly, rather than trusting
  that the video appeared to load. Also directly tested the field's validation both ways: a
  non-YouTube URL is rejected with a clear message, and leaving it blank is correctly accepted
  as the normal, optional state.

## Live chat: forcing light theme regardless of the viewer's device settings

Reported directly with a screenshot: the embedded live chat rendered in a dark theme —
unreadable message text against the panel's white background — because YouTube's chat embed
follows the viewer's own device or browser color scheme by default, and this site has no dark
mode of its own to match against.

- **Verified the actual parameter before using it, rather than guessing** — found a working,
  real-world code example using `dark_theme=1`/`dark_theme=0` on this exact embed, not just a
  plausible-sounding parameter name assumed from the main YouTube player's unrelated `theme`
  option.
- **`dark_theme=0` added explicitly**, not left to default — appended directly to the chat
  iframe's URL in `LiveChatPanel.tsx`, so the panel always renders light, matching the rest of
  the site, regardless of what the visitor's own phone or browser is set to.
- **Verified against the exact scenario reported, not just the default case** — tested with the
  browser's own color scheme explicitly set to dark (matching a visitor who has dark mode
  enabled) and confirmed directly, by inspecting the actual rendered iframe's `src`, that
  `dark_theme=0` is still correctly present regardless.

## Live chat: shelved, not fixed

The `dark_theme=0` fix didn't hold up under a real screenshot — header bar and message text
both still rendered dark. Given it's an undocumented, unofficial YouTube parameter and there's no
way to reach into a cross-origin iframe to override its internal styling directly, spending more
time guessing at further undocumented parameters wasn't worth it — flagged that plainly rather
than keep digging, and the call was made directly: hide chat, show sermon notes only for now.

- **`CHAT_ENABLED = false`** in `LiveChatPanel.tsx` — a single flag, not a deletion. The full
  chat implementation (iframe, mobile fallback, dark_theme parameter) stays intact underneath it,
  specifically so restoring it later — if YouTube's behavior changes or a different embed
  approach is found — is a one-line revert, not a rebuild.
- Panel now shows a static "Sermon Notes" label in place of the tab switcher, styled to match
  the previous active-tab look, so the result reads as an intentional single-purpose panel
  rather than a broken, half-finished one.
- Verified directly with `currentLiveVideoUrl` deliberately still set on the global, to confirm
  the chat stays correctly hidden even when a real live video is configured, not just in the
  already-empty case.

## Ministry detail page: join button wasn't gated behind login at all

Reported directly: the `/ministries` listing page correctly restricts joining to logged-in
members, but each individual ministry's own detail page showed a "Join Ministry" button to
everyone, logged in or not.

Traced to the actual root cause rather than assumed: the detail page had never been updated
since the listing page's own join button was upgraded from a plain `mailto:` link to a real,
trackable join-request system — confirmed by a comment already sitting in `MinistryCard.tsx`
describing that exact migration, and a leftover "hasn't been designed yet" disclaimer on the
detail page nobody had removed since. The two pages had simply drifted out of sync, not two
separate bugs.

- **Reused the exact same components as the listing page, not new ones** — the same
  `MembersOnlyGate` wrapping the same `JoinRequestButton`, fed by the same `getJoinStatus`/
  `buildRequestStatusMap` helpers. This isn't just visual consistency — it's the same underlying
  join-requests data, so approving or declining a request anywhere (including from `/admin`) is
  reflected identically everywhere a member might check their status: this detail page, the
  listing page, and the dashboard's pending-requests card, since all three now read from the
  same source rather than each having their own logic.
- **The stale `mailto:` link and its own leftover disclaimer text removed**, not left alongside
  the new button.
- **A real, compiler-caught type mismatch, not a guess**: Payload types an optional text field as
  `string | null`, while `JoinRequestButton`'s label prop only accepts `string | undefined` —
  caught directly by the TypeScript build, not assumed to be fine, and fixed with a simple `??
  undefined` coalesce.
- **Verified every state directly, not just the reported one**: anonymous visitor (correctly
  shown the same sign-in prompt used elsewhere), a member with no request yet (real button), a
  member with a pending request, and a member already approved — each seeded as real data and
  checked individually. Also clicked the real button as a real member and confirmed two things
  together: the page updates immediately to "Pending," and reloading the separate listing page
  afterward shows the same "Pending" status — proving this created a genuine, persisted database
  record rather than only updating in-page state.
- **Checked Groups' own detail page for the same pattern while already in this area** — found a
  different, pre-existing gap instead: it's correctly gated, but has no join button on the
  detail page at all, just a "not a member yet" message with no path to actually join. Flagged
  as a separate, follow-up item rather than fixed here, since it's new functionality to add, not
  a consistency bug to correct — outside what was actually asked for this round.

## Podcast links: no longer sending visitors to the wrong place, or away without warning

Raised as an open question — "how does this work, is it complete?" — investigated first, fixed
second, with the fix scoped to exactly the two real gaps that investigation actually found.

Traced the whole path before answering: the section is genuinely admin-editable (heading,
description, up to 4 platform links), and — checked directly rather than assumed — the site's
locale-routing `Link` component does correctly pass real external URLs through unmangled. Two
things weren't fine, though, both confirmed by rendering real data and inspecting the actual
HTML rather than reading the code and guessing:

- **The unconfigured fallback wasn't a harmless placeholder** — it was a fully real, clickable
  "Apple Podcasts" and "Spotify" pair pointing at those platforms' generic homepages, not the
  church's own show. A visitor would land somewhere real-looking but unrelated, not see an
  honest "not set up" message. Same category of issue as the mock-data fixes made earlier on
  this project, just found later because this one was originally, mistakenly reasoned to be
  harmless generic page copy.
- **Links opened in the same tab**, confirmed directly by inspecting the rendered `<a>` tag —
  no `target="_blank"`, unlike the footer's social icons elsewhere on the site, which do open in
  a new tab. Clicking "Spotify" took a visitor fully away from the church's own site rather than
  alongside it.

Fixed the same way as the other featured-content sections on this project: `adaptPodcastCta` now
returns `null` instead of the mock data when nothing's configured, the page skips rendering the
section entirely in that case, and the dead mock export was removed rather than left behind
unused. `target="_blank"` and `rel="noopener noreferrer"` added to the actual links, matching
the pattern already used elsewhere. Verified both states directly: unconfigured shows a clean
page with no section and no fake links at all, and configured with a real link shows the section
correctly with the exact `href` preserved and the new `target`/`rel` attributes both confirmed
present on the actual rendered element.

Noticed and flagged, deliberately left alone since it's a separate, different-shaped issue: the
field controlling which sermon is "featured" is marked required in the schema, in tension with
earlier work that made the adapter treat it as genuinely optional. Not fixed here — out of scope
for what was actually asked this round.

## Loading state

`src/app/[locale]/(site)/loading.tsx` uses Next's built-in convention: while any page under
`(site)` is fetching its Payload data, this automatically renders in place of that page's
content — Header and Footer (from the layout, outside this boundary) stay mounted throughout,
which is why the design shows full site chrome around the spinner rather than a blank page.

`CrossSpinner.tsx` is a ported SMIL SVG animation (radiating rays + pulsing glow + a central
cross) supplied as a finished design reference. One deliberate change from the original: the
color was swapped from the source's off-brand `#1e5aa8` to the site's actual `brand-navy`
token, so it reads as native to the site rather than pasted in.

Verified by rendering `LoadingScreen` directly via a temporary preview route (screenshotted,
then removed before shipping) rather than by racing a real page's data-fetch timing, which
proved unreliable in this sandbox — production builds statically prerender the homepage, so an
artificial delay there just extends the build, not something a real visitor would ever see.
Also confirmed the SVG animation is genuinely running (not a frozen frame) by hashing two
screenshots of just the spinner element taken 1.5s apart and confirming they differ.

## Internationalization (English / Tamil / Kannada)

The route structure is fully wired for three locales using `next-intl`:

- **English** (default) serves at clean URLs with no prefix: `/about`, `/ministries`.
- **Tamil** and **Kannada** are explicitly prefixed: `/ta/about`, `/kn/about`.
- The header's globe icon is a **working language switcher** — it navigates to the same
  page in the chosen locale, not just a decorative button.

**Tamil/Kannada fonts are now wired up.** Inter (the site's font) has no Tamil or Kannada
glyphs at all — those are separate scripts, not just accented Latin. `Noto_Sans_Tamil` and
`Noto_Sans_Kannada` are loaded in `[locale]/layout.tsx` alongside Inter, and applied via a
`:lang()` CSS rule in `globals.css` keyed off the `<html lang>` attribute — no per-component
logic needed; the right font just follows the locale automatically. Note for anyone testing in
a network-restricted sandbox like this one was built in: Google Fonts can't be fetched there,
so the actual glyphs can only be confirmed to render correctly with real internet access —
this was verified structurally (correct font-family applied per locale) but the visual
rendering itself needs a real check once deployed.

### What's actually translated right now — and what isn't

**Every component and page directory in the project has real Tamil and Kannada translations
now** — nav, header, footer, homepage, About, Ministries, Sermons, Events, Contact, Give,
Legal, Prayer, Live, Visit, Directions, Schedule, Dashboard, Rota, Volunteer, Groups, Sitemap,
and both auth pages (Login, Create Account), plus a comprehensive final sweep across every
`page.tsx`/`layout.tsx`/`loading.tsx`/`not-found.tsx` in the site that caught several
page-level misses component-level checks alone didn't (the Sitemap page's own heading, both
auth pages, `CreateAccountForm` — never touched by any earlier pass — and four `PagePlaceholder`
callers whose `title` prop was silently bypassing translation).

This was genuinely large — six work sessions across ~90 files — done in batches matching the
site's own directory structure, each batch fully built, seeded with real data, and verified
in a real headless browser before moving to the next. Not just "does the text render": real
form submissions were tested end-to-end in Tamil (Contact, Prayer, Visit, Volunteer Interest,
Leadership Interest all confirmed to actually submit and show a success state, not just
display translated labels), interactive states were exercised (category filters, search,
tab switches), and derived/computed labels were traced through their full path — several
filter dropdowns (Sermons' "All Series," Events' category pills, Rota's "All Ministries,"
Groups' category pills) had their "All X" labels hardcoded inside adapter *functions*, not
components, and needed threading real translations through the adapter itself, not just
wiring the UI layer.

**A few real mistakes were caught and fixed along the way, not glossed over**: a debug
`console.log` that turned out to be testing against a stale build rather than broken code: a
`Fragment` needing an explicit `key` where shorthand `<>` doesn't accept one; a `useTranslations`
namespace pointed at the wrong key (`t('signIn')` called against `auth` instead of `common`)
caught before shipping; and a corrupted layout-file backup from an earlier round that would
have silently shipped the site without its real font, caught by diffing against independent
backups before trusting a restore.

**Deliberately left alone, not overlooked:**
- **Locale-aware date formatting.** `'en-US'` is hardcoded in `EventCard`, `EventsCalendar`,
  `SermonCard`, `RecentSermonsSection`, `RotaEntryCard`, and `rota-adapter.ts` — so month names
  like "August 2026" and weekday names won't localize even though the surrounding text now
  does. This is a different category of gap (date *formatting* logic, not hardcoded *text*)
  and touches a distinct set of files; flagged clearly rather than folded in silently.
- **Legal document body text** (the actual Privacy Policy/Terms of Service paragraphs) — lives
  in data files, not components, and carries real accuracy/liability stakes if mistranslated.
  Treated the same as CMS content: not something auto-translated and shipped as authoritative.
- **The Give form's dynamic sentence** ("You're giving $X monthly to Y") uses piecewise word
  substitution to preserve bold styling on the amount/fund name, so Tamil/Kannada word order
  there isn't fully grammatical — a deliberate trade-off, not an oversight.

There's also a **pre-existing, separate quirk worth knowing about, not something this pass
introduced**: a "hard" 404 (a URL that doesn't match any route pattern at all, as opposed to a
matched route with bad data) falls through to the root `app/not-found.tsx` rather than the
locale-aware one, and shows English regardless of locale. This is the existing root/locale
not-found split documented elsewhere in this file, confirmed still working as designed.

### How translation is split between two systems

- **Static UI text** (everything above) — lives in `messages/{locale}.json`, read via
  `useTranslations()`/`getTranslations()`. Real Tamil/Kannada exists for the full current set.
- **Page content** (sermon titles, event descriptions, ministry copy) — lives in Payload as
  `localized: true` fields, already wired for every collection and global built in this
  project. This is **content-entry work for your bilingual staff via `/admin`**, not a code
  task — deliberately not something auto-translated wholesale here. Machine-translating real
  theological or ministry content and shipping it without a native-speaker review is a real
  accuracy risk this project didn't want to take on quietly.
- **Hardcoded component text** (the ~130-file gap above) — needs converting to `messages/*.json`
  keys before it can be translated at all. The largest remaining piece of real work.

### Adding a new static UI string

1. Add the English value to `messages/en.json`.
2. Add matching keys (with a real translation, not an English placeholder — that's what
   caused this exact gap in the first place) to `messages/ta.json` and `messages/kn.json`.
3. In the component: `const t = useTranslations('yourSection')`, then `t('yourKey')`.

### Every internal link must use the locale-aware Link

```tsx
// Correct — preserves whatever locale the user is currently on
import { Link } from '@/i18n/navigation'

// Wrong — always sends the user to English, breaking navigation on /ta or /kn
import Link from 'next/link'
```
The only exception is the root-level `src/app/not-found.tsx`, which intentionally uses plain
`next/link` — it has no locale context (see the comment in that file for why).

## File structure

```
src/
  app/
    [locale]/
      layout.tsx           # ROOT layout — html/body, Inter font, NextIntlClientProvider
      not-found.tsx         # locale-scoped 404 (styled, translated)
      (site)/
        layout.tsx           # Header + Footer wrapper for every page below
        page.tsx              # homepage
        about/page.tsx
        about/[slug]/page.tsx  # leadership bio placeholder
        ministries/page.tsx
        ministries/[slug]/page.tsx
        sermons/page.tsx
        sermons/[slug]/page.tsx
        events/page.tsx
        events/[slug]/page.tsx
        contact/page.tsx
        give/page.tsx
        privacy/page.tsx
        terms/page.tsx
        sitemap/page.tsx
        ... (placeholder routes: login, visit, schedule, groups, volunteer, live, prayer, cookies, blog)
    (payload)/                  # sibling root to [locale] — Payload's admin panel + API,
      layout.tsx                  # completely locale-agnostic (see middleware.ts exclusions)
      admin/[[...segments]]/page.tsx
      admin/[[...segments]]/not-found.tsx
      admin/importMap.js
      api/[...slug]/route.ts        # REST
      api/graphql/route.ts
      api/graphql-playground/route.ts
    not-found.tsx            # ROOT fallback — self-contained html/body, only hit if middleware
                               # can't map a URL to any locale at all
  middleware.ts               # next-intl locale detection/redirect (excludes /admin AND /api)
  payload.config.ts             # Postgres adapter, collections list, localization (en/ta/kn)
  collections/
    Users.ts                     # required by Payload for admin auth
    Media.ts                     # baseline upload handling
  i18n/
    routing.ts                 # the three locales + default + prefix strategy — single source of truth
    navigation.ts               # locale-aware Link/usePathname/useRouter, re-exported from here
    request.ts                   # loads the right messages/{locale}.json per request
  components/
    homepage/, about/, ministries/, sermons/, events/, contact/, give/, legal/, sitemap/, ui/
  types/                        # one file per page/domain, mirrors what Payload collections should look like
  data/                         # mock data — the ONLY files to edit for content changes right now
messages/
  en.json / ta.json / kn.json   # static UI strings
```

## Known placeholders to revisit

| File | What to fix |
|---|---|
| `tailwind.config.ts` | Colors are approximated from screenshots — replace with exact Figma hex values |
| `public/images/*.jpg` | Generated solid-color placeholders — replace with real photos |
| `messages/ta.json`, `messages/kn.json` | Real translation — currently English copies |
| Various forms (newsletter, contact, give's payment button, small groups) | No submit handlers — need real endpoints |
| `next.config.mjs` | `images.remotePatterns` empty — add Supabase Storage hostname once media moves there |
| `/cookies`, `/blog`, `/about/[slug]`, and a few nav placeholders | No real design yet |

## Next steps (in order, and why)

1. **✅ i18n route restructuring** — done first because retrofitting locale-aware data fetching
   onto already-written Payload queries is far more expensive than building it in from the start.
2. **✅ Payload CMS foundation** — config, admin panel, auth, and localization verified working
   end-to-end (real admin user created and logged in, real collection data confirmed).
3. **✅ Payload content collections** — Homepage, SiteSettings, Ministries, Leadership/About,
   Contact, Sermons, Events, Schedule, Live, Visit, Directions, Prayer. Every page built so far
   is fully wired to real Payload data, with per-field mock fallback for anything an editor
   hasn't filled in yet. Each was individually seed-tested end-to-end before being considered
   done — see the section above. Login stays unwired on purpose (see its own section above) and
   Live's sample chat/notes stay hardcoded on purpose (see `LivePage.ts`'s admin description).
4. **Tamil & Kannada translation** — the one remaining phase. Content now has a permanent home
   in the CMS (every `localized: true` field is ready to receive it), and static UI strings in
   `messages/ta.json` / `messages/kn.json` are still English placeholders. This was deliberately
   saved for last so nothing gets translated twice — see the i18n section above for the split
   between static-UI strings and CMS content.
5. **Whenever new pages get designed** (Cookie Policy, Blog, and the remaining placeholder
   routes: `/groups`, `/volunteer`, `/forgot-password`, `/create-account`) — same process as
   everything above: build the components against a design, add a Payload collection/global
   mirroring the page's real content needs, wire it in, seed-test it for real before calling it
   done.
6. **Real member authentication**, if Login is ever meant to do something — needs its own
   Payload collection (e.g. `Members`, with `auth: true`) kept separate from the admin `Users`
   collection, plus real access-control thinking. Not started, and shouldn't be started
   casually — see the Login section above for why mixing the two would be a real security issue.
