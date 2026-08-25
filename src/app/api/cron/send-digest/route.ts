import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { sendTransactionalEmail } from '@/lib/send-transactional-email'
import { fetchBrevoListContacts } from '@/lib/brevo-client'

// Runs once daily (see vercel.json) — Vercel's own scheduler sends
// CRON_SECRET as a Bearer token automatically; this is the standard,
// documented way to confirm a request genuinely came from Vercel's cron
// and not just anyone who found this URL, since the route itself is a
// perfectly ordinary, publicly-reachable HTTP endpoint otherwise.
//
// Two independent jobs run on every invocation:
//  1. Weekly sermon notes — only actually sends on Mondays, the day
//     after a typical Sunday service, giving time for that week's
//     sermon to be published first.
//  2. Event reminders — any event exactly 3 days out that hasn't been
//     reminded about yet (Events.reminderSentAt) gets one sent, then is
//     marked so it's never reminded about twice, no matter how many
//     times this route runs.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const results = { sermonNotesSent: 0, eventRemindersSent: 0, errors: [] as string[] }

  // --- 1. Weekly sermon notes (Mondays only, UTC) ---
  const today = new Date()
  const isMonday = today.getUTCDay() === 1
  const sermonNotesListId = process.env.BREVO_SERMON_NOTES_LIST_ID

  if (isMonday && sermonNotesListId) {
    try {
      const sermons = await payload.find({ collection: 'sermons', limit: 1, sort: '-date' })
      const sermon = sermons.docs[0]
      if (sermon) {
        const subscribers = await fetchBrevoListContacts(sermonNotesListId)
        for (const contact of subscribers) {
          await sendTransactionalEmail({
            to: contact.email,
            toName: contact.firstName,
            subject: `This week's sermon notes: ${sermon.title}`,
            htmlContent: `
              <p>Hi ${contact.firstName || 'there'},</p>
              <p>Here are this week's sermon notes:</p>
              <p><strong>${sermon.title}</strong>${sermon.speakerName ? ` — ${sermon.speakerName}` : ''}</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/sermons/${sermon.slug}">Watch or read more</a></p>
              <p>With care,<br>Bethesda AG Church</p>
            `,
          })
          results.sermonNotesSent++
        }
      }
    } catch (err) {
      results.errors.push(`sermon notes: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // --- 2. Event reminders (events exactly 3 days out, not yet reminded) ---
  const eventRemindersListId = process.env.BREVO_EVENT_REMINDERS_LIST_ID
  if (eventRemindersListId) {
    try {
      const reminderDate = new Date(today)
      reminderDate.setUTCDate(reminderDate.getUTCDate() + 3)
      const dayStart = new Date(Date.UTC(reminderDate.getUTCFullYear(), reminderDate.getUTCMonth(), reminderDate.getUTCDate()))
      const dayEnd = new Date(dayStart)
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1)

      const upcoming = await payload.find({
        collection: 'events',
        where: {
          and: [
            { startDate: { greater_than_equal: dayStart.toISOString() } },
            { startDate: { less_than: dayEnd.toISOString() } },
            { reminderSentAt: { equals: null } },
          ],
        },
      })

      const subscribers = upcoming.docs.length > 0 ? await fetchBrevoListContacts(eventRemindersListId) : []

      for (const event of upcoming.docs) {
        for (const contact of subscribers) {
          await sendTransactionalEmail({
            to: contact.email,
            toName: contact.firstName,
            subject: `Reminder: ${event.title} is in 3 days`,
            htmlContent: `
              <p>Hi ${contact.firstName || 'there'},</p>
              <p>Just a reminder — <strong>${event.title}</strong> is coming up in 3 days.</p>
              <p>${event.time} \u2014 ${event.location}</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.slug}">See event details</a></p>
              <p>We hope to see you there!<br>Bethesda AG Church</p>
            `,
          })
        }
        await payload.update({ collection: 'events', id: event.id, data: { reminderSentAt: new Date().toISOString() } })
        results.eventRemindersSent += subscribers.length
      }
    } catch (err) {
      results.errors.push(`event reminders: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return NextResponse.json({ success: results.errors.length === 0, ...results })
}
