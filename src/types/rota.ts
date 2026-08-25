export interface RotaFilterOption {
  value: string
  label: string
}

export interface RotaSpecialItem {
  label: string
  personName: string
  roleLabel?: string
}

export interface RotaEntry {
  id: string
  date: string // ISO
  ministry: string
  serviceTime: string
  sermonSpeakerName: string
  sermonSpeakerPhoto: string
  sermonSpeakerIsGuest: boolean
  sermonTitle: string
  sermonTranslatorName?: string
  worshipTeamName: string
  worshipLeaderName: string
  worshipBadge?: string
  choirTeamNames?: string
  teamMemberAvatars: string[]
  teamMemberCount: number
  specialItems: RotaSpecialItem[]
}

export interface WorshipGuidelinesData {
  heading: string
  description: string
  linkLabel: string
  linkHref: string
}
