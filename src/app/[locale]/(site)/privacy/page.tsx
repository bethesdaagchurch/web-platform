import { LegalTableOfContents } from '@/components/legal/LegalTableOfContents'
import { LegalContent } from '@/components/legal/LegalContent'
import { privacyPolicy } from '@/data/privacy-policy-mock'

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-content px-6 py-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <LegalTableOfContents sections={privacyPolicy.sections} />
        <LegalContent data={privacyPolicy} />
      </div>
    </div>
  )
}
