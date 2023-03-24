import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import WalletPage from './pages/WalletPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import EditUser from './pages/EditUser';
import TransactionPage from './pages/TransactionPage';
import ViewWallet from './pages/ViewWallet';
import ViewTransaction from './pages/ViewTransaction';
import TripsPage from './pages/TripsPage';
import ViewTrip from './pages/ViewTrip';
import DriverPage from './pages/DriverPage';
import EditDriver from './pages/EditDriver';
import ProtectedRoute from './utils/ProtectedRoute';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <ProtectedRoute>
        <DashboardLayout />
        </ProtectedRoute>,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <ProtectedRoute><DashboardAppPage /></ProtectedRoute> },
        { path: 'user', element: <ProtectedRoute><UserPage /></ProtectedRoute> },
        { path: 'driver', element: <ProtectedRoute><DriverPage /></ProtectedRoute> },
        { path: 'transaction', element: <ProtectedRoute><TransactionPage /></ProtectedRoute> },
        { path: 'trip', element: <ProtectedRoute><TripsPage /></ProtectedRoute> },
        { path: 'trip/view/:id', element: <ProtectedRoute><ViewTrip /></ProtectedRoute> },
        { path: 'transaction/view/:id', element: <ProtectedRoute><ViewTransaction /></ProtectedRoute> },
        { path: 'wallet', element: <ProtectedRoute><WalletPage /></ProtectedRoute> },
        { path: 'wallet/view/:id', element: <ProtectedRoute><ViewWallet /></ProtectedRoute> },
        { path: 'user/view/:id', element: <ProtectedRoute><EditUser /></ProtectedRoute> },
        { path: 'driver/view/:id', element: <ProtectedRoute><EditDriver /></ProtectedRoute> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
