import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal, Tab, Nav } from 'react-bootstrap';
import correctionService from '../../services/correction.service';
import { useURLManager, parseQueryParams } from '../../utils/url.utils';
import EnhancedErrorDisplay from '../../components/EnhancedErrorDisplay';
import errorHighlightingService from '../../services/error-highlighting.service';
import { medicalCorrectionConfig, correctionUtils } from '../../config/medical-correction.config';
// Connection components temporarily removed

// RAG Animation Styles
const ragStyles = `
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .rag-indicator {
    background: linear-gradient(45deg, #28a745, #20c997);
    color: white;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 10px;
  }
  
  .medical-db-processing {
    color: #007bff;
    font-size: 0.75rem;
    animation: fadeInOut 2s ease-in-out infinite;
  }
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;

// Inject styles and global functions
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = ragStyles;
  document.head.appendChild(styleSheet);
  
  // Global function for error detail display (soft-coded approach)
  window.showErrorDetails = function(element) {
    const errorType = element.getAttribute('data-error-type') || 'unknown';
    const original = element.getAttribute('data-original') || '';
    const suggestion = element.getAttribute('data-suggestion') || '';
    const source = element.getAttribute('data-source') || 'Medical AI';
    const confidence = element.getAttribute('data-confidence') || 'N/A';
    
    const isRAG = element.querySelector('.rag-badge') !== null;
    
    const message = `
🔍 Error Details:
• Type: ${errorType.charAt(0).toUpperCase() + errorType.slice(1)}
• Original: "${original}"
• Suggestion: "${suggestion}"
• Source: ${source}${isRAG ? ' (RAG-Enhanced)' : ''}
• Confidence: ${typeof confidence === 'number' ? Math.round(confidence * 100) + '%' : confidence}
    `.trim();
    
    alert(message);
  };
}

const ReportCorrection = () => {
  const [recordId, setRecordId] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [highlighted, setHighlighted] = useState('');
  
  // URL management for soft-coded URLs
  const urlManager = useURLManager();
  
  // Parse URL parameters on mount (useful for pre-filling forms from external links)
  React.useEffect(() => {
    const urlParams = parseQueryParams();
    if (urlParams.recordId) {
      setRecordId(urlParams.recordId);
    }
    if (urlParams.prefillText) {
      setText(decodeURIComponent(urlParams.prefillText));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = { record_id: recordId, report_text: text };
      const res = await correctionService.submit(payload);
      
      // Handle new backend response format
      if (res && res.analysis) {
        const analysisData = res.analysis;
        const result = {
          request_id: res.correction_request?.record_id || `submit-${Date.now()}`,
          status: 'completed',
          analysis: analysisData,
          original_text: res.original_text || text,
          corrected_text: res.corrected_text || text,
          versions: [
            {
              version_id: `v-submit-${Date.now()}`,
              findings: analysisData.corrections || [],
              corrections: analysisData.corrections || [],
              confidence_score: analysisData.summary?.confidence_score || 0
            }
          ]
        };
        setResult(result);
        setHighlighted(res.corrected_text || text);
      } else {
        // Handle old format
        setResult(res);
        const latestVersion = res.versions && res.versions.length ? res.versions[0] : null;
        const corrections = latestVersion && latestVersion.corrections ? latestVersion.corrections : null;
        if (corrections && corrections.grammar) {
          const g = corrections.grammar;
          setHighlighted(g.explain ? g.explain.join('\n') : (latestVersion.findings || text));
        } else if (latestVersion) {
          setHighlighted(latestVersion.findings || text);
        } else {
          setHighlighted(text);
        }
      }
      setShowModal(true);
    } catch (err) {
      // If unauthorized or network issue, provide a local demo fallback so UX can continue
      const msg = err?.message || String(err) || 'Submission failed';
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('network')) {
        // Build a lightweight local correction result for demo purposes
        const localRes = {
          request_id: `local-${Date.now()}`,
          status: 'local-demo',
          versions: [
            {
              version_id: `v1-local-${Date.now()}`,
              findings: localCorrection(text),
              corrections: {
                grammar: { explain: ['Local demo: minor grammar/fluency fixes applied.'] },
                medical: { explain: ['Local demo: no ontology lookup available.'] }
              },
              confidence_score: 0.6
            }
          ]
        };

        setResult(localRes);
        setHighlighted(localRes.versions[0].findings);
        setShowModal(true);
        setError('You are not authenticated — showing a local demo correction.');
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnalyzeOnly = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await correctionService.analyze(text);
      
      // Handle new backend response format
      if (res && res.analysis) {
        const analysisData = res.analysis;
        const demo = {
          request_id: `analysis-${Date.now()}`,
          status: 'analysis',
          analysis: analysisData,
          original_text: res.original_text || text,
          corrected_text: res.corrected_text || text,
          versions: [
            {
              version_id: `v-analysis-${Date.now()}`,
              findings: analysisData.corrections || [],
              corrections: analysisData.corrections || [],
              confidence_score: analysisData.summary?.confidence_score || 0
            }
          ]
        };
        setResult(demo);
        setHighlighted(res.corrected_text || text);
        setShowModal(true);
      } else {
        // Fallback for old format
        const demo = {
          request_id: `analysis-${Date.now()}`,
          status: 'analysis',
          versions: [
            {
              version_id: `v-analysis-${Date.now()}`,
              findings: res.findings || [],
              corrections: res.corrections || [],
              confidence_score: res.confidence_score || 0
            }
          ]
        };
        setResult(demo);
        setHighlighted(text);
        setShowModal(true);
      }
    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Comprehensive 4-module correction system with soft coding
  const localCorrection = (inputText) => {
    if (!inputText) return '';
    
    // Apply comprehensive correction modules
    let correctedText = inputText;
    let allCorrections = [];
    
    // Module 1: Letter Repetition Detection & Correction
    if (medicalCorrectionConfig.letterRepetition.enabled) {
      const letterResult = correctionUtils.applyLetterRepetitionCorrections(correctedText, medicalCorrectionConfig);
      correctedText = letterResult.text;
      allCorrections = [...allCorrections, ...letterResult.corrections];
    }
    
    // Module 2: Medical Terms & Abbreviations
    if (medicalCorrectionConfig.medicalTerms.enabled) {
      const medicalResult = correctionUtils.applyMedicalCorrections(correctedText, medicalCorrectionConfig);
      correctedText = medicalResult.text;
      allCorrections = [...allCorrections, ...medicalResult.corrections];
    }
    
    // Module 3: Spelling Corrections
    if (medicalCorrectionConfig.spelling.enabled) {
      medicalCorrectionConfig.spelling.corrections.forEach(correction => {
        if (correction.confidence >= medicalCorrectionConfig.spelling.minimumConfidence) {
          const regex = new RegExp(`\\b${correction.from}\\b`, 'gi');
          const matches = correctedText.match(regex);
          if (matches) {
            matches.forEach(match => {
              allCorrections.push({
                type: 'Spelling',
                original: match,
                corrected: correction.to,
                confidence: correction.confidence
              });
            });
            correctedText = correctedText.replace(regex, correction.to);
          }
        }
      });
    }
    
    // Module 4: Grammar Corrections
    if (medicalCorrectionConfig.grammar.enabled) {
      medicalCorrectionConfig.grammar.rules.forEach(rule => {
        if (rule.patterns) {
          rule.patterns.forEach(pattern => {
            if (pattern.confidence >= medicalCorrectionConfig.grammar.minimumConfidence) {
              const matches = correctedText.match(pattern.from);
              if (matches) {
                matches.forEach(match => {
                  allCorrections.push({
                    type: 'Grammar',
                    original: match,
                    corrected: pattern.to,
                    confidence: pattern.confidence
                  });
                });
                correctedText = correctedText.replace(pattern.from, pattern.to);
              }
            }
          });
        }
      });
    }
    
    // Validate medical term preservation
    const validation = correctionUtils.validateMedicalTerms(correctedText, medicalCorrectionConfig.medicalTerms.protectedTerms);
    
    // Log corrections for analysis
    if (medicalCorrectionConfig.global.logCorrections && allCorrections.length > 0) {
      console.log('🏥 MediXScan Comprehensive Corrections Applied:', {
        totalCorrections: allCorrections.length,
        modules: [...new Set(allCorrections.map(c => c.type))],
        medicalTermsPreserved: validation.preservationRate,
        corrections: allCorrections
      });
    }
    
    return correctedText;
  };

  const handleShareReport = async () => {
    try {
      // Build a shareable URL with current parameters
      const params = {};
      if (recordId) params.recordId = recordId;
      if (text) params.prefillText = encodeURIComponent(text);
      
      const shareableUrl = urlManager.urls.reportCorrection(params);
      const success = await urlManager.shareURL(
        shareableUrl, 
        'MediXScan Report Correction', 
        'Check out this radiology report correction system'
      );
      
      if (!success) {
        // Fallback: show URL in modal or alert
        alert(`Share URL: ${shareableUrl}`);
      }
    } catch (err) {
      console.error('Failed to share:', err);
      // Fallback to current page URL
      const currentUrl = urlManager.getCurrentBaseURL() + '/radiology/report-correction';
      alert(`Share URL: ${currentUrl}`);
    }
  };

  return (
    <Container className="py-4">
        {/* Connection Status Display - Temporarily disabled */}
        
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4>Report Correction</h4>
                <p className="text-muted mb-0">Comprehensive error detection with 4 modules: Grammar, Letter Repetition, Medical Terms, and Spelling correction.</p>
              </div>
              {/* Connection Status temporarily disabled */}
            </div>
          </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Medical Record ID</Form.Label>
              <Form.Control value={recordId} onChange={(e) => setRecordId(e.target.value)} placeholder="e.g. MR00000001" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Report Text</Form.Label>
              <Form.Control as="textarea" rows={10} value={text} onChange={(e) => setText(e.target.value)} required />
            </Form.Group>

            <div className="d-flex gap-2 align-items-center">
              <Button type="submit" variant="primary" disabled={submitting} className="position-relative">
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    <span>RAG Processing...</span>
                    <div className="position-absolute top-0 start-100 translate-middle">
                      <span className="badge bg-info rounded-pill animate-pulse">
                        🧠 AI
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    Submit for Correction
                    <div className="position-absolute top-0 start-100 translate-middle">
                      <span className="badge bg-success rounded-pill" title="RAG-Enhanced Medical AI">
                        🏥 RAG
                      </span>
                    </div>
                  </>
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                disabled={submitting} 
                onClick={handleAnalyzeOnly}
                className="position-relative"
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Medical DB Analysis...
                  </>
                ) : (
                  'Analyze Only'
                )}
              </Button>
              {submitting && (
                <div className="d-flex align-items-center text-info">
                  <small>
                    <div className="d-flex align-items-center">
                      <div className="spinner-grow spinner-grow-sm me-2" style={{width: '0.5rem', height: '0.5rem'}}></div>
                      <span>Querying RadLex & SNOMED databases...</span>
                    </div>
                  </small>
                </div>
              )}
              <Button 
                variant="outline-info" 
                onClick={() => handleShareReport()}
                title="Share this report correction page"
              >
                Share
              </Button>
            </div>
            
            {/* Comprehensive Module Status Indicators */}
            <div className="mt-2">
              <div className="d-flex flex-column gap-2">
                {/* RAG Status */}
                <div className="d-flex align-items-center gap-3">
                  <small className="text-muted d-flex align-items-center">
                    <span className="badge bg-success me-2">🏥</span>
                    <strong>RAG-Enhanced:</strong> Medical terminology powered by RadLex, SNOMED CT, and ICD-10 databases
                  </small>
                  {result?.analysis?.metadata?.rag_enabled && (
                    <small className="text-success">
                      ✅ {result.analysis.metadata.rag_corrections || 0} RAG corrections applied
                    </small>
                  )}
                </div>
                
                {/* Comprehensive Module Status */}
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <small className="text-muted">
                    <strong>Active Correction Modules:</strong>
                  </small>
                  <div className="d-flex gap-2 flex-wrap">
                    {medicalCorrectionConfig.letterRepetition.enabled && (
                      <span className="badge bg-primary" title="Letter Repetition Detection">
                        🔤 Letter Repetition
                      </span>
                    )}
                    {medicalCorrectionConfig.spelling.enabled && (
                      <span className="badge bg-info" title="Spelling Correction">
                        📝 Spelling
                      </span>
                    )}
                    {medicalCorrectionConfig.medicalTerms.enabled && (
                      <span className="badge bg-success" title="Medical Terms Standardization">
                        🏥 Medical Terms
                      </span>
                    )}
                    {medicalCorrectionConfig.grammar.enabled && (
                      <span className="badge bg-warning text-dark" title="Grammar Correction">
                        📖 Grammar
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Protection Status */}
                <div className="d-flex align-items-center gap-2">
                  <small className="text-success d-flex align-items-center">
                    <span className="badge bg-success me-2">🛡️</span>
                    <strong>Medical Term Protection:</strong> {medicalCorrectionConfig.medicalTerms.protectedTerms.length} critical terms protected
                  </small>
                </div>
              </div>
            </div>
          </Form>

          {result && (
            <div className="mt-4">
              <h5>Request Created</h5>
              <p className="text-success">Your request has been created. A preview is shown in the popup.</p>
              <Button variant="secondary" onClick={() => setShowModal(true)}>Open Result</Button>
            </div>
          )}

          <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>📋 Enhanced Report Analysis & Correction</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <EnhancedErrorDisplay 
                originalText={text}
                result={result}
                onClose={() => setShowModal(false)}
              />
            </Modal.Body>
            <Modal.Footer>
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="text-muted">
                  <small>💡 Tip: Use the tabs above to explore different views of your corrections</small>
                </div>
                <Button variant="primary" onClick={() => setShowModal(false)}>
                  ✅ Close Analysis
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportCorrection;
