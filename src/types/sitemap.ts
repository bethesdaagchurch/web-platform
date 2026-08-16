export interface SitemapLink {
  label: string
  description: string
  href: string
}

export interface SitemapSection {
  id: string
  icon: 'home' | 'info' | 'ministries' | 'sermons' | 'events'
  title: string
  links: SitemapLink[]
}
