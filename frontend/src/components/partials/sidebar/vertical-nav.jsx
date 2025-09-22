import React, { useContext, useState } from "react"
import { Accordion, AccordionContext, Collapse, Nav, OverlayTrigger, Tooltip, useAccordionButton } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import navigationConfig from "../../../config/navigation.config"



const VerticalNav = () => {

    const location = useLocation()
    const [activeMenu, setActiveMenu] = useState(false)
    const [active, setActive] = useState('')

    // Navigation items are now managed through navigationConfig

    const uiElementsItems = [
        { path: "/ui-elements/colors", name: "Colors", icon: "ri-font-color" },
        { path: "/ui-elements/typography", name: "Typography", icon: "ri-text" },
        { path: "/ui-elements/alerts", name: "Alerts", icon: "ri-alert-fill" },
        { path: "/ui-elements/badges", name: "Badges", icon: "ri-building-3-fill" },
        { path: "/ui-elements/breadcrumb", name: "Breadcrumb", icon: "ri-guide-fill" },
        { path: "/ui-elements/buttons", name: "Buttons", icon: "ri-checkbox-blank-fill" },
        { path: "/ui-elements/cards", name: "Cards", icon: "ri-bank-card-fill" },
        { path: "/ui-elements/carousel", name: "Carousel", icon: "ri-slideshow-4-fill" },
        { path: "/ui-elements/video", name: "Video", icon: "ri-movie-fill" },
        { path: "/ui-elements/grid", name: "Grid", icon: "ri-grid-fill" },
        { path: "/ui-elements/images", name: "Images", icon: "ri-image-fill" },
        { path: "/ui-elements/list-group", name: "List Group", icon: "ri-file-list-fill" },
        { path: "/ui-elements/modal", name: "Modal", icon: "ri-checkbox-blank-fill" },
        { path: "/ui-elements/notifications", name: "Notifications", icon: "ri-notification-3-fill" },
        { path: "/ui-elements/pagination", name: "Pagination", icon: "ri-more-fill" },
        { path: "/ui-elements/popovers", name: "Popovers", icon: "ri-folder-shield-fill" },
        { path: "/ui-elements/progressbars", name: "Progressbars", icon: "ri-battery-low-fill" },
        { path: "/ui-elements/tabs", name: "Tabs", icon: "ri-database-fill" },
        { path: "/ui-elements/tooltips", name: "Tooltips", icon: "ri-record-mail-fill" },
    ];

    const formItems = [
        { path: "/forms/form-elements", name: "Form Elements", icon: "ri-tablet-fill" },
        { path: "/forms/form-validations", name: "Form Validation", icon: "ri-device-fill" },
        { path: "/forms/form-switch", name: "Form Switch", icon: "ri-toggle-fill" },
        { path: "/forms/form-checkbox", name: "Form Checkbox", icon: "ri-chat-check-fill" },
        { path: "/forms/form-radio", name: "Form Radio", icon: "ri-radio-button-fill" },
    ];

    const formWizardItems = [
        { path: "/wizard/simple-wizard", name: "Simple Wizard", icon: "ri-anticlockwise-fill" },
        { path: "/wizard/validate-wizard", name: "Validate Wizard", icon: "ri-anticlockwise-2-fill" },
        { path: "/wizard/vertical-wizard", name: "Vertical Wizard", icon: "ri-clockwise-fill" },
    ];

    const tableItems = [
        { path: "/tables/basic-table", name: "Basic Tables", icon: "ri-table-fill" },
        { path: "/tables/data-table", name: "Data Tables", icon: "ri-table-2" },
        { path: "/tables/editable-table", name: "Editable Tables", icon: "ri-archive-drawer-fill" },
    ];


    const chartItems = [
        { path: "/charts/chart-page", name: "Chart Page", icon: "ri-file-chart-fill" },
        { path: "/charts/e-chart", name: "ECharts", icon: "ri-bar-chart-fill" },
        { path: "/charts/chart-am", name: "Am Charts", icon: "ri-bar-chart-box-fill" },
        { path: "/charts/apex-chart", name: "Apex Chart", icon: "ri-bar-chart-box-fill" },
    ];

    const iconItems = [
        { path: "/icons/dripicons", name: "Dripicons", icon: "ri-stack-fill" },
        { path: "/icons/fontawesome-5", name: "Font Awesome 5", icon: "ri-facebook-fill" },
        { path: "/icons/line-awesome", name: "Line Awesome", icon: "ri-keynote-fill" },
        { path: "/icons/remixicon", name: "Remixicon", icon: "ri-remixicon-fill" },
        { path: "/icons/unicons", name: "Unicons", icon: "ri-underline" },
    ];

    const authItems = [
        { path: "/auth/sign-in", name: "Login", icon: "ri-login-box-fill" },
        { path: "/auth/sign-up", name: "Register", icon: "ri-logout-box-fill" },
        { path: "/auth/recover-password", name: "Recover Password", icon: "ri-record-mail-fill" },
        { path: "/auth/confirm-mail", name: "Confirm Mail", icon: "ri-chat-check-fill" },
        { path: "/auth/lock-screen", name: "Lock Screen", icon: "ri-file-lock-fill" },
    ];

    const extraPagesItems = [
        { path: "/extra-pages/pages-timeline", name: "Timeline", icon: "ri-map-pin-time-fill" },
        { path: "/extra-pages/pages-invoice", name: "Invoice", icon: "ri-question-answer-fill" },
        { path: "/extra-pages/blank-page", name: "Blank Page", icon: "ri-checkbox-blank-fill" },
        { path: "/extra-pages/pages-error-404", name: "Error 404", icon: "ri-error-warning-fill" },
        { path: "/extra-pages/pages-error-500", name: "Error 500", icon: "ri-error-warning-fill" },
        { path: "/extra-pages/pages-pricing", name: "Pricing", icon: "ri-price-tag-3-fill" },
        { path: "/extra-pages/pages-pricing-one", name: "Pricing 1", icon: "ri-price-tag-2-fill" },
        { path: "/extra-pages/pages-maintenance", name: "Maintenance", icon: "ri-git-repository-commits-fill" },
        { path: "/extra-pages/pages-comingsoon", name: "Coming Soon", icon: "ri-run-fill" },
        { path: "/extra-pages/pages-faq", name: "Faq", icon: "ri-compasses-2-fill" },
    ];

    function CustomToggle({ children, eventKey, onClick, activeClass }) {

        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(eventKey, (active) => onClick({ state: !active, eventKey: eventKey }));

        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <Link to="#" aria-expanded={isCurrentEventKey ? 'true' : 'false'} className={`nav-link ${activeEventKey === active || eventKey === active && 'active'} ${activeClass === true ? 'active' : ""}`} role="button" onClick={(e) => {
                decoratedOnClick(isCurrentEventKey)
            }}>
                {children}
            </Link>
        );
    }


    return (
        <>
            <ul className="navbar-nav iq-main-menu" id="sidebar-menu">
                <Nav.Item as="li" className="static-item ms-2">
                    <Link className="nav-link static-item disabled text-start" tabIndex="-1">
                        <span className="default-icon">Dashboard</span>
                        <OverlayTrigger
                            key={"Home"}
                            placement={"right"}
                            overlay={
                                <Tooltip id="Home">
                                    Home
                                </Tooltip>
                            }
                        >
                            <span className="mini-icon">-</span>
                        </OverlayTrigger>
                    </Link>
                </Nav.Item>
                {/* Render Dashboard Items from Configuration */}
                {navigationConfig.dashboardItems.filter(item => item.enabled).map((dashboardItem, index) => (
                    <Nav.Item as="li" key={dashboardItem.id}>
                        <Link 
                            to={dashboardItem.path} 
                            className={`nav-link ${location.pathname === dashboardItem.path ? "active" : ""}`}
                        >
                            <OverlayTrigger
                                key={dashboardItem.id}
                                placement={"right"}
                                overlay={
                                    <Tooltip id={dashboardItem.id}>
                                        {dashboardItem.tooltip}
                                    </Tooltip>
                                }
                            >
                                <i className={dashboardItem.icon}>
                                </i>
                            </OverlayTrigger>
                            <span className="item-name">{dashboardItem.title}</span>
                        </Link>
                    </Nav.Item>
                ))}
                <li>
                    <hr className="hr-horizontal" />
                </li>
                <Accordion bsPrefix="bg-none" onSelect={(e) => setActiveMenu(e)}>
                    <Nav.Item as="li" className="static-item ms-2">
                        <Nav.Link className="static-item disabled text-start" tabIndex="-1">
                            <span className="default-icon">Apps</span>
                            <span className="mini-icon">-</span>
                        </Nav.Link>
                    </Nav.Item>
                    {/* Render App Items from Configuration */}
                    {Object.entries(navigationConfig.appItems).filter(([key, app]) => app.enabled).map(([key, app]) => (
                        <Accordion.Item 
                            key={key}
                            as="li" 
                            className={`nav-item ${active === key && 'active'}`} 
                            onClick={() => setActive(key)}
                        >
                            <div className="colors">
                                <CustomToggle
                                    eventKey={key}
                                    activeClass={app.items.some(item => location.pathname === item.path)}
                                    onClick={(activeKey) => setActiveMenu(activeKey)}
                                >
                                    <OverlayTrigger
                                        key={key}
                                        placement={"right"}
                                        overlay={
                                            <Tooltip id={key}>
                                                {app.tooltip}
                                            </Tooltip>
                                        }
                                    >
                                        <i className={app.icon}></i>
                                    </OverlayTrigger>
                                    <span className="item-name">{app.title}</span>
                                    <i className="right-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </i>
                                </CustomToggle>

                                <Accordion.Collapse eventKey={key} as="ul" className="sub-nav" id={key}>
                                    <>
                                        {app.items.map((item) => (
                                            <li key={item.path}>
                                                <Link className={`nav-link ${location.pathname === item.path ? "active" : ""}`} to={item.path}>
                                                    <i className={item.icon}></i>
                                                    <span className="item-name">{item.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </>
                                </Accordion.Collapse>
                            </div>
                        </Accordion.Item>
                    ))}

                    {/* Doctor section is now managed through configuration in navigationConfig.appItems */}

                    {/* Render Single App Items from Configuration */}
                    {Object.entries(navigationConfig.singleAppItems).filter(([key, app]) => app.enabled).map(([key, app]) => (
                        <Nav.Item as="li" key={key}>
                            <Link className={`nav-link ${location.pathname === app.path ? "active" : ""}`} to={app.path}>
                                <OverlayTrigger
                                    key={key}
                                    placement={"right"}
                                    overlay={
                                        <Tooltip id={key}>
                                            {app.tooltip}
                                        </Tooltip>
                                    }
                                >
                                    <i className={app.icon}>
                                    </i>
                                </OverlayTrigger>
                                <span className="item-name">{app.title}</span>
                            </Link>
                        </Nav.Item>
                    ))}

                    {/* Components Section - Controlled by soft coding configuration */}
                    {navigationConfig.componentsSection.enabled && (
                        <>
                            {navigationConfig.componentsSection.showHeader && (
                                <Nav.Item as="li" className="static-item ms-2">
                                    <Nav.Link className="static-item disabled text-start" tabIndex="-1">
                                        <span className="default-icon">Components</span>
                                        <span className="mini-icon">-</span>
                                    </Nav.Link>
                                </Nav.Item>
                            )}
                            
                            {/* UI Elements - Disabled through configuration */}
                            {navigationConfig.componentsSection.items.uiElements.enabled && (
                                <Accordion.Item as="li" bsPrefix={`nav-item ${active === "UIElements" && 'active'}`} onClick={() => setActive("UIElements")}>
                                    <div className="colors">
                                        <CustomToggle
                                            eventKey="UIElements"
                                            activeClass={uiElementsItems.some(item => location.pathname === item.path)}
                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                        >
                                            <OverlayTrigger
                                                key={"UIElements"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="UIElements">
                                                        UIElements
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-apps-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">UI Elements</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse eventKey="UIElements" as="ul" className="sub-nav" id="UIElements">
                                            <>
                                                {uiElementsItems.map(({ path, name, icon }) => (
                                                    <li key={path}>
                                                        <Link className={`nav-link ${location.pathname === path ? "active" : ""}`} to={path}>
                                                            <i className={icon}></i>
                                                            <span className="item-name">{name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}

                            {/* Forms - Disabled through configuration */}
                            {navigationConfig.componentsSection.items.forms.enabled && (
                                <Accordion.Item as="li" bsPrefix={`nav-item ${active === "Forms" && 'active'}`} onClick={() => setActive("Forms")}>
                                    <div className="colors">
                                        <CustomToggle
                                            eventKey="Forms"
                                            activeClass={formItems.some(item => location.pathname === item.path)}
                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                        >
                                            <OverlayTrigger
                                                key={"Forms"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="Forms">
                                                        Forms
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-device-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">Forms</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse as="ul" className="sub-nav" eventKey="Forms" id="Forms">
                                            <>
                                                {formItems.map(({ path, name, icon }) => (
                                                    <li key={path}>
                                                        <Link className={`nav-link ${location.pathname === path ? "active" : ""}`} to={path}>
                                                            <i className={icon}></i>
                                                            <span className="item-name">{name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}

                            {/* Form Wizard - Disabled through configuration */}
                            {navigationConfig.componentsSection.items.formWizard.enabled && (
                                <Accordion.Item as="li" className={`nav-item ${active === "Form-Wizard" && 'active'}`} onClick={() => setActive("Form-Wizard")}>
                                    <div className="colors">
                                        <CustomToggle
                                            eventKey="Form-Wizard"
                                            activeClass={formWizardItems.some(item => item.path === location.pathname)}
                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                        >
                                            <OverlayTrigger
                                                key={"Forms-Wizard"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="Forms-Wizard">
                                                        Forms Wizard
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-file-word-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">Form Wizard</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse eventKey="Form-Wizard" as="ul" className="sub-nav" id="Form-Wizard">
                                            <>
                                                {formWizardItems.map(({ path, name, icon }) => (
                                                    <li key={path}>
                                                        <Link className={`nav-link ${location.pathname === path ? "active" : ""}`} to={path}>
                                                            <i className={icon}></i>
                                                            <span className="item-name">{name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}

                            {/* Tables - Disabled through configuration */}
                            {navigationConfig.componentsSection.items.tables.enabled && (
                                <Accordion.Item as="li" className={`nav-item ${active === "table" && 'active'}`} onClick={() => setActive("table")}>
                                    <div className="colors">
                                        <CustomToggle
                                            eventKey="table"
                                            activeClass={tableItems.some(item => item.path === location.pathname)}
                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                        >
                                            <OverlayTrigger
                                                key={"Table"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="Table">
                                                        Table
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-table-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">Table</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse eventKey="table" as="ul" className="sub-nav" id="table">
                                            <>
                                                {tableItems.map(({ path, name, icon }) => (
                                                    <li key={path}>
                                                        <Link className={`nav-link ${location.pathname === path ? "active" : ""}`} to={path}>
                                                            <i className={icon}></i>
                                                            <span className="item-name">{name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}

                            {/* Charts - Disabled through configuration */}
                            {navigationConfig.componentsSection.items.charts.enabled && (
                                <Accordion.Item as="li" className={`nav-item ${active === "Chart" && 'active'}`} onClick={() => setActive("Chart")}>
                                    <div className="colors">
                                        <CustomToggle
                                            eventKey="Chart"
                                            activeClass={chartItems.some(item => item.path === location.pathname)}
                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                        >
                                            <OverlayTrigger
                                                key={"Chart"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="Chart">
                                                        Chart
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-bar-chart-2-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">Charts</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse eventKey="Chart" as="ul" className="sub-nav" id="Chart">
                                            <>
                                                {chartItems.map(({ path, name, icon }) => (
                                                    <li key={path}>
                                                        <Link className={`nav-link ${location.pathname === path ? "active" : ""}`} to={path}>
                                                            <i className={icon}></i>
                                                            <span className="item-name">{name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}

                            {/* Icons - Disabled through configuration */}
                            {navigationConfig.componentsSection.items.icons.enabled && (
                                <Accordion.Item as="li" className={`nav-item ${active === "Icons" && 'active'}`} onClick={() => setActive("Icons")}>
                                    <div className="colors">
                                        <CustomToggle
                                            eventKey="Icons"
                                            activeClass={iconItems.some(item => item.path === location.pathname)}
                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                        >
                                            <OverlayTrigger
                                                key={"Icons"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="Icons">
                                                        Icons
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-bar-chart-2-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">Icons</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse eventKey="Icons" as="ul" className="sub-nav" id="Icons">
                                            <>
                                                {iconItems.map(({ path, name, icon }) => (
                                                    <li key={path}>
                                                        <Link className={`nav-link ${location.pathname === path ? "active" : ""}`} to={path}>
                                                            <i className={icon}></i>
                                                            <span className="item-name">{name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}
                        </>
                    )}

                    {/* Pages Section - Controlled by soft coding configuration */}
                    {navigationConfig.pagesSection.enabled && (
                        <>
                            {navigationConfig.pagesSection.showHeader && (
                                <Nav.Item as="li" className="static-item ms-2">
                                    <Nav.Link className="static-item disabled text-start" tabIndex="-1">
                                        <span className="default-icon ">Pages</span>
                                        <span className="mini-icon">-</span>
                                    </Nav.Link>
                                </Nav.Item>
                            )}

                            {/* Authentication - Enabled */}
                            {navigationConfig.pagesSection.items.authentication.enabled && (
                                <Accordion.Item as="li" eventKey="Authentication" className={`nav-item ${active === "Authentication" && "active"}`} onClick={() => setActive("Authentication")}>
                                    <div className="colors">
                                        <CustomToggle
                                            eventKey="Authentication"
                                            activeClass={authItems.some(item => item.path === location.pathname)}
                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                        >
                                            <OverlayTrigger
                                                key={"Authentication"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="Authentication">
                                                        Authentication
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-server-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">Authentication</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse eventKey="Authentication" as="ul" className="sub-nav" id="Authentication">
                                            <>
                                                {authItems.map(({ path, name, icon }) => (
                                                    <li key={path}>
                                                        <Link className={`nav-link ${location.pathname === path ? "active" : ""}`} to={path}>
                                                            <i className={icon}></i>
                                                            <span className="item-name">{name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}

                            {/* Maps - DISABLED through configuration */}
                            {navigationConfig.pagesSection.items.maps.enabled && (
                                <Accordion.Item as="li" eventKey="Maps" id="Maps" className={`nav-item ${active === "Maps" && 'active'}`} onClick={() => setActive("Maps")}>
                                    <div className="colors">
                                        <CustomToggle eventKey="Maps" onClick={(activeKey) => setActiveMenu(activeKey)}>
                                            <OverlayTrigger
                                                key={"Maps"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="Maps">
                                                        Maps
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-map-pin-2-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">Maps</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse as="ul" eventKey="Maps" className="sub-nav" id="Maps">
                                            <li>
                                                <Link className={`nav-link ${location.pathname === "/maps/google-map" ? "active" : ""}`}
                                                    to="/maps/google-map">
                                                    <i className="ri-google-fill"></i>
                                                    <span className="item-name">Google Map</span>
                                                </Link>
                                            </li>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}

                            {/* Extra Pages - DISABLED through configuration */}
                            {navigationConfig.pagesSection.items.extraPages.enabled && (
                                <Accordion.Item as="li" eventKey="0" id="Extrapages" className={`nav-item ${active === "Extrapages" && 'active'}`} onClick={() => setActive("Extrapages")}>
                                    <div className="colors">
                                        <CustomToggle
                                            eventKey="Extrapages"
                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                        >
                                            <OverlayTrigger
                                                key={"Extrapages"}
                                                placement={"right"}
                                                overlay={
                                                    <Tooltip id="Extrapages">
                                                        Extrapages
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="ri-folders-fill"></i>
                                            </OverlayTrigger>
                                            <span className="item-name">Extra Pages</span>
                                            <i className="right-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" className="icon-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </i>
                                        </CustomToggle>

                                        <Accordion.Collapse eventKey="Extrapages" as="ul" className="sub-nav" id="Extrapages">
                                            <>
                                                {extraPagesItems.map(({ path, name, icon }) => (
                                                    <li key={path}>
                                                        <Link className={`nav-link ${location.pathname === path ? "active" : ""}`} to={path}>
                                                            <i className={icon}></i>
                                                            <span className="item-name">{name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion.Item>
                            )}
                        </>
                    )}
                </Accordion>

                <li>
                    <hr className="hr-horizontal" />
                </li>
            </ul>

        </>
    )
}

export default VerticalNav