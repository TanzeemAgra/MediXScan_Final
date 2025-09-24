import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Form, Table, ProgressBar, Alert } from 'react-bootstrap';
// Soft-coded icon imports with production-safe fallbacks
import { 
  FaXRay, FaBrain, FaEye, FaDownload, FaCheck, 
  FaClock, FaExclamationTriangle, FaRobot, FaPrint 
} from '../../utils/icons.utils.jsx';

// Advanced Radiology Workflow Widget with AI Integration
const RadiologyWorkflowWidget = ({ config, onStudyUpdate }) => {
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState({});
  const [loading, setLoading] = useState(false);

  // Soft-coded study types and configurations
  const studyTypes = config?.imagingTypes || ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound'];
  const urgencyLevels = config?.urgencyLevels || ['STAT', 'Urgent', 'Routine'];
  
  useEffect(() => {
    // Initialize with mock data - in production, this would fetch from API
    const mockStudies = [
      {
        id: 'RAD-001',
        patientId: 'P-12345',
        patientName: 'Sarah Johnson',
        patientAge: 45,
        studyType: 'CT Chest',
        bodyPart: 'Chest',
        urgency: 'STAT',
        scheduledTime: '2025-09-24T14:30:00',
        status: 'In Progress',
        technician: 'Mike Rodriguez',
        referringPhysician: 'Dr. Emily Chen',
        clinicalHistory: 'Chest pain, suspected pulmonary embolism',
        aiAnalysis: {
          completed: true,
          confidence: 0.94,
          findings: ['Possible pulmonary embolism in right lower lobe', 'No acute consolidation'],
          riskScore: 0.85
        },
        images: {
          total: 120,
          processed: 120,
          format: 'DICOM'
        }
      },
      {
        id: 'RAD-002',
        patientId: 'P-67890',
        patientName: 'Robert Kim',
        patientAge: 62,
        studyType: 'MRI Brain',
        bodyPart: 'Brain',
        urgency: 'Urgent',
        scheduledTime: '2025-09-24T15:00:00',
        status: 'Scheduled',
        technician: 'Lisa Wang',
        referringPhysician: 'Dr. James Wilson',
        clinicalHistory: 'Headache, vision changes, rule out mass',
        aiAnalysis: {
          completed: false,
          confidence: 0,
          findings: [],
          riskScore: 0
        },
        images: {
          total: 0,
          processed: 0,
          format: 'DICOM'
        }
      },
      {
        id: 'RAD-003',
        patientId: 'P-11111',
        patientName: 'Maria Garcia',
        patientAge: 34,
        studyType: 'X-Ray',
        bodyPart: 'Left Wrist',
        urgency: 'Routine',
        scheduledTime: '2025-09-24T15:30:00',
        status: 'Completed',
        technician: 'John Smith',
        referringPhysician: 'Dr. Anna Martinez',
        clinicalHistory: 'Fall, suspected fracture',
        aiAnalysis: {
          completed: true,
          confidence: 0.96,
          findings: ['Distal radius fracture confirmed', 'No displacement'],
          riskScore: 0.3
        },
        images: {
          total: 2,
          processed: 2,
          format: 'DICOM'
        }
      }
    ];
    
    setStudies(mockStudies);
  }, []);

  // Soft-coded AI analysis function
  const performAIAnalysis = async (studyId) => {
    setLoading(true);
    try {
      // Simulate AI analysis - in production, this would call the AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAIResult = {
        completed: true,
        confidence: 0.92,
        findings: ['Analysis completed successfully', 'No critical findings detected'],
        riskScore: Math.random() * 0.5,
        processingTime: '2.3s',
        modelVersion: 'v2.1.0'
      };
      
      setAiAnalysisResults(prev => ({
        ...prev,
        [studyId]: mockAIResult
      }));
      
      // Update study with AI results
      setStudies(prev => prev.map(study => 
        study.id === studyId 
          ? { ...study, aiAnalysis: mockAIResult }
          : study
      ));
      
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadgeColor = (urgency) => {
    switch (urgency) {
      case 'STAT': return 'danger';
      case 'Urgent': return 'warning';
      case 'Routine': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Scheduled': return 'info';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const renderStudyModal = () => {
    if (!selectedStudy) return null;

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaXRay className="me-2" />
            Study Details - {selectedStudy.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <h6>Patient Information</h6>
              <p><strong>Name:</strong> {selectedStudy.patientName}</p>
              <p><strong>Age:</strong> {selectedStudy.patientAge}</p>
              <p><strong>Patient ID:</strong> {selectedStudy.patientId}</p>
              
              <h6 className="mt-3">Study Information</h6>
              <p><strong>Type:</strong> {selectedStudy.studyType}</p>
              <p><strong>Body Part:</strong> {selectedStudy.bodyPart}</p>
              <p><strong>Scheduled:</strong> {new Date(selectedStudy.scheduledTime).toLocaleString()}</p>
              <p><strong>Technician:</strong> {selectedStudy.technician}</p>
              <p><strong>Referring Physician:</strong> {selectedStudy.referringPhysician}</p>
            </div>
            
            <div className="col-md-6">
              <h6>Clinical History</h6>
              <p className="bg-light p-2 rounded">{selectedStudy.clinicalHistory}</p>
              
              <h6 className="mt-3">Image Details</h6>
              <p><strong>Total Images:</strong> {selectedStudy.images.total}</p>
              <p><strong>Processed:</strong> {selectedStudy.images.processed}</p>
              <p><strong>Format:</strong> {selectedStudy.images.format}</p>
              
              {selectedStudy.images.total > 0 && (
                <ProgressBar 
                  now={(selectedStudy.images.processed / selectedStudy.images.total) * 100}
                  label={`${selectedStudy.images.processed}/${selectedStudy.images.total}`}
                  variant="success"
                />
              )}
            </div>
          </div>
          
          {/* AI Analysis Section */}
          {selectedStudy.aiAnalysis.completed && (
            <div className="mt-4">
              <h6>
                <FaBrain className="me-2 text-success" />
                AI Analysis Results
              </h6>
              <Alert variant="success">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span><strong>Confidence Score:</strong></span>
                  <Badge bg="success">{(selectedStudy.aiAnalysis.confidence * 100).toFixed(1)}%</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span><strong>Risk Score:</strong></span>
                  <Badge bg={selectedStudy.aiAnalysis.riskScore > 0.7 ? 'danger' : 'success'}>
                    {(selectedStudy.aiAnalysis.riskScore * 100).toFixed(1)}%
                  </Badge>
                </div>
                
                <h6 className="mt-3">Key Findings:</h6>
                <ul className="mb-0">
                  {selectedStudy.aiAnalysis.findings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <FaPrint className="me-2" />
            Print Report
          </Button>
          <Button variant="success">
            <FaDownload className="me-2" />
            Download DICOM
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <Card className="h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaXRay className="me-2 text-primary" />
            <h5 className="mb-0">Advanced Radiology Workflow</h5>
          </div>
          <div className="d-flex align-items-center">
            <Badge bg="success" className="me-2">
              <FaRobot className="me-1" />
              AI Enabled
            </Badge>
            <Badge bg="info">{studies.length} Studies</Badge>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Patient</th>
                <th>Study Type</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>AI Analysis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((study) => (
                <tr key={study.id}>
                  <td>
                    <div>
                      <strong>{study.patientName}</strong><br />
                      <small className="text-muted">{study.patientId}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      {study.studyType}<br />
                      <small className="text-muted">{study.bodyPart}</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getUrgencyBadgeColor(study.urgency)}>
                      {study.urgency}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeColor(study.status)}>
                      {study.status}
                    </Badge>
                    <br />
                    <small className="text-muted">
                      <FaClock className="me-1" />
                      {new Date(study.scheduledTime).toLocaleTimeString()}
                    </small>
                  </td>
                  <td>
                    {study.aiAnalysis.completed ? (
                      <div>
                        <ProgressBar 
                          now={study.aiAnalysis.confidence * 100} 
                          size="sm"
                          variant={study.aiAnalysis.confidence > 0.9 ? 'success' : 'warning'}
                        />
                        <small className="text-success">
                          <FaCheck className="me-1" />
                          {(study.aiAnalysis.confidence * 100).toFixed(1)}% Confidence
                        </small>
                      </div>
                    ) : study.status === 'Completed' ? (
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => performAIAnalysis(study.id)}
                        disabled={loading}
                      >
                        <FaBrain className="me-1" />
                        Run AI Analysis
                      </Button>
                    ) : (
                      <small className="text-muted">Pending imaging</small>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => {
                          setSelectedStudy(study);
                          setShowModal(true);
                        }}
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-success"
                        disabled={!study.aiAnalysis.completed}
                      >
                        <FaDownload />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {renderStudyModal()}
    </>
  );
};

export default RadiologyWorkflowWidget;