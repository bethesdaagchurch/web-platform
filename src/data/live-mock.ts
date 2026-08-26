import type { LiveStreamData, OnlineGivingData, InPersonData } from '@/types/live'

export const liveStream: LiveStreamData = {
  isLive: true,
  liveLabel: 'Live Now',
  title: 'Sunday Morning Worship',
  speaker: 'Pastor John Doe',
  bookReference: 'The Book of John',
  // Deliberately a placeholder, not a real channel — this is the
  // fallback shown before an admin has ever configured LivePage. YouTube's
  // embed degrades gracefully (shows "video unavailable") rather than
  // breaking the page, which is the honest, correct behavior for
  // genuinely unconfigured content.
  youtubeChannelId: 'UC0000000000000000000000',
  // No mock fallback for these two — see adaptLiveStream in
  // live-adapter.ts for why a fake video ID or fake sermon notes would
  // be actively misleading rather than harmless placeholder content.
}

export const onlineGiving: OnlineGivingData = {
  heading: 'Online Giving',
  description: 'Support the ministry and help us reach more people with the love of Christ. Your generosity makes a difference.',
  buttonLabel: 'Give Now',
  buttonHref: '/give',
}

export const inPerson: InPersonData = {
  heading: 'Join us in Person',
  serviceTimes: [
    { id: 's1', label: 'First Service', time: '9:00 AM' },
    { id: 's2', label: 'Second Service', time: '11:00 AM' },
    { id: 's3', label: 'Youth Ministry', time: '11:00 AM' },
  ],
  directionsLabel: 'Get Directions',
  directionsHref: '/directions',
}
