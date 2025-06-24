import React, { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from './helper/ErrorBoundary'; 
import LoadingScreen from './components/Loader/LoadingScreen';
import { ROLES } from './constant/roles';
import { getIsAuth } from './services/Auth';
import { useDialog } from './context/DialogProvider';
import FeedbackSuccessPage from './components/utils/SubmitConfirmationForm';
import DocumentationPage from './Pages/Documentation/Document';
// Lazy-loaded components
const ApplicationManagement = React.lazy(() => import('./Pages/Management/ApplicationManagement'));
const DragDropReport = React.lazy(() => import('./Pages/DragDropReport/DragDropReport'));
const AnalyticsDashboard = React.lazy(()=> import('./Pages/Analytics/AnalyticsDashboard'));
const TransactionDetails = React.lazy(()=>import('./Pages/PaymentTransaction/TransactionDetails'));
const PasswordChangeCelebration = React.lazy(()=> import('./Pages/Auth/PasswordChangeCelebration'));
const PartyInvoicePage = React.lazy(()=> import('./Pages/PartyInvoice/PartyInvoicePage'));
const PartyManagement = React.lazy(()=> import('./Pages/PartyInvoice/PartyManagement'));
const InvoiceTemplate = React.lazy(()=> import('./Pages/PartyInvoice/Invoice/InvoiceTemplate'));
const AgendaManagement = React.lazy(()=> import('./Pages/Agenda/AgendaManagement'));
const PartyInvoice = React.lazy(() => import('./Pages/PartyInvoice/PartyInvoiceForm'));
const ActivityLogPage = React.lazy(()=> import('./Pages/Activitylog/ActivityLog'));
const CreateNewPassword =React.lazy(()=> import('./Pages/Auth/CreateNewPassword'));
const OTPVerification =React.lazy(()=> import('./Pages/Auth/OTPVerification'));
const InventoryCreationForm = React.lazy(()=> import('./Pages/Inventory/CreateInventoryItem')) ;
const ForgetPassword = React.lazy(()=> import('./Pages/Auth/ForgetPassword'));
const MenuDetails = React.lazy(()=> import('./Pages/Inventory/MenuDetails'));
const ProtectedRoute = React.lazy(() => import('./ProtectedRoute'));
const MemberManagement = React.lazy(() => import('./Pages/Member/MemberManagement'));
const LandingPage = React.lazy(() => import('./Pages/LandingPage/LandingPage'));
const UnauthorizedPage = React.lazy(() => import('./helper/Unauthorized'));
const EventManagement = React.lazy(() => import('./Pages/Event/EventManagement'));
const UserTransactions = React.lazy(() => import('./Pages/Member/UserTransaction'));
const BulkCreateMember = React.lazy(() => import('./Pages/Member/BulkCreateMember'));
const BulkCreateInventoryItem = React.lazy(() => import('./Pages/Inventory/BulkCreateInventoryItems'));
const PaymentTransactions = React.lazy(() => import('./Pages/PaymentTransaction/PaymentTransactions'));
const MemberProfile = React.lazy(() => import('./Pages/Member/MemberProfile'));
const BulkCreateTransaction = React.lazy(() => import('./Pages/PaymentTransaction/BulkCreateTransaction'));
const CreateMemberProfile = React.lazy(() => import('./Pages/Member/CreateMember'));
const CreateEventForm = React.lazy(() => import('./Pages/Event/CreateEventForm'));
const Applicationuser = React.lazy(() => import('./Pages/Appuser/Applicationuser'));
const Dashboard = React.lazy(() => import('./Pages/Dashboard/Dashboard'));
const InvoiceAndBilling = React.lazy(() => import('./Pages/Invoice/InvoiceAndBilling'));
const InventoryPage = React.lazy(() => import('./Pages/Inventory/Inventory'));
const ItemDetails = React.lazy(() => import('./Pages/Inventory/ItemDetails'));
const SettingsPage = React.lazy(() => import('./Pages/Setting/Setting'));
const NotFound = React.lazy(() => import('./helper/NotFound'));
const SignIn = React.lazy(() => import('./Pages/Auth/SignIn'));
const MoviesListPage = React.lazy(() => import('./Pages/LandingPage/MoviesList'));
const WhatsNew = React.lazy(() => import('./Pages/WhatsNew'));
const CompanyProfile = React.lazy(() => import('./Pages/CompanyProfile/CompanyProfile'));
const BackupManagementPage = React.lazy(() => import('./Pages/BackupAndSecurity/DataBackup'))

// legal pages
const TermsOfService = React.lazy(() => import('./Pages/Legal/TermsOfService'));
const PrivacyPolicy = React.lazy(() => import('./Pages/Legal/PrivacyPolicy'));
const ClubRules = React.lazy(() => import('./Pages/Legal/ClubRules'));
const CookiePolicy = React.lazy(() => import('./Pages/Legal/CookiePolicy'));
const AccessibilityPage = React.lazy(() => import('./Pages/Accessibility/AccessibilityPage'));

// public pages 
const AboutUsPage = React.lazy(() => import('./Pages/ClubPublicPages/AboutUs'));
const EventsPage = React.lazy(() => import('./Pages/ClubPublicPages/EventsPage'));
const ActivitiesPage = React.lazy(() => import('./Pages/ClubPublicPages/ActivitiesPage'));
const MembershipPage = React.lazy(() => import('./Pages/ClubPublicPages/MembershipPage'));


const AUTH_ROUTES = [
  '/auth/sign-in',
  '/auth/forget-password',
  '/auth/create-new-password',
  '/auth/verify-otp',
  '/welcome',
  '/my-profile',
  '/menu-details',
  '/user-transactions/:userId',
  '/unauthorized',
  '/whats-new',
  '/terms-of-service',
  '/privacy-policy',
  '/club-rules',
  '/cookie-policy',
  '/accessibility',
  '/about-us',
  '/events',
  '/activities',
  '/membership',

];

const MainRoutes = () => {
  const { showAlert } = useDialog();
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        
        if (!user?.token) {
          if (!isAuthRoute) {
            navigate('/auth/sign-in', { replace: true });
          }
          setIsCheckingAuth(false);
          return;
        }

        const res = await getIsAuth(user.token);
        if (!res || res.error) {
          showAlert(
            "Session Expired",
            "Your session has expired. Please log in again to continue.",
            "error"
          );
          localStorage.removeItem('user');
          navigate('/auth/sign-in', { replace: true });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        showAlert(
          "Authentication Error",
          "There was a problem verifying your session. Please log in again.",
          "error"
        );
        localStorage.removeItem('user');
        navigate('/auth/sign-in', { replace: true });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (!isAuthRoute) {
      checkAuth();
    } else {
      setIsCheckingAuth(false);
    }
  }, [location.pathname]);

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* auth public Routes */}
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/forget-password" element={<ForgetPassword />} />
          <Route path="/auth/verify-otp" element={<OTPVerification />} />
          <Route path="/auth/create-new-password" element={<CreateNewPassword />} />
          <Route path="/auth/password-updated" element={<PasswordChangeCelebration />} />
          <Route path="/whats-new" element={<WhatsNew />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/club-rules" element={<ClubRules />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/membership" element={<MembershipPage />} />

          {/* User Visible Pages */}
          <Route element={<ProtectedRoute roles={[ROLES.USER, ROLES.VIEWER]} />}>
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/my-profile" element={<MemberProfile />} />
            <Route path="/menu-details" element={<MenuDetails />} />
            <Route path="/movies" element={<MoviesListPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute roles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.EDITOR]} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Inventory" element={<InventoryPage />} />
            <Route path="/Inventory/create-single" element={<InventoryCreationForm />} />
            <Route path="/setting" element={<SettingsPage />} />
            <Route path="/member-managemnet" element={<MemberManagement />} />
            <Route path="/create-member" element={<CreateMemberProfile />} />
            <Route path="/event-management" element={<EventManagement />} />
            <Route path="/event-management/create" element={<CreateEventForm />} />
            <Route path="/all-transaction" element={<PaymentTransactions />} />
            <Route path="/transaction-details/:invoiceNumber" element={<TransactionDetails />} />
            <Route path="/agenda-management" element={<AgendaManagement />} />
            <Route path="/report/advance-analytics" element={<AnalyticsDashboard />} />
            <Route path="/report/drag-drop-pipeline" element={<DragDropReport />} />
            <Route path="/application-management" element={<ApplicationManagement />} />
            <Route path="/Inventory/item/:itemCode" element={<ItemDetails />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
            <Route path="/backup-management" element={<BackupManagementPage />} />
          </Route>

          {/* For Everyone */}
          <Route
            path="/user-transactions/:userId"
            element={<UserTransactions />}
          />

          {/* club adminstrator only Cashier Only */}
          <Route element={<ProtectedRoute roles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.CASHIER]} />}>
            <Route path="/invoice-billing" element={<InvoiceAndBilling />} />
            <Route path="/transactions/log-activity" element={<ActivityLogPage />} />
            <Route path="/party-invoice-billing" element={<PartyInvoice />} />
            <Route path="/party-management" element={<PartyManagement />} />
            <Route path="/party-invoice/:invoiceNumber" element={<PartyInvoicePage />} />
            <Route path="/party-invoice/pdf-view" element={<InvoiceTemplate />} />
            <Route path="/feedback-form-success" element={<FeedbackSuccessPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
          </Route>

          {/* Bulk Creation for Super Admin */}
          <Route element={<ProtectedRoute roles={[ROLES.SUPERADMIN,ROLES.ADMIN]} />}>
            <Route path="/member-managemnet/create" element={<BulkCreateMember />} />
            <Route path="/Inventory/create" element={<BulkCreateInventoryItem />} />
            <Route path="/all-transaction/create" element={<BulkCreateTransaction />} />
            <Route path="/application-user" element={<Applicationuser />} />
          </Route>

          {/* Page Not Found */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default MainRoutes;