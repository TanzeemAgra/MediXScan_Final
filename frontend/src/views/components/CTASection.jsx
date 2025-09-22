import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const CTASection = ({ config, onCTAAction }) => {
  if (!config || !config.enabled) return null;

  const { section, actions, trustIndicators, background } = config;

  const backgroundStyle = background?.type === 'gradient' 
    ? {
        background: `linear-gradient(${background.gradient.direction}, ${background.gradient.colors.join(', ')})`
      }
    : {};

  return (
    <section id="cta" className="cta-section py-5 text-white" style={backgroundStyle}>
      <Container>
        <Row className="text-center">
          <Col>
            <h2 className="display-4 fw-bold mb-3">{section.title}</h2>
            <p className="lead mb-5">{section.subtitle}</p>
            
            <div className="cta-actions mb-5">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size={action.size}
                  className="me-3 mb-3"
                  onClick={() => onCTAAction(action.action, action.target)}
                >
                  <i className={`${action.icon} me-2`}></i>
                  {action.text}
                </Button>
              ))}
            </div>

            <Row className="justify-content-center">
              {trustIndicators.map((indicator, index) => (
                <Col lg={3} md={6} key={index} className="mb-3">
                  <div className="trust-indicator">
                    <i className={`${indicator.icon} fs-3 mb-2`}></i>
                    <div className="fw-bold">{indicator.label}</div>
                    <div className="small opacity-75">{indicator.sublabel}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CTASection;