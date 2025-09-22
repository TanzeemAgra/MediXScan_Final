import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const StaticPage = ({ page }) => {
  if (!page) return null;

  const { title, subtitle, content } = page;

  return (
    <section className="static-page py-5">
      <Container>
        <Row className="mb-4">
          <Col>
            <h1 className="display-4">{title}</h1>
            <p className="lead text-muted">{subtitle}</p>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            {Array.isArray(content) ? (
              content.map((item, idx) => (
                <Card key={idx} className="mb-3">
                  <Card.Body>
                    {item.title && <h5>{item.title}</h5>}
                    {item.quote && <blockquote>"{item.quote}"</blockquote>}
                    {item.description && <p>{item.description}</p>}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <Card>
                <Card.Body>
                  {content.overview && <p>{content.overview}</p>}
                  {content.description && <p>{content.description}</p>}
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col lg={4}>
            <Card className="mb-3">
              <Card.Body>
                <h5>Contact Sales</h5>
                <p className="small text-muted">Want a tailored walkthrough? Contact our team to schedule onboarding.</p>
                <Button variant="primary">Contact Sales</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default StaticPage;
