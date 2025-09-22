import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const SolutionsGrid = ({ config }) => {
  if (!config || !config.enabled) return null;

  const { section, items } = config;

  return (
    <section id="solutions" className="solutions-grid py-5">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-4 fw-bold mb-3">{section.title}</h2>
            <p className="lead text-muted">{section.subtitle}</p>
          </Col>
        </Row>
        <Row>
          {items.slice(0, 6).map((item, index) => (
            <Col lg={4} md={6} key={item.id} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <i className={`${item.icon} display-4 text-primary mb-3`}></i>
                  <h5 className="fw-bold mb-3">{item.title}</h5>
                  <p className="text-muted">{item.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default SolutionsGrid;