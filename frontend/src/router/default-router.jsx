
import DefaultLayout from "../layouts/defaultLayout"
import BlankLayout from "../layouts/blank-layout"
import Index from "../views"
import DashboardWithRealData from "../views/dashboard-real-data"
import LandingPage from "../views/LandingPage"

// Dashboard Page
import HospitalDashboardOne from "../views/dashboard-pages/hospital-dashboard-one"
import HospitalDashboardTwo from "../views/dashboard-pages/hospital-dashboard-two"
import PatientDashboard from "../views/dashboard-pages/patient-dashboard"
import Covid19Dashboard from "../views/dashboard-pages/covid-19-dashboard"

// Email Page
import Inbox from "../views/email/inbox"
import EmailCompose from "../views/email/email-compose"

// Doctor Page
import AddDoctor from "../views/doctor/add-doctor"
import DoctorList from "../views/doctor/doctor-list"
import DoctorProfile from "../views/doctor/doctor-profile"
import EditDoctor from "../views/doctor/edit-doctor"

// Calendar Page
import Calendar from "../views/calendar/calendar"

// Chat Page
import Chat from "../views/chat/chat"

// Radiology Pages
import XRayReports from "../views/radiology/xray-reports"
import CTScans from "../views/radiology/ct-scans"
import MRIResults from "../views/radiology/mri-results"
import Ultrasound from "../views/radiology/ultrasound"
import ScheduleImaging from "../views/radiology/schedule-imaging"
import AdvancedRadiologyDashboard from "../views/radiology/AdvancedRadiologyDashboard"
import ReportCorrection from "../views/radiology/report-correction"
import Anonymizer from "../views/radiology/anonymizer"

// UI Elements
import Alerts from "../views/ui-elements/alerts";
import Badges from "../views/ui-elements/badges";
import Breadcrumb from "../views/ui-elements/breadcrumb";
import Buttons from "../views/ui-elements/buttons";
import Cards from "../views/ui-elements/cards";
import Carousels from "../views/ui-elements/carousel";
import Colors from "../views/ui-elements/colors";
import Grid from "../views/ui-elements/grid";
import Images from "../views/ui-elements/images";
import ListGroups from "../views/ui-elements/listGroup";
import Modals from "../views/ui-elements/modal";
import Notification from "../views/ui-elements/notification";
import Paginations from "../views/ui-elements/pagination";
import Popovers from "../views/ui-elements/popovers";
import Progressbars from "../views/ui-elements/progressbars";
import Tabs from "../views/ui-elements/tabs";
import Tooltips from "../views/ui-elements/tooltips";
import Typography from "../views/ui-elements/typography";
import Video from "../views/ui-elements/video";

// Form Page
import FormCheckbox from "../views/forms/form-checkbox"
import FormElements from "../views/forms/form-elements"
import FormRadio from "../views/forms/form-radio"
import FormSwitch from "../views/forms/form-switch"
import FormValidatioins from "../views/forms/form-validations"

// Wizard Page
import SimpalWizard from "../views/wizard/simple-wizard"
import ValidteWizard from "../views/wizard/validate-wizard"
import VerticalWizard from "../views/wizard/vertical-wizard"

// Table Page
import BasicTable from "../views/tables/basic-table"
import DataTable from "../views/tables/data-table"
import EditTable from "../views/tables/editable-table"

// Charts Page
import ApexChart from "../views/charts/apex-chart"
import ChartAm from "../views/charts/chart-am"
import ChartPage from "../views/charts/chart-page"
import EChart from "../views/charts/e-chart"

// Icons Page
import Dripicons from "../views/icons/dripicons"
import FontAwsomeFive from "../views/icons/fontawesome-Five"
import Lineawesome from "../views/icons/line-awesome"
import Remixicon from "../views/icons/remixicon"
import Unicons from "../views/icons/unicons"

// Maps 
import GoogleMap from "../views/maps/google-map"

// Extra Page
import AccountSetting from "../views/extra-pages/account-setting"
import BlankPage from "../views/extra-pages/blank-page"
import CommingSoon from "../views/extra-pages/pages-comingsoon"
import Error404 from "../views/extra-pages/pages-error-404"
import Error500 from "../views/extra-pages/pages-error-500"
import Faq from "../views/extra-pages/pages-faq"
import Invoice from "../views/extra-pages/pages-invoice"
import Maintenance from "../views/extra-pages/pages-maintenance"
import PricingOne from "../views/extra-pages/pages-pricing-one"
import Pricing from "../views/extra-pages/pages-pricing"
import Timeline from "../views/extra-pages/pages-timeline"
import PrivacyPolicy from "../views/extra-pages/privacy-policy"
import PrivacySetting from "../views/extra-pages/privacy-setting"
import TermsOfService from "../views/extra-pages/terms-of-service"
import StaticPage from "../views/static/StaticPage"
import { getStaticPage } from "../config/static-pages.config"
import SignIn from "../views/auth/sign-in"
import ConformMail from "../views/auth/confirm-mail"
import SignUp from "../views/auth/sign-up"
import RecoverPassword from "../views/auth/recover-password"
import LockScreen from "../views/auth/lock-screen"
import RBACLogin from "../views/auth/rbac-login"
import { AuthRouteHandler } from "../components/RouteHandler"
import { path } from "@amcharts/amcharts4/core"

export const DefaultRoute = [
  // Landing Page Route (No Layout)
  {
    path: "/",
    element: <LandingPage />
  },
  // Main App Routes (With Layout)
  {
    path: "",
    element: <DefaultLayout />,
    children: [
      //  ------ Dashboard Route ------ 
      {
        path: '/dashboard',
        element: <DashboardWithRealData />
      },
      {
        path: '/dashboard/dummy',
        element: <Index />
      },
      {
        path: '/dashboard-pages/dashboard-1',
        element: <HospitalDashboardOne />
      },
      {
        path: '/dashboard-pages/dashboard-2',
        element: <HospitalDashboardTwo />
      },
      {
        path: '/dashboard-pages/patient-dashboard',
        element: <PatientDashboard />
      },
      {
        path: '/dashboard-pages/dashboard-4',
        element: <Covid19Dashboard />
      },

      //  ------ Email Route ------ 
      {
        path: '/email/inbox',
        element: <Inbox />
      },
      {
        path: '/email/email-compose',
        element: <EmailCompose />
      },

      //  ------ Doctor Route ------ 
      {
        path: '/doctor/doctor-list',
        element: <DoctorList />
      },
      {
        path: '/doctor/add-doctor',
        element: <AddDoctor />
      },
      {
        path: '/doctor/doctor-profile',
        element: <DoctorProfile />
      },
      {
        path: '/doctor/edit-doctor',
        element: <EditDoctor />
      },

      //  ------ Calendar Route ------ 
      {
        path: '/calendar',
        element: <Calendar />
      },

      //  ------ Chat Route ------ 
      {
        path: '/chat',
        element: <Chat />
      },

      //  ------ Radiology Route ------ 
      {
        path: '/radiology/dashboard',
        element: <AdvancedRadiologyDashboard />
      },
      {
        path: '/radiology/report-correction',
        element: <ReportCorrection />
      },
      {
        path: '/radiology/anonymizer',
        element: <Anonymizer />
      },
      {
        path: '/radiology/xray-reports',
        element: <XRayReports />
      },
      {
        path: '/radiology/ct-scans',
        element: <CTScans />
      },
      {
        path: '/radiology/mri-results',
        element: <MRIResults />
      },
      {
        path: '/radiology/ultrasound',
        element: <Ultrasound />
      },
      {
        path: '/radiology/schedule',
        element: <ScheduleImaging />
      },

      //  ------ UI Elements Route ------ 
      {
        path: "/ui-elements/alerts",
        element: <Alerts />,
      },
      {
        path: "/ui-elements/badges",
        element: <Badges />,
      },
      {
        path: "/ui-elements/breadcrumb",
        element: <Breadcrumb />,
      },
      {
        path: "/ui-elements/buttons",
        element: <Buttons />,
      },
      {
        path: "/ui-elements/cards",
        element: <Cards />,
      },
      {
        path: "/ui-elements/carousel",
        element: <Carousels />,
      },
      {
        path: "/ui-elements/colors",
        element: <Colors />,
      },
      {
        path: "/ui-elements/grid",
        element: <Grid />,
      },
      {
        path: "/ui-elements/images",
        element: <Images />,
      },
      {
        path: "/ui-elements/list-group",
        element: <ListGroups />,
      },
      {
        path: "/ui-elements/modal",
        element: <Modals />,
      },
      {
        path: "/ui-elements/notifications",
        element: <Notification />,
      },
      {
        path: "/ui-elements/pagination",
        element: <Paginations />,
      },
      {
        path: "/ui-elements/popovers",
        element: <Popovers />,
      },
      {
        path: "/ui-elements/progressbars",
        element: <Progressbars />,
      },
      {
        path: "/ui-elements/tabs",
        element: <Tabs />,
      },
      {
        path: "/ui-elements/tooltips",
        element: <Tooltips />,
      },
      {
        path: "/ui-elements/typography",
        element: <Typography />,
      },
      {
        path: "/ui-elements/video",
        element: <Video />,
      },

      //  ------ Form Route ------
      {
        path: '/forms/form-elements',
        element: <FormElements />
      },

      {
        path: '/forms/form-validations',
        element: <FormValidatioins />
      },

      {
        path: '/forms/form-switch',
        element: <FormSwitch />
      },

      {
        path: '/forms/form-checkbox',
        element: <FormCheckbox />
      },

      {
        path: '/forms/form-radio',
        element: <FormRadio />
      },

      //  ------ Wizard Route ------ 
      {
        path: '/wizard/simple-wizard',
        element: <SimpalWizard />
      },
      {
        path: '/wizard/validate-wizard',
        element: <ValidteWizard />
      },
      {
        path: '/wizard/vertical-wizard',
        element: <VerticalWizard />
      },

      //  ------ Table Route ------ 
      {
        path: '/tables/basic-table',
        element: <BasicTable />
      },
      {
        path: '/tables/data-table',
        element: <DataTable />
      },
      {
        path: '/tables/editable-table',
        element: <EditTable />
      },

      //  ------ Chart Route ------ 
      {
        path: '/charts/chart-page',
        element: <ChartPage />
      },
      {
        path: '/charts/e-chart',
        element: <EChart />
      },
      {
        path: '/charts/chart-am',
        element: <ChartAm />
      },
      {
        path: '/charts/apex-chart',
        element: <ApexChart />
      },

      //  ------ Icons Route ------ 
      {
        path: '/icons/dripicons',
        element: <Dripicons />
      },
      {
        path: '/icons/fontawesome-5',
        element: <FontAwsomeFive />
      },
      {
        path: '/icons/line-awesome',
        element: <Lineawesome />
      },
      {
        path: '/icons/remixicon',
        element: <Remixicon />
      },
      {
        path: '/icons/unicons',
        element: <Unicons />
      },

      //  ------ Map Route ------ 
      {
        path: '/maps/google-map',
        element: <GoogleMap />
      },

      //  ------ ExtraPage Route ------ 
      {
        path: '/extra-pages/pages-timeline',
        element: <Timeline />
      },
      {
        path: '/extra-pages/pages-invoice',
        element: <Invoice />
      },
      {
        path: '/extra-pages/blank-page',
        element: <BlankPage />
      },
      {
        path: '/extra-pages/pages-pricing',
        element: <Pricing />
      },
      {
        path: '/extra-pages/pages-pricing-one',
        element: <PricingOne />
      },
      {
        path: '/extra-pages/pages-faq',
        element: <Faq />
      },
      {
        path: '/extra-pages/privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: '/extra-pages/terms-of-use',
        element: <TermsOfService />
      },
      {
        path: '/extra-pages/account-setting',
        element: <AccountSetting />
      },
      {
        path: '/extra-pages/privacy-setting',
        element: <PrivacySetting />
      }
      ,
  // Public static pages are handled by BlankLayoutRouter to keep them outside the authenticated app layout
    ]
  }
]

export const BlankLayoutRouter = [
  {
    path: "",
    element: <BlankLayout />,
    children: [

      //  ------ Auth Route ------ 
      {
        path: '/auth/sign-in',
        element: <SignIn />
      },
      {
        path: '/auth/login',
        element: <SignIn />
      },
      {
        path: '/login',
        element: <SignIn />
      },
      {
        path: '/auth/rbac-login',
        element: <RBACLogin />
      },
      {
        path: '/auth/sign-up',
        element: <SignUp />
      },
      {
        path: '/auth/register',
        element: <SignUp />
      },
      {
        path: '/register',
        element: <SignUp />
      },
      {
        path: '/auth/recover-password',
        element: <RecoverPassword />
      },
      {
        path: '/auth/forgot-password',
        element: <RecoverPassword />
      },
      {
        path: '/auth/confirm-mail',
        element: <ConformMail />
      },
      {
        path: '/auth/lock-screen',
        element: <LockScreen />
      },

      // Public static pages (soft-coded from config) - keep outside main app layout
      { path: '/features', element: <StaticPage page={getStaticPage('features')} /> },
      { path: '/security', element: <StaticPage page={getStaticPage('security')} /> },
      { path: '/integrations', element: <StaticPage page={getStaticPage('integrations')} /> },
      { path: '/docs', element: <StaticPage page={getStaticPage('docs')} /> },
      { path: '/docs/api', element: <StaticPage page={getStaticPage('docs-api')} /> },
      { path: '/help', element: <StaticPage page={getStaticPage('help')} /> },
      { path: '/training', element: <StaticPage page={getStaticPage('training')} /> },
      { path: '/webinars', element: <StaticPage page={getStaticPage('webinars')} /> },
      { path: '/case-studies', element: <StaticPage page={getStaticPage('case-studies')} /> },
      { path: '/privacy', element: <StaticPage page={getStaticPage('privacy')} /> },
      { path: '/terms', element: <StaticPage page={getStaticPage('terms')} /> },
      { path: '/cookies', element: <StaticPage page={getStaticPage('cookies')} /> },
  { path: '/gdpr', element: <StaticPage page={getStaticPage('gdpr')} /> },

      //  ------ Extra Page Route ------ 
      {
        path: '/extra-pages/pages-error-404',
        element: <Error404 />
      },
      {
        path: '/extra-pages/pages-error-500',
        element: <Error500 />
      },
      {
        path: '/extra-pages/pages-maintenance',
        element: <Maintenance />
      },
      {
        path: '/extra-pages/pages-comingsoon',
        element: <CommingSoon />
      },
    ]
  }

]