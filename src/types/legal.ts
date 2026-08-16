export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'bold-items'; items: { label: string; text: string }[] }
  | { type: 'contact-box'; heading: string; paragraph: string; orgLines: string[] }
  | { type: 'callout'; icon: 'handshake'; heading: string; text: string }
  | { type: 'icon-items'; items: { icon: 'shield' | 'analytics' | 'sliders'; title: string; text: string }[] }
  | { type: 'info-note'; text: string }

export interface LegalSection {
  id: string
  heading: string
  icon?: 'cookie' | 'settings' | 'preferences'
  blocks: LegalBlock[]
}

export interface LegalPageData {
  title: string
  lastUpdated: string
  sections: LegalSection[]
}
