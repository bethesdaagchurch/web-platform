import type { ServerProps } from 'payload'
import Link from 'next/link'

export default async function NeedsAttentionWidget({ payload, user }: ServerProps) {
  // The admin's own explicit choice (confirmed after flagging the
  // trade-off): once seen, an item stops showing here even while still
  // pending, until something newer arrives. Reading the OLD value before
  // overwriting it below is what makes "since last visit" work correctly.
  const previouslySeenAt = user && 'notificationsSeenAt' in user ? (user.notificationsSeenAt as string | undefined) : undefined

  const [pendingRequests, newLeadershipInterests] = await Promise.all([
    payload.find({
      collection: 'join-requests',
      where: previouslySeenAt
        ? { and: [{ status: { equals: 'pending' } }, { createdAt: { greater_than: previouslySeenAt } }] }
        : { status: { equals: 'pending' } },
      limit: 10,
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'leadership-interests',
      where: previouslySeenAt
        ? { and: [{ status: { equals: 'new' } }, { createdAt: { greater_than: previouslySeenAt } }] }
        : { status: { equals: 'new' } },
      limit: 10,
      sort: '-createdAt',
    }),
  ])

  // Recorded now, using this same request — so the NEXT visit's query
  // above will correctly exclude everything just shown, matching "don't
  // pop up again until something new arrives" exactly as described.
  if (user?.id) {
    await payload.update({ collection: 'users', id: user.id, data: { notificationsSeenAt: new Date().toISOString() } })
  }

  const totalCount = pendingRequests.totalDocs + newLeadershipInterests.totalDocs
  if (totalCount === 0) return null

  return (
    <div
      style={{
        background: '#FFF8E1',
        border: '1px solid #F0D98C',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
        Needs Attention ({totalCount})
      </p>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
        Real email alerts aren&apos;t set up yet — this is where new items show up in the
        meantime. Once you&apos;ve seen an item here, it won&apos;t show again until something
        new comes in — check the Join Requests and Leadership Interests collections directly
        for anything still sitting unresolved from before.
      </p>

      {pendingRequests.totalDocs > 0 && (
        <p style={{ fontSize: 14, marginBottom: 4 }}>
          <Link href="/admin/collections/join-requests?where[status][equals]=pending" style={{ color: '#0D3B66', fontWeight: 500 }}>
            {pendingRequests.totalDocs} pending join {pendingRequests.totalDocs === 1 ? 'request' : 'requests'}
          </Link>
        </p>
      )}

      {newLeadershipInterests.totalDocs > 0 && (
        <p style={{ fontSize: 14 }}>
          <Link href="/admin/collections/leadership-interests?where[status][equals]=new" style={{ color: '#0D3B66', fontWeight: 500 }}>
            {newLeadershipInterests.totalDocs} new leadership {newLeadershipInterests.totalDocs === 1 ? 'interest' : 'interests'}
          </Link>
        </p>
      )}
    </div>
  )
}

