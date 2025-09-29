import React, { useState, useEffect } from 'react';
import { Card, Tab, Nav, Badge, Button, Tooltip, OverlayTrigger, Form, Row, Col } from 'react-bootstrap';
import errorHighlightingService from '../services/error-highlighting.service';
import { medicalCorrectionConfig } from '../config/medical-correction.config';
import '../assets/scss/error-highlighting.scss';

const EnhancedErrorDisplay = ({ originalText, result, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('highlighted');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedErrorTypes, setSelectedErrorTypes] = useState(['all']); // Dynamic error type filter

  useEffect(() => {
    if (originalText && result) {
      // Check if we have backend correction data
      const backendAnalysis = result.analysis || result;
      
      if (backendAnalysis && backendAnalysis.corrections) {
        // Use backend correction data with actual corrected text
        const analyzed = {
          originalText: originalText,
          correctedText: backendAnalysis.corrected_text || originalText,
          errors: backendAnalysis.corrections.map(correction => ({
            type: correction.error_type,
            position: correction.position,
            original: correction.error,
            suggestion: correction.suggestion,
            recommendation: correction.recommendation,
            confidence: correction.confidence
          })),
          statistics: backendAnalysis.summary || {}
        };
        setAnalysis(analyzed);
      } else {
        // Fallback to frontend analysis if no backend data
        const analyzed = errorHighlightingService.analyzeText(originalText);
        setAnalysis(analyzed);
      }
    }
  }, [originalText, result]);

  if (!analysis) {
    return <div className="text-center p-4">Analyzing text...</div>;
  }

  const renderErrorLegend = () => {
    const errorTypes = [...new Set(analysis.errors.map(error => error.type))];
    const colorScheme = errorHighlightingService.colorScheme;
    
    return (
      <div className="error-legend">
        <strong style={{ marginRight: '10px' }}>Error Types:</strong>
        {errorTypes.map(type => (
          <div key={type} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: colorScheme[type] || '#f8f9fa' }}
            ></div>
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderErrorStats = () => {
    const filteredErrors = getFilteredErrors();
    const stats = errorHighlightingService.getErrorStatistics(filteredErrors);
    
    return (
      <div className="error-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Issues</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.byType.grammar || 0}</div>
          <div className="stat-label">Grammar</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.byType.medical || 0 + stats.byType.spelling || 0}</div>
          <div className="stat-label">Medical Terms</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Math.round(stats.avgConfidence * 100)}%</div>
          <div className="stat-label">Confidence</div>
        </div>
      </div>
    );
  };

  const renderConfidenceBar = () => {
    const confidence = analysis.confidence * 100;
    
    return (
      <div className="confidence-indicator">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong>Correction Confidence:</strong>
          <Badge bg={confidence > 80 ? 'success' : confidence > 60 ? 'warning' : 'danger'}>
            {Math.round(confidence)}%
          </Badge>
        </div>
        <div className="confidence-bar">
          <div 
            className="confidence-fill" 
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    const recommendations = errorHighlightingService.generateRecommendations(analysis.errors);
    
    if (recommendations.length === 0) {
      return (
        <div className="recommendations-panel">
          <h6>🎉 Excellent! No major issues found.</h6>
          <p>Your medical report appears to be well-written with minimal corrections needed. This demonstrates good medical writing practices.</p>
        </div>
      );
    }
    
    return (
      <div className="recommendations-panel">
        <h6>📝 Professional Medical Writing Recommendations</h6>
        <p className="text-muted mb-3">
          <small>These suggestions help improve clarity, accuracy, and professionalism in medical documentation.</small>
        </p>
        {recommendations.map((rec, index) => (
          <div key={index} className={`recommendation-item priority-${rec.priority}`}>
            <div className="recommendation-title">
              {rec.category.includes('Medical') ? '🏥' : '📚'} {rec.category}
              <Badge 
                bg={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'success'} 
                className="ms-2"
              >
                {rec.priority}
              </Badge>
            </div>
            <div className="recommendation-message mb-2">{rec.message}</div>
            {rec.action && (
              <div className="text-muted" style={{ fontSize: '0.85em' }}>
                <strong>Action:</strong> {rec.action}
              </div>
            )}
            {rec.examples && rec.examples.length > 0 && (
              <div className="mt-2">
                <small className="text-muted">Examples:</small>
                <ul className="mb-0 mt-1" style={{ fontSize: '0.8em' }}>
                  {rec.examples.slice(0, 2).map((example, idx) => (
                    <li key={idx} className="text-muted">{example}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-3 p-2 bg-light rounded">
          <small className="text-muted">
            <strong>💡 Pro Tip:</strong> Regular use of standardized medical terminology and proper grammar 
            improves communication between healthcare professionals and reduces the risk of misinterpretation.
          </small>
        </div>
      </div>
    );
  };

  const renderComparisonView = () => {
    // Get detected errors for focused comparison
    const detectedErrors = analysis.errors || [];
    
    // Set the focused comparison configuration
    errorHighlightingService.focusedConfig = medicalCorrectionConfig.focusedComparison;
    
    const comparison = errorHighlightingService.generateComparisonHtml(
      originalText, 
      analysis.correctedText,
      detectedErrors
    );
    
    return (
      <div className="focused-diff-container">
        <div className="row">
          <div className="col-md-6">
            <div className="focused-diff-column">
              <h6 className="text-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Original Issues ({comparison.corrections?.length || 0})
              </h6>
              <div 
                className="focused-comparison-content"
                dangerouslySetInnerHTML={{ __html: comparison.originalHtml }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="focused-diff-column">
              <h6 className="text-success">
                <i className="fas fa-check-circle me-2"></i>
                Corrected Words ({comparison.corrections?.length || 0})
              </h6>
              <div 
                className="focused-comparison-content"
                dangerouslySetInnerHTML={{ __html: comparison.correctedHtml }}
              />
            </div>
          </div>
        </div>
        
        {comparison.corrections?.length > 0 && (
          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="text-info">
              <i className="fas fa-info-circle me-2"></i>
              Correction Summary
            </h6>
            <div className="row text-center">
              <div className="col-md-3">
                <div className="text-primary h4">{comparison.corrections.length}</div>
                <small className="text-muted">Total Corrections</small>
              </div>
              <div className="col-md-3">
                <div className="text-success h4">
                  {Math.round(comparison.corrections.reduce((acc, c) => acc + c.confidence, 0) / comparison.corrections.length * 100)}%
                </div>
                <small className="text-muted">Avg Confidence</small>
              </div>
              <div className="col-md-3">
                <div className="text-info h4">
                  {[...new Set(comparison.corrections.map(c => c.type))].length}
                </div>
                <small className="text-muted">Error Types</small>
              </div>
              <div className="col-md-3">
                <div className="text-warning h4">
                  {comparison.corrections.filter(c => c.confidence < 0.8).length}
                </div>
                <small className="text-muted">Low Confidence</small>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleErrorClick = (event) => {
    const errorElement = event.target.closest('.error-highlight');
    if (errorElement) {
      errorElement.classList.add('animate');
      setTimeout(() => {
        errorElement.classList.remove('animate');
      }, 500);
    }
  };

  // Get available error types dynamically
  const availableErrorTypes = analysis ? [...new Set(analysis.errors.map(error => error.error_type || error.type || 'other'))] : [];
  
  // Filter errors based on selected types
  const getFilteredErrors = () => {
    if (!analysis || selectedErrorTypes.includes('all')) {
      return analysis?.errors || [];
    }
    return analysis.errors.filter(error => selectedErrorTypes.includes(error.error_type || error.type || 'other'));
  };

  // Handle error type filter changes
  const handleErrorTypeChange = (errorType, checked) => {
    if (errorType === 'all') {
      setSelectedErrorTypes(['all']);
    } else {
      let newTypes = selectedErrorTypes.filter(t => t !== 'all');
      if (checked) {
        newTypes = [...newTypes, errorType];
      } else {
        newTypes = newTypes.filter(t => t !== errorType);
      }
      setSelectedErrorTypes(newTypes.length === 0 ? ['all'] : newTypes);
    }
  };

  // Generate highlighted HTML for filtered errors
  const getFilteredHighlightedHtml = () => {
    if (!analysis) return '';
    
    const filteredErrors = getFilteredErrors();
    
    // If no errors or all errors filtered out, return original text
    if (filteredErrors.length === 0) {
      return analysis.originalText || '';
    }
    
    // Use enhanced RAG highlighting if available
    try {
      if (errorHighlightingService.highlightErrorsWithRAG) {
        return errorHighlightingService.highlightErrorsWithRAG(analysis.originalText, filteredErrors);
      } else if (errorHighlightingService.highlightErrors) {
        return errorHighlightingService.highlightErrors(analysis.originalText, filteredErrors);
      } else {
        // Fallback to pre-generated highlighted HTML
        return analysis.highlightedHtml || analysis.originalText || '';
      }
    } catch (error) {
      console.warn('Error highlighting failed, using fallback:', error);
      return analysis.highlightedHtml || analysis.originalText || '';
    }
  };

  return (
    <div className="enhanced-error-display">
      {/* Header with statistics */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>📊 Analysis Results</h5>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => setShowRecommendations(!showRecommendations)}
          >
            {showRecommendations ? 'Hide' : 'Show'} Recommendations
          </Button>
        </div>
        
        {/* Dynamic Error Type Filters */}
        {availableErrorTypes.length > 0 && (
          <Card className="mb-3">
            <Card.Body className="py-2">
              <Row>
                <Col>
                  <div className="d-flex align-items-center">
                    <strong className="me-3">🔍 Filter by Error Type:</strong>
                    <Form.Check
                      type="checkbox"
                      id="filter-all"
                      label="All Types"
                      checked={selectedErrorTypes.includes('all')}
                      onChange={(e) => handleErrorTypeChange('all', e.target.checked)}
                      className="me-3"
                    />
                    {availableErrorTypes.map(errorType => (
                      <Form.Check
                        key={errorType}
                        type="checkbox"
                        id={`filter-${errorType}`}
                        label={
                          <span>
                            {errorType === 'medical_terminology' ? '🏥 Medical Terminology' : 
                             errorType === 'spelling' ? '📝 Spelling' : 
                             errorType === 'grammar' ? '✏️ Grammar' :
                             errorType === 'punctuation' ? '📍 Punctuation' : 
                             `📋 ${errorType.charAt(0).toUpperCase() + errorType.slice(1)}`}
                            <Badge bg="secondary" className="ms-1">
                              {analysis.errors.filter(e => (e.error_type || e.type || 'other') === errorType).length}
                            </Badge>
                          </span>
                        }
                        checked={selectedErrorTypes.includes(errorType)}
                        onChange={(e) => handleErrorTypeChange(errorType, e.target.checked)}
                        className="me-3"
                      />
                    ))}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
        
        {renderErrorStats()}
        {renderConfidenceBar()}
        {renderErrorLegend()}
      </div>

      {/* Recommendations panel */}
      {showRecommendations && renderRecommendations()}

      {/* Tabbed content */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="comparison-tabs">
          <Nav.Item>
            <Nav.Link eventKey="highlighted">
              🔍 Highlighted Errors
              {getFilteredErrors().length > 0 && (
                <Badge bg="danger" className="ms-2">{getFilteredErrors().length}</Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="comparison">
              📋 Side-by-Side Comparison
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="corrected">
              ✅ Final Corrected Text
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="highlighted">
            <div className="comparison-content">
              <h6>🔍 Highlighted Issues and Suggestions</h6>
              <div className="mb-3">
                <small className="text-muted">
                  Click on highlighted text to see details. Hover for quick info.
                </small>
              </div>
              <div 
                className="report-text"
                dangerouslySetInnerHTML={{ __html: getFilteredHighlightedHtml() }}
                onClick={handleErrorClick}
              />
              
              {/* Detailed error list */}
              {getFilteredErrors().length > 0 && (
                <div className="mt-4">
                  <h6>📝 Detailed Issue List</h6>
                  <div className="list-group">
                    {getFilteredErrors().map((error, index) => (
                      <div key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1 text-capitalize">{error.type} Issue</h6>
                            <p className="mb-1">{error.message}</p>
                            <small className="text-muted">
                              "{error.original}" → "{error.suggestion || error.replacement}"
                            </small>
                          </div>
                          <Badge bg={error.confidence > 0.8 ? 'success' : error.confidence > 0.6 ? 'warning' : 'secondary'}>
                            {Math.round(error.confidence * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="comparison">
            <div className="comparison-content">
              <h6>🎯 Focused Word-by-Word Comparison</h6>
              <div className="mb-3">
                <small className="text-info">
                  <i className="fas fa-info-circle me-1"></i>
                  <strong>Shows only corrected words</strong> instead of entire report content for focused review
                </small>
              </div>
              {renderComparisonView()}
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="corrected">
            <div className="comparison-content">
              <h6>✅ Final Corrected Medical Report</h6>
              <div className="mb-3">
                <small className="text-success">
                  This is your corrected text ready for use in medical documentation.
                </small>
              </div>
              <div className="report-text" style={{ backgroundColor: '#f8fff8', padding: '15px', borderRadius: '6px', border: '1px solid #28a745' }}>
                {analysis.correctedText}
              </div>
              
              <div className="mt-3 d-flex gap-2">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Copy corrected text to clipboard</Tooltip>}
                >
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(analysis.correctedText);
                      // Could add toast notification here
                    }}
                  >
                    📋 Copy Text
                  </Button>
                </OverlayTrigger>
                
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Download as text file</Tooltip>}
                >
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([analysis.correctedText], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'corrected-medical-report.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    💾 Download
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default EnhancedErrorDisplay;