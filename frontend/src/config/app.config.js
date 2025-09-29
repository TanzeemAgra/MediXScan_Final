// MediXScan Configuration
const config = {
  // Application Info
  app: {
    name: 'MediXScan',
    version: '1.0.0',
    description: 'Medical Clinic & Patient Management System',
    title: 'MediXScan - Medical Management System'
  },
  
  // API Configuration - Soft coded for Railway production
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 
             import.meta.env.VITE_API_URL ||
             (import.meta.env.MODE === 'production' ? 'https://medixscanfinal-production.up.railway.app/api/v1' : 'http://localhost:8000/api/v1'),
    timeout: 30000
  },
  
  // Server Configuration
  server: {
    frontend: {
      url: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
      port: 5173
    },
    backend: {
      url: import.meta.env.VITE_BACKEND_URL || 
           import.meta.env.VITE_API_URL ||
           (import.meta.env.MODE === 'production' ? 'https://medixscanfinal-production.up.railway.app' : 'http://localhost:8000'),
      port: import.meta.env.MODE === 'production' ? 443 : 8000
    }
  },
  
  // Theme Configuration
  theme: {
    defaultMode: 'light',
    primaryColor: '#1976d2',
    secondaryColor: '#4fc3f7',
    accentColor: '#4caf50'
  },
  
  // Features Configuration
  features: {
    enableNotifications: true,
    enableDarkMode: true,
    enableChat: true,
    enableCalendar: true,
    enableReports: true
  },

  // Logo Configuration
  logo: {
    // Display options: 'both', 'image-only', 'text-only'
    displayMode: 'text-only',
    showImage: false,
    showText: true,
    image: {
      src: '/assets/images/medixscan-logo.svg',
      alt: 'MediXScan Logo',
      height: '30',
      className: 'logo-normal img-fluid mb-3'
    },
    text: {
      content: 'MediXScan',
      className: 'brand-name fw-bold fs-4',
      showIcon: true // Optional icon next to text
    }
  },
  
  // Medical Specializations
  specializations: [
    'General Practice',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Radiology',
    'Emergency Medicine'
  ],
  
  // Dashboard Configuration
  dashboard: {
    refreshInterval: 30000, // 30 seconds
    chartsAnimationDuration: 1000,
    maxPatientsDisplay: 10,
    maxDoctorsDisplay: 8
  }
};

export default config;