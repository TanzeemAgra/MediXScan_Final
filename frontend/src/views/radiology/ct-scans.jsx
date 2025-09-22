import React from 'react';
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';

const CTScans = () => {
  const ctScans = [
    {
      id: 'CT001',
      patientName: 'Alice Johnson',
      scanType: 'Head CT',
      date: '2025-09-19',
      status: 'Completed',
      contrast: 'With Contrast',
      radiologist: 'Dr. Emily Davis'
    },
    {
      id: 'CT002',
      patientName: 'Mark Wilson',
      scanType: 'Abdominal CT',
      date: '2025-09-21',
      status: 'In Progress',
      contrast: 'Without Contrast',
      radiologist: 'Dr. James Miller'
    },
    {
      id: 'CT003',
      patientName: 'Lisa Brown',
      scanType: 'Chest CT',
      date: '2025-09-22',
      status: 'Scheduled',
      contrast: 'With Contrast',
      radiologist: 'Dr. Emily Davis'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge bg="success">{status}</Badge>;
      case 'In Progress':
        return <Badge bg="warning">{status}</Badge>;
      case 'Scheduled':
        return <Badge bg="info">{status}</Badge>;
      default:
        return <Badge bg="light">{status}</Badge>;
    }
  };

  return (
    <div>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="header-title">
                <h4 className="card-title">CT Scan Reports</h4>
              </div>
              <Button variant="primary" size="sm">
                <i className="ri-add-line"></i> Schedule CT Scan
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped>
                  <thead>
                    <tr>
                      <th>Scan ID</th>
                      <th>Patient Name</th>
                      <th>Scan Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Contrast</th>
                      <th>Radiologist</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ctScans.map((scan, index) => (
                      <tr key={index}>
                        <td>{scan.id}</td>
                        <td>{scan.patientName}</td>
                        <td>{scan.scanType}</td>
                        <td>{scan.date}</td>
                        <td>{getStatusBadge(scan.status)}</td>
                        <td>
                          <Badge bg={scan.contrast === 'With Contrast' ? 'primary' : 'secondary'}>
                            {scan.contrast}
                          </Badge>
                        </td>
                        <td>{scan.radiologist}</td>
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

export default CTScans;