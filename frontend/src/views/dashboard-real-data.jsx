import React, { useState, useEffect } from "react";
import { Row, Col, ProgressBar, Button, Badge, Table, Dropdown, ListGroup, Spinner, Alert } from "react-bootstrap";
import Card from "../components/Card";
import ReactApexChart from 'react-apexcharts';
import { Link, useNavigate } from "react-router-dom";
import { useAuth, usePermissions, useRoleConfig } from "../hooks/useRBAC.jsx";
import { PermissionGate, RoleBadge, RoleSwitcher, FeatureFlag } from "../components/RBACMiddleware";
import {
  useDashboardOverview,
  useDashboardStats,
  useDashboardChartData,
  useTodayAppointments,
  useUpcomingAppointments,
  useDoctors,
  usePatients
} from "../hooks/useApi";
import apiConfig from "../config/api.config";
import routesConfig from "../config/routes.config";
import { isDevelopment, isFeatureEnabled } from "../config/environment.config";

const generatePath = (path) => {
    return window.origin + import.meta.env.BASE_URL + path;
};

const DashboardWithRealData = () => {
    const backgroundImage = generatePath("/assets/images/page-img/38.png");
    const userImage = generatePath("/assets/images/user/11.png");
    const navigate = useNavigate();

    // RBAC hooks
    const { user, role, isAuthenticated } = useAuth();
    const { hasPermission, canAccessModule, getFeatureFlags } = usePermissions();
    const { roleData, dashboardModules, navigationConfig, featureFlags } = useRoleConfig();

    // Fetch real dashboard data using custom hooks
    const { data: overview, loading: overviewLoading, error: overviewError } = useDashboardOverview();
    const { patients: patientStats, appointments: appointmentStats, doctors: doctorStats, loading: statsLoading } = useDashboardStats();
    const { data: todayAppointments, loading: todayLoading, error: todayError } = useTodayAppointments();
    const { data: upcomingAppointments, loading: upcomingLoading } = useUpcomingAppointments();
    const { data: doctorsData, loading: doctorsLoading } = useDoctors({ limit: 8 });
    const { data: patientsData, loading: patientsLoading } = usePatients({ limit: 8 });
    const { data: appointmentChartData, loading: chartLoading } = useDashboardChartData('appointments');
    const { data: patientChartData } = useDashboardChartData('patients');

    // Loading component
    const LoadingSpinner = () => (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    // Error component
    const ErrorAlert = ({ error, title = "Error loading data" }) => (
        <Alert variant="danger">
            <Alert.Heading>{title}</Alert.Heading>
            <p>{error?.message || 'An unexpected error occurred'}</p>
            {apiConfig.features.mockData.enabled && (
                <small className="text-muted">Falling back to mock data...</small>
            )}
        </Alert>
    );

    // Real-time chart for appointments with actual data
    const [appointmentsChart, setAppointmentsChart] = useState({
        chart: {
            height: 80,
            type: 'area',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 2000,
                },
            },
            toolbar: {
                show: false,
            },
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0,
            },
        },
        series: [
            {
                name: 'Appointments',
                data: appointmentChartData?.datasets?.[0]?.data || [],
            },
        ],
        colors: ['#089bab'],
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
            labels: {
                show: false,
            },
        },
        yaxis: {
            max: 130,
            labels: {
                show: false,
            },
        },
        legend: {
            show: false,
        },
        grid: {
            show: false,
        },
    });

    // Update chart when new data arrives
    useEffect(() => {
        if (appointmentChartData?.datasets?.[0]?.data) {
            setAppointmentsChart(prev => ({
                ...prev,
                series: [{
                    ...prev.series[0],
                    data: appointmentChartData.datasets[0].data
                }]
            }));
        }
    }, [appointmentChartData]);

    // Real-time chart for patients
    const [patientsChart, setPatientsChart] = useState({
        chart: {
            height: 80,
            type: 'area',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 2000,
                },
            },
            toolbar: {
                show: false,
            },
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0,
            },
        },
        series: [
            {
                name: 'New Patients',
                data: patientChartData?.datasets?.[0]?.data || [],
            },
        ],
        colors: ['#fc9f5b'],
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
            labels: {
                show: false,
            },
        },
        yaxis: {
            max: 130,
            labels: {
                show: false,
            },
        },
        legend: {
            show: false,
        },
        grid: {
            show: false,
        },
    });

    // Update patients chart when new data arrives
    useEffect(() => {
        if (patientChartData?.datasets?.[0]?.data) {
            setPatientsChart(prev => ({
                ...prev,
                series: [{
                    ...prev.series[0],
                    data: patientChartData.datasets[0].data
                }]
            }));
        }
    }, [patientChartData]);

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Format time for display
    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Get status badge component
    const getStatusBadge = (status) => {
        const statusColors = {
            'scheduled': 'primary',
            'confirmed': 'info',
            'in_progress': 'warning',
            'completed': 'success',
            'cancelled': 'danger',
            'no_show': 'secondary'
        };
        
        return (
            <Badge bg={statusColors[status] || 'secondary'}>
                {status?.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    // Redirect to Advanced Radiology Dashboard for certain roles
    useEffect(() => {
        if (role === 'radiologist' && canAccessModule('radiology')) {
            // Auto-redirect radiologists to advanced dashboard
            const timer = setTimeout(() => {
                navigate('/radiology/dashboard');
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [role, canAccessModule, navigate]);

    return (
        <>
            {/* RBAC-Enhanced Header */}
            <Row className="mb-4">
                <Col lg="12">
                    <Card className="bg-gradient-primary text-white border-0">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col lg="8">
                                    <div className="d-flex align-items-center">
                                        <div className="media-support-user-img me-4">
                                            <img 
                                                className="rounded-pill img-fluid bg-soft-light" 
                                                src={user?.avatar || userImage} 
                                                alt="profile"
                                                style={{ width: '60px', height: '60px' }}
                                            />
                                        </div>
                                        <div className="media-support-info">
                                            <h4 className="mb-2 text-white">
                                                Welcome back, {user?.firstName || 'Dr. Sarah'} {user?.lastName || 'Johnson'}!
                                            </h4>
                                            <div className="d-flex align-items-center gap-3">
                                                <RoleBadge 
                                                    role={role} 
                                                    showIcon={true} 
                                                    showDescription={false}
                                                />
                                                <span className="text-light">
                                                    <i className="ri-hospital-line me-1"></i>
                                                    {user?.department || 'Radiology Department'}
                                                </span>
                                                <span className="text-light">
                                                    <i className="ri-time-line me-1"></i>
                                                    Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Today, 9:30 AM'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4" className="text-end">
                                    <div className="d-flex justify-content-end gap-2 flex-wrap">
                                        {/* Role Switcher for Demo */}
                                        {(isDevelopment || isFeatureEnabled('roleSwitcher')) && (
                                            <RoleSwitcher />
                                        )}
                                        
                                        {/* Quick Actions based on Role */}
                                        <PermissionGate requiredPermissions={['radiology:view']}>
                                            <Button 
                                                variant="light" 
                                                size="sm"
                                                onClick={() => navigate(routesConfig.radiology.xrayReports)}
                                            >
                                                <i className="ri-scan-line me-1"></i>
                                                Radiology
                                            </Button>
                                        </PermissionGate>

                                        <PermissionGate requiredPermissions={['patient:view']}>
                                            <Button variant="outline-light" size="sm">
                                                <i className="ri-user-heart-line me-1"></i>
                                                Patients
                                            </Button>
                                        </PermissionGate>

                                        <PermissionGate requiredPermissions={['report:create']}>
                                            <Button variant="outline-light" size="sm">
                                                <i className="ri-file-add-line me-1"></i>
                                                New Report
                                            </Button>
                                        </PermissionGate>
                                    </div>
                                </Col>
                            </Row>

                            {/* Role-specific notification for Radiologists */}
                            {role === 'radiologist' && (
                                <Row className="mt-3">
                                    <Col lg="12">
                                        <Alert variant="info" className="mb-0 border-0 bg-white bg-opacity-10 text-light">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <i className="ri-information-line me-2"></i>
                                                    You will be redirected to the Advanced Radiology Dashboard in a moment...
                                                </div>
                                                <Button 
                                                    variant="outline-light" 
                                                    size="sm"
                                                    onClick={() => navigate('/radiology/dashboard')}
                                                >
                                                    Go Now <i className="ri-arrow-right-line ms-1"></i>
                                                </Button>
                                            </div>
                                        </Alert>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl="8">
                    <Row>
                        <Col xl="12">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">MediXScan Dashboard Overview</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {overviewLoading ? (
                                        <LoadingSpinner />
                                    ) : overviewError ? (
                                        <ErrorAlert error={overviewError} title="Failed to load overview" />
                                    ) : (
                                        <Row>
                                            <Col md="6" lg="3">
                                                <div className="iq-card-text d-flex align-items-center justify-content-between">
                                                    <span className="">Total Patients</span>
                                                </div>
                                                <div className="iq-card-text d-flex align-items-center justify-content-between">
                                                    <h2 className="text-primary">
                                                        {overview?.totalPatients || 0}
                                                    </h2>
                                                </div>
                                            </Col>
                                            <Col md="6" lg="3">
                                                <div className="iq-card-text d-flex align-items-center justify-content-between">
                                                    <span className="">Total Doctors</span>
                                                </div>
                                                <div className="iq-card-text d-flex align-items-center justify-content-between">
                                                    <h2 className="text-success">
                                                        {overview?.totalDoctors || 0}
                                                    </h2>
                                                </div>
                                            </Col>
                                            <Col md="6" lg="3">
                                                <div className="iq-card-text d-flex align-items-center justify-content-between">
                                                    <span className="">Today's Appointments</span>
                                                </div>
                                                <div className="iq-card-text d-flex align-items-center justify-content-between">
                                                    <h2 className="text-warning">
                                                        {overview?.todayAppointments || 0}
                                                    </h2>
                                                </div>
                                            </Col>
                                            <Col md="6" lg="3">
                                                <div className="iq-card-text d-flex align-items-center justify-content-between">
                                                    <span className="">Completed Today</span>
                                                </div>
                                                <div className="iq-card-text d-flex align-items-center justify-content-between">
                                                    <h2 className="text-info">
                                                        {overview?.completedAppointments || 0}
                                                    </h2>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        {/* Real-time Charts */}
                        <Col lg="6">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Appointments Trend</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {chartLoading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <span className="text-dark">Today's Appointments</span>
                                                    <h2 className="counter text-primary">
                                                        {appointmentStats?.data?.today || 0}
                                                    </h2>
                                                </div>
                                            </div>
                                            <ReactApexChart
                                                options={appointmentsChart}
                                                series={appointmentsChart.series}
                                                type="area"
                                                height={80}
                                            />
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col lg="6">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">New Patients</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {statsLoading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <span className="text-dark">This Month</span>
                                                    <h2 className="counter text-warning">
                                                        {patientStats?.data?.newThisMonth || 0}
                                                    </h2>
                                                </div>
                                            </div>
                                            <ReactApexChart
                                                options={patientsChart}
                                                series={patientsChart.series}
                                                type="area"
                                                height={80}
                                            />
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Today's Appointments */}
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Today's Appointments</h4>
                            </div>
                            <Link to="/appointments" className="btn btn-primary btn-sm">
                                View All
                            </Link>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {todayLoading ? (
                                <LoadingSpinner />
                            ) : todayError ? (
                                <ErrorAlert error={todayError} />
                            ) : todayAppointments?.length > 0 ? (
                                <div className="table-responsive">
                                    <Table className="mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">Patient</th>
                                                <th scope="col">Doctor</th>
                                                <th scope="col">Time</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todayAppointments.slice(0, 5).map((appointment) => (
                                                <tr key={appointment.appointment_id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <h6 className="mb-0">
                                                                {appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}
                                                            </h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        Dr. {appointment.doctor?.user?.first_name} {appointment.doctor?.user?.last_name}
                                                    </td>
                                                    <td>{formatTime(appointment.appointment_time)}</td>
                                                    <td>{appointment.appointment_type?.replace('_', ' ')}</td>
                                                    <td>{getStatusBadge(appointment.status)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No appointments scheduled for today</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Sidebar with additional info */}
                <Col xl="4">
                    {/* Doctors List */}
                    <Card>
                        <Card.Header>
                            <div className="header-title">
                                <h4 className="card-title">Available Doctors</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {doctorsLoading ? (
                                <LoadingSpinner />
                            ) : doctorsData?.results?.length > 0 ? (
                                <ListGroup className="list-group-flush">
                                    {doctorsData.results.slice(0, 6).map((doctor) => (
                                        <ListGroup.Item key={doctor.doctor_id} className="d-flex align-items-center justify-content-between px-0">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    className="avatar-40 rounded-pill"
                                                    src={doctor.user?.profile_picture || generatePath("/assets/images/user/01.jpg")}
                                                    alt="doctor"
                                                    loading="lazy"
                                                />
                                                <div className="ms-3">
                                                    <h6 className="mb-0">
                                                        Dr. {doctor.user?.first_name} {doctor.user?.last_name}
                                                    </h6>
                                                    <small className="text-muted">
                                                        {doctor.specialization?.replace('_', ' ')}
                                                    </small>
                                                </div>
                                            </div>
                                            <Badge bg="success">Active</Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No doctors available</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Recent Patients */}
                    <Card>
                        <Card.Header>
                            <div className="header-title">
                                <h4 className="card-title">Recent Patients</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {patientsLoading ? (
                                <LoadingSpinner />
                            ) : patientsData?.results?.length > 0 ? (
                                <ListGroup className="list-group-flush">
                                    {patientsData.results.slice(0, 6).map((patient) => (
                                        <ListGroup.Item key={patient.patient_id} className="d-flex align-items-center justify-content-between px-0">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    className="avatar-40 rounded-pill"
                                                    src={patient.user?.profile_picture || generatePath("/assets/images/user/02.jpg")}
                                                    alt="patient"
                                                    loading="lazy"
                                                />
                                                <div className="ms-3">
                                                    <h6 className="mb-0">
                                                        {patient.user?.first_name} {patient.user?.last_name}
                                                    </h6>
                                                    <small className="text-muted">
                                                        Patient ID: {patient.patient_id}
                                                    </small>
                                                </div>
                                            </div>
                                            <Badge bg={patient.is_active ? 'primary' : 'secondary'}>
                                                {patient.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No recent patients</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Real-time Status */}
                    <Card>
                        <Card.Header>
                            <div className="header-title">
                                <h4 className="card-title">System Status</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span>API Connection</span>
                                <Badge bg="success">Connected</Badge>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span>Real-time Updates</span>
                                <Badge bg={apiConfig.features.realTimeUpdates.enabled ? 'success' : 'secondary'}>
                                    {apiConfig.features.realTimeUpdates.enabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <span>Data Caching</span>
                                <Badge bg={apiConfig.features.caching.enabled ? 'info' : 'secondary'}>
                                    {apiConfig.features.caching.enabled ? 'Active' : 'Disabled'}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashboardWithRealData;