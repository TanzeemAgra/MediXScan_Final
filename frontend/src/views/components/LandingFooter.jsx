import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const LandingFooter = ({ config, onNavigate, getAssetPath = (p) => p }) => {
  if (!config || !config.enabled) return null;

  const { branding, sections, social, contact, legal, copyright } = config;

  return (
    <footer className="landing-footer bg-dark text-white py-5">
      <Container>
        <Row>
          <Col lg={4} className="mb-4">
            <div className="footer-brand mb-3">
              <img 
                src={getAssetPath(branding.logo || 'images/medixscan-logo-white.png')} 
                alt={branding.name} 
                height="32"
                className="mb-2"
              />
              <h5 className="fw-bold">{branding.name}</h5>
              <p className="text-muted small">{branding.tagline}</p>
            </div>
            <p className="text-muted">{branding.description}</p>
            
            <div className="social-links">
              {social.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  className="text-white me-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </Col>

          {sections.map((section, index) => (
            <Col lg={2} md={6} key={index} className="mb-4">
              <h6 className="fw-bold mb-3">{section.title}</h6>
              <ul className="list-unstyled">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="mb-2">
                    <a 
                      href={link.url}
                      className="text-muted text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('navigate', link.url);
                      }}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
          ))}

          <Col lg={4} className="mb-4">
            <h6 className="fw-bold mb-3">Get in Touch</h6>
            <div className="contact-info">
              <p className="mb-2">
                <i className="ri-mail-line me-2"></i>
                <a href={`mailto:${contact.email}`} className="text-muted text-decoration-none">
                  {contact.email}
                </a>
              </p>
              <p className="mb-2">
                <i className="ri-phone-line me-2"></i>
                <a href={`tel:${contact.phone}`} className="text-muted text-decoration-none">
                  {contact.phone}
                </a>
              </p>
              <p className="text-muted">
                <i className="ri-map-pin-line me-2"></i>
                {contact.address}
              </p>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted small mb-0">{copyright}</p>
          </Col>
          <Col md={6}>
            <div className="legal-links text-md-end">
              {legal.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="text-muted text-decoration-none me-3"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('navigate', link.url);
                  }}
                >
                  {link.text}
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default LandingFooter;