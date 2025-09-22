import React from 'react';
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';

const XRayReports = () => {
  const xrayReports = [
    {
      id: 'XR001',
      patientName: 'John Doe',
      reportType: 'Chest X-Ray',
      date: '2025-09-20',
      status: 'Completed',
      priority: 'Normal',
      radiologist: 'Dr. Sarah Wilson'
    },
    {
      id: 'XR002',
      patientName: 'Jane Smith',
      reportType: 'Abdominal X-Ray',
      date: '2025-09-21',
      status: 'In Progress',
      priority: 'High',
      radiologist: 'Dr. Michael Brown'
    },
    {
      id: 'XR003',
      patientName: 'Robert Johnson',
      reportType: 'Bone X-Ray',
      date: '2025-09-22',
      status: 'Pending',
      priority: 'Normal',
      radiologist: 'Dr. Sarah Wilson'
    }
  ];

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
    switch (priority) {
      case 'High':
        return <Badge bg="danger">{priority}</Badge>;
      case 'Medium':
        return <Badge bg="warning">{priority}</Badge>;
      case 'Normal':
        return <Badge bg="success">{priority}</Badge>;
      default:
        return <Badge bg="light">{priority}</Badge>;
    }
  };

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
              <div className="table-responsive">
                <Table striped>
                  <thead>
                    <tr>
                      <th>Report ID</th>
                      <th>Patient Name</th>
                      <th>Report Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Radiologist</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {xrayReports.map((report, index) => (
                      <tr key={index}>
                        <td>{report.id}</td>
                        <td>{report.patientName}</td>
                        <td>{report.reportType}</td>
                        <td>{report.date}</td>
                        <td>{getStatusBadge(report.status)}</td>
                        <td>{getPriorityBadge(report.priority)}</td>
                        <td>{report.radiologist}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <i className="ri-eye-line"></i> View
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <i className="ri-download-line"></i> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default XRayReports;