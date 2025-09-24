// Patient Search Widget - Advanced search and filtering with soft-coded configuration
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Card, Form, InputGroup, Button, Accordion, Badge, 
  Row, Col, Dropdown, OverlayTrigger, Tooltip 
} from 'react-bootstrap';
import { 
  FaSearch, FaFilter, FaTimes, FaCalendarAlt, 
  FaUser, FaPhone, FaEnvelope, FaIdCard 
} from '../../utils/icons.utils.jsx';

const PatientSearchWidget = ({ onSearch, onFilterChange, config, enabled = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle search input
  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  }, [onSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, field, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[filterType]) {
        newFilters[filterType] = {};
      }
      
      if (value === '' || value === null || value === undefined) {
        delete newFilters[filterType][field];
        if (Object.keys(newFilters[filterType]).length === 0) {
          delete newFilters[filterType];
        }
      } else {
        newFilters[filterType][field] = value;
      }
      
      onFilterChange(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery('');
    onSearch('');
    onFilterChange({});
  }, [onSearch, onFilterChange]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).reduce((count, filterGroup) => {
      return count + Object.keys(filterGroup).length;
    }, 0);
  }, [activeFilters]);

  // Render filter input based on field configuration
  const renderFilterInput = (filterType, field, fieldConfig) => {
    const currentValue = activeFilters[filterType]?.[field] || '';
    
    switch (fieldConfig.type || 'text') {
      case 'date':
        return (
          <Form.Control
            type="date"
            value={currentValue}
            onChange={(e) => handleFilterChange(filterType, field, e.target.value)}
            size="sm"
          />
        );
        
      case 'select':
        return (
          <Form.Select
            value={currentValue}
            onChange={(e) => handleFilterChange(filterType, field, e.target.value)}
            size="sm"
          >
            <option value="">All</option>
            {fieldConfig.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );
        
      case 'number':
        return (
          <Form.Control
            type="number"
            value={currentValue}
            onChange={(e) => handleFilterChange(filterType, field, e.target.value)}
            placeholder={fieldConfig.placeholder}
            size="sm"
          />
        );
        
      default:
        return (
          <Form.Control
            type="text"
            value={currentValue}
            onChange={(e) => handleFilterChange(filterType, field, e.target.value)}
            placeholder={fieldConfig.placeholder || `Search by ${field}`}
            size="sm"
          />
        );
    }
  };

  // Quick search buttons
  const quickSearchButtons = [
    { label: 'Recent Patients', icon: FaUser, filter: { administrative: { lastVisit: 'last7days' } } },
    { label: 'New Patients', icon: FaUser, filter: { administrative: { registrationDate: 'last30days' } } },
    { label: 'Upcoming Appointments', icon: FaCalendarAlt, filter: { administrative: { hasUpcomingAppointment: true } } }
  ];

  if (!enabled) {
    return (
      <Card>
        <Card.Body className="text-center text-muted">
          <FaSearch className="display-4 mb-2 opacity-25" />
          <p>Search functionality is disabled</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="patient-search-widget">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <FaSearch className="me-2" />
          Patient Search
        </h6>
        {activeFilterCount > 0 && (
          <Badge bg="primary">{activeFilterCount} active</Badge>
        )}
      </Card.Header>
      
      <Card.Body>
        {/* Main Search Input */}
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search patients by name, ID, email, or phone..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {(searchQuery || activeFilterCount > 0) && (
            <Button 
              variant="outline-secondary" 
              onClick={clearFilters}
              title="Clear search and filters"
            >
              <FaTimes />
            </Button>
          )}
        </InputGroup>

        {/* Quick Search Buttons */}
        <div className="mb-3">
          <small className="text-muted d-block mb-2">Quick Search:</small>
          <div className="d-flex flex-wrap gap-2">
            {quickSearchButtons.map((button, index) => (
              <Button
                key={index}
                variant="outline-primary"
                size="sm"
                onClick={() => onFilterChange(button.filter)}
              >
                <button.icon className="me-1" />
                {button.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <FaFilter className="me-2" />
              Advanced Filters
              {activeFilterCount > 0 && (
                <Badge bg="secondary" className="ms-2">{activeFilterCount}</Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              {/* Demographic Filters */}
              {config.advancedFilters.demographic && (
                <div className="mb-4">
                  <h6 className="mb-3">
                    <FaUser className="me-2 text-primary" />
                    Demographics
                  </h6>
                  <Row>
                    <Col md={6} className="mb-2">
                      <Form.Label className="small">Age Range</Form.Label>
                      <Row>
                        <Col xs={6}>
                          <Form.Control
                            type="number"
                            placeholder="Min age"
                            value={activeFilters.demographic?.ageMin || ''}
                            onChange={(e) => handleFilterChange('demographic', 'ageMin', e.target.value)}
                            size="sm"
                          />
                        </Col>
                        <Col xs={6}>
                          <Form.Control
                            type="number"
                            placeholder="Max age"
                            value={activeFilters.demographic?.ageMax || ''}
                            onChange={(e) => handleFilterChange('demographic', 'ageMax', e.target.value)}
                            size="sm"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label className="small">Gender</Form.Label>
                      <Form.Select
                        value={activeFilters.demographic?.gender || ''}
                        onChange={(e) => handleFilterChange('demographic', 'gender', e.target.value)}
                        size="sm"
                      >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Medical Filters */}
              {config.advancedFilters.medical && (
                <div className="mb-4">
                  <h6 className="mb-3">
                    <FaIdCard className="me-2 text-success" />
                    Medical Information
                  </h6>
                  <Row>
                    <Col md={6} className="mb-2">
                      <Form.Label className="small">Blood Type</Form.Label>
                      <Form.Select
                        value={activeFilters.medical?.bloodType || ''}
                        onChange={(e) => handleFilterChange('medical', 'bloodType', e.target.value)}
                        size="sm"
                      >
                        <option value="">All Blood Types</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Select>
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label className="small">Chronic Conditions</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Diabetes, Hypertension"
                        value={activeFilters.medical?.chronicConditions || ''}
                        onChange={(e) => handleFilterChange('medical', 'chronicConditions', e.target.value)}
                        size="sm"
                      />
                    </Col>
                  </Row>
                </div>
              )}

              {/* Administrative Filters */}
              {config.advancedFilters.administrative && (
                <div className="mb-4">
                  <h6 className="mb-3">
                    <FaCalendarAlt className="me-2 text-info" />
                    Administrative
                  </h6>
                  <Row>
                    <Col md={6} className="mb-2">
                      <Form.Label className="small">Registration Date</Form.Label>
                      <Row>
                        <Col xs={6}>
                          <Form.Control
                            type="date"
                            value={activeFilters.administrative?.registrationDateFrom || ''}
                            onChange={(e) => handleFilterChange('administrative', 'registrationDateFrom', e.target.value)}
                            size="sm"
                          />
                        </Col>
                        <Col xs={6}>
                          <Form.Control
                            type="date"
                            value={activeFilters.administrative?.registrationDateTo || ''}
                            onChange={(e) => handleFilterChange('administrative', 'registrationDateTo', e.target.value)}
                            size="sm"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label className="small">Insurance Provider</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Insurance provider name"
                        value={activeFilters.administrative?.insuranceProvider || ''}
                        onChange={(e) => handleFilterChange('administrative', 'insuranceProvider', e.target.value)}
                        size="sm"
                      />
                    </Col>
                  </Row>
                </div>
              )}

              {/* Filter Actions */}
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={clearFilters}
                  disabled={activeFilterCount === 0}
                >
                  <FaTimes className="me-1" />
                  Clear All Filters
                </Button>
                <small className="text-muted align-self-center">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                </small>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>

      <style jsx>{`
        .patient-search-widget .accordion-button {
          padding: 0.5rem 0.75rem;
        }
        
        .patient-search-widget .accordion-body {
          padding: 1rem 0.75rem;
        }
        
        .patient-search-widget .form-label {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </Card>
  );
};

export default PatientSearchWidget;