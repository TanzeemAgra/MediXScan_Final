import React from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';

const TestimonialsCarousel = ({ config, animationConfig = {}, getAssetPath = (p) => p }) => {
  if (!config || !config.enabled) return null;

  const { section, items } = config;

  return (
    <section id="testimonials" className="testimonials py-5 bg-light">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-4 fw-bold mb-3">{section.title}</h2>
            <p className="lead text-muted">{section.subtitle}</p>
          </Col>
        </Row>
        <Row>
          <Col lg={8} className="mx-auto">
            <Carousel indicators={false} interval={config.interval}>
              {items.map((testimonial) => (
                <Carousel.Item key={testimonial.id}>
                  <Card className="border-0 shadow">
                    <Card.Body className="text-center p-5">
                      <img 
                        src={getAssetPath(testimonial.avatar || 'images/default-avatar.jpg')}
                        alt={testimonial.name}
                        className="rounded-circle mb-3"
                        width="80"
                        height="80"
                      />
                      <blockquote className="mb-4">
                        <p className="fs-5 text-muted">"{testimonial.quote}"</p>
                      </blockquote>
                      <h5 className="fw-bold">{testimonial.name}</h5>
                      <p className="text-muted">{testimonial.position}</p>
                      <p className="text-primary">{testimonial.organization}</p>
                    </Card.Body>
                  </Card>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialsCarousel;