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

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'driver', element: <DriverPage /> },
        { path: 'transaction', element: <TransactionPage /> },
        { path: 'trip', element: <TripsPage /> },
        { path: 'trip/view/:id', element: <ViewTrip /> },
        { path: 'transaction/view/:id', element: <ViewTransaction /> },
        { path: 'wallet', element: <WalletPage /> },
        { path: 'wallet/view/:id', element: <ViewWallet /> },
        { path: 'user/view/:id', element: <EditUser /> },
        { path: 'driver/view/:id', element: <EditDriver /> },
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
