import type { ContactHeroData, SubjectOption, OfficeHoursRow, VisitData } from '@/types/contact'

export const contactHero: ContactHeroData = {
  heading: "We'd love to hear from you",
  subtext:
    'Whether you have a question, need prayer, or simply want to connect, our doors and inboxes are always open. Reach out to us below.',
}

export const subjectOptions: SubjectOption[] = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'prayer', label: 'Prayer Request' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'ministry-info', label: 'Ministry Info' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
]

export const officeHours: OfficeHoursRow[] = [
  { id: 'weekdays', label: 'Monday - Thursday', hours: '9:00 AM - 4:00 PM' },
  { id: 'friday', label: 'Friday', hours: '9:00 AM - 12:00 PM' },
  { id: 'sunday', label: 'Sunday Services', hours: '8:00 AM, 10:30 AM & 6:00 PM', highlight: true },
]

export const visitData: VisitData = {
  campusName: 'Bethesda AG Church Campus',
  mapEmbedUrl: '', // TODO: paste a Google Maps embed URL once available
  directionsHref: '/directions',
}
