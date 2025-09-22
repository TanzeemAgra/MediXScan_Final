import React from 'react';
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';

const MRIResults = () => {
  const mriResults = [
    {
      id: 'MRI001',
      patientName: 'David Lee',
      scanType: 'Brain MRI',
      date: '2025-09-18',
      status: 'Completed',
      sequence: 'T1, T2, FLAIR',
      radiologist: 'Dr. Rachel Green'
    },
    {
      id: 'MRI002',
      patientName: 'Emma Taylor',
      scanType: 'Spine MRI',
      date: '2025-09-20',
      status: 'In Analysis',
      sequence: 'T1, T2',
      radiologist: 'Dr. Kevin Wong'
    },
    {
      id: 'MRI003',
      patientName: 'Chris Anderson',
      scanType: 'Knee MRI',
      date: '2025-09-23',
      status: 'Scheduled',
      sequence: 'T1, T2, PD',
      radiologist: 'Dr. Rachel Green'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge bg="success">{status}</Badge>;
      case 'In Analysis':
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
                <h4 className="card-title">MRI Results</h4>
              </div>
              <Button variant="primary" size="sm">
                <i className="ri-add-line"></i> Schedule MRI
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped>
                  <thead>
                    <tr>
                      <th>MRI ID</th>
                      <th>Patient Name</th>
                      <th>Scan Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Sequence</th>
                      <th>Radiologist</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mriResults.map((result, index) => (
                      <tr key={index}>
                        <td>{result.id}</td>
                        <td>{result.patientName}</td>
                        <td>{result.scanType}</td>
                        <td>{result.date}</td>
                        <td>{getStatusBadge(result.status)}</td>
                        <td>
                          <Badge bg="primary">{result.sequence}</Badge>
                        </td>
                        <td>{result.radiologist}</td>
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

export default MRIResults;