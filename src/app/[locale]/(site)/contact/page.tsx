import { ContactHero } from '@/components/contact/ContactHero'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactSidebar } from '@/components/contact/ContactSidebar'
import { VisitMap } from '@/components/contact/VisitMap'

import { getPayloadClient } from '@/lib/payload'
import { adaptContactHero, adaptSubjectOptions, adaptVisitData } from '@/lib/contact-adapter'
import { adaptSiteSettings, adaptOfficeHours, resolveMapEmbedUrl } from '@/lib/site-settings-adapter'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [contactPage, siteSettingsDoc] = await Promise.all([
    payload.findGlobal({ slug: 'contact-page', locale: typedLocale }),
    payload.findGlobal({ slug: 'site-settings', locale: typedLocale }),
  ])

  const siteSettings = adaptSiteSettings(siteSettingsDoc)

  return (
    <>
      <ContactHero data={adaptContactHero(contactPage)} />

      <section className="mx-auto max-w-content px-6 py-12">
        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <ContactForm subjectOptions={adaptSubjectOptions(contactPage)} />
          <ContactSidebar
            hours={adaptOfficeHours(siteSettingsDoc)}
            address={siteSettings.address}
            phone={siteSettings.phone}
            email={siteSettings.email}
          />
        </div>
      </section>

      <VisitMap data={adaptVisitData(contactPage, resolveMapEmbedUrl(siteSettings))} />
    </>
  )
}
