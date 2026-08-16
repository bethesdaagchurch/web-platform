import type { LegalSection } from '@/types/legal'
import { siteSettings } from '@/data/homepage-mock'

export const termsHero = {
  eyebrow: 'Legal Document',
  title: 'Terms of Service',
  subtext: 'Please read these terms carefully before using our digital platforms or services. Last updated on October 24, 2024.',
}

export const termsSections: LegalSection[] = [
  {
    id: 'intro',
    heading: '',
    blocks: [
      {
        type: 'paragraph',
        text: `Welcome to ${siteSettings.churchName}. These Terms of Service ("Terms") govern your access to and use of our website, applications, and associated services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.`,
      },
      {
        type: 'callout',
        icon: 'handshake',
        heading: 'Acceptance of Terms',
        text: `By creating an account, accessing, or using the Services provided by ${siteSettings.churchName}, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you do not agree to these Terms, you may not access or use the Services. These terms apply to all visitors, users, and others who access the Services.`,
      },
    ],
  },
  {
    id: 'user-conduct',
    heading: 'User Conduct',
    blocks: [
      {
        type: 'paragraph',
        text: 'Our community is built on mutual respect and shared values. As a user of our Services, you agree not to use the Services in a way that:',
      },
      {
        type: 'bullets',
        items: [
          'Violates any applicable national, state, local, or international law or regulation.',
          'Exploits, harms, or attempts to exploit or harm minors in any way by exposing them to inappropriate content.',
          'Transmits, or procures the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.',
          `Impersonates or attempts to impersonate ${siteSettings.churchName}, a staff member, another user, or any other person or entity.`,
          `Engages in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which, as determined by us, may harm ${siteSettings.churchName} or users of the Services, or expose them to liability.`,
        ],
      },
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual Property',
    blocks: [
      {
        type: 'paragraph',
        text: `The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by ${siteSettings.churchName}, its licensors, or other providers of such material and are protected by applicable copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You are permitted to use the Services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as follows:`,
      },
      {
        type: 'bullets',
        items: [
          'Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.',
          'You may store files that are automatically cached by your web browser for display enhancement purposes.',
          'You may print or download one copy of a reasonable number of pages of the website for your own personal, non-commercial use and not for further reproduction, publication, or distribution.',
        ],
      },
    ],
  },
  {
    id: 'account-security',
    heading: 'Account Security',
    blocks: [
      {
        type: 'paragraph',
        text: 'If you choose, or are provided with, a user name, password, or any other piece of information as part of our security procedures, you must treat such information as confidential, and you must not disclose it to any other person or entity. You also acknowledge that your account is personal to you and agree not to provide any other person with access to this website or portions of it using your user name, password, or other security information.',
      },
    ],
  },
  {
    id: 'modifications',
    heading: 'Modifications to the Service',
    blocks: [
      {
        type: 'paragraph',
        text: 'We reserve the right to withdraw or amend our Services, and any service or material we provide via the Services, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Services is unavailable at any time or for any period. From time to time, we may restrict access to some parts of the Services, or the entire Services, to users, including registered users.',
      },
    ],
  },
]

export const termsCta = {
  heading: 'Questions about our terms?',
  description:
    'If you require further clarification on any of the points mentioned in our Terms of Service, our administrative team is here to help.',
  buttonLabel: 'Contact Administration',
  buttonHref: '/contact',
}
