import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Card, Form, Button, Alert, Row, Col, Tab, Nav, 
  Badge, ProgressBar, Modal, Accordion, Table, Dropdown 
} from 'react-bootstrap';
import advancedAnonymizationService from '../../services/advanced-anonymization.service';
import anonymizationConfigService from '../../services/anonymization-config.service';

const Anonymizer = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [detections, setDetections] = useState([]);
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [sensitivity, setSensitivity] = useState('medium');
  const [complianceFramework, setComplianceFramework] = useState('HIPAA');
  const [anonymizationStrategy, setAnonymizationStrategy] = useState('REPLACEMENT');
  const [showSettings, setShowSettings] = useState(false);
  const [realTimePreview, setRealTimePreview] = useState(true);
  const [selectedDetections, setSelectedDetections] = useState(new Set());
  const [customRules, setCustomRules] = useState({});
  const textAreaRef = useRef(null);

  // Real-time preview when text changes
  useEffect(() => {
    if (realTimePreview && text.trim()) {
      const timeoutId = setTimeout(() => {
        performAnalysis(text, false);
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(timeoutId);
    } else if (!text.trim()) {
      setDetections([]);
      setInsights(null);
      setResult(null);
    }
  }, [text, sensitivity, realTimePreview]);

  const performAnalysis = async (inputText, fullAnonymization = true) => {
    if (!inputText.trim()) return;

    try {
      // Get insights first
      const analysisInsights = advancedAnonymizationService.getAnonymizationInsights(inputText);
      setInsights(analysisInsights);

      // Detect sensitive data
      const detectedData = advancedAnonymizationService.detectSensitiveData(inputText, sensitivity);
      setDetections(detectedData);

      if (fullAnonymization) {
        // Perform full anonymization
        const anonymizationOptions = {
          preserveStructure: true,
          useContextualReplacement: anonymizationStrategy !== 'SUPPRESSION',
          anonymizationLevel: sensitivity
        };

        const anonymizationResult = advancedAnonymizationService.anonymizeText(
          inputText, 
          detectedData, 
          anonymizationOptions
        );

        setResult(anonymizationResult);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze text: ' + err.message);
    }
  };

  const handleAnonymize = async () => {
    setError(null);
    setProcessing(true);
    
    try {
      await performAnalysis(text, true);
      if (detections.length > 0) {
        setActiveTab('results');
      }
    } catch (err) {
      setError(err.message || 'Anonymization failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDetectionToggle = (detectionIndex) => {
    const newSelected = new Set(selectedDetections);
    if (newSelected.has(detectionIndex)) {
      newSelected.delete(detectionIndex);
    } else {
      newSelected.add(detectionIndex);
    }
    setSelectedDetections(newSelected);
  };

  const handleCustomAnonymization = () => {
    if (selectedDetections.size === 0) {
      setError('Please select at least one detection to anonymize');
      return;
    }

    const selectedDetectionsList = detections.filter((_, index) => 
      selectedDetections.has(index)
    );

    const anonymizationResult = advancedAnonymizationService.anonymizeText(
      text, 
      selectedDetectionsList, 
      {
        preserveStructure: true,
        useContextualReplacement: anonymizationStrategy !== 'SUPPRESSION',
        anonymizationLevel: sensitivity
      }
    );

    setResult(anonymizationResult);
    setActiveTab('results');
  };

  const getSensitivityColor = (confidence) => {
    if (confidence >= 0.9) return 'danger';
    if (confidence >= 0.7) return 'warning';
    return 'info';
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h4>🔒 Advanced Medical Data Anonymizer</h4>
            <p className="text-muted mb-0">
              AI-powered sensitive data detection and anonymization with HIPAA compliance
            </p>
          </div>
          <div>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="me-2"
              onClick={() => setShowSettings(true)}
            >
              ⚙️ Settings
            </Button>
            <Form.Check 
              type="switch"
              id="real-time-preview"
              label="Real-time Preview"
              checked={realTimePreview}
              onChange={(e) => setRealTimePreview(e.target.checked)}
              className="d-inline-block"
            />
          </div>
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

          {/* Insights Panel */}
          {insights && (
            <Alert variant={getRiskLevelColor(insights.riskLevel)} className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Risk Level: {insights.riskLevel}</strong>
                  <span className="ms-3">
                    Compliance Score: <Badge bg={insights.complianceScore >= 80 ? 'success' : 'warning'}>
                      {insights.complianceScore}%
                    </Badge>
                  </span>
                  <span className="ms-3">
                    Detections: <Badge bg="info">{detections.length}</Badge>
                  </span>
                </div>
                <small>
                  Framework: <Badge bg="secondary">{complianceFramework}</Badge>
                </small>
              </div>
              
              {insights.recommendations.length > 0 && (
                <div className="mt-2">
                  <strong>Recommendations:</strong>
                  <ul className="mb-0 mt-1">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index}>
                        <Badge bg={rec.priority === 'HIGH' ? 'danger' : 'warning'} className="me-2">
                          {rec.priority}
                        </Badge>
                        {rec.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Alert>
          )}

          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="input">
                  📝 Input & Analysis
                  {detections.length > 0 && (
                    <Badge bg="danger" className="ms-2">{detections.length}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="detections" disabled={detections.length === 0}>
                  🔍 Detected Sensitive Data
                  {detections.length > 0 && (
                    <Badge bg="warning" className="ms-2">{detections.length}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="results" disabled={!result}>
                  ✅ Anonymized Results
                  {result && (
                    <Badge bg="success" className="ms-2">Ready</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="comparison" disabled={!result}>
                  🔄 Side-by-Side Comparison
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Input & Analysis Tab */}
              <Tab.Pane eventKey="input">
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Medical Report Text</strong>
                        <small className="text-muted ms-2">
                          Paste your medical report, lab results, or clinical notes
                        </small>
                      </Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={12}
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter or paste medical text here. The system will automatically detect sensitive information like patient names, IDs, dates, and contact information..."
                        ref={textAreaRef}
                        style={{ fontFamily: 'monospace' }}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Card className="mb-3">
                      <Card.Header>
                        <strong>Anonymization Settings</strong>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label>Sensitivity Level</Form.Label>
                          <Form.Select 
                            value={sensitivity} 
                            onChange={(e) => setSensitivity(e.target.value)}
                          >
                            <option value="low">Low - Basic detection</option>
                            <option value="medium">Medium - Balanced</option>
                            <option value="high">High - Strict detection</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Compliance Framework</Form.Label>
                          <Form.Select 
                            value={complianceFramework} 
                            onChange={(e) => setComplianceFramework(e.target.value)}
                          >
                            <option value="HIPAA">HIPAA (US Healthcare)</option>
                            <option value="GDPR">GDPR (EU Data Protection)</option>
                            <option value="CUSTOM">Custom Rules</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Anonymization Strategy</Form.Label>
                          <Form.Select 
                            value={anonymizationStrategy} 
                            onChange={(e) => setAnonymizationStrategy(e.target.value)}
                          >
                            <option value="REPLACEMENT">Token Replacement</option>
                            <option value="MASKING">Character Masking</option>
                            <option value="GENERALIZATION">Data Generalization</option>
                            <option value="SUPPRESSION">Complete Removal</option>
                          </Form.Select>
                        </Form.Group>
                      </Card.Body>
                    </Card>

                    {/* Quick Stats */}
                    {text && (
                      <Card>
                        <Card.Header>
                          <strong>Document Analysis</strong>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Characters:</span>
                            <Badge bg="secondary">{text.length.toLocaleString()}</Badge>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Words:</span>
                            <Badge bg="secondary">{text.split(/\s+/).length.toLocaleString()}</Badge>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Lines:</span>
                            <Badge bg="secondary">{text.split('\n').length.toLocaleString()}</Badge>
                          </div>
                          {detections.length > 0 && (
                            <div className="d-flex justify-content-between">
                              <span>Sensitive Items:</span>
                              <Badge bg="danger">{detections.length}</Badge>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-3">
                  <Button 
                    onClick={handleAnonymize} 
                    disabled={processing || !text.trim()} 
                    variant="primary"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      '🔒 Anonymize All Detected Data'
                    )}
                  </Button>
                  
                  {detections.length > 0 && (
                    <Button 
                      variant="outline-primary" 
                      size="lg"
                      onClick={() => setActiveTab('detections')}
                    >
                      🔍 Review Detections ({detections.length})
                    </Button>
                  )}
                </div>
              </Tab.Pane>

              {/* Detections Tab */}
              <Tab.Pane eventKey="detections">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Detected Sensitive Data ({detections.length} items)</h5>
                  <div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => setSelectedDetections(new Set(detections.map((_, i) => i)))}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => setSelectedDetections(new Set())}
                    >
                      Clear Selection
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={handleCustomAnonymization}
                      disabled={selectedDetections.size === 0}
                    >
                      Anonymize Selected ({selectedDetections.size})
                    </Button>
                  </div>
                </div>

                {detections.length === 0 ? (
                  <Alert variant="success">
                    <strong>No sensitive data detected!</strong>
                    <p className="mb-0">
                      This text appears to be safe for sharing. No personal identifiers, 
                      contact information, or other sensitive data was found.
                    </p>
                  </Alert>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th width="50">
                          <Form.Check 
                            type="checkbox"
                            checked={selectedDetections.size === detections.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDetections(new Set(detections.map((_, i) => i)));
                              } else {
                                setSelectedDetections(new Set());
                              }
                            }}
                          />
                        </th>
                        <th>Detected Value</th>
                        <th>Data Type</th>
                        <th>Category</th>
                        <th>Confidence</th>
                        <th>Context</th>
                        <th>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detections.map((detection, index) => (
                        <tr key={index}>
                          <td>
                            <Form.Check 
                              type="checkbox"
                              checked={selectedDetections.has(index)}
                              onChange={() => handleDetectionToggle(index)}
                            />
                          </td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">
                              {detection.value}
                            </code>
                          </td>
                          <td>
                            <Badge bg="info">{detection.type}</Badge>
                          </td>
                          <td>
                            <Badge bg="secondary">{detection.category}</Badge>
                          </td>
                          <td>
                            <Badge bg={getSensitivityColor(detection.confidence)}>
                              {(detection.confidence * 100).toFixed(1)}%
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              ...{detection.context.full.substring(0, 50)}...
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {detection.start}-{detection.end}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab.Pane>

              {/* Results Tab */}
              <Tab.Pane eventKey="results">
                {result ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Anonymized Results</h5>
                      <div>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => navigator.clipboard.writeText(result.anonymizedText)}
                        >
                          📋 Copy to Clipboard
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setActiveTab('comparison')}
                        >
                          🔄 Compare Side-by-Side
                        </Button>
                      </div>
                    </div>

                    <Alert variant="success" className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>
                          <strong>Anonymization Complete!</strong> 
                          {result.detections} sensitive data items were anonymized.
                        </span>
                        <Badge bg="success">
                          Safe for Sharing
                        </Badge>
                      </div>
                    </Alert>

                    <Card>
                      <Card.Header>
                        <strong>Anonymized Text</strong>
                      </Card.Header>
                      <Card.Body>
                        <pre 
                          style={{ 
                            whiteSpace: 'pre-wrap', 
                            backgroundColor: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #dee2e6',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                            maxHeight: '400px',
                            overflow: 'auto'
                          }}
                        >
                          {result.anonymizedText}
                        </pre>
                      </Card.Body>
                    </Card>

                    {/* Anonymization Summary */}
                    <Card className="mt-3">
                      <Card.Header>
                        <strong>Anonymization Summary</strong>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <h6>Detection Summary</h6>
                            <ul className="list-unstyled">
                              {Object.entries(result.summary.byCategory).map(([category, count]) => (
                                <li key={category} className="d-flex justify-content-between">
                                  <span>{category}:</span>
                                  <Badge bg="info">{count}</Badge>
                                </li>
                              ))}
                            </ul>
                          </Col>
                          <Col md={6}>
                            <h6>Confidence Levels</h6>
                            <div className="mb-2">
                              <small>High Confidence (&gt;80%)</small>
                              <ProgressBar 
                                variant="danger" 
                                now={result.summary.confidenceLevels.high} 
                                max={result.detections} 
                                label={result.summary.confidenceLevels.high}
                              />
                            </div>
                            <div className="mb-2">
                              <small>Medium Confidence (60-80%)</small>
                              <ProgressBar 
                                variant="warning" 
                                now={result.summary.confidenceLevels.medium} 
                                max={result.detections}
                                label={result.summary.confidenceLevels.medium}
                              />
                            </div>
                            <div>
                              <small>Low Confidence (&lt;60%)</small>
                              <ProgressBar 
                                variant="info" 
                                now={result.summary.confidenceLevels.low} 
                                max={result.detections}
                                label={result.summary.confidenceLevels.low}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </div>
                ) : (
                  <Alert variant="info">
                    <strong>No results yet.</strong>
                    <p className="mb-0">
                      Please run the anonymization process from the Input & Analysis tab first.
                    </p>
                  </Alert>
                )}
              </Tab.Pane>

              {/* Comparison Tab */}
              <Tab.Pane eventKey="comparison">
                {result ? (
                  <div>
                    <h5 className="mb-3">Side-by-Side Comparison</h5>
                    <Row>
                      <Col md={6}>
                        <Card>
                          <Card.Header className="bg-danger text-white">
                            <strong>⚠️ Original (Sensitive)</strong>
                          </Card.Header>
                          <Card.Body>
                            <pre 
                              style={{ 
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                                maxHeight: '500px',
                                overflow: 'auto'
                              }}
                            >
                              {text}
                            </pre>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card>
                          <Card.Header className="bg-success text-white">
                            <strong>✅ Anonymized (Safe)</strong>
                          </Card.Header>
                          <Card.Body>
                            <pre 
                              style={{ 
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                                maxHeight: '500px',
                                overflow: 'auto'
                              }}
                            >
                              {result.anonymizedText}
                            </pre>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Alert variant="info">
                    <strong>No comparison available.</strong>
                    <p className="mb-0">
                      Please run the anonymization process first to see the comparison.
                    </p>
                  </Alert>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Advanced Anonymization Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Detection Patterns</Accordion.Header>
              <Accordion.Body>
                <p>Configure custom detection patterns for your specific use case.</p>
                <Form.Group>
                  <Form.Label>Custom Regex Patterns</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Enter custom regex patterns, one per line..."
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1">
              <Accordion.Header>Anonymization Rules</Accordion.Header>
              <Accordion.Body>
                <p>Customize how different types of sensitive data should be anonymized.</p>
                <Form.Group className="mb-3">
                  <Form.Label>Name Replacement Strategy</Form.Label>
                  <Form.Select>
                    <option>Generic tokens ([PATIENT NAME])</option>
                    <option>Realistic synthetic names</option>
                    <option>Character masking (Jo** Do*)</option>
                  </Form.Select>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="2">
              <Accordion.Header>Compliance Settings</Accordion.Header>
              <Accordion.Body>
                <p>Configure compliance requirements and audit logging.</p>
                <Form.Check 
                  type="checkbox" 
                  label="Enable audit logging"
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox" 
                  label="Strict HIPAA compliance mode"
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox" 
                  label="Generate anonymization reports"
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowSettings(false)}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Anonymizer;
