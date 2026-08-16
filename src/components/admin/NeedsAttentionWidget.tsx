import type { ServerProps } from 'payload'
import Link from 'next/link'

export default async function NeedsAttentionWidget({ payload }: ServerProps) {
  const [pendingRequests, newLeadershipInterests] = await Promise.all([
    payload.find({ collection: 'join-requests', where: { status: { equals: 'pending' } }, limit: 10, sort: '-createdAt' }),
    payload.find({ collection: 'leadership-interests', where: { status: { equals: 'new' } }, limit: 10, sort: '-createdAt' }),
  ])

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
        Real email alerts aren&apos;t set up yet — this is where pending items show up in the
        meantime, right when you open the admin.
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
