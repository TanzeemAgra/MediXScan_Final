import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const Anonymizer = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleAnonymize = async () => {
    setError(null);
    setProcessing(true);
    try {
      // Placeholder anonymization: mask numbers and emails
      let masked = text.replace(/\b\d{6,}\b/g, '[[ID]]');
      masked = masked.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[[EMAIL]]');
      setResult(masked);
    } catch (err) {
      setError(err.message || 'Anonymization failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4>Anonymizer</h4>
          <p className="text-muted">Quick anonymization for free-text reports (placeholder implementation).</p>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Report Text</Form.Label>
            <Form.Control as="textarea" rows={10} value={text} onChange={(e) => setText(e.target.value)} />
          </Form.Group>

          <Button onClick={handleAnonymize} disabled={processing} variant="primary">
            {processing ? 'Processing...' : 'Anonymize'}
          </Button>

          {result && (
            <div className="mt-4">
              <h5>Anonymized Result</h5>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Anonymizer;
