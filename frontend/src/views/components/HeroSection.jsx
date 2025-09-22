import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import './HeroSection.scss';

const HeroSection = ({ config, onCTAAction, animationConfig = {}, getAssetPath = (p) => p }) => {
  const [typedText, setTypedText] = useState('');
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  const { content, statistics, background } = config;

  // Respect global animation flags
  const enableParticle = Boolean(animationConfig.enableParticleBackground && background?.type === 'particle');
  const enableTypewriter = Boolean(animationConfig.enableTypewriter);

  // Typewriter effect for title
  useEffect(() => {
    if (!content.title.main || !enableTypewriter) return;

    let index = 0;
    const text = content.title.main;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [content.title.main, enableTypewriter]);

  // Statistics counter animation
  useEffect(() => {
    if (!statistics.enabled || !isVisible) return;

    const timer = setInterval(() => {
      setCurrentStatIndex(prev => 
        prev < statistics.stats.length - 1 ? prev + 1 : 0
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [statistics.stats.length, isVisible]);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Particle system animation
  useEffect(() => {
    if (!enableParticle || !background.particle || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const newParticles = [];
      for (let i = 0; i < background.particle.count; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * background.particle.speed,
          vy: (Math.random() - 0.5) * background.particle.speed,
          size: Math.random() * 3 + 1
        });
      }
      setParticles(newParticles);
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${background.particle.color}${Math.floor(background.particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${background.particle.color}${Math.floor((background.particle.opacity * (1 - distance / 100)) * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [background.particle, particles]);

  // Counter animation hook
  const useCounterAnimation = (targetValue, duration = 2000) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentVal = targetValue * easeOutCubic;
        
        setCurrentValue(Math.floor(currentVal));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [targetValue, duration, isVisible]);

    return currentValue;
  };

  // Render background
  const renderBackground = () => {
    if (background.type === 'gradient') {
      const gradientStyle = {
        background: `linear-gradient(${background.gradient.direction}, ${background.gradient.colors.join(', ')})`
      };
      return <div className="hero-background gradient-bg" style={gradientStyle}></div>;
    } else if (background.type === 'particle') {
      return (
        <>
          <div className="hero-background particle-bg"></div>
          {enableParticle && <canvas ref={canvasRef} className="particle-canvas"></canvas>}
        </>
      );
    }
    return null;
  };

  // Render statistics
  const renderStatistics = () => {
    if (!statistics.enabled) return null;

    return (
      <div className="hero-statistics">
        <Container>
          <div className="trust-badge text-center mb-4">
            <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
              <i className="ri-shield-check-line me-2"></i>
              {statistics.trustBadge}
            </Badge>
          </div>
          
          <Row className="justify-content-center">
            {statistics.stats.map((stat, index) => (
              <StatisticItem
                key={stat.id}
                stat={stat}
                isActive={index === currentStatIndex}
                isVisible={isVisible}
                delay={stat.animationDelay}
              />
            ))}
          </Row>
        </Container>
      </div>
    );
  };

  // Statistic Item Component
  const StatisticItem = ({ stat, isActive, isVisible, delay }) => {
    const animatedValue = useCounterAnimation(stat.value, 2000);
    
    return (
      <Col lg={3} md={6} className="mb-4">
        <div 
          className={`statistic-item ${isActive ? 'active' : ''}`}
          style={{ 
            animationDelay: `${delay}ms`,
            '--accent-color': stat.color
          }}
        >
          <div className="stat-icon">
            <i className={stat.icon}></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {isVisible ? animatedValue : 0}{stat.suffix}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
          <div className="stat-glow"></div>
        </div>
      </Col>
    );
  };

  return (
    <section id="hero" className="hero-section" ref={heroRef}>
      {renderBackground()}
      
      <Container className="hero-content">
        <Row className="align-items-center min-vh-100">
          <Col lg={6} className="hero-text">
            <div className="hero-content-inner">
              <Badge bg="primary" className="hero-badge mb-3">
                <i className="ri-rocket-line me-2"></i>
                {content.preTitle}
              </Badge>
              
              <h1 className="hero-title">
                <span className="title-main">{typedText}</span>
                <span className="title-cursor">|</span>
                <br />
                <span className="title-highlight">{content.title.highlight}</span>
              </h1>
              
              <p className="hero-subtitle">
                {content.title.subtitle}
              </p>
              
              <div className="hero-actions">
                <Button
                  variant={content.cta.primary.variant}
                  size={content.cta.primary.size}
                  className="me-3 mb-3"
                  onClick={() => onCTAAction(content.cta.primary.action, content.cta.primary.target)}
                >
                  <i className={`${content.cta.primary.icon} me-2`}></i>
                  {content.cta.primary.text}
                </Button>
                
                <Button
                  variant={content.cta.secondary.variant}
                  size={content.cta.secondary.size}
                  className="me-3 mb-3"
                  onClick={() => onCTAAction(content.cta.secondary.action, content.cta.secondary.target)}
                >
                  <i className={`${content.cta.secondary.icon} me-2`}></i>
                  {content.cta.secondary.text}
                </Button>
                
                <Button
                  variant={content.cta.tertiary.variant}
                  size={content.cta.tertiary.size}
                  className="mb-3"
                  onClick={() => onCTAAction(content.cta.tertiary.action, content.cta.tertiary.target)}
                >
                  <i className={`${content.cta.tertiary.icon} me-2`}></i>
                  {content.cta.tertiary.text}
                </Button>
              </div>
            </div>
          </Col>
          
          <Col lg={6} className="hero-visual">
            <div className="hero-dashboard-preview">
              <div className="dashboard-mockup">
                <div className="mockup-header">
                  <div className="mockup-controls">
                    <span className="control-dot red"></span>
                    <span className="control-dot yellow"></span>
                    <span className="control-dot green"></span>
                  </div>
                  <div className="mockup-title">MediXScan AI Dashboard</div>
                </div>
                <div className="mockup-content">
                  <div className="ai-processing-indicator">
                    <div className="processing-wave"></div>
                    <div className="processing-text">
                      <span>AI Analysis in Progress...</span>
                      <div className="progress-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mock-charts">
                    <div className="chart-item">
                      <div className="chart-bar"></div>
                      <div className="chart-bar"></div>
                      <div className="chart-bar"></div>
                      <div className="chart-bar"></div>
                    </div>
                  </div>
                  
                  <div className="mock-insights">
                    <div className="insight-item">
                      <i className="ri-check-line text-success"></i>
                      <span>99.8% Accuracy Achieved</span>
                    </div>
                    <div className="insight-item">
                      <i className="ri-time-line text-info"></i>
                      <span>Processing: 0.3s</span>
                    </div>
                    <div className="insight-item">
                      <i className="ri-brain-line text-primary"></i>
                      <span>AI Confidence: High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      
      {renderStatistics()}
      
      <div className="hero-scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <div className="scroll-text">Scroll to explore</div>
      </div>
    </section>
  );
};

export default HeroSection;