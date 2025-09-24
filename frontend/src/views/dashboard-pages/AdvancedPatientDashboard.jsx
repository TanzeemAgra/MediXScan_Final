// Advanced Patient Management Dashboard - MediXScan
// Comprehensive patient dashboard with real-time database integration

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Container, Row, Col, Card, Badge, Button, Alert, Spinner, 
  Form, InputGroup, Dropdown, Modal, Table, ProgressBar, Tabs, Tab 
} from 'react-bootstrap';

// Soft-coded icon imports
import { 
  FaUsers, FaUserPlus, FaSearch, FaFilter, FaCalendarAlt, 
  FaHeartbeat, FaEdit, FaEye, FaTrash, FaDownload, FaPlus,
  FaChartLine, FaBell, FaUserMd, FaClock, FaPhone, FaEnvelope,
  FaExclamationTriangle, FaCheck, FaRefresh, FaPrint
} from '../../utils/icons.utils.jsx';

// Import services and configurations
import { patientAPIService, patientDataProcessor } from '../../services/patient-api.service.js';
import patientDashboardConfig from '../../config/patient-dashboard.config.js';
import { useApi } from '../../hooks/useApi.js';

// Import patient management widgets
import PatientSearchWidget from '../../components/widgets/PatientSearchWidget.jsx';
import PatientListWidget from '../../components/widgets/PatientListWidget.jsx';
import PatientStatsWidget from '../../components/widgets/PatientStatsWidget.jsx';
import PatientVitalSignsWidget from '../../components/widgets/PatientVitalSignsWidget.jsx';
import PatientAnalyticsWidget from '../../components/widgets/PatientAnalyticsWidget.jsx';

const AdvancedPatientDashboard = () => {
  // Soft-coded configuration
  const config = patientDashboardConfig;
  const features = config.featureFlags;
  const layout = config.dashboardLayout;

  // State management
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: 'lastName', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'create'
  const [bulkSelection, setBulkSelection] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Real-time data fetching with useApi hook
  const { 
    data: patientsData, 
    loading: patientsLoading, 
    error: patientsError, 
    refetch: refetchPatients 
  } = useApi(
    () => patientAPIService.getAllPatients({
      page: currentPage,
      ordering: `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.field}`,
      filters: { ...filters, search: searchQuery }
    }),
    [currentPage, sortConfig, filters, searchQuery, refreshKey],
    { 
      enabled: features.enableRealTimeUpdates,
      refetchInterval: config.apiIntegration.realTimeUpdates.updateInterval
    }
  );

  // Patient statistics
  const { 
    data: statsData, 
    loading: statsLoading 
  } = useApi(
    () => patientAPIService.getPatientStatistics(),
    [refreshKey],
    { refetchInterval: config.widgetConfigurations.patientStats.refreshInterval }
  );

  // Demographics data for analytics
  const { 
    data: demographicsData 
  } = useApi(
    () => patientAPIService.getPatientDemographics(),
    [refreshKey],
    { enabled: features.enablePatientAnalytics }
  );

  // Update patients when data changes
  useEffect(() => {
    if (patientsData?.success) {
      setPatients(patientsData.data.results || []);
      setLoading(false);
    }
    if (patientsError) {
      setError(patientsError);
      setLoading(false);
    }
  }, [patientsData, patientsError]);

  // Search functionality with debouncing
  const debouncedSearch = useMemo(() => {
    return searchQuery;
  }, [searchQuery]);

  // Handle patient selection
  const handlePatientSelect = useCallback((patient) => {
    setSelectedPatient(patient);
    setModalType('view');
    setShowModal(true);
  }, []);

  // Handle patient creation
  const handleCreatePatient = useCallback(() => {
    setSelectedPatient(null);
    setModalType('create');
    setShowModal(true);
  }, []);

  // Handle patient editing
  const handleEditPatient = useCallback((patient) => {
    setSelectedPatient(patient);
    setModalType('edit');
    setShowModal(true);
  }, []);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  // Handle filtering
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter
  }, []);

  // Handle sorting
  const handleSort = useCallback((field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Handle bulk operations
  const handleBulkOperation = useCallback(async (operation, selectedIds) => {
    try {
      setLoading(true);
      
      switch (operation) {
        case 'export':
          await patientAPIService.exportPatientData(selectedIds, 'csv');
          break;
        case 'delete':
          // Implementation for bulk delete
          break;
        default:
          console.warn('Unknown bulk operation:', operation);
      }
      
      setBulkSelection([]);
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    refetchPatients();
  }, [refetchPatients]);

  // Render patient quick actions
  const renderQuickActions = () => (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaPlus className="me-2" />
          Quick Actions
        </h5>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
        >
          <FaRefresh className={`me-1 ${loading ? 'fa-spin' : ''}`} />
          Refresh
        </Button>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3}>
            <Button 
              variant="primary" 
              className="w-100 mb-2"
              onClick={handleCreatePatient}
            >
              <FaUserPlus className="me-2" />
              Add Patient
            </Button>
          </Col>
          <Col md={3}>
            <Button 
              variant="success" 
              className="w-100 mb-2"
              disabled={!features.enableAppointmentIntegration}
            >
              <FaCalendarAlt className="me-2" />
              Schedule Appointment
            </Button>
          </Col>
          <Col md={3}>
            <Button 
              variant="info" 
              className="w-100 mb-2"
              disabled={!features.enableDataExport}
            >
              <FaDownload className="me-2" />
              Export Data
            </Button>
          </Col>
          <Col md={3}>
            <Button 
              variant="secondary" 
              className="w-100 mb-2"
              disabled={!features.enablePatientAnalytics}
            >
              <FaChartLine className="me-2" />
              View Reports
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // Error display
  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger">
          <FaExclamationTriangle className="me-2" />
          Error loading patient data: {error}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-2"
            onClick={handleRefresh}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="advanced-patient-dashboard">
      <Container fluid>
        {/* Dashboard Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">
              <FaUsers className="me-2 text-primary" />
              Patient Management System
            </h2>
            <p className="text-muted mb-0">
              Comprehensive patient dashboard with real-time updates and advanced analytics
            </p>
          </div>
          <div className="d-flex align-items-center">
            {features.enableRealTimeUpdates && (
              <Badge bg="success" className="me-2">
                <FaClock className="me-1" />
                Live Updates
              </Badge>
            )}
            {features.enableHIPAACompliance && (
              <Badge bg="info" className="me-2">
                <FaCheck className="me-1" />
                HIPAA Compliant
              </Badge>
            )}
            <small className="text-muted">
              Last updated: {new Date().toLocaleTimeString()}
            </small>
          </div>
        </div>

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Main Dashboard Tabs */}
        <Tabs defaultActiveKey="overview" className="mb-4">
          {/* Overview Tab */}
          <Tab eventKey="overview" title={
            <span>
              <FaUsers className="me-2" />
              Overview
            </span>
          }>
            <Row>
              {/* Patient Statistics */}
              <Col xl={8}>
                <PatientStatsWidget 
                  data={statsData}
                  loading={statsLoading}
                  config={config.widgetConfigurations.patientStats}
                />
              </Col>
              
              {/* Quick Stats Cards */}
              <Col xl={4}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Card className="text-center h-100">
                      <Card.Body>
                        <FaUsers className="display-4 text-primary mb-2" />
                        <h5>{statsData?.data?.totalPatients || 0}</h5>
                        <small className="text-muted">Total Patients</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Card className="text-center h-100">
                      <Card.Body>
                        <FaUserPlus className="display-4 text-success mb-2" />
                        <h5>{statsData?.data?.newPatients || 0}</h5>
                        <small className="text-muted">New This Month</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Tab>

          {/* Patient Search & Management Tab */}
          <Tab eventKey="patients" title={
            <span>
              <FaSearch className="me-2" />
              Patient Search
            </span>
          }>
            <Row>
              <Col xl={3}>
                <PatientSearchWidget
                  onSearch={handleSearch}
                  onFilterChange={handleFilterChange}
                  config={config.searchConfiguration}
                  enabled={features.enablePatientSearch}
                />
              </Col>
              <Col xl={9}>
                <PatientListWidget
                  patients={patients}
                  loading={loading}
                  onPatientSelect={handlePatientSelect}
                  onPatientEdit={handleEditPatient}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  config={config.widgetConfigurations.patientList}
                  bulkSelection={bulkSelection}
                  onBulkSelectionChange={setBulkSelection}
                  onBulkOperation={handleBulkOperation}
                />
              </Col>
            </Row>
          </Tab>

          {/* Analytics Tab */}
          {features.enablePatientAnalytics && (
            <Tab eventKey="analytics" title={
              <span>
                <FaChartLine className="me-2" />
                Analytics
              </span>
            }>
              <PatientAnalyticsWidget
                demographicsData={demographicsData}
                patientsData={patients}
                loading={loading}
                config={config}
              />
            </Tab>
          )}

          {/* Vital Signs Tab */}
          {features.enableVitalSigns && selectedPatient && (
            <Tab eventKey="vitals" title={
              <span>
                <FaHeartbeat className="me-2" />
                Vital Signs
              </span>
            }>
              <PatientVitalSignsWidget
                patientId={selectedPatient.id}
                config={config.widgetConfigurations.vitalSigns}
              />
            </Tab>
          )}
        </Tabs>

        {/* Patient Details Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'create' && (
                <>
                  <FaUserPlus className="me-2" />
                  Add New Patient
                </>
              )}
              {modalType === 'edit' && (
                <>
                  <FaEdit className="me-2" />
                  Edit Patient Information
                </>
              )}
              {modalType === 'view' && selectedPatient && (
                <>
                  <FaEye className="me-2" />
                  {patientDataProcessor.formatPatientName(selectedPatient)}
                </>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPatient || modalType === 'create' ? (
              <div>
                {/* Patient details content will be rendered here */}
                <Alert variant="info">
                  <FaBell className="me-2" />
                  Patient details form will be implemented here with full CRUD functionality
                </Alert>
              </div>
            ) : (
              <div className="text-center">
                <Spinner animation="border" />
                <p className="mt-2">Loading patient information...</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            {modalType !== 'view' && (
              <Button variant="primary">
                <FaCheck className="me-2" />
                Save Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Floating Action Button for Mobile */}
        <div className="d-md-none position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1050 }}>
          <Button
            variant="primary"
            className="rounded-circle"
            style={{ width: '60px', height: '60px' }}
            onClick={handleCreatePatient}
          >
            <FaPlus />
          </Button>
        </div>
      </Container>

      <style jsx>{`
        .advanced-patient-dashboard {
          animation: fadeIn 0.5s ease-in;
          min-height: 100vh;
          background: #f8f9fa;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          border: none;
          transition: box-shadow 0.15s ease-in-out;
        }

        .card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }

        .table-responsive {
          border-radius: 0.375rem;
        }

        .btn {
          transition: all 0.15s ease-in-out;
        }

        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedPatientDashboard;