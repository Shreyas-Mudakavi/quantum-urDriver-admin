import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../Store";
// import logo from "./images/dv.svg";
import "./SideNavBar.css";

const linkList = [
  { icon: "fa fa-id-card", text: "Dashboard", url: "/admin/dashboard" },
  { icon: "fa fa-user-friends", text: "Users", url: "/admin/users" },
  { icon: "fa fa-user-circle", text: "Drivers", url: "/admin/drivers" },
  { icon: "fas fa-exchange-alt", text: "Transactions", url: "/admin/transactions" },
  { icon: "fas fa-bus-alt", text: "Trips", url: "/admin/trips" },
  { icon: "fas fa-wallet", text: "Wallet", url: "/admin/wallet" },
];
export default function SideNavbar() {
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [isExpanded, setExpendState] = useState(true);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <>
      {userInfo ? (
        <div
          className={
            isExpanded
              ? "side-nav-container"
              : "side-nav-container side-nav-container-NX"
          }
        >
          <div className="nav-upper">
            <div
              className={`nav-heading ${
                isExpanded
                  ? "justify-content-between"
                  : "justify-content-center"
              }`}
            >
              {isExpanded && (
                <a href="index3.html" className="brand-link">
                  {/* <img src={logo} alt="" width={"50px"} height="auto" /> */}
                  <span className="brand-text ml-2 font-weight-light">
                    Boston George
                  </span>
                </a>
              )}
              <button
                className="sidebar-toggle-btn"
                onClick={() => setExpendState(!isExpanded)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
            <div className="sidebar">
              {/* Sidebar user panel (optional) */}
              <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                <div className="info">
                  {isExpanded && (
                    <Link to="/view-profile" className="d-block">
                      {userInfo.profile_image && (
                        <img
                          src={userInfo.profile_image}
                          alt=""
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "0.5rem",
                          }}
                        />
                      )}
                      <span className="info-text">
                        Welcome{" "}
                        {userInfo
                          ? `${userInfo.firstname} ${userInfo.lastname}`
                          : "Back"}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
              {/* Sidebar Menu */}
              <nav className="mt-2">
                <ul
                  className="nav nav-pills nav-sidebar flex-column"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  {linkList.map(({ icon, text, url }) => (
                    <li key={url}
                      className={`nav-item has-treeview ${
                        isExpanded ? "menu-item" : "menu-item menu-item-NX"
                      } ${activeLink === text && 'active-item'}`}
                      onClick={() => setActiveLink(text)}
                    >
                      <Link to={url} className="nav-link">
                        <i className={icon}></i>
                        {isExpanded && <p className="ml-2">{text}</p>}
                      </Link>
                    </li>
                  ))}

                  <li
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                  >
                    <Link onClick={signoutHandler} to="/" className="nav-link">
                      <i className="fas fa-sign-out-alt"></i>
                      {isExpanded && <p className="ml-2">Log Out</p>}
                    </Link>
                  </li>
                </ul>
              </nav>
              {/* /.sidebar-menu */}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
