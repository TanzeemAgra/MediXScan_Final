// Port Detection Test Component
// Quick test to verify the port detection system works properly

import React from 'react';
import { Container, Card, Button, Badge } from 'react-bootstrap';
import { usePortDetection, ConnectionStatus } from '../utils/port-detection.utils.jsx';
import { useURLManager } from '../utils/url.utils';

const PortDetectionTest = () => {
  const { portInfo, loading, error, buildURL, refresh } = usePortDetection();
  const urlManager = useURLManager();

  const testUrls = [
    { name: 'Report Correction', url: urlManager.urls.reportCorrection() },
    { name: 'Radiology Dashboard', url: urlManager.urls.radiologyDashboard() },
    { name: 'Anonymizer', url: urlManager.urls.anonymizer() },
  ];

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4>🔍 Port Detection Test</h4>
          <p className="text-muted mb-0">Testing soft-coded URL system and port detection</p>
        </Card.Header>
        <Card.Body>
          {/* Connection Status */}
          <div className="mb-4">
            <h5>Connection Status</h5>
            <ConnectionStatus compact={false} />
          </div>

          {/* Port Information */}
          <div className="mb-4">
            <h5>Detection Results</h5>
            {loading && <p>🔍 Detecting ports...</p>}
            {error && <p className="text-danger">❌ Error: {error}</p>}
            {portInfo && (
              <div>
                <p><strong>Status:</strong> <Badge bg={portInfo.connectionStatus === 'connected' ? 'success' : 'warning'}>
                  {portInfo.connectionStatus}
                </Badge></p>
                <p><strong>Detected Port:</strong> {portInfo.detectedPort || 'None'}</p>
                <p><strong>Base URL:</strong> <code>{portInfo.baseURL || 'Not detected'}</code></p>
                <p><strong>Environment:</strong> {portInfo.environment?.mode}</p>
              </div>
            )}
          </div>

          {/* Generated URLs */}
          <div className="mb-4">
            <h5>Generated URLs</h5>
            <div className="row">
              {testUrls.map((item, index) => (
                <div key={index} className="col-12 mb-2">
                  <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                    <div>
                      <strong>{item.name}:</strong>
                      <br />
                      <small className="text-muted"><code>{item.url}</code></small>
                    </div>
                    <div>
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => window.open(item.url, '_blank')}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={refresh}>
              🔄 Refresh Detection
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={() => console.log('Port Detection Info:', { portInfo, urlManager })}
            >
              📋 Log Details
            </Button>
          </div>

          {/* Technical Details */}
          {portInfo && (
            <details className="mt-4">
              <summary>Technical Details</summary>
              <pre className="small bg-light p-3 mt-2">
                {JSON.stringify({
                  portInfo,
                  urlManagerInfo: {
                    connectionStatus: urlManager.connectionStatus,
                    environment: urlManager.environment,
                    urls: Object.keys(urlManager.urls)
                  }
                }, null, 2)}
              </pre>
            </details>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PortDetectionTest;