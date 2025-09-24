// Icon System Test Page
// Tests all our soft-coded validation functions

import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Badge, Table } from 'react-bootstrap';
import { 
  validateIconAvailability, 
  checkIconAvailability, 
  batchCheckIconAvailability, 
  getIconSystemStats,
  isIconSystemHealthy,
  FaTachometerAlt,
  FaCheck,
  FaExclamationTriangle 
} from '../../utils/icons.utils.jsx';

const IconSystemTestPage = () => {
  const [validationResults, setValidationResults] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    
    try {
      // Test 1: Full system validation
      console.log('🔍 Running icon system validation...');
      const validation = validateIconAvailability();
      setValidationResults(validation);
      
      // Test 2: System statistics
      const stats = getIconSystemStats();
      setSystemStats(stats);
      
      // Test 3: Health check
      const health = isIconSystemHealthy();
      setSystemHealth(health);
      
      // Test 4: Individual icon checks
      const testIcons = ['FaTachometerAlt', 'FaCheck', 'FaExclamationTriangle', 'FaNonExistent'];
      const batchResults = batchCheckIconAvailability(testIcons);
      console.log('📊 Batch icon check results:', batchResults);
      
      console.log('✅ All icon system tests completed successfully!');
      
    } catch (error) {
      console.error('❌ Icon system test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      healthy: 'success',
      warning: 'warning',
      critical: 'danger',
      unknown: 'secondary'
    };
    
    return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <FaTachometerAlt className="me-2" />
                MediXScan Icon System Test Results
              </h4>
            </Card.Header>
            <Card.Body>
              
              {/* Quick Actions */}
              <div className="d-flex gap-2 mb-4">
                <Button 
                  variant="primary" 
                  onClick={runTests}
                  disabled={loading}
                >
                  {loading ? 'Testing...' : 'Run Tests Again'}
                </Button>
                <Button 
                  variant="outline-info"
                  onClick={() => console.log('Current system stats:', getIconSystemStats())}
                >
                  Log System Stats
                </Button>
              </div>

              {/* System Health Overview */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <Card className="h-100">
                    <Card.Body className="text-center">
                      <h5>System Health</h5>
                      {systemHealth !== null ? (
                        <div>
                          {systemHealth ? (
                            <FaCheck className="text-success fs-2 mb-2" />
                          ) : (
                            <FaExclamationTriangle className="text-warning fs-2 mb-2" />
                          )}
                          <p className="mb-0">
                            {systemHealth ? 'Healthy' : 'Issues Detected'}
                          </p>
                        </div>
                      ) : (
                        <div>Loading...</div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
                
                <div className="col-md-4">
                  <Card className="h-100">
                    <Card.Body>
                      <h5>System Statistics</h5>
                      {systemStats && (
                        <div>
                          <p><strong>Icon Mappings:</strong> {systemStats.totalMappings}</p>
                          <p><strong>Emoji Fallbacks:</strong> {systemStats.totalEmojisFallbacks}</p>
                          <p><strong>Text Fallbacks:</strong> {systemStats.totalTextFallbacks}</p>
                          <p><strong>Version:</strong> {systemStats.systemVersion}</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
                
                <div className="col-md-4">
                  <Card className="h-100">
                    <Card.Body>
                      <h5>Validation Status</h5>
                      {validationResults && (
                        <div>
                          <p><strong>Overall:</strong> {getStatusBadge(validationResults.overall)}</p>
                          <p><strong>Errors:</strong> {validationResults.errors.length}</p>
                          <p><strong>Warnings:</strong> {validationResults.warnings.length}</p>
                          <p><strong>Timestamp:</strong> {new Date(validationResults.timestamp).toLocaleTimeString()}</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Detailed Results */}
              {validationResults && (
                <div className="row">
                  <div className="col-12">
                    <Card>
                      <Card.Header>
                        <h5>Detailed Validation Results</h5>
                      </Card.Header>
                      <Card.Body>
                        
                        {/* Errors */}
                        {validationResults.errors.length > 0 && (
                          <Alert variant="danger">
                            <Alert.Heading>Errors Found</Alert.Heading>
                            <ul className="mb-0">
                              {validationResults.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </Alert>
                        )}
                        
                        {/* Warnings */}
                        {validationResults.warnings.length > 0 && (
                          <Alert variant="warning">
                            <Alert.Heading>Warnings</Alert.Heading>
                            <ul className="mb-0">
                              {validationResults.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </Alert>
                        )}
                        
                        {/* Recommendations */}
                        {validationResults.recommendations.length > 0 && (
                          <Alert variant="info">
                            <Alert.Heading>Recommendations</Alert.Heading>
                            <ul className="mb-0">
                              {validationResults.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </Alert>
                        )}
                        
                        {/* Icon Status Table */}
                        <h6 className="mt-3">Icon Status Details</h6>
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Icon Name</th>
                              <th>Available</th>
                              <th>Fallback Level</th>
                              <th>Accessible</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(validationResults.icons).map(([iconName, details]) => (
                              <tr key={iconName}>
                                <td><code>{iconName}</code></td>
                                <td>
                                  {details.available ? (
                                    <Badge bg="success">Yes</Badge>
                                  ) : (
                                    <Badge bg="danger">No</Badge>
                                  )}
                                </td>
                                <td>
                                  <Badge bg={details.fallbackLevel === 'primary' ? 'success' : 'warning'}>
                                    {details.fallbackLevel}
                                  </Badge>
                                </td>
                                <td>
                                  {details.accessible ? (
                                    <Badge bg="success">Yes</Badge>
                                  ) : (
                                    <Badge bg="warning">No</Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              )}
              
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IconSystemTestPage;