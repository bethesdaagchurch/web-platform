import type { DirectionsPage as DirectionsPageGlobal } from '@/payload-types'
import type { DirectionsHeroData, DirectionsServiceTime, NeedHelpData, DrivingDirectionSection, ParkingItem } from '@/types/directions'
import {
  directionsHero as mockHero,
  directionsServiceTimes as mockTimes,
  needHelp as mockNeedHelp,
  drivingDirections as mockDriving,
  parkingItems as mockParking,
} from '@/data/directions-mock'

export function adaptDirectionsHero(doc: DirectionsPageGlobal | null): DirectionsHeroData {
  if (!doc?.hero) return mockHero
  return {
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
  }
}

export function adaptDirectionsServiceTimes(doc: DirectionsPageGlobal | null): DirectionsServiceTime[] {
  if (!doc?.serviceTimes || doc.serviceTimes.length === 0) return mockTimes
  return doc.serviceTimes.map((row, i) => ({
    id: row.id || `time-${i}`,
    label: row.label,
    time: row.time,
  }))
}

export function adaptNeedHelp(doc: DirectionsPageGlobal | null): NeedHelpData {
  if (!doc?.needHelp) return mockNeedHelp
  return {
    heading: doc.needHelp.heading || mockNeedHelp.heading,
    description: doc.needHelp.description || mockNeedHelp.description,
  }
}

export function adaptDrivingDirections(doc: DirectionsPageGlobal | null): DrivingDirectionSection[] {
  if (!doc?.drivingDirections || doc.drivingDirections.length === 0) return mockDriving
  return doc.drivingDirections.map((item, i) => ({
    id: item.id || `direction-${i}`,
    heading: item.heading,
    text: item.text,
  }))
}

export function adaptParkingItems(doc: DirectionsPageGlobal | null): ParkingItem[] {
  if (!doc?.parkingItems || doc.parkingItems.length === 0) return mockParking
  return doc.parkingItems.map((item, i) => ({
    id: item.id || `parking-${i}`,
    icon: item.icon,
    title: item.title,
    description: item.description,
  }))
}
