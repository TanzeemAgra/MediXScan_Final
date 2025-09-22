import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const SecurityCompliance = ({ config }) => {
  if (!config || !config.enabled) return null;

  const { section, certifications, trustFeatures } = config;

  return (
    <section id="security" className="security-compliance py-5">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-4 fw-bold mb-3">{section.title}</h2>
            <p className="lead text-muted">{section.subtitle}</p>
          </Col>
        </Row>
        
        <Row className="mb-5">
          {certifications.map((cert) => (
            <Col lg={3} md={6} key={cert.id} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body>
                  <i className={`${cert.icon} display-4 text-primary mb-3`}></i>
                  <h5 className="fw-bold">{cert.name}</h5>
                  <p className="text-muted small">{cert.description}</p>
                  <div className="features-list">
                    {cert.features.slice(0, 2).map((feature, idx) => (
                      <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {trustFeatures.map((feature, index) => (
            <Col lg={3} md={6} key={index} className="mb-4">
              <div className="text-center">
                <i className={`${feature.icon} display-5 text-primary mb-3`}></i>
                <h6 className="fw-bold">{feature.title}</h6>
                <p className="text-muted small">{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default SecurityCompliance;