import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import LoadingBox from "../layout/LoadingBox";
import axios from "axios";

import { Button } from "react-bootstrap";
import { MdToggleOff, MdToggleOn } from "react-icons/md";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        trips: action.payload.trips,
        pages: Math.ceil(action.payload.trips.length / 15),
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function Trips() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  let a = (page - 1) * 15;
  console.log("token", token);

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState(false);
  const [del, setDel] = useState(false);

  const [{ loading, error, trips, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const deleteTrip = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?") === true) {
      try {
        setDel(true);
        const res = await axios.delete(
          `http://3.239.229.120:5000/api/admin/user/${id}`,

          {
            headers: { Authorization: token },
          }
        );
        setDel(false);
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        if (searchInput) {
          const res = await axios.get(
            `http://3.239.229.120:5000/api/admin?search=${searchInput}&in=users`,

            {
              headers: { Authorization: token },
            }
          );

          navigate("/admin/users?page=1");
          dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        } else {
          const res = await axios.get(
            "http://3.239.229.120:5000/api/rides/all",

            {
              headers: { Authorization: token },
            }
          );
          console.log("trips", res.data.data);
          dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
        }
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [page, token, del, query]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <div className="wrapper">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="card">
                <div className="card-header">
                  <div className="float-right">
                    <nav className="navbar navbar-expand navbar-white navbar-light">
                      <form className="form-inline ml-3">
                        <div className="input-group input-group-sm">
                          <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="form-control form-control-navbar"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                          />
                          <div className="input-group-append">
                            <button className="btn btn-navbar">
                              <i
                                className="fas fa-search"
                                onClick={(e) => {
                                  setQuery(!query);
                                }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </nav>
                  </div>
                </div>

                <div className="card-body">
                  <div className="table-responsive">
                    <table
                      id="example1"
                      className="table table-bordered table-striped"
                    >
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>User</th>
                          <th>Pickup Addr.</th>
                          <th>Dest. Addr.</th>
                          <th>Fare</th>
                          <th>Status</th>
                          <th>Driver</th>
                          <th>OTP</th>
                          <th>Payment</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trips.slice(a, a + 15).map((trip, i) => (
                          <tr key={trip._id} className="odd">
                            <td className="text-center">{i + 1}</td>
                            <td>{trip.user.name}</td>
                            <td>{trip.pickup.pickUpAddress}</td>
                            <td>{trip.destination.destinationAddress}</td>
                            <td>{trip.fare}</td>
                            <td>{trip.status}</td>
                            <td>{trip.driver.name}</td>
                            <td>{trip.otp}</td>
                            <td>
                              {trip.payment ? (
                                <MdToggleOn
                                  className="on"
                                  // onClick={() =>
                                  //   paymentStatusHandler(
                                  //     trip._id,
                                  //     0
                                  //   )
                                  // }
                                />
                              ) : (
                                <MdToggleOff
                                  className="off"
                                  // onClick={() =>
                                  //   paymentStatusHandler(
                                  //     trip._id,
                                  //     1
                                  //   )
                                  // }
                                />
                              )}
                            </td>
                            <td>
                              <Button
                                onClick={() => {
                                  navigate(`/admin/view/trip/${trip._id}`);
                                }}
                                type="success"
                                className="btn btn-primary"
                              >
                                <i className="fa fa-eye"></i>
                              </Button>
                              <Button
                                onClick={() => {
                                  deleteTrip(trip._id);
                                }}
                                type="danger"
                                className="btn btn-danger ml-1"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 float-right">
                    <div className="dataTables_paginate paging_simple_numbers">
                      <ul className="pagination">
                        {[...Array(pages).keys()].map((x) => (
                          <div key={x}>
                            <Link
                              className={
                                x + 1 === Number(page)
                                  ? "page-link paginate_button page-item active"
                                  : "page-link paginate_button page-item"
                              }
                              key={x + 1}
                              to={`/admin/users?page=${x + 1}`}
                            >
                              {x + 1}
                            </Link>
                          </div>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
