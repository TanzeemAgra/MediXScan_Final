import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Badge, Dropdown, Button, Table, ProgressBar } from 'react-bootstrap';
// Soft-coded icon imports with production-safe fallbacks
import { 
  FaChartLine, FaChartBar, FaChartPie, FaTrophy, FaUsers, 
  FaClock, FaDownload, FaFilter, FaCalendarAlt, FaEye 
} from '../../utils/icons.utils.jsx';
import Chart from 'react-apexcharts';
import CountUp from 'react-countup';

// Advanced Analytics Dashboard Widget
const AdvancedAnalyticsWidget = ({ config, timeRange = 'month' }) => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [loading, setLoading] = useState(true);

  // Soft-coded analytics configuration
  const analyticsConfig = {
    metrics: {
      performance: {
        title: 'Doctor Performance',
        icon: FaTrophy,
        color: '#089bab',
        kpis: ['diagnosticAccuracy', 'patientThroughput', 'reportTurnaroundTime', 'patientSatisfaction']
      },
      department: {
        title: 'Department Analytics',
        icon: FaUsers,
        color: '#FC9F5B',
        kpis: ['efficiency', 'quality', 'patientFlow', 'resourceUtilization']
      },
      radiology: {
        title: 'Radiology Metrics',
        icon: FaEye,
        color: '#28a745',
        kpis: ['imagingVolume', 'reportAccuracy', 'aiUtilization', 'modalityEfficiency']
      }
    },
    timeRanges: {
      'today': 'Today',
      'week': 'This Week', 
      'month': 'This Month',
      'quarter': 'This Quarter',
      'year': 'This Year'
    },
    benchmarks: {
      diagnosticAccuracy: { excellent: 95, good: 90, average: 85 },
      patientThroughput: { excellent: 25, good: 20, average: 15 },
      reportTurnaroundTime: { excellent: 30, good: 45, average: 60 }, // minutes
      patientSatisfaction: { excellent: 4.5, good: 4.0, average: 3.5 }
    }
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Mock data - in production this would fetch from API
        const mockData = {
          performance: {
            kpis: {
              diagnosticAccuracy: 94.5,
              patientThroughput: 22,
              reportTurnaroundTime: 32,
              patientSatisfaction: 4.7,
              totalPatients: 1247,
              completedReports: 1189,
              avgConsultationTime: 18.5
            },
            trends: {
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              series: [{
                name: 'Patients Seen',
                data: [18, 22, 19, 25, 23, 15, 8]
              }, {
                name: 'Reports Completed',
                data: [16, 21, 18, 24, 22, 14, 7]
              }]
            },
            distribution: {
              categories: ['Critical Cases', 'Routine Cases', 'Follow-ups', 'Consultations'],
              data: [15, 45, 25, 15]
            }
          },
          department: {
            kpis: {
              efficiency: 87.3,
              quality: 92.1,
              patientFlow: 78.9,
              resourceUtilization: 84.5,
              bedOccupancy: 89,
              avgLengthOfStay: 3.2,
              readmissionRate: 8.4
            },
            comparisons: {
              categories: ['Radiology', 'Cardiology', 'Neurology', 'Emergency'],
              series: [{
                name: 'Efficiency %',
                data: [87, 84, 91, 79]
              }, {
                name: 'Quality Score',
                data: [92, 88, 94, 85]
              }]
            }
          },
          radiology: {
            kpis: {
              imagingVolume: 342,
              reportAccuracy: 96.8,
              aiUtilization: 78.5,
              modalityEfficiency: 91.2,
              criticalFindings: 23,
              avgReportTime: 28.5,
              aiAgreementRate: 94.2
            },
            modalityBreakdown: {
              categories: ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Nuclear'],
              data: [125, 89, 67, 45, 16]
            },
            aiPerformance: {
              categories: ['Pneumonia Detection', 'Fracture Analysis', 'Tumor Detection', 'Stroke Assessment'],
              accuracy: [96.5, 94.8, 92.3, 89.7],
              volume: [156, 89, 45, 23]
            }
          }
        };

        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Analytics data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedTimeRange]);

  const getPerformanceBadge = (value, metric) => {
    const benchmark = analyticsConfig.benchmarks[metric];
    if (!benchmark) return { variant: 'secondary', text: 'N/A' };
    
    if (value >= benchmark.excellent) return { variant: 'success', text: 'Excellent' };
    if (value >= benchmark.good) return { variant: 'info', text: 'Good' };
    if (value >= benchmark.average) return { variant: 'warning', text: 'Average' };
    return { variant: 'danger', text: 'Below Average' };
  };

  const renderKPICard = (title, value, unit, metric, trend) => {
    const badge = getPerformanceBadge(value, metric);
    
    return (
      <Card className="text-center h-100 border-0 shadow-sm">
        <Card.Body>
          <h3 className="text-primary mb-1">
            <CountUp 
              end={value} 
              duration={2} 
              decimals={typeof value === 'number' && value % 1 !== 0 ? 1 : 0}
              suffix={unit}
            />
          </h3>
          <h6 className="text-muted mb-2">{title}</h6>
          <Badge bg={badge.variant}>{badge.text}</Badge>
          {trend && (
            <div className="mt-2">
              <small className={`text-${trend > 0 ? 'success' : 'danger'}`}>
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% vs last {selectedTimeRange}
              </small>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const renderPerformanceAnalytics = () => {
    const data = analyticsData.performance;
    if (!data) return null;

    const chartOptions = {
      chart: {
        type: 'area',
        height: 300,
        toolbar: { show: false }
      },
      colors: ['#089bab', '#FC9F5B'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      fill: {
        type: 'gradient',
        gradient: { opacityFrom: 0.6, opacityTo: 0.1 }
      },
      xaxis: { categories: data.trends.categories },
      legend: { position: 'top' },
      grid: { strokeDashArray: 3 }
    };

    const pieOptions = {
      chart: { type: 'pie', height: 250 },
      colors: ['#e74c3c', '#f39c12', '#3498db', '#2ecc71'],
      labels: data.distribution.categories,
      legend: { position: 'bottom' }
    };

    return (
      <>
        <Row className="mb-4">
          <Col md={3}>
            {renderKPICard('Diagnostic Accuracy', data.kpis.diagnosticAccuracy, '%', 'diagnosticAccuracy', 2.1)}
          </Col>
          <Col md={3}>
            {renderKPICard('Patients/Day', data.kpis.patientThroughput, '', 'patientThroughput', -1.5)}
          </Col>
          <Col md={3}>
            {renderKPICard('Avg Report Time', data.kpis.reportTurnaroundTime, ' min', 'reportTurnaroundTime', -8.2)}
          </Col>
          <Col md={3}>
            {renderKPICard('Patient Rating', data.kpis.patientSatisfaction, '/5', 'patientSatisfaction', 3.4)}
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h6><FaChartLine className="me-2" />Weekly Performance Trends</h6>
              </Card.Header>
              <Card.Body>
                <Chart
                  options={chartOptions}
                  series={data.trends.series}
                  type="area"
                  height={300}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h6><FaChartPie className="me-2" />Case Distribution</h6>
              </Card.Header>
              <Card.Body>
                <Chart
                  options={pieOptions}
                  series={data.distribution.data}
                  type="pie"
                  height={250}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderDepartmentAnalytics = () => {
    const data = analyticsData.department;
    if (!data) return null;

    const chartOptions = {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false }
      },
      colors: ['#089bab', '#FC9F5B'],
      plotOptions: {
        bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' }
      },
      dataLabels: { enabled: false },
      xaxis: { categories: data.comparisons.categories },
      legend: { position: 'top' }
    };

    return (
      <>
        <Row className="mb-4">
          <Col md={3}>
            {renderKPICard('Efficiency Score', data.kpis.efficiency, '%', null, 1.8)}
          </Col>
          <Col md={3}>
            {renderKPICard('Quality Score', data.kpis.quality, '%', null, 0.7)}
          </Col>
          <Col md={3}>
            {renderKPICard('Patient Flow', data.kpis.patientFlow, '%', null, -2.1)}
          </Col>
          <Col md={3}>
            {renderKPICard('Resource Utilization', data.kpis.resourceUtilization, '%', null, 3.2)}
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h6><FaChartBar className="me-2" />Department Comparison</h6>
              </Card.Header>
              <Card.Body>
                <Chart
                  options={chartOptions}
                  series={data.comparisons.series}
                  type="bar"
                  height={300}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h6><FaUsers className="me-2" />Department KPIs</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Bed Occupancy</span>
                    <strong>{data.kpis.bedOccupancy}%</strong>
                  </div>
                  <ProgressBar now={data.kpis.bedOccupancy} variant="info" />
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Avg Length of Stay</span>
                    <strong>{data.kpis.avgLengthOfStay} days</strong>
                  </div>
                  <ProgressBar now={65} variant="success" />
                </div>
                
                <div className="mb-0">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Readmission Rate</span>
                    <strong>{data.kpis.readmissionRate}%</strong>
                  </div>
                  <ProgressBar now={data.kpis.readmissionRate * 10} variant="warning" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderRadiologyAnalytics = () => {
    const data = analyticsData.radiology;
    if (!data) return null;

    const modalityOptions = {
      chart: { type: 'bar', height: 200, toolbar: { show: false } },
      colors: ['#28a745'],
      plotOptions: { bar: { horizontal: true } },
      xaxis: { categories: data.modalityBreakdown.categories },
      dataLabels: { enabled: true }
    };

    return (
      <>
        <Row className="mb-4">
          <Col md={3}>
            {renderKPICard('Imaging Volume', data.kpis.imagingVolume, '', null, 12.3)}
          </Col>
          <Col md={3}>
            {renderKPICard('Report Accuracy', data.kpis.reportAccuracy, '%', null, 1.2)}
          </Col>
          <Col md={3}>
            {renderKPICard('AI Utilization', data.kpis.aiUtilization, '%', null, 8.7)}
          </Col>
          <Col md={3}>
            {renderKPICard('Modality Efficiency', data.kpis.modalityEfficiency, '%', null, 2.9)}
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6><FaChartBar className="me-2" />Modality Volume</h6>
              </Card.Header>
              <Card.Body>
                <Chart
                  options={modalityOptions}
                  series={[{ data: data.modalityBreakdown.data }]}
                  type="bar"
                  height={200}
                />
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6><FaEye className="me-2" />AI Performance Metrics</h6>
              </Card.Header>
              <Card.Body>
                <Table size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>AI Model</th>
                      <th>Accuracy</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.aiPerformance.categories.map((model, index) => (
                      <tr key={model}>
                        <td>{model}</td>
                        <td>
                          <Badge bg="success">{data.aiPerformance.accuracy[index]}%</Badge>
                        </td>
                        <td>{data.aiPerformance.volume[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderAnalyticsContent = () => {
    switch (selectedMetric) {
      case 'performance':
        return renderPerformanceAnalytics();
      case 'department':
        return renderDepartmentAnalytics();
      case 'radiology':
        return renderRadiologyAnalytics();
      default:
        return renderPerformanceAnalytics();
    }
  };

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaChartLine className="me-2 text-primary" />
          <h5 className="mb-0">Advanced Analytics Dashboard</h5>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <Dropdown>
            <Dropdown.Toggle size="sm" variant="outline-secondary">
              <FaFilter className="me-1" />
              {analyticsConfig.metrics[selectedMetric]?.title}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.entries(analyticsConfig.metrics).map(([key, metric]) => (
                <Dropdown.Item
                  key={key}
                  onClick={() => setSelectedMetric(key)}
                  active={selectedMetric === key}
                >
                  <metric.icon className="me-2" />
                  {metric.title}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle size="sm" variant="outline-secondary">
              <FaCalendarAlt className="me-1" />
              {analyticsConfig.timeRanges[selectedTimeRange]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.entries(analyticsConfig.timeRanges).map(([key, label]) => (
                <Dropdown.Item
                  key={key}
                  onClick={() => setSelectedTimeRange(key)}
                  active={selectedTimeRange === key}
                >
                  {label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button size="sm" variant="outline-primary">
            <FaDownload className="me-1" />
            Export
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          renderAnalyticsContent()
        )}
      </Card.Body>
    </Card>
  );
};

export default AdvancedAnalyticsWidget;