import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal, Tab, Nav } from 'react-bootstrap';
import correctionService from '../../services/correction.service';
import { useURLManager, parseQueryParams } from '../../utils/url.utils';
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
      const payload = { medical_record_id: recordId, text };
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
    let out = inputText.trim();
    // Fix common double spaces and ensure period at end
    out = out.replace(/\s{2,}/g, ' ');
    if (!/[.?!]$/.test(out)) out = out + '.';
    // Simple replacements: 'pt' -> 'patient', 'pleural effusion' annotation
    out = out.replace(/\bpt\b/gi, 'patient');
    out = out.replace(/pleural effusion/gi, 'pleural effusion (small)');
    return out;
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

          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Correction Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tab.Container defaultActiveKey="highlighted">
                <Nav variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="highlighted">Highlighted Error</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="corrected">Corrected Report</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content className="mt-3">
                  <Tab.Pane eventKey="highlighted">
                    <h6>Highlights / Suggested edits</h6>
                    {/* Confidence summary */}
                    {result && result.versions && result.versions[0] && (
                      <div className="mb-2">
                        <strong>Confidence:</strong>
                        <div className="progress" style={{ height: '12px' }}>
                          <div className="progress-bar" role="progressbar" style={{ width: `${(result.versions[0].confidence_score || 0) * 100}%` }} aria-valuenow={(result.versions[0].confidence_score || 0) * 100} aria-valuemin="0" aria-valuemax="100">
                            {Math.round((result.versions[0].confidence_score || 0) * 100)}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Categorized corrections */}
                    <div className="mb-3">
                      <strong>Detected issues:</strong>
                      <ul>
                        {result && result.versions && result.versions[0] && result.versions[0].corrections && (
                          Object.keys(result.versions[0].corrections).map((k) => {
                            const correction = result.versions[0].corrections[k];
                            let displayText = '';
                            if (Array.isArray(correction.explain)) {
                              displayText = correction.explain.join('; ');
                            } else if (correction.explain) {
                              displayText = String(correction.explain);
                            } else {
                              displayText = JSON.stringify(correction);
                            }
                            return (
                              <li key={k}><strong>{k}</strong>: {displayText}</li>
                            );
                          })
                        )}
                      </ul>
                    </div>

                    <pre style={{ whiteSpace: 'pre-wrap' }}>{highlighted}</pre>
                  </Tab.Pane>
                  <Tab.Pane eventKey="corrected">
                    <h6>Corrected Report</h6>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{(result && result.versions && result.versions[0] && result.versions[0].findings) || text}</pre>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportCorrection;
