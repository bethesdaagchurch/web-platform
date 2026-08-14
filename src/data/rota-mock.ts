import type { RotaEntry, WorshipGuidelinesData } from '@/types/rota'

export const rotaEyebrow = 'Ministry Schedule'

export const worshipGuidelines: WorshipGuidelinesData = {
  heading: 'Worship Guidelines',
  description: 'Review the latest song lists and rehearsal schedules.',
  linkLabel: 'View Resources',
  linkHref: '/resources',
}

export const rotaEntries: RotaEntry[] = [
  {
    id: 'rota-1',
    date: '2024-11-03',
    ministry: 'Main Service',
    serviceTime: '10:00 AM',
    sermonSpeakerName: 'Pastor Smith',
    sermonSpeakerPhoto: '/images/rota-pastor-smith.jpg',
    sermonSpeakerIsGuest: false,
    sermonTitle: 'The Grace of Giving',
    worshipTeamName: 'The Heavensband Band',
    worshipLeaderName: 'David Kim',
    teamMemberAvatars: ['/images/rota-team-1.jpg', '/images/rota-team-2.jpg', '/images/rota-team-3.jpg'],
    teamMemberCount: 6,
    specialItems: [{ label: 'Offering Song', personName: 'Sarah Jenkins', roleLabel: 'Vocalist' }],
  },
  {
    id: 'rota-2',
    date: '2024-11-10',
    ministry: 'Main Service',
    serviceTime: '10:00 AM',
    sermonSpeakerName: 'Rev. Allen',
    sermonSpeakerPhoto: '/images/rota-rev-allen.jpg',
    sermonSpeakerIsGuest: true,
    sermonTitle: 'Missions Focus',
    worshipTeamName: 'Sanctuary Choir',
    worshipLeaderName: 'Maria Gonzalez',
    worshipBadge: 'Full Ensemble',
    teamMemberAvatars: [],
    teamMemberCount: 0,
    specialItems: [{ label: 'Communion Music', personName: 'String Quartet' }],
  },
]
