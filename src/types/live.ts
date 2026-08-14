export interface LiveStreamData {
  isLive: boolean
  liveLabel: string
  title: string
  speaker: string
  bookReference: string
  youtubeChannelId: string
}

export interface ChatMessage {
  id: string
  initials: string
  avatarColor: 'gold' | 'blue'
  name: string
  time: string
  message: string
}

export interface SermonNote {
  id: string
  text: string
}

export interface OnlineGivingData {
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
}

export interface ServiceTimeRow {
  id: string
  label: string
  time: string
}

export interface InPersonData {
  heading: string
  serviceTimes: ServiceTimeRow[]
  directionsLabel: string
  directionsHref: string
}
