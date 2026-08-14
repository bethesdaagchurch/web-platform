export interface ContactHeroData {
  heading: string
  subtext: string
}

export interface SubjectOption {
  value: string
  label: string
}

export interface OfficeHoursRow {
  id: string
  label: string
  hours: string
  highlight?: boolean // Sunday Services row is styled gold in the design
}

export interface VisitData {
  campusName: string
  mapEmbedUrl: string
  directionsHref: string
}
