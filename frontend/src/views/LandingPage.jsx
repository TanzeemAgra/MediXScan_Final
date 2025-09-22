import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Badge, Card, Navbar, Nav, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import landingPageConfig, { 
  isSectionEnabled, 
  getSectionConfig, 
  getAnimationConfig 
} from '../config/landing-page.config.js';
import { useAuth } from '../hooks/useRBAC.jsx';
import HeroSection from './components/HeroSection';
import FeaturesShowcase from './components/FeaturesShowcase';
import SolutionsGrid from './components/SolutionsGrid';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import SecurityCompliance from './components/SecurityCompliance';
import CTASection from './components/CTASection';
import LandingFooter from './components/LandingFooter';
import { getAssetPath } from '../config/landing-page.config.js';
import './LandingPage.scss';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const animationConfig = getAnimationConfig();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 100);

      // Determine active section for navigation
      const sections = ['hero', 'features', 'solutions', 'testimonials', 'security', 'cta'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    if (animationConfig.enableScrollAnimations) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [animationConfig.enableScrollAnimations]);

  // Handle CTA actions
  const handleCTAAction = (action, target) => {
    switch (action) {
      case 'navigate':
        if (isAuthenticated && target === '/auth/rbac-login') {
          navigate('/dashboard');
        } else {
          navigate(target);
        }
        break;
      case 'modal':
        if (target === 'demo-modal') {
          setShowDemoModal(true);
        } else if (target === 'video-modal') {
          setShowVideoModal(true);
        }
        break;
      case 'scroll':
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      default:
        console.warn('Unknown CTA action:', action);
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render navigation
  const renderNavigation = () => (
    <Navbar 
      expand="lg" 
      className={`landing-navbar fixed-top ${isScrolled ? 'scrolled' : ''}`}
      variant="dark"
    >
      <Container>
        <Navbar.Brand onClick={() => scrollToSection('hero')} style={{ cursor: 'pointer' }}>
          <img 
            src="/assets/images/medixscan-logo-white.png" 
            alt="MediXScan AI" 
            height="32"
            className="me-2"
          />
          <span className="brand-text">MediXScan AI</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="landing-navbar-nav" />
        
        <Navbar.Collapse id="landing-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              onClick={() => scrollToSection('features')}
              className={activeSection === 'features' ? 'active' : ''}
            >
              Features
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollToSection('solutions')}
              className={activeSection === 'solutions' ? 'active' : ''}
            >
              Solutions
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollToSection('security')}
              className={activeSection === 'security' ? 'active' : ''}
            >
              Security
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollToSection('testimonials')}
              className={activeSection === 'testimonials' ? 'active' : ''}
            >
              Testimonials
            </Nav.Link>
          </Nav>
          
          <Nav className="ms-auto">
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => setShowDemoModal(true)}
            >
              <i className="ri-calendar-line me-1"></i>
              Schedule Demo
            </Button>
            <Button
              variant="light"
              onClick={() => handleCTAAction('navigate', '/auth/rbac-login')}
            >
              <i className="ri-login-circle-line me-1"></i>
              {isAuthenticated ? 'Dashboard' : 'Sign In'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  // Demo Modal Component
  const DemoModal = () => (
    <Modal 
      show={showDemoModal} 
      onHide={() => setShowDemoModal(false)}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Schedule Your Personal Demo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-4">
          <i className="ri-calendar-event-line display-4 text-primary mb-3"></i>
          <h5>Get a Personalized Demo of MediXScan AI</h5>
          <p className="text-muted mb-4">
            See how our AI-powered radiology platform can transform your healthcare workflow.
            Our specialists will show you features tailored to your specific needs.
          </p>
          
          <Row className="g-3">
            <Col md={6}>
              <Card className="demo-option border-primary">
                <Card.Body className="text-center">
                  <i className="ri-video-line fs-2 text-primary mb-2"></i>
                  <h6>Virtual Demo</h6>
                  <p className="small text-muted">30-minute online demonstration</p>
                  <Button variant="primary" size="sm">
                    Schedule Virtual
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="demo-option border-success">
                <Card.Body className="text-center">
                  <i className="ri-map-pin-line fs-2 text-success mb-2"></i>
                  <h6>On-Site Demo</h6>
                  <p className="small text-muted">In-person at your facility</p>
                  <Button variant="success" size="sm">
                    Schedule On-Site
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );

  // Video Modal Component
  const VideoModal = () => (
    <Modal 
      show={showVideoModal} 
      onHide={() => setShowVideoModal(false)}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>MediXScan AI - Platform Overview</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="video-container">
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="MediXScan AI Demo Video"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="landing-page">
      {renderNavigation()}
      
      {/* Hero Section */}
      {isSectionEnabled('hero') && (
        <HeroSection 
            config={getSectionConfig('hero')}
            animationConfig={animationConfig}
            getAssetPath={getAssetPath}
            onCTAAction={handleCTAAction}
          />
      )}

      {/* Features Showcase */}
      {isSectionEnabled('features') && (
        <FeaturesShowcase 
          config={getSectionConfig('features')}
          animationConfig={animationConfig}
          getAssetPath={getAssetPath}
          onCTAAction={handleCTAAction}
        />
      )}

      {/* Solutions Grid */}
      {isSectionEnabled('solutions') && (
        <SolutionsGrid 
          config={getSectionConfig('solutions')}
          animationConfig={animationConfig}
          getAssetPath={getAssetPath}
          onCTAAction={handleCTAAction}
        />
      )}

      {/* Testimonials */}
      {isSectionEnabled('testimonials') && (
        <TestimonialsCarousel 
          config={getSectionConfig('testimonials')}
          animationConfig={animationConfig}
          getAssetPath={getAssetPath}
        />
      )}

      {/* Security & Compliance */}
      {isSectionEnabled('security') && (
        <SecurityCompliance 
          config={getSectionConfig('security')}
          animationConfig={animationConfig}
          getAssetPath={getAssetPath}
        />
      )}

      {/* Call to Action */}
      {isSectionEnabled('cta') && (
        <CTASection 
          config={getSectionConfig('cta')}
          animationConfig={animationConfig}
          getAssetPath={getAssetPath}
          onCTAAction={handleCTAAction}
        />
      )}

      {/* Footer */}
      {isSectionEnabled('footer') && (
        <LandingFooter 
          config={getSectionConfig('footer')}
          getAssetPath={getAssetPath}
          onNavigate={handleCTAAction}
        />
      )}

      {/* Modals */}
      <DemoModal />
      <VideoModal />

      {/* Scroll to Top Button */}
      {isScrolled && (
        <Button
          className="scroll-to-top"
          variant="primary"
          onClick={() => scrollToSection('hero')}
        >
          <i className="ri-arrow-up-line"></i>
        </Button>
      )}
    </div>
  );
};

export default LandingPage;