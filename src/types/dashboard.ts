export interface GroupItem {
  id: string
  name: string
  schedule: string
  location: string
  slug: string
}

export interface VolunteerShiftData {
  dayLabel: string
  role: string
  time: string
  location: string
}

export interface DashboardSermonItem {
  id: string
  slug: string
  seriesLabel: string
  title: string
  speakerName: string
  date: string
  thumbnail: string
}

export interface RegisteredEventItem {
  registrationId: string
  eventId: string
  slug: string
  title: string
  startDate: string
  time: string
  location: string
}

export interface RotaAssignmentItem {
  id: string
  date: string
  ministry: string
  serviceTime: string
  teamName: string
}

export interface MinistryDashboardItem {
  id: string
  slug: string
  name: string
}

export interface PendingRequestItem {
  id: string
  targetType: 'ministries' | 'groups'
  targetName: string
  status: 'pending' | 'declined'
}

export interface LeadershipInterestItem {
  id: string
  areaOfInterest: string
  status: 'new' | 'contacted' | 'placed'
  createdAt: string
}
