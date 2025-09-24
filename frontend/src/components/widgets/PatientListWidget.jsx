// Patient List Widget - Advanced patient table with sorting, pagination, and bulk operations
import React, { useState, useMemo, useCallback } from 'react';
import { 
  Card, Table, Button, Form, Badge, Dropdown, 
  OverlayTrigger, Tooltip, Pagination, Alert,
  ButtonGroup, Modal, ProgressBar
} from 'react-bootstrap';
import { 
  FaEye, FaEdit, FaTrash, FaCalendarAlt, FaSort, FaSortUp, FaSortDown,
  FaCheck, FaTimes, FaDownload, FaPhone, FaEnvelope, FaUser,
  FaEllipsisV, FaBirthdayCake, FaIdCard
} from '../../utils/icons.utils.jsx';
import { patientDataProcessor } from '../../services/patient-api.service.js';

const PatientListWidget = ({ 
  patients, 
  loading, 
  onPatientSelect, 
  onPatientEdit, 
  onSort, 
  sortConfig, 
  config,
  bulkSelection,
  onBulkSelectionChange,
  onBulkOperation
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Pagination calculations
  const { paginatedPatients, totalPages, startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginated = patients.slice(start, end);
    const pages = Math.ceil(patients.length / pageSize);
    
    return {
      paginatedPatients: paginated,
      totalPages: pages,
      startIndex: start + 1,
      endIndex: Math.min(end, patients.length)
    };
  }, [patients, currentPage, pageSize]);

  // Handle bulk selection
  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      const allIds = paginatedPatients.map(p => p.id);
      onBulkSelectionChange([...new Set([...bulkSelection, ...allIds])]);
    } else {
      const pageIds = paginatedPatients.map(p => p.id);
      onBulkSelectionChange(bulkSelection.filter(id => !pageIds.includes(id)));
    }
  }, [paginatedPatients, bulkSelection, onBulkSelectionChange]);

  const handleSelectPatient = useCallback((patientId) => {
    if (bulkSelection.includes(patientId)) {
      onBulkSelectionChange(bulkSelection.filter(id => id !== patientId));
    } else {
      onBulkSelectionChange([...bulkSelection, patientId]);
    }
  }, [bulkSelection, onBulkSelectionChange]);

  // Format patient data for display
  const formatPatientData = useCallback((patient, field) => {
    switch (field.key) {
      case 'fullName':
        return patientDataProcessor.formatPatientName(patient);
      
      case 'age':
        return patient.dateOfBirth 
          ? patientDataProcessor.calculateAge(patient.dateOfBirth)
          : 'N/A';
      
      case 'lastVisit':
        return patient.lastVisit 
          ? new Date(patient.lastVisit).toLocaleDateString()
          : 'No visits';
      
      case 'status':
        return (
          <Badge bg={patient.status === 'active' ? 'success' : 'secondary'}>
            {patient.status || 'Unknown'}
          </Badge>
        );
      
      case 'patientId':
        return (
          <code className="text-primary">{patient.patientId || patient.id}</code>
        );
      
      default:
        return patient[field.key] || 'N/A';
    }
  }, []);

  // Render sort icon
  const renderSortIcon = (fieldKey) => {
    if (sortConfig.field !== fieldKey) {
      return <FaSort className="opacity-25" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="text-primary" />
      : <FaSortDown className="text-primary" />;
  };

  // Render action buttons
  const renderActionButtons = (patient) => (
    <ButtonGroup size="sm">
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>View Patient Details</Tooltip>}
      >
        <Button
          variant="outline-primary"
          onClick={() => onPatientSelect(patient)}
        >
          <FaEye />
        </Button>
      </OverlayTrigger>
      
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>Edit Patient Information</Tooltip>}
      >
        <Button
          variant="outline-secondary"
          onClick={() => onPatientEdit(patient)}
        >
          <FaEdit />
        </Button>
      </OverlayTrigger>
      
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle variant="outline-info" split>
          <FaEllipsisV />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => console.log('Schedule appointment', patient)}>
            <FaCalendarAlt className="me-2" />
            Schedule Appointment
          </Dropdown.Item>
          <Dropdown.Item onClick={() => console.log('Contact patient', patient)}>
            <FaPhone className="me-2" />
            Contact Patient
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => console.log('View medical history', patient)}>
            <FaIdCard className="me-2" />
            Medical History
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </ButtonGroup>
  );

  // Bulk actions
  const bulkActions = [
    { key: 'export', label: 'Export Selected', icon: FaDownload, variant: 'primary' },
    { key: 'contact', label: 'Send Message', icon: FaEnvelope, variant: 'info' },
    { key: 'archive', label: 'Archive', icon: FaTimes, variant: 'warning' }
  ];

  if (loading) {
    return (
      <Card>
        <Card.Header>
          <h6 className="mb-0">Patient List</h6>
        </Card.Header>
        <Card.Body className="text-center">
          <div className="my-4">
            <ProgressBar animated now={100} />
            <p className="mt-2">Loading patients...</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h6 className="mb-0">Patient List</h6>
        </Card.Header>
        <Card.Body className="text-center">
          <FaUser className="display-4 text-muted mb-3" />
          <h5>No Patients Found</h5>
          <p className="text-muted">Try adjusting your search criteria or filters.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">Patient List</h6>
          <small className="text-muted">
            Showing {startIndex}-{endIndex} of {patients.length} patients
          </small>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          {/* Bulk Actions */}
          {bulkSelection.length > 0 && (
            <Dropdown>
              <Dropdown.Toggle variant="primary" size="sm">
                Bulk Actions ({bulkSelection.length})
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {bulkActions.map(action => (
                  <Dropdown.Item
                    key={action.key}
                    onClick={() => onBulkOperation(action.key, bulkSelection)}
                  >
                    <action.icon className="me-2" />
                    {action.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
          
          {/* Page Size Selector */}
          <Form.Select
            size="sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ width: 'auto' }}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </Form.Select>
        </div>
      </Card.Header>
      
      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: '50px' }}>
                <Form.Check
                  type="checkbox"
                  checked={paginatedPatients.length > 0 && 
                    paginatedPatients.every(p => bulkSelection.includes(p.id))}
                  onChange={handleSelectAll}
                />
              </th>
              {config.displayFields.map(field => (
                <th 
                  key={field.key} 
                  style={{ width: field.width }}
                  className={field.sortable ? 'cursor-pointer user-select-none' : ''}
                  onClick={() => field.sortable && onSort(field.key)}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    {field.label}
                    {field.sortable && renderSortIcon(field.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.map(patient => (
              <tr key={patient.id} className="align-middle">
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={bulkSelection.includes(patient.id)}
                    onChange={() => handleSelectPatient(patient.id)}
                  />
                </td>
                {config.displayFields.map(field => (
                  <td key={field.key}>
                    {field.key === 'actions' ? (
                      renderActionButtons(patient)
                    ) : (
                      formatPatientData(patient, field)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">
              Page {currentPage} of {totalPages}
            </small>
          </div>
          
          <Pagination className="mb-0" size="sm">
            <Pagination.First 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            />
            <Pagination.Prev 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            />
            
            {/* Page numbers */}
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageNumber = Math.max(1, currentPage - 2) + index;
              if (pageNumber <= totalPages) {
                return (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                );
              }
              return null;
            })}
            
            <Pagination.Next 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            />
            <Pagination.Last 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            />
          </Pagination>
        </Card.Footer>
      )}

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .table th {
          border-top: none;
          font-weight: 600;
          color: #495057;
        }
        
        .table tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.05);
        }
        
        .table td {
          vertical-align: middle;
        }
        
        .pagination {
          --bs-pagination-padding-x: 0.5rem;
          --bs-pagination-padding-y: 0.25rem;
        }
      `}</style>
    </Card>
  );
};

export default PatientListWidget;