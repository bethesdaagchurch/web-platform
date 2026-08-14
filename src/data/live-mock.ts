import type { LiveStreamData, ChatMessage, SermonNote, OnlineGivingData, InPersonData } from '@/types/live'

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
}

export const chatMessages: ChatMessage[] = [
  { id: 'm1', initials: 'A', avatarColor: 'gold', name: 'Alice M.', time: '10:02 AM', message: 'Good morning church family!' },
  { id: 'm2', initials: 'B', avatarColor: 'blue', name: 'Bob R.', time: '10:05 AM', message: 'Tuning in from Texas today. Blessed Sunday!' },
]

export const sermonNotes: SermonNote[] = [
  { id: 'n1', text: 'Full sermon notes for this week\u2019s message haven\u2019t been posted yet — check back after the service.' },
]

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
