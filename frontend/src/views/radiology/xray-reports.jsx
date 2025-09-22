import React, { useState } from 'react';
import { Row, Col, Card, Table, Badge, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { useRadiologyRecords, useMutation } from '../../hooks/useApi';
import { medicalRecordService } from '../../services/api.service';

const XRayReports = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: ''
  });

  // Fetch real radiology records with X-ray filter
  const { 
    data: radiologyData, 
    loading, 
    error, 
    refetch 
  } = useRadiologyRecords({
    record_type: 'imaging',
    imaging_type: 'xray',
    search: filters.search,
    status: filters.status,
    priority: filters.priority
  });

  // Mutation for updating records
  const { mutate: updateRecord, loading: updateLoading } = useMutation(
    ({ id, data }) => medicalRecordService.update(id, data),
    {
      onSuccess: () => {
        refetch(); // Refresh the data after update
      }
    }
  );

  // Extract X-ray reports from the response
  const xrayReports = radiologyData?.xrayReports || radiologyData?.results || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge bg="success">{status}</Badge>;
      case 'In Progress':
        return <Badge bg="warning">{status}</Badge>;
      case 'Pending':
        return <Badge bg="secondary">{status}</Badge>;
      default:
        return <Badge bg="light">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'urgent': { bg: 'danger', text: 'Urgent' },
      'high': { bg: 'warning', text: 'High' },
      'normal': { bg: 'primary', text: 'Normal' },
      'low': { bg: 'info', text: 'Low' }
    };
    
    const priorityInfo = priorityMap[priority] || { bg: 'secondary', text: priority };
    return <Badge bg={priorityInfo.bg}>{priorityInfo.text}</Badge>;
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Handle status update
  const handleStatusUpdate = async (recordId, newStatus) => {
    try {
      await updateRecord({ id: recordId, data: { status: newStatus } });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  // Error component
  const ErrorAlert = ({ error }) => (
    <Alert variant="danger">
      <Alert.Heading>Error loading X-Ray reports</Alert.Heading>
      <p>{error?.message || 'An unexpected error occurred'}</p>
    </Alert>
  );

  return (
    <div>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="header-title">
                <h4 className="card-title">X-Ray Reports</h4>
              </div>
              <Button variant="primary" size="sm">
                <i className="ri-add-line"></i> New X-Ray Request
              </Button>
            </Card.Header>
            <Card.Body>
              {/* Filters */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search by patient name or ID..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                      <InputGroup.Text>
                        <i className="ri-search-line"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="reviewed">Reviewed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="outline-secondary" onClick={() => setFilters({ search: '', status: '', priority: '' })}>
                    <i className="ri-refresh-line"></i> Reset
                  </Button>
                </Col>
              </Row>

              {/* Data Table */}
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorAlert error={error} />
              ) : (
                <div className="table-responsive">
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Record ID</th>
                        <th>Patient Name</th>
                        <th>Imaging Type</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Doctor</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {xrayReports.length > 0 ? (
                        xrayReports.map((report, index) => (
                          <tr key={report.record_id || index}>
                            <td>{report.record_id}</td>
                            <td>
                              {report.patient?.user?.first_name} {report.patient?.user?.last_name}
                            </td>
                            <td>{report.record_type?.replace('_', ' ').toUpperCase()}</td>
                            <td>{formatDate(report.record_date)}</td>
                            <td>{getStatusBadge(report.status || 'pending')}</td>
                            <td>{getPriorityBadge(report.priority || 'normal')}</td>
                            <td>
                              Dr. {report.doctor?.user?.first_name} {report.doctor?.user?.last_name}
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2">
                                <i className="ri-eye-line"></i> View
                              </Button>
                              <Button variant="outline-secondary" size="sm" className="me-2">
                                <i className="ri-download-line"></i> Download
                              </Button>
                              {report.status === 'pending' && (
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  disabled={updateLoading}
                                  onClick={() => handleStatusUpdate(report.record_id, 'in_progress')}
                                >
                                  <i className="ri-play-line"></i> Start
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            <div className="text-muted">
                              <i className="ri-file-list-line fs-1 d-block mb-2"></i>
                              No X-Ray reports found
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default XRayReports;