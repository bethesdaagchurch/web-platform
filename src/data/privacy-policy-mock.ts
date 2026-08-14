import type { LegalPageData } from '@/types/legal'
import { siteSettings } from '@/data/homepage-mock'

export const privacyPolicy: LegalPageData = {
  title: 'Privacy Policy',
  lastUpdated: 'October 24, 2024',
  sections: [
    {
      id: 'introduction',
      heading: 'Introduction',
      blocks: [
        {
          type: 'paragraph',
          text: `Welcome to ${siteSettings.churchName}. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.`,
        },
        {
          type: 'paragraph',
          text: 'This privacy notice describes how we might use your information if you visit our website, engage with us in other related ways \u2014 including any sales, marketing, or events.',
        },
      ],
    },
    {
      id: 'information-collection',
      heading: 'Information Collection',
      blocks: [
        {
          type: 'paragraph',
          text: 'We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our ministries and services, when you participate in activities on the website, or otherwise when you contact us.',
        },
        {
          type: 'bold-items',
          items: [
            {
              label: 'Personal Information Provided by You:',
              text: 'We collect names; phone numbers; email addresses; mailing addresses; contact preferences; and other similar information.',
            },
            {
              label: 'Payment Data:',
              text: 'We may collect data necessary to process your payment if you make donations or purchases.',
            },
          ],
        },
      ],
    },
    {
      id: 'use-of-information',
      heading: 'Use of Information',
      blocks: [
        {
          type: 'paragraph',
          text: 'We use personal information collected via our website for a variety of purposes described below. We process your personal information for these purposes in reliance on our legitimate interests as a ministry, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.',
        },
        {
          type: 'bullets',
          items: [
            'To facilitate account creation and login process.',
            'To send administrative information to you.',
            'To fulfill and manage your orders and donations.',
            'To respond to user inquiries and offer support to users.',
          ],
        },
      ],
    },
    {
      id: 'cookies-tracking',
      heading: 'Cookies & Tracking',
      blocks: [
        {
          type: 'paragraph',
          text: 'We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.',
        },
      ],
    },
    {
      id: 'your-rights',
      heading: 'Your Rights',
      blocks: [
        {
          type: 'paragraph',
          text: 'Depending on your location, you may have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure, (iii) to restrict the processing of your personal information, and (iv) if applicable, to data portability.',
        },
      ],
    },
    {
      id: 'contact-us',
      heading: 'Contact Us',
      blocks: [
        {
          type: 'contact-box',
          heading: 'Contact Us',
          paragraph: 'If you have questions or comments about this notice, you may email us at privacy@bethesdaag.church or by post to:',
          orgLines: [siteSettings.churchName, ...siteSettings.address],
        },
      ],
    },
  ],
}
