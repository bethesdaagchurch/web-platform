import type { VisitPage as VisitPageGlobal } from '@/payload-types'
import type { VisitHeroData, ExpectationItem, VisitServiceTime } from '@/types/visit'
import { visitHero as mockHero, expectations as mockExpectations, visitServiceTimes as mockTimes } from '@/data/visit-mock'

export function adaptVisitHero(doc: VisitPageGlobal | null): VisitHeroData {
  if (!doc?.hero) return mockHero
  return {
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
  }
}

export function adaptExpectations(doc: VisitPageGlobal | null): ExpectationItem[] {
  if (!doc?.whatToExpect || doc.whatToExpect.length === 0) return mockExpectations
  return doc.whatToExpect.map((item, i) => ({
    id: item.id || `expect-${i}`,
    icon: item.icon,
    title: item.title,
    description: item.description,
  }))
}

export function adaptVisitServiceTimes(doc: VisitPageGlobal | null): VisitServiceTime[] {
  if (!doc?.serviceTimes || doc.serviceTimes.length === 0) return mockTimes
  return doc.serviceTimes.map((row, i) => ({
    id: row.id || `time-${i}`,
    label: row.label,
    time: row.time,
  }))
}
