// Landing Page Configuration for MediXScan
// Comprehensive soft-coded configuration inspired by modern medical AI platforms

const landingPageConfig = {
  // Global Landing Page Settings
  meta: {
    title: "MediXScan AI - Revolutionary Medical Imaging Intelligence",
    description: "Transform healthcare delivery with cutting-edge AI that enhances diagnostic precision, accelerates analysis workflows, and elevates patient care standards.",
    keywords: "AI radiology, medical imaging, DICOM analysis, healthcare AI, medical diagnostics, radiology workflow",
    ogImage: "/assets/images/medixscan-og-image.png",
    favicon: "/favicon.ico"
  },

  // Base path for assets (can be overridden in deployments)
  assetsBase: '/assets',

  // Animation & Interaction Settings
  animations: {
    enableScrollAnimations: true,
    enableParallax: true,
    enableTypewriter: true,
    enableCounterAnimations: true,
    // Enable inline feature videos in showcases (desktop only by default)
    enableFeatureVideos: true,
    transitionDuration: 300,
    scrollOffset: 100,
    enableParticleBackground: true
  },

  // Hero Section Configuration
  hero: {
    enabled: true,
    layout: "gradient-overlay", // "gradient-overlay", "video-background", "particle-system"
    background: {
      type: "gradient", // "gradient", "video", "image", "particle"
      gradient: {
        colors: ["#667eea", "#764ba2", "#f093fb"],
        direction: "135deg"
      },
      particle: {
        count: 50,
        color: "#ffffff",
        opacity: 0.1,
        speed: 0.5
      }
    },
    content: {
      preTitle: "AI-Powered Radiology Excellence",
      title: {
        main: "Revolutionary Medical Imaging",
        highlight: "Intelligence",
        subtitle: "Transform healthcare delivery with cutting-edge AI that enhances diagnostic precision, accelerates analysis workflows, and elevates patient care standards."
      },
      cta: {
        primary: {
          text: "Start Free Trial",
          action: "navigate",
          target: "/auth/rbac-login",
          variant: "primary",
          size: "lg",
          icon: "ri-play-circle-line"
        },
        secondary: {
          text: "Schedule Demo",
          action: "modal",
          target: "demo-modal",
          variant: "outline-light",
          size: "lg",
          icon: "ri-calendar-line"
        },
        tertiary: {
          text: "Watch Demo Video",
          action: "modal",
          target: "video-modal",
          variant: "link",
          size: "lg",
          icon: "ri-play-line"
        }
      }
    },
    statistics: {
      enabled: true,
      layout: "horizontal", // "horizontal", "grid", "carousel"
      trustBadge: "Trusted by Healthcare Professionals Worldwide",
      stats: [
        {
          id: "reports",
          value: 10000,
          suffix: "+",
          label: "Reports Analyzed Daily",
          icon: "ri-file-chart-line",
          color: "#28a745",
          animationDelay: 0
        },
        {
          id: "facilities",
          value: 500,
          suffix: "+",
          label: "Healthcare Facilities",
          icon: "ri-hospital-line",
          color: "#007bff",
          animationDelay: 200
        },
        {
          id: "accuracy",
          value: 99.7,
          suffix: "%",
          label: "Accuracy Rate",
          icon: "ri-shield-check-line",
          color: "#28a745",
          animationDelay: 400
        },
        {
          id: "professionals",
          value: 2000,
          suffix: "+",
          label: "Medical Professionals",
          icon: "ri-user-heart-line",
          color: "#6f42c1",
          animationDelay: 600
        }
      ]
    }
  },

  // Features Section Configuration
  features: {
    enabled: true,
    layout: "carousel-showcase", // "grid", "tabs", "carousel-showcase", "masonry"
    section: {
      preTitle: "Advanced Radiology Solutions in Action",
      title: "Experience the Future of Medical Imaging",
      subtitle: "Cutting-edge AI technology and revolutionary diagnostic capabilities"
    },
    showcase: {
      enabled: true,
      autoPlay: true,
      interval: 5000,
      showIndicators: true,
      showControls: true
    },
    items: [
      {
        id: "thoracic-imaging",
        category: "AI Analysis",
        title: "AI-Powered Chest Analysis",
        subtitle: "Thoracic Imaging Excellence",
        description: "State-of-the-art deep learning algorithms analyze chest X-rays with superhuman precision, detecting pneumonia, nodules, tuberculosis, and complex pulmonary conditions in real-time with unmatched accuracy.",
        image: "/assets/images/features/thoracic-imaging.jpg",
        video: "/assets/videos/thoracic-analysis-demo.mp4",
        specs: {
          processingTime: "< 0.5 seconds",
          accuracy: "99.8%",
          pathologies: "15+ conditions",
          status: "Active AI Processing"
        },
        features: [
          "99.8% Diagnostic Accuracy",
          "Sub-second Analysis Speed", 
          "Multi-pathology Detection",
          "Real-time Processing"
        ],
        cta: {
          text: "Explore",
          action: "navigate",
          target: "/radiology/chest-analysis"
        },
        badge: "Most Popular"
      },
      {
        id: "neuroimaging",
        category: "Brain Analysis",
        title: "Advanced Neuroimaging AI",
        subtitle: "Brain & Spine Intelligence",
        description: "Revolutionary neural network technology for MRI and CT brain analysis, detecting strokes, tumors, hemorrhages, and neurological conditions with exceptional precision and speed.",
        image: "/assets/images/features/neuroimaging.jpg",
        video: "/assets/videos/neuro-analysis-demo.mp4",
        specs: {
          processingTime: "< 1.2 seconds",
          accuracy: "99.5%",
          pathologies: "20+ conditions",
          status: "Advanced Neural Networks"
        },
        features: [
          "Multi-modal Brain Analysis",
          "Stroke Detection in Minutes",
          "Tumor Segmentation",
          "Automated Reporting"
        ],
        cta: {
          text: "Explore",
          action: "navigate", 
          target: "/radiology/neuroimaging"
        }
      },
      {
        id: "musculoskeletal",
        category: "Bone Analysis",
        title: "Orthopedic AI Diagnosis", 
        subtitle: "Musculoskeletal Intelligence",
        description: "Comprehensive bone and joint analysis using advanced computer vision to detect fractures, arthritis, bone density issues, and orthopedic conditions with radiologist-level accuracy.",
        image: "/assets/images/features/musculoskeletal.jpg",
        video: "/assets/videos/ortho-analysis-demo.mp4",
        specs: {
          processingTime: "< 0.8 seconds",
          accuracy: "99.2%", 
          pathologies: "12+ conditions",
          status: "Computer Vision Active"
        },
        features: [
          "Fracture Detection",
          "Arthritis Assessment",
          "Bone Density Analysis",
          "3D Reconstruction"
        ],
        cta: {
          text: "Explore",
          action: "navigate",
          target: "/radiology/musculoskeletal"
        }
      }
    ]
  },

  // Intelligent Solutions Section
  solutions: {
    enabled: true,
    layout: "grid-with-animations", // "grid", "masonry", "grid-with-animations"
    section: {
      preTitle: "Intelligent Radiology Solutions", 
      title: "Comprehensive AI-Powered Tools for Modern Healthcare",
      subtitle: "Revolutionary features designed for healthcare excellence"
    },
    items: [
      {
        id: "ai-analysis",
        title: "AI-Powered Analysis",
        description: "Advanced machine learning algorithms analyze radiology reports with unprecedented accuracy and speed.",
        icon: "ri-brain-line",
        gradient: ["#667eea", "#764ba2"],
        metrics: [
          { label: "Accuracy Rate", value: "99.7%" },
          { label: "Processing", value: "Real-time" },
          { label: "Analysis", value: "Multi-modal" }
        ],
        features: [
          "Deep Learning Models",
          "Computer Vision AI", 
          "Natural Language Processing",
          "Predictive Analytics"
        ],
        animationDelay: 0
      },
      {
        id: "multi-doctor",
        title: "Multi-Doctor Platform",
        description: "Collaborative workspace designed for multiple healthcare professionals with role-based access control.",
        icon: "ri-team-line",
        gradient: ["#f093fb", "#f5576c"],
        metrics: [
          { label: "Role Management", value: "Advanced" },
          { label: "Collaboration", value: "Secure" },
          { label: "Audit Trail", value: "Complete" }
        ],
        features: [
          "RBAC System",
          "Real-time Collaboration",
          "Secure Messaging", 
          "Workflow Management"
        ],
        animationDelay: 200
      },
      {
        id: "rag-enhancement",
        title: "RAG Enhancement",
        description: "Retrieval-Augmented Generation technology for context-aware medical insights and recommendations.",
        icon: "ri-lightbulb-line",
        gradient: ["#4facfe", "#00f2fe"],
        metrics: [
          { label: "Context-Aware", value: "Advanced" },
          { label: "Knowledge Base", value: "Medical" },
          { label: "Recommendations", value: "Smart" }
        ],
        features: [
          "Medical Knowledge Integration",
          "Context Understanding",
          "Intelligent Suggestions",
          "Evidence-Based Insights"
        ],
        animationDelay: 400
      },
      {
        id: "workflow-automation", 
        title: "Workflow Automation",
        description: "Streamlined processes that reduce manual tasks and accelerate diagnostic workflows.",
        icon: "ri-settings-3-line",
        gradient: ["#fa709a", "#fee140"],
        metrics: [
          { label: "Auto-routing", value: "Intelligent" },
          { label: "Scheduling", value: "Smart" },
          { label: "Reports", value: "Automated" }
        ],
        features: [
          "Automated Case Routing",
          "Smart Prioritization",
          "Report Generation",
          "Quality Assurance"
        ],
        animationDelay: 600
      },
      {
        id: "quality-assurance",
        title: "Quality Assurance", 
        description: "Built-in quality checks and validation systems ensure consistent, reliable diagnostic output.",
        icon: "ri-shield-check-line",
        gradient: ["#a8edea", "#fed6e3"],
        metrics: [
          { label: "Error Detection", value: "Automated" },
          { label: "Consistency", value: "Verified" },
          { label: "Compliance", value: "Monitored" }
        ],
        features: [
          "Automated QC Checks",
          "Consistency Validation",
          "Error Prevention",
          "Compliance Monitoring"
        ],
        animationDelay: 800
      },
      {
        id: "analytics-insights",
        title: "Analytics & Insights",
        description: "Comprehensive reporting and analytics to track performance and identify improvement opportunities.", 
        icon: "ri-bar-chart-line",
        gradient: ["#ffecd2", "#fcb69f"],
        metrics: [
          { label: "Performance", value: "Real-time" },
          { label: "Analysis", value: "Trend" },
          { label: "Reports", value: "Custom" }
        ],
        features: [
          "Real-time Dashboards",
          "Performance Analytics",
          "Trend Analysis",
          "Custom Reporting"
        ],
        animationDelay: 1000
      }
    ]
  },

  // Testimonials Section
  testimonials: {
    enabled: true,
    layout: "carousel-cards", // "carousel", "grid", "carousel-cards"
    section: {
      preTitle: "What Healthcare Professionals Say",
      title: "Trusted by Leading Medical Professionals Worldwide",
      subtitle: "Real experiences from healthcare professionals using MediXScan AI"
    },
    autoPlay: true,
    interval: 6000,
    showIndicators: true,
    items: [
      {
        id: "dr-sarah-johnson",
        name: "Dr. Sarah Johnson",
        position: "Chief Radiologist", 
        organization: "Metropolitan Medical Center",
        specialization: "Thoracic Imaging",
        avatar: "/assets/images/testimonials/dr-sarah-johnson.jpg",
        rating: 5,
        quote: "MediXScan AI has revolutionized our diagnostic workflow. The accuracy and speed of analysis have significantly improved our patient care quality. Our team can now process 40% more cases with higher confidence.",
        metrics: {
          casesProcessed: "40% increase",
          timeReduced: "60% faster",
          accuracyImprovement: "15% better"
        },
        badge: "Verified Professional"
      },
      {
        id: "dr-michael-chen",
        name: "Dr. Michael Chen",
        position: "Director of Radiology",
        organization: "City General Hospital", 
        specialization: "Neuroimaging",
        avatar: "/assets/images/testimonials/dr-michael-chen.jpg",
        rating: 5,
        quote: "The multi-doctor collaboration features and RAG enhancement have transformed how our team works together. The AI insights are incredibly accurate and save us hours of analysis time.",
        metrics: {
          collaborationImprovement: "85% better",
          timeReduced: "4 hours daily",
          teamEfficiency: "200% increase"
        },
        badge: "Department Director"
      },
      {
        id: "dr-emily-rodriguez",
        name: "Dr. Emily Rodriguez",
        position: "Senior Radiologist",
        organization: "University Medical Center",
        specialization: "Pediatric Radiology", 
        avatar: "/assets/images/testimonials/dr-emily-rodriguez.jpg",
        rating: 5,
        quote: "The AI's ability to detect subtle abnormalities in pediatric cases is remarkable. It's like having a second set of expert eyes on every case, which gives me tremendous confidence in my diagnoses.",
        metrics: {
          detectionRate: "99.8% accuracy",
          confidenceIncrease: "95% higher",
          patientOutcomes: "30% better"
        },
        badge: "Pediatric Specialist"
      }
    ]
  },

  // Security & Compliance Section
  security: {
    enabled: true,
    layout: "compliance-grid", // "grid", "tabs", "compliance-grid"
    section: {
      preTitle: "Enterprise-Grade Security & Compliance",
      title: "Your Data Security and Privacy Are Our Top Priorities",
      subtitle: "MediXScan AI adheres to the highest standards of healthcare data protection and privacy regulations"
    },
    certifications: [
      {
        id: "hipaa",
        name: "HIPAA Compliant",
        description: "Health Insurance Portability and Accountability Act",
        icon: "ri-hospital-line",
        badge: "/assets/images/certifications/hipaa-badge.png",
        features: [
          "End-to-end PHI encryption",
          "Role-based access controls", 
          "Comprehensive audit trails",
          "BAA agreements available"
        ],
        verificationUrl: "#hipaa-verification"
      },
      {
        id: "gdpr",
        name: "GDPR Compliant", 
        description: "General Data Protection Regulation",
        icon: "ri-shield-line",
        badge: "/assets/images/certifications/gdpr-badge.png",
        features: [
          "Explicit consent management",
          "Right to be forgotten",
          "Data portability rights",
          "Privacy by design"
        ],
        verificationUrl: "#gdpr-verification"
      },
      {
        id: "soc2",
        name: "SOC 2 Type II",
        description: "Service Organization Control 2", 
        icon: "ri-award-line",
        badge: "/assets/images/certifications/soc2-badge.png",
        features: [
          "Security controls verified",
          "Availability monitoring",
          "Processing integrity",
          "Confidentiality assured"
        ],
        verificationUrl: "#soc2-verification"
      },
      {
        id: "iso27001",
        name: "ISO 27001",
        description: "Information Security Management",
        icon: "ri-secure-payment-line", 
        badge: "/assets/images/certifications/iso27001-badge.png",
        features: [
          "Risk management framework",
          "Security incident response",
          "Continuous monitoring",
          "Regular security audits"
        ],
        verificationUrl: "#iso27001-verification"
      }
    ],
    trustFeatures: [
      {
        title: "Zero Trust Architecture",
        description: "Every access request is verified and authenticated",
        icon: "ri-shield-keyhole-line"
      },
      {
        title: "End-to-End Encryption", 
        description: "AES-256 encryption for data at rest and TLS 1.3 in transit",
        icon: "ri-lock-2-line"
      },
      {
        title: "Regular Security Audits",
        description: "Quarterly penetration testing and daily vulnerability scans", 
        icon: "ri-search-eye-line"
      },
      {
        title: "24/7 Security Monitoring",
        description: "Real-time threat detection and incident response",
        icon: "ri-eye-line"
      }
    ]
  },

  // Call to Action Section
  cta: {
    enabled: true,
    layout: "centered-with-stats", // "centered", "split", "centered-with-stats"
    background: {
      type: "gradient",
      gradient: {
        colors: ["#667eea", "#764ba2"],
        direction: "135deg"
      }
    },
    section: {
      preTitle: "Get Started Today",
      title: "Ready to Transform Your Radiology Practice?",
      subtitle: "Join thousands of healthcare professionals who trust MediXScan AI for accurate, fast, and reliable radiology analysis."
    },
    actions: [
      {
        id: "trial",
        text: "Start Free Trial",
        action: "navigate",
        target: "/auth/rbac-login",
        variant: "light",
        size: "lg",
        icon: "ri-play-circle-line"
      },
      {
        id: "demo",
        text: "Schedule Demo", 
        action: "modal",
        target: "demo-modal",
        variant: "outline-light",
        size: "lg",
        icon: "ri-calendar-line"
      },
      {
        id: "video",
        text: "Watch Demo Video",
        action: "modal",
        target: "video-modal", 
        variant: "link",
        size: "lg",
        icon: "ri-play-line"
      }
    ],
    trustIndicators: [
      {
        label: "HIPAA Compliant",
        sublabel: "Enterprise Security",
        icon: "ri-shield-check-line"
      },
      {
        label: "10,000+ Users", 
        sublabel: "Healthcare Professionals",
        icon: "ri-user-heart-line"
      },
      {
        label: "500+ Hospitals",
        sublabel: "Worldwide Trust",
        icon: "ri-hospital-line" 
      },
      {
        label: "99.9% Uptime",
        sublabel: "Guaranteed Reliability",
        icon: "ri-time-line"
      }
    ]
  },

  // Footer Configuration
  footer: {
    enabled: true,
    layout: "comprehensive", // "simple", "comprehensive", "minimal"
    branding: {
      logo: "/assets/images/medixscan-logo-white.png",
      name: "MediXScan AI", 
      tagline: "Advanced Radiology Intelligence",
      description: "Revolutionizing medical diagnostics with cutting-edge AI technology. Trusted by healthcare professionals worldwide for accurate, fast, and reliable radiology analysis."
    },
    social: [
      {
        name: "LinkedIn",
        url: "https://linkedin.com/company/medixscan", 
        icon: "ri-linkedin-fill"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/medixscan",
        icon: "ri-twitter-fill"
      },
      {
        name: "Facebook", 
        url: "https://facebook.com/medixscan",
        icon: "ri-facebook-fill"
      }
    ],
    sections: [
      {
        title: "Platform",
        links: [
          { text: "Features", url: "/features" },
          { text: "Pricing", url: "/pricing" },
          { text: "Security", url: "/security" },
          { text: "Integrations", url: "/integrations" },
          { text: "API Documentation", url: "/docs/api" }
        ]
      },
      {
        title: "Resources", 
        links: [
          { text: "Documentation", url: "/docs" },
          { text: "Help Center", url: "/help" },
          { text: "Training", url: "/training" },
          { text: "Webinars", url: "/webinars" },
          { text: "Case Studies", url: "/case-studies" }
        ]
      }
    ],
    contact: {
      email: "contact@medixscan.ai",
      phone: "+1 (555) 123-4567",
      address: "123 Medical Plaza, Healthcare District, HC 12345"
    },
    legal: [
      { text: "Privacy Policy", url: "/privacy" },
      { text: "Terms of Service", url: "/terms" },
      { text: "Cookie Policy", url: "/cookies" }, 
      { text: "GDPR", url: "/gdpr" }
    ],
    copyright: "© 2025 MediXScan AI. All rights reserved. Built with ❤️ for healthcare professionals"
  }
};

// Helper Functions for Landing Page Configuration

// Get section configuration by ID
export const getSectionConfig = (sectionId) => {
  return landingPageConfig[sectionId] || null;
};

// Check if section is enabled
export const isSectionEnabled = (sectionId) => {
  return landingPageConfig[sectionId]?.enabled === true;
};

// Get animation settings
export const getAnimationConfig = () => {
  return landingPageConfig.animations;
};

// Get CTA configuration for specific section
export const getCTAConfig = (sectionId, ctaId = null) => {
  const section = landingPageConfig[sectionId];
  if (!section) return null;
  
  if (ctaId && section.cta && Array.isArray(section.cta)) {
    return section.cta.find(cta => cta.id === ctaId);
  }
  
  return section.cta || null;
};

// Get testimonials data
export const getTestimonialsData = () => {
  return landingPageConfig.testimonials.items || [];
};

// Get security certifications
export const getSecurityCertifications = () => {
  return landingPageConfig.security.certifications || [];
};

// Get features showcase items
export const getFeaturesShowcase = () => {
  return landingPageConfig.features.items || [];
};

// Resolve an asset path relative to `assetsBase`. Accepts absolute paths (returns unchanged)
export const getAssetPath = (path) => {
  if (!path) return '';
  // If path already absolute or starts with '/', return as-is (assume relative to site root)
  if (path.startsWith('/') || path.startsWith('http')) return path;
  const base = landingPageConfig.assetsBase || '';
  // Ensure no double slashes
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

// Get solutions grid items
export const getSolutionsGrid = () => {
  return landingPageConfig.solutions.items || [];
}; 

// Validate configuration
export const validateLandingConfig = () => {
  const requiredSections = ['hero', 'features', 'cta'];
  const errors = [];
  
  requiredSections.forEach(section => {
    if (!landingPageConfig[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default landingPageConfig;