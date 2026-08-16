import { LegalHero } from '@/components/legal/LegalHero'
import { LegalSectionsList } from '@/components/legal/LegalSectionsList'
import { LegalContactCta } from '@/components/legal/LegalContactCta'
import { termsHero, termsSections, termsCta } from '@/data/terms-mock'

export default function TermsPage() {
  return (
    <>
      <LegalHero eyebrow={termsHero.eyebrow} title={termsHero.title} subtext={termsHero.subtext} />
      <div className="mx-auto max-w-3xl px-6 pb-16">
        <LegalSectionsList sections={termsSections} />
        <LegalContactCta
          heading={termsCta.heading}
          description={termsCta.description}
          buttonLabel={termsCta.buttonLabel}
          buttonHref={termsCta.buttonHref}
        />
      </div>
    </>
  )
}
