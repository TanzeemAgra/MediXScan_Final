import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Badge, Alert, Spinner, ProgressBar, Tabs, Tab } from 'react-bootstrap';
// Soft-coded icon imports with fallback support
import { 
  FaUserMd, FaHeartbeat, FaXRay, FaBrain, FaChartLine, 
  FaBell, FaUsers, FaCalendarAlt, FaClipboardList, FaPrescriptionBottleAlt,
  FaRobot, FaEye, FaDownload, FaClock, FaExclamationTriangle, FaTachometerAlt, FaCheck
} from '../../utils/icons.utils.jsx';
import Chart from 'react-apexcharts';
import CountUp from 'react-countup';

// Import configuration and widgets
import doctorDashboardConfig from '../../config/doctor-dashboard.config';
import RadiologyWorkflowWidget from '../../components/widgets/RadiologyWorkflowWidget';
import RealTimeAlertsWidget from '../../components/widgets/RealTimeAlertsWidget';
import AdvancedAnalyticsWidget from '../../components/widgets/AdvancedAnalyticsWidget';
import DashboardProductionTest from '../../components/widgets/DashboardProductionTest';

const AdvancedDoctorDashboard = () => {
  // Soft-coded state management based on configuration
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  // Soft-coded feature flags from configuration
  const features = doctorDashboardConfig.featureFlags;
  const widgetConfig = doctorDashboardConfig.widgetCategories;
  const apiConfig = doctorDashboardConfig.apiIntegration;

  // Initialize dashboard data based on soft-coded configuration
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls based on configuration
        const dashboardPromises = [];
        
        if (widgetConfig.patientManagement.enabled) {
          dashboardPromises.push(fetchPatientData());
        }
        
        if (widgetConfig.radiologyWorkflow.enabled) {
          dashboardPromises.push(fetchRadiologyData());
        }
        
        if (widgetConfig.analytics.enabled) {
          dashboardPromises.push(fetchAnalyticsData());
        }

        const results = await Promise.all(dashboardPromises);
        
        // Combine results based on soft-coded structure
        const combinedData = {
          patients: results[0] || {},
          radiology: results[1] || {},
          analytics: results[2] || {},
          lastUpdated: new Date().toISOString()
        };

        setDashboardData(combinedData);
        
        if (features.enableRealTimeSync) {
          initializeRealTimeUpdates();
        }
        
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        setAlerts(prev => [...prev, {
          type: 'danger',
          message: 'Failed to load dashboard data. Please refresh.',
          timestamp: new Date()
        }]);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [selectedTimeRange]);

  // Soft-coded API functions based on configuration
  const fetchPatientData = async () => {
    // Mock data - in production, this would use apiConfig.endpoints.patientQueue
    return {
      totalPatients: 142,
      criticalPatients: 8,
      waitingPatients: 23,
      completedToday: 89,
      patientQueue: [
        {
          id: 'P001',
          name: 'Sarah Johnson',
          priority: 'Critical',
          condition: 'Chest Pain',
          waitTime: 15,
          vitals: { hr: 95, bp: '140/90', temp: 37.2, o2: 97 }
        },
        {
          id: 'P002', 
          name: 'Michael Chen',
          priority: 'Urgent',
          condition: 'Head Trauma',
          waitTime: 8,
          vitals: { hr: 88, bp: '120/80', temp: 36.8, o2: 98 }
        },
        {
          id: 'P003',
          name: 'Emma Davis',
          priority: 'Normal',
          condition: 'Routine Checkup',
          waitTime: 25,
          vitals: { hr: 72, bp: '118/75', temp: 36.5, o2: 99 }
        }
      ]
    };
  };

  const fetchRadiologyData = async () => {
    return {
      pendingScans: 34,
      completedScans: 78,
      aiAnalysisQueue: 12,
      averageTurnaroundTime: 45,
      imagingQueue: [
        {
          id: 'R001',
          patientName: 'John Smith',
          studyType: 'CT Chest',
          urgency: 'STAT',
          scheduledTime: '14:30',
          aiConfidence: 0.92,
          status: 'In Progress'
        },
        {
          id: 'R002',
          patientName: 'Lisa Wang',
          studyType: 'MRI Brain',
          urgency: 'Urgent',
          scheduledTime: '15:00',
          aiConfidence: 0.88,
          status: 'Scheduled'
        }
      ]
    };
  };

  const fetchAnalyticsData = async () => {
    return {
      diagnosticAccuracy: 94.5,
      patientSatisfaction: 4.7,
      reportTurnaroundTime: 32,
      dailyProductivity: 18,
      monthlyTrends: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        series: [{
          name: 'Patients Seen',
          data: [85, 92, 88, 95]
        }, {
          name: 'Reports Generated',
          data: [78, 87, 82, 89]
        }]
      }
    };
  };

  const initializeRealTimeUpdates = () => {
    // Soft-coded real-time updates based on configuration
    const interval = setInterval(() => {
      if (features.enableRealTimeSync) {
        // Simulate real-time data updates
        setDashboardData(prev => ({
          ...prev,
          lastUpdated: new Date().toISOString()
        }));
      }
    }, widgetConfig.patientManagement.widgets.patientQueue.config.autoRefresh);

    return () => clearInterval(interval);
  };

  // Soft-coded widget rendering based on configuration
  const renderPatientQueueWidget = () => {
    if (!widgetConfig.patientManagement.enabled) return null;
    
    const queueConfig = widgetConfig.patientManagement.widgets.patientQueue.config;
    const patients = dashboardData.patients?.patientQueue || [];

    return (
      <Card className="h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaUsers className="me-2 text-primary" />
            <h5 className="mb-0">Patient Queue Management</h5>
          </div>
          <Badge bg="info">{patients.length} Active</Badge>
        </Card.Header>
        <Card.Body>
          {patients.slice(0, queueConfig.maxPatients).map((patient) => (
            <div key={patient.id} className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
              <div>
                <h6 className="mb-1">{patient.name}</h6>
                <small className="text-muted">{patient.condition}</small>
                <div className="mt-1">
                  <Badge 
                    bg={patient.priority === 'Critical' ? 'danger' : 
                        patient.priority === 'Urgent' ? 'warning' : 'success'}
                    className="me-2"
                  >
                    {patient.priority}
                  </Badge>
                  <small className="text-muted">
                    <FaClock className="me-1" />
                    {patient.waitTime} min wait
                  </small>
                </div>
              </div>
              <div className="text-end">
                <div className="d-flex align-items-center mb-1">
                  <FaHeartbeat className="me-1 text-danger" />
                  <small>{patient.vitals.hr} bpm</small>
                </div>
                <div className="d-flex align-items-center">
                  <small className="text-muted">O2: {patient.vitals.o2}%</small>
                </div>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  };

  const renderRadiologyWidget = () => {
    if (!widgetConfig.radiologyWorkflow.enabled) return null;
    
    const imagingQueue = dashboardData.radiology?.imagingQueue || [];

    return (
      <Card className="h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaXRay className="me-2 text-success" />
            <h5 className="mb-0">Radiology Imaging Queue</h5>
          </div>
          {features.enableAIAssistance && (
            <Badge bg="success">
              <FaRobot className="me-1" />
              AI Enabled
            </Badge>
          )}
        </Card.Header>
        <Card.Body>
          {imagingQueue.map((study) => (
            <div key={study.id} className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
              <div>
                <h6 className="mb-1">{study.patientName}</h6>
                <small className="text-muted">{study.studyType}</small>
                <div className="mt-1">
                  <Badge 
                    bg={study.urgency === 'STAT' ? 'danger' : 
                        study.urgency === 'Urgent' ? 'warning' : 'info'}
                    className="me-2"
                  >
                    {study.urgency}
                  </Badge>
                  <small className="text-muted">
                    <FaCalendarAlt className="me-1" />
                    {study.scheduledTime}
                  </small>
                </div>
              </div>
              <div className="text-end">
                {features.enableAIAssistance && (
                  <div className="mb-2">
                    <small className="text-muted d-block">AI Confidence</small>
                    <ProgressBar 
                      now={study.aiConfidence * 100} 
                      size="sm" 
                      variant={study.aiConfidence > 0.9 ? 'success' : 'warning'}
                    />
                  </div>
                )}
                <Badge bg="primary">{study.status}</Badge>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  };

  const renderAnalyticsWidget = () => {
    if (!widgetConfig.analytics.enabled) return null;
    
    const analytics = dashboardData.analytics || {};

    const chartOptions = {
      chart: {
        type: 'area',
        height: 300,
        toolbar: { show: false }
      },
      colors: ['#089bab', '#FC9F5B'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.1
        }
      },
      xaxis: {
        categories: analytics.monthlyTrends?.categories || []
      },
      legend: {
        position: 'top'
      }
    };

    return (
      <Card className="h-100">
        <Card.Header>
          <div className="d-flex align-items-center">
            <FaChartLine className="me-2 text-info" />
            <h5 className="mb-0">Performance Analytics</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <div className="text-center">
                <h3 className="text-success">
                  <CountUp end={analytics.diagnosticAccuracy || 0} duration={2} decimals={1} suffix="%" />
                </h3>
                <small className="text-muted">Diagnostic Accuracy</small>
              </div>
            </Col>
            <Col md={6}>
              <div className="text-center">
                <h3 className="text-primary">
                  <CountUp end={analytics.reportTurnaroundTime || 0} duration={2} suffix=" min" />
                </h3>
                <small className="text-muted">Avg. Turnaround</small>
              </div>
            </Col>
          </Row>
          {analytics.monthlyTrends && (
            <Chart
              options={chartOptions}
              series={analytics.monthlyTrends.series}
              type="area"
              height={200}
            />
          )}
        </Card.Body>
      </Card>
    );
  };

  const renderAIAssistanceWidget = () => {
    if (!features.enableAIAssistance) return null;
    
    return (
      <Card className="h-100 border-success">
        <Card.Header className="bg-success text-white">
          <div className="d-flex align-items-center">
            <FaBrain className="me-2" />
            <h5 className="mb-0">AI-Assisted Diagnosis</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-3">
            <FaRobot size={48} className="text-success mb-2" />
            <p className="text-muted">AI models are analyzing current cases</p>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Pneumonia Detection</span>
            <Badge bg="success">Active</Badge>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Fracture Analysis</span>
            <Badge bg="success">Active</Badge>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Tumor Identification</span>
            <Badge bg="warning">Learning</Badge>
          </div>
          
          <Alert variant="info" className="mb-0">
            <FaEye className="me-2" />
            <strong>12</strong> cases pending AI review
          </Alert>
        </Card.Body>
      </Card>
    );
  };

  const renderCriticalAlertsWidget = () => {
    return (
      <Card className="h-100 border-warning">
        <Card.Header className="bg-warning text-dark">
          <div className="d-flex align-items-center">
            <FaBell className="me-2" />
            <h5 className="mb-0">Critical Alerts</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Alert variant="danger" className="d-flex align-items-center">
            <FaExclamationTriangle className="me-2" />
            <div>
              <strong>Critical Lab Result</strong><br />
              <small>Patient: Sarah Johnson - Troponin Elevated</small>
            </div>
          </Alert>
          
          <Alert variant="warning" className="d-flex align-items-center">
            <FaHeartbeat className="me-2" />
            <div>
              <strong>Vital Sign Alert</strong><br />
              <small>Patient: Michael Chen - BP: 180/110</small>
            </div>
          </Alert>
          
          <div className="text-center">
            <small className="text-muted">
              Last updated: {new Date().toLocaleTimeString()}
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading Advanced Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="advanced-doctor-dashboard">
      {/* Dashboard Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaTachometerAlt className="me-2 text-primary" />
            Advanced Doctor Dashboard
          </h2>
          <p className="text-muted mb-0">
            Comprehensive medical workflow management with AI-powered insights and real-time analytics
          </p>
        </div>
        <div className="d-flex align-items-center">
          {features.enableAIAssistance && (
            <Badge bg="success" className="me-2 pulse">
              <FaRobot className="me-1" />
              AI Enhanced
            </Badge>
          )}
          {features.enableRealTimeSync && (
            <Badge bg="info" className="me-2">
              <FaClock className="me-1" />
              Real-time
            </Badge>
          )}
          <small className="text-muted">
            Last updated: {dashboardData.lastUpdated ? new Date(dashboardData.lastUpdated).toLocaleTimeString() : 'Loading...'}
          </small>
        </div>
      </div>

      {/* Production Test Widget */}
      <DashboardProductionTest />

      {/* Production Test Widget */}
      <DashboardProductionTest />

      {/* Advanced Dashboard Tabs for Better Organization */}
      <Tabs defaultActiveKey="overview" className="mb-4">
        {/* Overview Tab - Main Dashboard */}
        <Tab eventKey="overview" title={
          <span>
            <FaTachometerAlt className="me-2" />
            Overview
          </span>
        }>
          <Row className="g-4">
            {/* Patient Management Section */}
            <Col xl={6}>
              {renderPatientQueueWidget()}
            </Col>
            
            {/* AI Assistance Section */}
            <Col xl={6}>
              {renderAIAssistanceWidget()}
            </Col>
            
            {/* Critical Alerts Section - Full Width */}
            <Col xl={12}>
              <RealTimeAlertsWidget 
                config={widgetConfig.communicationHub?.widgets?.realTimeAlerts?.config}
                onAlertAction={(action, alertId) => {
                  console.log(`Alert ${action}: ${alertId}`);
                }}
              />
            </Col>
          </Row>
        </Tab>

        {/* Radiology Workflow Tab */}
        <Tab eventKey="radiology" title={
          <span>
            <FaXRay className="me-2" />
            Radiology Workflow
          </span>
        }>
          <Row className="g-4">
            <Col xl={12}>
              <RadiologyWorkflowWidget 
                config={widgetConfig.radiologyWorkflow?.widgets?.imagingQueue?.config}
                onStudyUpdate={(studyId, updates) => {
                  console.log(`Study updated: ${studyId}`, updates);
                }}
              />
            </Col>
            
            {/* Quick Stats for Radiology */}
            <Col xl={3}>
              <Card className="text-center border-primary">
                <Card.Body>
                  <FaXRay size={32} className="text-primary mb-2" />
                  <h3 className="text-primary">
                    <CountUp end={dashboardData.radiology?.pendingScans || 34} duration={2} />
                  </h3>
                  <small className="text-muted">Pending Scans</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3}>
              <Card className="text-center border-success">
                <Card.Body>
                  <FaCheck size={32} className="text-success mb-2" />
                  <h3 className="text-success">
                    <CountUp end={dashboardData.radiology?.completedScans || 78} duration={2} />
                  </h3>
                  <small className="text-muted">Completed Today</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3}>
              <Card className="text-center border-warning">
                <Card.Body>
                  <FaBrain size={32} className="text-warning mb-2" />
                  <h3 className="text-warning">
                    <CountUp end={dashboardData.radiology?.aiAnalysisQueue || 12} duration={2} />
                  </h3>
                  <small className="text-muted">AI Analysis Queue</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3}>
              <Card className="text-center border-info">
                <Card.Body>
                  <FaClock size={32} className="text-info mb-2" />
                  <h3 className="text-info">
                    <CountUp end={dashboardData.radiology?.averageTurnaroundTime || 45} duration={2} suffix=" min" />
                  </h3>
                  <small className="text-muted">Avg Turnaround</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Analytics Tab */}
        <Tab eventKey="analytics" title={
          <span>
            <FaChartLine className="me-2" />
            Analytics
          </span>
        }>
          <Row className="g-4">
            <Col xl={12}>
              <AdvancedAnalyticsWidget 
                config={widgetConfig.analytics}
                timeRange="month"
              />
            </Col>
          </Row>
        </Tab>

        {/* Patient Management Tab */}
        <Tab eventKey="patients" title={
          <span>
            <FaUsers className="me-2" />
            Patient Management
          </span>
        }>
          <Row className="g-4">
            <Col xl={8}>
              {renderPatientQueueWidget()}
            </Col>
            <Col xl={4}>
              {renderAnalyticsWidget()}
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Feature Status Footer */}
      <div className="mt-4 p-3 bg-light rounded">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h6 className="mb-2">🚀 Active Features:</h6>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(features).map(([feature, enabled]) => (
                enabled && (
                  <Badge key={feature} bg="info" className="text-capitalize">
                    {feature.replace(/([A-Z])/g, ' $1').trim().replace('enable', '')}
                  </Badge>
                )
              ))}
            </div>
          </div>
          <div className="col-md-4 text-end">
            <small className="text-muted">
              Dashboard Version: v2.1.0<br />
              API Status: <Badge bg="success">Online</Badge>
            </small>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .advanced-doctor-dashboard {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdvancedDoctorDashboard;