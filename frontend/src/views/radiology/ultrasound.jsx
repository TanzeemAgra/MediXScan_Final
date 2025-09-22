import React from 'react';
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';

const Ultrasound = () => {
  const ultrasoundReports = [
    {
      id: 'US001',
      patientName: 'Sarah Martinez',
      examType: 'Abdominal Ultrasound',
      date: '2025-09-21',
      status: 'Completed',
      indication: 'Abdominal pain',
      technician: 'Mary Johnson'
    },
    {
      id: 'US002',
      patientName: 'Tom Wilson',
      examType: 'Cardiac Echo',
      date: '2025-09-22',
      status: 'In Progress',
      indication: 'Heart murmur',
      technician: 'John Smith'
    },
    {
      id: 'US003',
      patientName: 'Jennifer Clark',
      examType: 'Pelvic Ultrasound',
      date: '2025-09-23',
      status: 'Scheduled',
      indication: 'Routine checkup',
      technician: 'Mary Johnson'
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
                <h4 className="card-title">Ultrasound Reports</h4>
              </div>
              <Button variant="primary" size="sm">
                <i className="ri-add-line"></i> Schedule Ultrasound
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped>
                  <thead>
                    <tr>
                      <th>Exam ID</th>
                      <th>Patient Name</th>
                      <th>Exam Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Indication</th>
                      <th>Technician</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultrasoundReports.map((report, index) => (
                      <tr key={index}>
                        <td>{report.id}</td>
                        <td>{report.patientName}</td>
                        <td>{report.examType}</td>
                        <td>{report.date}</td>
                        <td>{getStatusBadge(report.status)}</td>
                        <td>{report.indication}</td>
                        <td>{report.technician}</td>
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

export default Ultrasound;