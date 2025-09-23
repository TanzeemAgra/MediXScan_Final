import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal, Tab, Nav } from 'react-bootstrap';
import correctionService from '../../services/correction.service';
import { useURLManager, parseQueryParams } from '../../utils/url.utils';
import EnhancedErrorDisplay from '../../components/EnhancedErrorDisplay';
import errorHighlightingService from '../../services/error-highlighting.service';
// Connection components temporarily removed

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
      setResult(res);
      // Build highlighted view from returned corrections if available
      const latestVersion = res.versions && res.versions.length ? res.versions[0] : null;
      const corrections = latestVersion && latestVersion.corrections ? latestVersion.corrections : null;
      if (corrections && corrections.grammar) {
        // If grammar explain text available, use it; otherwise show raw findings
        const g = corrections.grammar;
        setHighlighted(g.explain ? g.explain.join('\n') : (latestVersion.findings || text));
      } else if (latestVersion) {
        setHighlighted(latestVersion.findings || text);
      } else {
        setHighlighted(text);
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
      // Build a result-like object used by modal
      const demo = {
        request_id: `analysis-${Date.now()}`,
        status: 'analysis',
        versions: [
          {
            version_id: `v-analysis-${Date.now()}`,
            findings: res.findings,
            corrections: res.corrections,
            confidence_score: res.confidence_score
          }
        ]
      };
      setResult(demo);
      setHighlighted((res.corrections && res.corrections.grammar && res.corrections.grammar.explain)
        ? res.corrections.grammar.explain.join('\n')
        : (res.findings || text));
      setShowModal(true);
    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Simple client-side correction stub: minor grammar fixes and punctuation normalization
  const localCorrection = (inputText) => {
    if (!inputText) return '';
    
    // Use the enhanced error detection service for better corrections
    const analysis = errorHighlightingService.analyzeText(inputText);
    return analysis.correctedText;
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
                <p className="text-muted mb-0">Submit an imaging report for grammar and medical term correction.</p>
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

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit for Correction'}
              </Button>
              <Button 
                variant="outline-secondary" 
                disabled={submitting} 
                onClick={handleAnalyzeOnly}
              >
                {submitting ? 'Analyzing...' : 'Analyze Only'}
              </Button>
              <Button 
                variant="outline-info" 
                onClick={() => handleShareReport()}
                title="Share this report correction page"
              >
                Share
              </Button>
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
