import React, { useState, useEffect, useCallback } from 'react';
import { Card, Alert, Badge, Button, ListGroup, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
// Soft-coded icon imports with production-safe fallbacks
import { 
  FaBell, FaExclamationTriangle, FaHeartbeat, FaUserMd, 
  FaCog, FaCheck, FaTimes, FaClock, FaVolumeUp, FaVolumeMute 
} from '../../utils/icons.utils.jsx';

// Advanced Real-Time Alert and Notification System
const RealTimeAlertsWidget = ({ config, onAlertAction }) => {
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alertSettings, setAlertSettings] = useState({
    criticalResults: { enabled: true, sound: true, autoEscalate: true },
    vitalSigns: { enabled: true, sound: true, autoEscalate: false },
    equipmentAlerts: { enabled: true, sound: false, autoEscalate: true },
    medicationAlerts: { enabled: true, sound: true, autoEscalate: false },
    emergencyCodes: { enabled: true, sound: true, autoEscalate: true }
  });

  // Soft-coded alert configurations
  const alertTypes = {
    CRITICAL_RESULT: {
      level: 'critical',
      icon: FaExclamationTriangle,
      color: 'danger',
      sound: '/sounds/critical-alert.mp3',
      timeout: 300 // 5 minutes
    },
    VITAL_SIGNS: {
      level: 'warning',
      icon: FaHeartbeat,
      color: 'warning',
      sound: '/sounds/vital-alert.mp3',
      timeout: 180 // 3 minutes
    },
    EQUIPMENT_FAILURE: {
      level: 'urgent',
      icon: FaCog,
      color: 'danger',
      sound: '/sounds/equipment-alert.mp3',
      timeout: 120 // 2 minutes
    },
    MEDICATION_ALERT: {
      level: 'info',
      icon: FaUserMd,
      color: 'info',
      sound: '/sounds/info-alert.mp3',
      timeout: 600 // 10 minutes
    },
    EMERGENCY_CODE: {
      level: 'emergency',
      icon: FaBell,
      color: 'dark',
      sound: '/sounds/emergency-alert.mp3',
      timeout: 60 // 1 minute
    }
  };

  // Initialize with mock real-time alerts
  useEffect(() => {
    const initializeAlerts = () => {
      const mockAlerts = [
        {
          id: 'ALERT-001',
          type: 'CRITICAL_RESULT',
          title: 'Critical Lab Result - Troponin Elevated',
          message: 'Patient: Sarah Johnson (P-12345) - Troponin I: 2.8 ng/mL (Normal: <0.04)',
          patientId: 'P-12345',
          patientName: 'Sarah Johnson',
          department: 'Emergency Department',
          physician: 'Dr. Emily Chen',
          timestamp: new Date(),
          acknowledged: false,
          escalated: false,
          priority: 1,
          requiresResponse: true,
          metadata: {
            labValue: '2.8 ng/mL',
            normalRange: '<0.04 ng/mL',
            criticalValue: true
          }
        },
        {
          id: 'ALERT-002',
          type: 'VITAL_SIGNS',
          title: 'Vital Signs Alert - Hypertensive Crisis',
          message: 'Patient: Michael Chen (P-67890) - BP: 185/110 mmHg, HR: 120 bpm',
          patientId: 'P-67890',
          patientName: 'Michael Chen',
          department: 'ICU',
          physician: 'Dr. James Wilson',
          timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
          acknowledged: false,
          escalated: false,
          priority: 2,
          requiresResponse: true,
          metadata: {
            systolic: 185,
            diastolic: 110,
            heartRate: 120,
            trend: 'increasing'
          }
        },
        {
          id: 'ALERT-003',
          type: 'EQUIPMENT_FAILURE',
          title: 'MRI Scanner Offline',
          message: 'MRI Scanner #2 (Room 3B) - System Error: Cooling failure detected',
          patientId: null,
          patientName: null,
          department: 'Radiology',
          physician: 'Biomedical Engineering',
          timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
          acknowledged: true,
          escalated: false,
          priority: 3,
          requiresResponse: false,
          metadata: {
            equipment: 'MRI Scanner #2',
            location: 'Room 3B',
            errorCode: 'COOL_001',
            affectedStudies: 3
          }
        }
      ];
      
      setAlerts(mockAlerts);
    };

    initializeAlerts();

    // Simulate real-time alert updates
    const alertInterval = setInterval(() => {
      // Randomly add new alerts for demonstration
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        const newAlert = generateRandomAlert();
        setAlerts(prev => [newAlert, ...prev]);
        
        if (soundEnabled && alertSettings[newAlert.type.toLowerCase()]?.sound) {
          playAlertSound(newAlert.type);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(alertInterval);
  }, [soundEnabled, alertSettings]);

  const generateRandomAlert = () => {
    const types = Object.keys(alertTypes);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const patients = ['Emma Davis', 'John Smith', 'Lisa Wang', 'Robert Johnson'];
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    
    return {
      id: `ALERT-${Date.now()}`,
      type: randomType,
      title: `New ${randomType.replace('_', ' ').toLowerCase()} alert`,
      message: `Automated alert for patient ${randomPatient}`,
      patientId: `P-${Math.floor(Math.random() * 99999)}`,
      patientName: randomPatient,
      department: 'Emergency Department',
      physician: 'Dr. System Alert',
      timestamp: new Date(),
      acknowledged: false,
      escalated: false,
      priority: Math.floor(Math.random() * 5) + 1,
      requiresResponse: true,
      metadata: {}
    };
  };

  const playAlertSound = (alertType) => {
    if (soundEnabled) {
      const audioConfig = alertTypes[alertType];
      if (audioConfig && audioConfig.sound) {
        // In a real implementation, this would play an audio file
        console.log(`Playing sound: ${audioConfig.sound}`);
      }
    }
  };

  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date() }
          : alert
      )
    );
    
    if (onAlertAction) {
      onAlertAction('acknowledge', alertId);
    }
  }, [onAlertAction]);

  const dismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    if (onAlertAction) {
      onAlertAction('dismiss', alertId);
    }
  }, [onAlertAction]);

  const escalateAlert = useCallback((alertId) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, escalated: true, escalatedAt: new Date() }
          : alert
      )
    );
    
    if (onAlertAction) {
      onAlertAction('escalate', alertId);
    }
  }, [onAlertAction]);

  const getAlertIcon = (type) => {
    const IconComponent = alertTypes[type]?.icon || FaBell;
    return IconComponent;
  };

  const getAlertVariant = (type) => {
    return alertTypes[type]?.color || 'secondary';
  };

  const getPriorityBadge = (priority) => {
    if (priority <= 2) return { variant: 'danger', text: 'Critical' };
    if (priority <= 3) return { variant: 'warning', text: 'High' };
    if (priority <= 4) return { variant: 'info', text: 'Medium' };
    return { variant: 'secondary', text: 'Low' };
  };

  const renderAlert = (alert) => {
    const AlertIcon = getAlertIcon(alert.type);
    const variant = getAlertVariant(alert.type);
    const priorityBadge = getPriorityBadge(alert.priority);
    
    return (
      <Alert
        key={alert.id}
        variant={variant}
        className={`mb-2 ${alert.acknowledged ? 'opacity-75' : ''}`}
        dismissible={alert.acknowledged}
        onClose={() => dismissAlert(alert.id)}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-1">
              <AlertIcon className="me-2" />
              <strong>{alert.title}</strong>
              <Badge bg={priorityBadge.variant} className="ms-2">
                {priorityBadge.text}
              </Badge>
              {alert.escalated && (
                <Badge bg="dark" className="ms-1">Escalated</Badge>
              )}
            </div>
            
            <p className="mb-1">{alert.message}</p>
            
            <div className="d-flex align-items-center text-muted">
              <small>
                <FaClock className="me-1" />
                {alert.timestamp.toLocaleTimeString()}
              </small>
              {alert.patientName && (
                <small className="ms-3">
                  Patient: {alert.patientName}
                </small>
              )}
              <small className="ms-3">
                Department: {alert.department}
              </small>
            </div>
          </div>
          
          <div className="d-flex flex-column gap-1 ms-3">
            {!alert.acknowledged && (
              <Button
                size="sm"
                variant="outline-success"
                onClick={() => acknowledgeAlert(alert.id)}
              >
                <FaCheck />
              </Button>
            )}
            
            {alert.requiresResponse && !alert.escalated && (
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => escalateAlert(alert.id)}
              >
                <FaBell />
              </Button>
            )}
          </div>
        </div>
      </Alert>
    );
  };

  const renderSettingsModal = () => (
    <Modal show={showSettings} onHide={() => setShowSettings(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Alert Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="switch"
            id="sound-toggle"
            label="Enable Alert Sounds"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="mb-3"
          />
          
          <h6>Alert Type Settings</h6>
          {Object.entries(alertSettings).map(([type, settings]) => (
            <div key={type} className="border rounded p-3 mb-2">
              <h6 className="text-capitalize">{type.replace(/([A-Z])/g, ' $1')}</h6>
              <Form.Check
                type="switch"
                id={`${type}-enabled`}
                label="Enabled"
                checked={settings.enabled}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  [type]: { ...prev[type], enabled: e.target.checked }
                }))}
              />
              <Form.Check
                type="switch"
                id={`${type}-sound`}
                label="Sound Notification"
                checked={settings.sound}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  [type]: { ...prev[type], sound: e.target.checked }
                }))}
                disabled={!settings.enabled}
              />
              <Form.Check
                type="switch"
                id={`${type}-escalate`}
                label="Auto Escalate"
                checked={settings.autoEscalate}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  [type]: { ...prev[type], autoEscalate: e.target.checked }
                }))}
                disabled={!settings.enabled}
              />
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowSettings(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => setShowSettings(false)}>
          Save Settings
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaBell className="me-2 text-warning" />
            <h5 className="mb-0">Real-Time Alerts</h5>
            {activeAlerts.length > 0 && (
              <Badge bg="danger" className="ms-2 pulse">
                {activeAlerts.length}
              </Badge>
            )}
          </div>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="me-2"
            >
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <FaCog />
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {activeAlerts.length === 0 && acknowledgedAlerts.length === 0 ? (
            <div className="text-center text-muted py-4">
              <FaBell size={48} className="mb-2 opacity-50" />
              <p>No active alerts</p>
            </div>
          ) : (
            <>
              {/* Active Alerts */}
              {activeAlerts.length > 0 && (
                <div className="mb-3">
                  <h6 className="text-danger">
                    <FaExclamationTriangle className="me-2" />
                    Active Alerts ({activeAlerts.length})
                  </h6>
                  {activeAlerts.map(renderAlert)}
                </div>
              )}
              
              {/* Acknowledged Alerts */}
              {acknowledgedAlerts.length > 0 && (
                <div>
                  <h6 className="text-muted">
                    <FaCheck className="me-2" />
                    Recently Acknowledged ({acknowledgedAlerts.length})
                  </h6>
                  {acknowledgedAlerts.slice(0, 3).map(renderAlert)}
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      
      {renderSettingsModal()}
      
      <style jsx>{`
        .pulse {
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default RealTimeAlertsWidget;