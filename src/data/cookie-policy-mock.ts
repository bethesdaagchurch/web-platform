import type { LegalPageData } from '@/types/legal'
import { siteSettings } from '@/data/homepage-mock'

export const cookiePolicy: LegalPageData = {
  title: 'Cookie Policy',
  lastUpdated: 'October 24, 2024',
  sections: [
    {
      id: 'intro',
      heading: '',
      blocks: [
        {
          type: 'paragraph',
          text: `At ${siteSettings.churchName}, we are committed to maintaining the trust and confidence of our community. This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.`,
        },
      ],
    },
    {
      id: 'what-are-cookies',
      heading: 'What are Cookies?',
      icon: 'cookie',
      blocks: [
        {
          type: 'paragraph',
          text: 'Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.',
        },
        {
          type: 'paragraph',
          text: `Cookies set by the website owner (in this case, ${siteSettings.churchName}) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., interactive content and analytics).`,
        },
      ],
    },
    {
      id: 'how-we-use-them',
      heading: 'How We Use Them',
      icon: 'settings',
      blocks: [
        {
          type: 'paragraph',
          text: 'We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies.',
        },
        {
          type: 'icon-items',
          items: [
            {
              icon: 'shield',
              title: 'Essential Cookies',
              text: 'These are necessary for the website to function properly. They include, for example, cookies that enable you to log into secure areas of our website.',
            },
            {
              icon: 'analytics',
              title: 'Analytics Cookies',
              text: 'These allow us to recognize and count the number of visitors and to see how visitors move around our website. This helps us improve the way our website works.',
            },
            {
              icon: 'sliders',
              title: 'Functional Cookies',
              text: 'These are used to recognize you when you return to our website. This enables us to personalize our content for you, such as remembering your preferences.',
            },
          ],
        },
      ],
    },
    {
      id: 'managing-preferences',
      heading: 'Managing Your Preferences',
      icon: 'preferences',
      blocks: [
        {
          type: 'paragraph',
          text: 'You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager when you first visit our site.',
        },
        {
          type: 'paragraph',
          text: 'You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.',
        },
        {
          type: 'info-note',
          text: 'To learn more about how to manage cookies through your browser, please visit the help menu of your specific browser.',
        },
      ],
    },
  ],
}
