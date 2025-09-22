import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Button, Badge, Dropdown, Modal, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { useAuth, usePermissions, useRoleConfig } from '../../hooks/useRBAC.jsx';
import { PermissionGate, RoleBadge, FeatureFlag } from '../../components/RBACMiddleware';
import radiologyDashboardConfig, { getWidgetsByRole, getModalityConfig } from '../../config/radiology-dashboard.config';
import { 
  useDashboardOverview, 
  useRadiologyRecords, 
  useDashboardStats,
  useMutation 
} from '../../hooks/useApi';
import { medicalRecordService, equipmentService } from '../../services/api.service';
import './AdvancedRadiologyDashboard.scss';

const AdvancedRadiologyDashboard = () => {
  const { user, role } = useAuth();
  const { hasPermission, isAuthorized } = usePermissions();
  const { roleData, dashboardModules, featureFlags } = useRoleConfig();
  const [selectedModality, setSelectedModality] = useState('all');
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000);

  // Data hooks
  const { data: overview, loading: overviewLoading, error: overviewError, refetch: refetchOverview } = useDashboardOverview();
  const { data: radiologyStats, loading: statsLoading } = useDashboardStats();
  const { data: radiologyData, loading: examsLoading, refetch: refetchExams } = useRadiologyRecords({ 
    limit: 10, 
    modality: selectedModality !== 'all' ? selectedModality : undefined 
  });

  // Soft-coded data transformation: Convert radiology data structure to flat array
  const recentExams = useMemo(() => {
    if (!radiologyData) return [];
    
    // Handle different possible data structures with soft coding approach
    if (Array.isArray(radiologyData)) {
      // Direct array format
      return radiologyData;
    } else if (radiologyData.results && Array.isArray(radiologyData.results)) {
      // Results array format from API
      return radiologyData.results;
    } else if (typeof radiologyData === 'object') {
      // Combined format from our API: {xrayReports: [], ctScans: [], mriResults: [], ultrasounds: []}
      const allExams = [];
      
      // Soft-coded property extraction
      const examArrayProperties = ['xrayReports', 'ctScans', 'mriResults', 'ultrasounds', 'results'];
      
      examArrayProperties.forEach(prop => {
        if (radiologyData[prop] && Array.isArray(radiologyData[prop])) {
          allExams.push(...radiologyData[prop]);
        }
      });
      
      return allExams;
    }
    
    // Fallback: empty array
    return [];
  }, [radiologyData]);

  // Equipment data state
  const [equipmentData, setEquipmentData] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(false);
  const [equipmentError, setEquipmentError] = useState(null);

  // Load equipment data
  useEffect(() => {
    const loadEquipmentData = async () => {
      if (!hasPermission('equipment:view')) return;
      
      try {
        setLoadingEquipment(true);
        setEquipmentError(null);
        
        // Try to load real data first, fallback to mock data
        let response;
        try {
          response = await equipmentService.getAll();
        } catch (error) {
          console.warn('Real equipment API not available, using mock data:', error);
          response = await equipmentService.getMockEquipmentData();
        }
        
        if (response.success && response.data) {
          setEquipmentData(response.data.equipmentList || []);
        }
      } catch (error) {
        console.error('Failed to load equipment data:', error);
        setEquipmentError('Failed to load equipment data');
        // Fallback to empty array
        setEquipmentData([]);
      } finally {
        setLoadingEquipment(false);
      }
    };

    loadEquipmentData();
  }, [hasPermission, equipmentService]);

  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasPermission('radiology:view')) {
        refetchOverview();
        refetchExams();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, hasPermission, refetchOverview, refetchExams]);

  // Get role-specific widgets
  const roleWidgets = useMemo(() => {
    return getWidgetsByRole(role);
  }, [role]);

  // Statistics calculations - using soft coding approach with defensive programming
  const dashboardStats = useMemo(() => {
    // Ensure recentExams is always an array for safe filtering
    const examsArray = Array.isArray(recentExams) ? recentExams : [];
    
    const base = {
      totalExams: examsArray.length,
      pendingReports: examsArray.filter(exam => exam?.status === 'Pending' || exam?.status === 'pending').length,
      completedReports: examsArray.filter(exam => exam?.status === 'Completed' || exam?.status === 'completed').length,
      criticalFindings: examsArray.filter(exam => exam?.priority === 'urgent' || exam?.priority === 'high').length
    };

    return base;
  }, [recentExams]);

  // Workload distribution data - using soft coding approach with defensive programming
  const workloadData = useMemo(() => {
    // Ensure recentExams is always an array for safe iteration
    const examsArray = Array.isArray(recentExams) ? recentExams : [];
    const modalityCount = {};
    
    examsArray.forEach(exam => {
      // Soft-coded modality detection with fallback
      const modality = exam?.imaging_type || exam?.record_type || 'other';
      modalityCount[modality] = (modalityCount[modality] || 0) + 1;
    });

    return {
      series: Object.values(modalityCount),
      labels: Object.keys(modalityCount).map(key => key.charAt(0).toUpperCase() + key.slice(1))
    };
  }, [recentExams]);

  // Equipment status colors
  const getStatusColor = (status) => {
    const colors = radiologyDashboardConfig.widgets.equipmentStatus.config.statusColors;
    return colors[status] || colors.offline;
  };

  // Render Stats Widget
  const renderStatsWidget = () => (
    <Card className="radiology-stats-widget mb-4">
      <Card.Body>
        <Row>
          <Col md={3} className="text-center">
            <div className="stat-item">
              <div className="stat-icon bg-primary">
                <i className="ri-scan-line"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{dashboardStats.totalExams}</h3>
                <p className="stat-label">Total Exams Today</p>
              </div>
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="stat-item">
              <div className="stat-icon bg-warning">
                <i className="ri-file-list-line"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{dashboardStats.pendingReports}</h3>
                <p className="stat-label">Pending Reports</p>
              </div>
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="stat-item">
              <div className="stat-icon bg-success">
                <i className="ri-checkbox-circle-line"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{dashboardStats.completedReports}</h3>
                <p className="stat-label">Completed Reports</p>
              </div>
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="stat-item">
              <div className="stat-icon bg-danger">
                <i className="ri-alarm-warning-line"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{dashboardStats.criticalFindings}</h3>
                <p className="stat-label">Critical Findings</p>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // Render Equipment Status Widget
  const renderEquipmentWidget = () => (
    <PermissionGate requiredPermissions={['equipment:view']}>
      <Card className="equipment-status-widget mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Equipment Status</h5>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setShowEquipmentModal(true)}
          >
            <i className="ri-eye-line me-1"></i>View All
          </Button>
        </Card.Header>
        <Card.Body>
          {loadingEquipment ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" className="me-2" />
              Loading equipment data...
            </div>
          ) : equipmentError ? (
            <Alert variant="warning" className="mb-0">
              <i className="ri-alert-line me-2"></i>
              {equipmentError}
            </Alert>
          ) : equipmentData.length === 0 ? (
            <div className="text-center text-muted py-4">
              <i className="ri-tools-line fs-4 d-block mb-2"></i>
              No equipment data available
            </div>
          ) : (
            <Row>
              {equipmentData.map(equipment => (
                <Col lg={6} key={equipment.id} className="mb-3">
                  <div className="equipment-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div 
                          className="equipment-status-indicator me-3"
                          style={{ backgroundColor: getStatusColor(equipment.status) }}
                        ></div>
                        <div>
                        <h6 className="mb-1">{equipment.name}</h6>
                        <small className="text-muted">{equipment.location}</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <Badge 
                        bg={equipment.status === 'online' ? 'success' : equipment.status === 'inUse' ? 'primary' : 'warning'}
                      >
                        {equipment.status}
                      </Badge>
                      <div className="mt-1">
                        <small className="text-muted">{equipment.utilization}%</small>
                      </div>
                    </div>
                  </div>
                  {equipment.utilization > 0 && (
                    <ProgressBar 
                      now={equipment.utilization} 
                      className="mt-2"
                      variant={equipment.utilization > 90 ? 'danger' : equipment.utilization > 70 ? 'warning' : 'info'}
                    />
                  )}
                </div>
              </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </PermissionGate>
  );

  // Render Workload Chart Widget
  const renderWorkloadChart = () => {
    const chartOptions = {
      chart: {
        type: 'donut',
        height: 300
      },
      labels: workloadData.labels,
      colors: ['#0d6efd', '#198754', '#ffc107', '#fd7e14', '#6f42c1'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      legend: {
        position: 'right'
      }
    };

    return (
      <Card className="workload-chart-widget mb-4">
        <Card.Header>
          <h5 className="mb-0">Workload Distribution</h5>
        </Card.Header>
        <Card.Body>
          <ReactApexChart 
            options={chartOptions} 
            series={workloadData.series} 
            type="donut" 
            height={300} 
          />
        </Card.Body>
      </Card>
    );
  };

  // Render Recent Exams Widget
  const renderRecentExams = () => (
    <Card className="recent-exams-widget mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Recent Examinations</h5>
        <div className="d-flex align-items-center gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <i className="ri-filter-line me-1"></i>
              {selectedModality === 'all' ? 'All Modalities' : selectedModality.toUpperCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedModality('all')}>All Modalities</Dropdown.Item>
              <Dropdown.Divider />
              {Object.keys(radiologyDashboardConfig.imagingModalities).map(modality => (
                <Dropdown.Item 
                  key={modality} 
                  onClick={() => setSelectedModality(modality)}
                >
                  <i className={`${radiologyDashboardConfig.imagingModalities[modality].icon} me-2`}></i>
                  {radiologyDashboardConfig.imagingModalities[modality].name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-primary" size="sm" onClick={refetchExams}>
            <i className="ri-refresh-line"></i>
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {examsLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (Array.isArray(recentExams) && recentExams.length > 0) ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Exam ID</th>
                  <th>Patient</th>
                  <th>Modality</th>
                  <th>Date/Time</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(recentExams) ? recentExams : []).map((exam, index) => (
                  <tr key={exam.record_id || index}>
                    <td>
                      <code>{exam.record_id}</code>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">
                          {exam.patient?.user?.first_name} {exam.patient?.user?.last_name}
                        </div>
                        <small className="text-muted">ID: {exam.patient?.patient_id}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="ri-scan-line me-2 text-primary"></i>
                        {exam.record_type?.replace('_', ' ').toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{new Date(exam.record_date).toLocaleDateString()}</div>
                        <small className="text-muted">{new Date(exam.record_date).toLocaleTimeString()}</small>
                      </div>
                    </td>
                    <td>
                      <Badge 
                        bg={exam.status === 'completed' ? 'success' : exam.status === 'pending' ? 'warning' : 'secondary'}
                      >
                        {exam.status || 'Pending'}
                      </Badge>
                    </td>
                    <td>
                      <Badge 
                        bg={exam.priority === 'urgent' ? 'danger' : exam.priority === 'high' ? 'warning' : 'info'}
                      >
                        {exam.priority || 'Normal'}
                      </Badge>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <PermissionGate requiredPermissions={['radiology:view']}>
                          <Button variant="outline-primary" size="sm">
                            <i className="ri-eye-line"></i>
                          </Button>
                        </PermissionGate>
                        <PermissionGate requiredPermissions={['report:create']}>
                          <Button variant="outline-secondary" size="sm">
                            <i className="ri-file-text-line"></i>
                          </Button>
                        </PermissionGate>
                        <PermissionGate requiredPermissions={['radiology:edit']}>
                          <Button variant="outline-info" size="sm">
                            <i className="ri-download-line"></i>
                          </Button>
                        </PermissionGate>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted">
            <i className="ri-scan-line display-4"></i>
            <p className="mt-3">No recent examinations found</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  // Render AI Insights Widget
  const renderAIInsights = () => (
    <FeatureFlag flag="aiDiagnostics">
      <PermissionGate requiredPermissions={['radiology:view']}>
        <Card className="ai-insights-widget mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="ri-robot-line me-2 text-primary"></i>
              <h5 className="mb-0">AI-Enhanced Diagnostics</h5>
              <Badge bg="success" className="ms-2">Beta</Badge>
            </div>
            <Button 
              variant="outline-info" 
              size="sm"
              onClick={() => setShowAIInsights(true)}
            >
              <i className="ri-settings-line me-1"></i>Configure
            </Button>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="ai-feature-item">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <i className="ri-search-eye-line me-2 text-info"></i>
                      <span>Automated Detection</span>
                    </div>
                    <Badge bg="success">Active</Badge>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-info" 
                      style={{ width: '92%' }} 
                      aria-valuenow="92"
                    ></div>
                  </div>
                  <small className="text-muted">Confidence: 92%</small>
                </div>
              </Col>
              <Col md={6}>
                <div className="ai-feature-item">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <i className="ri-compare-line me-2 text-success"></i>
                      <span>Comparison Analysis</span>
                    </div>
                    <Badge bg="success">Active</Badge>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: '87%' }} 
                      aria-valuenow="87"
                    ></div>
                  </div>
                  <small className="text-muted">Accuracy: 87%</small>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <div className="ai-feature-item">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <i className="ri-ruler-line me-2 text-warning"></i>
                      <span>Auto Measurements</span>
                    </div>
                    <Badge bg="success">Active</Badge>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: '89%' }} 
                      aria-valuenow="89"
                    ></div>
                  </div>
                  <small className="text-muted">Precision: 89%</small>
                </div>
              </Col>
              <Col md={6}>
                <div className="ai-feature-item">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <i className="ri-file-text-line me-2 text-secondary"></i>
                      <span>Report Generation</span>
                    </div>
                    <Badge bg="secondary">Coming Soon</Badge>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-secondary" 
                      style={{ width: '0%' }} 
                      aria-valuenow="0"
                    ></div>
                  </div>
                  <small className="text-muted">In Development</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </PermissionGate>
    </FeatureFlag>
  );

  if (overviewLoading || statsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="advanced-radiology-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header mb-4">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center">
              <i className="ri-dashboard-3-line display-6 text-primary me-3"></i>
              <div>
                <h1 className="h3 mb-1">Advanced Radiology Dashboard</h1>
                <p className="text-muted mb-0">
                  Welcome back, {user?.firstName} {user?.lastName} | 
                  <RoleBadge role={role} showIcon={true} />
                </p>
              </div>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <div className="d-flex align-items-center justify-content-end gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  <i className="ri-time-line me-1"></i>
                  Auto-refresh: {refreshInterval / 1000}s
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setRefreshInterval(15000)}>15 seconds</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRefreshInterval(30000)}>30 seconds</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRefreshInterval(60000)}>1 minute</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRefreshInterval(300000)}>5 minutes</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" size="sm">
                <i className="ri-add-line me-1"></i>
                New Exam
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Error Alert */}
      {overviewError && (
        <Alert variant="danger" dismissible>
          <Alert.Heading>Error Loading Dashboard Data</Alert.Heading>
          <p>{overviewError.message}</p>
        </Alert>
      )}

      {/* Dashboard Widgets */}
      <div className="dashboard-widgets">
        {/* Stats Widget - Always visible */}
        {renderStatsWidget()}

        <Row>
          {/* Equipment Status Widget */}
          {dashboardModules.equipment?.enabled && (
            <Col lg={6} className="mb-4">
              {renderEquipmentWidget()}
            </Col>
          )}

          {/* Workload Chart Widget */}
          {dashboardModules.analytics?.enabled && (
            <Col lg={6} className="mb-4">
              {renderWorkloadChart()}
            </Col>
          )}
        </Row>

        {/* Recent Exams Widget */}
        {dashboardModules.radiology?.enabled && renderRecentExams()}

        {/* AI Insights Widget */}
        {featureFlags.aiDiagnostics && renderAIInsights()}
      </div>

      {/* Equipment Modal */}
      <Modal show={showEquipmentModal} onHide={() => setShowEquipmentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Equipment Status Overview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {equipmentData.map(equipment => (
              <Col md={6} key={equipment.id} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="card-title mb-0">{equipment.name}</h6>
                      <Badge 
                        bg={equipment.status === 'online' ? 'success' : equipment.status === 'inUse' ? 'primary' : 'warning'}
                      >
                        {equipment.status}
                      </Badge>
                    </div>
                    <p className="text-muted mb-2">
                      <i className="ri-map-pin-line me-1"></i>
                      {equipment.location}
                    </p>
                    <div className="mb-2">
                      <small className="text-muted">Utilization</small>
                      <ProgressBar now={equipment.utilization} className="mt-1" />
                    </div>
                    <div className="d-flex justify-content-between">
                      <Button variant="outline-primary" size="sm">
                        <i className="ri-settings-line me-1"></i>Manage
                      </Button>
                      <Button variant="outline-info" size="sm">
                        <i className="ri-bar-chart-line me-1"></i>Stats
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>

      {/* AI Insights Modal */}
      <Modal show={showAIInsights} onHide={() => setShowAIInsights(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>AI Diagnostics Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <i className="ri-information-line me-2"></i>
            Configure AI-enhanced diagnostic features for improved accuracy and efficiency.
          </Alert>
          {/* Add AI configuration options here */}
          <p>AI configuration options will be available in the next update.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdvancedRadiologyDashboard;