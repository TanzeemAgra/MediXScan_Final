// Patient Statistics Widget - Real-time patient metrics with database integration
import React, { useMemo } from 'react';
import { Card, Row, Col, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import { FaUsers, FaUserPlus, FaCalendarAlt, FaExclamationTriangle, FaTrendUp, FaTrendDown } from '../../utils/icons.utils.jsx';
import CountUp from 'react-countup';

const PatientStatsWidget = ({ data, loading, config }) => {
  // Process statistics data
  const stats = useMemo(() => {
    if (!data?.success || !data.data) {
      return config.metrics.map(metric => ({
        ...metric,
        value: 0,
        trend: 0,
        trendDirection: 'stable'
      }));
    }

    const statsData = data.data;
    
    return config.metrics.map(metric => {
      const value = statsData[metric.key] || 0;
      const previousValue = statsData[`${metric.key}_previous`] || 0;
      const trend = previousValue > 0 ? ((value - previousValue) / previousValue * 100) : 0;
      
      return {
        ...metric,
        value,
        trend: Math.abs(trend),
        trendDirection: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable'
      };
    });
  }, [data, config]);

  if (loading) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">Patient Statistics</h5>
        </Card.Header>
        <Card.Body className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Loading statistics...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaUsers className="me-2 text-primary" />
          Patient Statistics
        </h5>
        <Badge bg="success">Live</Badge>
      </Card.Header>
      <Card.Body>
        <Row>
          {stats.map((stat, index) => (
            <Col md={6} lg={3} key={stat.key} className="mb-3">
              <div className="stat-card p-3 rounded border">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className={`icon-container p-2 rounded bg-${stat.color} bg-opacity-10`}>
                    {React.createElement(
                      stat.icon === 'FaUsers' ? FaUsers :
                      stat.icon === 'FaUserPlus' ? FaUserPlus :
                      stat.icon === 'FaCalendarAlt' ? FaCalendarAlt :
                      FaExclamationTriangle,
                      { className: `text-${stat.color}`, size: 24 }
                    )}
                  </div>
                  {stat.trendDirection !== 'stable' && (
                    <div className={`trend-indicator text-${stat.trendDirection === 'up' ? 'success' : 'danger'}`}>
                      {stat.trendDirection === 'up' ? (
                        <FaTrendUp size={16} />
                      ) : (
                        <FaTrendDown size={16} />
                      )}
                      <small className="ms-1">{stat.trend.toFixed(1)}%</small>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="mb-1">
                    <CountUp
                      end={stat.value}
                      duration={1.5}
                      separator=","
                    />
                  </h3>
                  <p className="text-muted mb-0 small">{stat.label}</p>
                </div>

                {/* Progress bar for visual representation */}
                {stat.key === 'totalPatients' && (
                  <div className="mt-2">
                    <ProgressBar 
                      now={Math.min((stat.value / 1000) * 100, 100)} 
                      variant={stat.color}
                      style={{ height: '4px' }}
                    />
                    <small className="text-muted">Capacity utilization</small>
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PatientStatsWidget;