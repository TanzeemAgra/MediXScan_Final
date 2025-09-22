import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel } from 'react-bootstrap';
import './FeaturesShowcase.scss';

const FeaturesShowcase = ({ config, onCTAAction, animationConfig = {}, getAssetPath = (p) => p }) => {
  if (!config || !config.enabled) return null;

  const { section, items, showcase } = config;

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    try {
      mq.addEventListener('change', update);
    } catch (e) {
      mq.addListener(update);
    }
    return () => {
      try {
        mq.removeEventListener('change', update);
      } catch (e) {
        mq.removeListener(update);
      }
    };
  }, []);

  return (
    <section id="features" className="features-showcase">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <Badge bg="primary" className="mb-3">
              {section.preTitle}
            </Badge>
            <h2 className="display-4 fw-bold mb-3">
              {section.title}
            </h2>
            <p className="lead text-muted">
              {section.subtitle}
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <Carousel
              interval={showcase.autoPlay ? showcase.interval : null}
              indicators={showcase.showIndicators}
              controls={showcase.showControls}
              className="features-carousel"
            >
              {items.map((item, index) => (
                <Carousel.Item key={item.id}>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <div className="feature-content">
                        <Badge bg="secondary" className="mb-3">
                          {item.category}
                          {item.badge && <span className="ms-2 badge bg-warning">{item.badge}</span>}
                        </Badge>
                        <h3 className="h2 fw-bold mb-3">{item.title}</h3>
                        <h5 className="text-primary mb-3">{item.subtitle}</h5>
                        <p className="mb-4">{item.description}</p>
                        
                        <div className="specs-grid mb-4">
                          {Object.entries(item.specs).map(([key, value]) => (
                            <div key={key} className="spec-item">
                              <div className="spec-label">{key}</div>
                              <div className="spec-value">{value}</div>
                            </div>
                          ))}
                        </div>

                        <ul className="feature-list mb-4">
                          {item.features.map((feature, idx) => (
                            <li key={idx}>
                              <i className="ri-check-line text-success me-2"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => onCTAAction(item.cta.action, item.cta.target)}
                        >
                          {item.cta.text}
                          <i className="ri-arrow-right-line ms-2"></i>
                        </Button>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="feature-visual">
                        <div className="mockup-container">
                          {animationConfig.enableFeatureVideos && item.video && isDesktop ? (
                            // Render video on desktop; mobile will show image via CSS or JS
                            // Use getAssetPath directly (don't strip leading slash) to avoid '/assets/assets/..' duplication
                            <video
                              className="img-fluid feature-video"
                              src={getAssetPath(item.video)}
                              poster={getAssetPath(item.image)}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="auto"
                            >
                              Sorry, your browser doesn't support embedded videos.
                            </video>
                          ) : (
                            <img 
                              src={getAssetPath(item.image || 'images/features/default-feature.jpg')}
                              alt={item.title}
                              className="img-fluid"
                            />
                          )}

                          <div className="ai-overlay">
                            {animationConfig.enableParallax && (
                              <>
                                <div className="scanning-line"></div>
                                <div className="analysis-points">
                                  <div className="point point-1"></div>
                                  <div className="point point-2"></div>
                                  <div className="point point-3"></div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesShowcase;