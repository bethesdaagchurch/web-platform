import { LegalHero } from '@/components/legal/LegalHero'
import { LegalSectionsList } from '@/components/legal/LegalSectionsList'
import { cookiePolicy } from '@/data/cookie-policy-mock'

export default function CookiePolicyPage() {
  return (
    <div className="pb-16">
      <LegalHero title={cookiePolicy.title} lastUpdated={cookiePolicy.lastUpdated} align="left" />
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <LegalSectionsList sections={cookiePolicy.sections} />
      </div>
    </div>
  )
}
