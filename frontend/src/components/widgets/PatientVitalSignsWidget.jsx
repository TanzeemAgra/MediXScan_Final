// Patient Vital Signs Widget - Placeholder for vital signs monitoring
import React from 'react';
import { Card, Alert } from 'react-bootstrap';
import { FaHeartbeat } from '../../utils/icons.utils.jsx';

const PatientVitalSignsWidget = ({ patientId, config }) => {
  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">
          <FaHeartbeat className="me-2" />
          Vital Signs Monitoring
        </h6>
      </Card.Header>
      <Card.Body>
        <Alert variant="info">
          <h6>Vital Signs Dashboard Coming Soon</h6>
          <p className="mb-0">
            Real-time vital signs monitoring and historical trends for Patient ID: {patientId}
          </p>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default PatientVitalSignsWidget;