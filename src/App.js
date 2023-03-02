import { Store } from "./Store";
import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import AdminProtectedRoute from "./components/protectedRoute/AdminProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/layout/SideNavBar";
import NotFound from "./components/layout/NotFound";

import Transaction from "./components/transaction/Transaction.js";
// import AddTransaction from "./components/transaction/AddTransaction.js";
import ViewTransaction from "./components/transaction/ViewTransaction.js";

import Wallet from "./components/wallet/Wallet.js";
// import AddWallet from "./components/wallet/AddWallet.js";
import ViewWallet from "./components/wallet/ViewWallet.js";

import Trips from "./components/trips/Trips.js";
// import AddTrip from "./components/trips/AddTrip.js";
import ViewTrip from "./components/trips/ViewTrip.js";

import Users from "./components/user/Users.js";
import ViewUser from "./components/user/ViewUser.js";

import Drivers from "./components/driver/Drivers.js";
import ViewDriver from "./components/driver/ViewDriver.js";

import AdminLoginScreen from "./components/AdminLoginScreen";
import Dashboard from "./components/layout/Dashboard";

const Children = ({ child }) => (
  <AdminProtectedRoute>{child}</AdminProtectedRoute>
);
function App() {
  const { state } = useContext(Store);
  const { token } = state;
  const pathname = window.location.pathname;
  console.log(pathname);

  return (
    <BrowserRouter>
      <div className="main-wrapper">
        <div className="sidebar-wrapper">
          {/* <Menu/> */}
          <SideNavbar />
        </div>
        <div className="body-wrapper">
          <div style={{ width: "100%" }}>
            <Header />
            <Routes>
              <Route path="/" element={<AdminLoginScreen />} />
              <Route
                path="/admin/dashboard"
                element={<Children child={<Dashboard />} />}
              />

              <Route
                path="/admin/users"
                element={<Children child={<Users />} />}
              />
              <Route
                path="/admin/view/user/:id"
                element={<Children child={<ViewUser />} />}
              />
              
              <Route
                path="/admin/drivers"
                element={<Children child={<Drivers />} />}
              />
              <Route
                path="/admin/view/driver/:id"
                element={<Children child={<ViewDriver />} />}
              />

              <Route
                path="/admin/transactions"
                element={<Children child={<Transaction />} />}
              />
              {/* <Route
                path="/admin/transaction/create"
                element={<Children child={<AddTransaction />} />}
              /> */}
              <Route
                path="/admin/view/transaction/:id"
                element={<Children child={<ViewTransaction />} />}
              />

              <Route
                path="/admin/wallet"
                element={<Children child={<Wallet />} />}
              />
              {/* <Route
                path="/admin/wallet/create"
                element={<Children child={<AddWallet />} />}
              /> */}
              <Route
                path="/admin/view/wallet/:id"
                element={<Children child={<ViewWallet />} />}
              />

              <Route
                path="/admin/trips"
                element={<Children child={<Trips />} />}
              />
              {/* <Route
                path="/admin/trip/create"
                element={<Children child={<AddTrip />} />}
              /> */}
              <Route
                path="/admin/view/trip/:id"
                element={<Children child={<ViewTrip />} />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
