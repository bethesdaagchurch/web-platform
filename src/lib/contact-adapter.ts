import type { ContactPage as ContactPageGlobal } from '@/payload-types'
import type { ContactHeroData, SubjectOption, VisitData } from '@/types/contact'
import { contactHero as mockHero, subjectOptions as mockSubjectOptions, visitData as mockVisitData } from '@/data/contact-mock'

export function adaptContactHero(doc: ContactPageGlobal | null): ContactHeroData {
  if (!doc?.hero) return mockHero
  return {
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
  }
}

export function adaptSubjectOptions(doc: ContactPageGlobal | null): SubjectOption[] {
  if (!doc?.subjectOptions || doc.subjectOptions.length === 0) return mockSubjectOptions
  return doc.subjectOptions.map((o) => ({ value: o.value, label: o.label }))
}

// mapEmbedUrl comes from SiteSettings (site-settings-adapter.ts), not here —
// this only covers the fields specific to the Contact page itself.
export function adaptVisitData(doc: ContactPageGlobal | null, mapEmbedUrl: string): VisitData {
  if (!doc?.visit) return { ...mockVisitData, mapEmbedUrl }
  return {
    campusName: doc.visit.campusName || mockVisitData.campusName,
    directionsHref: doc.visit.directionsHref || mockVisitData.directionsHref,
    mapEmbedUrl,
  }
}
