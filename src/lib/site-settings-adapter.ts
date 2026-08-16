import type { SiteSetting } from '@/payload-types'
import type { SiteSettings } from '@/types/homepage'
import type { OfficeHoursRow } from '@/types/contact'
import { siteSettings as mockSiteSettings } from '@/data/homepage-mock'
import { officeHours as mockOfficeHours } from '@/data/contact-mock'

export function adaptSiteSettings(doc: SiteSetting | null): SiteSettings {
  if (!doc) return mockSiteSettings
  return {
    churchName: doc.churchName || mockSiteSettings.churchName,
    tagline: doc.tagline || mockSiteSettings.tagline,
    address: doc.address && doc.address.length > 0 ? doc.address.map((a) => a.line) : mockSiteSettings.address,
    phone: doc.phone || mockSiteSettings.phone,
    email: doc.email || mockSiteSettings.email,
    mapEmbedUrl: doc.mapEmbedUrl || mockSiteSettings.mapEmbedUrl,
    // Structural, code-owned — not sourced from the CMS. See file header.
    nav: mockSiteSettings.nav,
    footerLinks: mockSiteSettings.footerLinks,
  }
}

export function adaptOfficeHours(doc: SiteSetting | null): OfficeHoursRow[] {
  if (!doc?.officeHours || doc.officeHours.length === 0) return mockOfficeHours
  return doc.officeHours.map((row, i) => ({
    id: row.id || `hours-${i}`,
    label: row.label,
    hours: row.hours,
    highlight: row.highlight ?? false,
  }))
}

// SiteSettings.mapEmbedUrl requires an admin to know how to get a real
// Google Maps *embed* URL (Share > Embed a map > copy the iframe src) —
// a confusing, error-prone manual step for a non-technical church admin,
// and it's simply never been set, so both maps have just shown a "not
// set" placeholder since they were built. This derives a real, working
// embed automatically from the same churchName/address already entered,
// using Google's keyless `?output=embed` query format (no API key, no
// billing account — matching this project's free-tools-only constraint)
// rather than the full Embed API. The manually-pasted field is kept as an
// optional override, for a church that wants a precisely-placed pin.
export function resolveMapEmbedUrl(settings: SiteSettings): string {
  if (settings.mapEmbedUrl) return settings.mapEmbedUrl
  const query = encodeURIComponent([settings.churchName, ...settings.address].join(' '))
  return `https://www.google.com/maps?q=${query}&output=embed`
}
