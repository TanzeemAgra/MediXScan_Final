import landingConfig from './landing-page.config';

const staticPages = {
  features: {
    title: landingConfig.features.section.title || 'Features',
    subtitle: landingConfig.features.section.subtitle || '',
    content: landingConfig.features.items || [] // features list
  },
  security: {
    title: landingConfig.security.section.title || 'Security',
    subtitle: landingConfig.security.section.subtitle || '',
    content: landingConfig.security
  },
  integrations: {
    title: 'Integrations',
    subtitle: 'Connect MediXScan with your existing systems and PACS',
    content: {
      description: 'We provide ready-made integrations for major PACS, RIS, EHR vendors and a robust API for custom workflows.'
    }
  },
  docs: {
    title: 'Documentation',
    subtitle: 'Developer resources, API reference and integration guides',
    content: {
      overview: 'Explore API docs, SDKs, and integration examples to get started quickly.'
    }
  },
  'docs-api': {
    title: 'API Documentation',
    subtitle: 'REST API and Webhooks',
    content: {
      overview: 'The MediXScan API provides endpoints to submit studies, fetch analysis results, manage users, and integrate with clinical systems.'
    }
  },
  help: {
    title: 'Help Center',
    subtitle: 'Support articles, FAQs and contact options',
    content: {
      overview: 'Search our knowledge base or contact support for assistance.'
    }
  },
  training: {
    title: 'Training',
    subtitle: 'Training programs and certification for clinical teams',
    content: {
      overview: 'On-demand training and live sessions to onboard your radiology team.'
    }
  },
  webinars: {
    title: 'Webinars',
    subtitle: 'Upcoming and recorded webinars',
    content: {
      overview: 'Join live demos or watch recordings to learn best practices.'
    }
  },
  'case-studies': {
    title: 'Case Studies',
    subtitle: 'Clinical outcomes and success stories',
    content: landingConfig.testimonials.items || []
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we protect patient data',
    content: {
      overview: 'MediXScan is committed to protecting patient privacy and complying with applicable laws.'
    }
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Legal terms and service level agreements',
    content: {
      overview: 'Use of the MediXScan platform is subject to these terms.'
    }
  },
  cookies: {
    title: 'Cookie Policy',
    subtitle: 'How we use cookies',
    content: {
      overview: 'We use cookies and similar technologies to improve site experience and analytics.'
    }
  },
  gdpr: {
    title: 'GDPR',
    subtitle: 'General Data Protection Regulation compliance',
    content: landingConfig.security.certifications || []
  }
};

export const getStaticPage = (slug) => {
  return staticPages[slug] || null;
};

export default staticPages;
