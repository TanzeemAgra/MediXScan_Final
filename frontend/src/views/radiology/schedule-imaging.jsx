import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge } from 'react-bootstrap';

const ScheduleImaging = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    examType: '',
    priority: 'Normal',
    indication: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const upcomingSchedules = [
    {
      id: 'SCH001',
      patientName: 'Alex Johnson',
      examType: 'MRI Brain',
      date: '2025-09-25',
      time: '10:00 AM',
      priority: 'High',
      status: 'Confirmed'
    },
    {
      id: 'SCH002',
      patientName: 'Maria Garcia',
      examType: 'CT Chest',
      date: '2025-09-25',
      time: '2:00 PM',
      priority: 'Normal',
      status: 'Pending'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      patientName: '',
      examType: '',
      priority: 'Normal',
      indication: '',
      preferredDate: '',
      preferredTime: '',
      notes: ''
    });
    alert('Imaging appointment scheduled successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge bg="success">{status}</Badge>;
      case 'Pending':
        return <Badge bg="warning">{status}</Badge>;
      case 'Cancelled':
        return <Badge bg="danger">{status}</Badge>;
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
        <Col lg={6}>
          <Card>
            <Card.Header>
              <div className="header-title">
                <h4 className="card-title">Schedule New Imaging</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Patient Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        placeholder="Enter patient name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Exam Type *</Form.Label>
                      <Form.Select
                        name="examType"
                        value={formData.examType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select exam type</option>
                        <option value="X-Ray">X-Ray</option>
                        <option value="CT Scan">CT Scan</option>
                        <option value="MRI">MRI</option>
                        <option value="Ultrasound">Ultrasound</option>
                        <option value="Mammography">Mammography</option>
                        <option value="Bone Density">Bone Density</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preferred Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Clinical Indication</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="indication"
                        value={formData.indication}
                        onChange={handleInputChange}
                        placeholder="Enter clinical indication..."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Additional Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional notes..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary">
                  <i className="ri-calendar-schedule-line"></i> Schedule Appointment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card>
            <Card.Header>
              <div className="header-title">
                <h4 className="card-title">Upcoming Schedules</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Exam</th>
                      <th>Date/Time</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingSchedules.map((schedule, index) => (
                      <tr key={index}>
                        <td>{schedule.patientName}</td>
                        <td>{schedule.examType}</td>
                        <td>
                          <small>
                            {schedule.date}<br/>
                            {schedule.time}
                          </small>
                        </td>
                        <td>{getPriorityBadge(schedule.priority)}</td>
                        <td>{getStatusBadge(schedule.status)}</td>
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

export default ScheduleImaging;