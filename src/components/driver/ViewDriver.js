import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
// import EditUserModel from "./EditUser.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, driver: action.payload.user };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewDriver = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // driver/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, driver }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`http://3.239.229.120:5000/api/admin/user/${id}`, {
          headers: { Authorization: token },
        });
        console.log("driver", data.data);

        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
  }, [id]);

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
        <>
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">{driver.name} Details</h3>
                  <div className="card-tools">
                    <i
                      className="fa fa-edit"
                      style={{ color: "blue" }}
                      onClick={() => setModalShow(true)}
                    ></i>
                  </div>
                </div>
                <div className="card-body">
                  <h4></h4>

                  <section className="content">
                    <div className="container-fluid">
                      {/* SELECT2 EXAMPLE */}
                      <div className="card card-default ">
                        {/* /.card-header */}
                        <div className="card-body">
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <div className="form-group">
                                <img
                                  src={driver.profile_image}
                                  alt=""
                                  width={"200px"}
                                  height={"200px"}
                                />
                              </div>
                            </div>

                            <div className="col-md-8">
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Email</label>
                                    </p>
                                    <p>{driver.email}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Name</label>
                                    </p>
                                    <p>{driver.name}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Sex</label>
                                    </p>
                                    <p>{driver.sex}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Age</label>
                                    </p>
                                    <p>{driver.age}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>City</label>
                                    </p>
                                    <p>{driver.city}</p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Phone</label>
                                    </p>
                                    <p>{driver.phone}</p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Account Type</label>
                                    </p>
                                    <p>{driver.account_type}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Created At</label>
                                    </p>
                                    <p>{getDateTime(driver.createdAt)}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Last Update</label>
                                    </p>
                                    <p>{getDateTime(driver.updatedAt)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h4 className="mb-3">License Details</h4>
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <div className="form-group">
                                <img
                                  src={driver.license.image}
                                  alt=""
                                  width={"200px"}
                                  height={"200px"}
                                />
                              </div>
                            </div>

                            <div className="col-md-8">
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>License No.</label>
                                    </p>
                                    <p>{driver.license.license_no}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h4 className="mb-3">Vehicle Details</h4>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Brand</label>
                                </p>
                                <p>{driver.vehicle.information.brand}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Model</label>
                                </p>
                                <p>{driver.vehicle.information.model}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Registration No.</label>
                                </p>
                                <p>
                                  {driver.vehicle.information.registration_no}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Type</label>
                                </p>
                                <p>{driver.vehicle.type}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Wheels</label>
                                </p>
                                <p>{driver.vehicle.wheels}</p>
                              </div>
                            </div>
                          </div>
                          {/* /.card-body */}
                        </div>

                        {/* /.row */}
                      </div>
                    </div>
                  </section>
                </div>
                {/* /.card */}
              </div>
              {/* /.card */}

              {/* /.card */}
            </div>
            {/* /.container-fluid */}
          </section>
          {/* /.content */}

          {/* <EditUserModel show={modalShow} onHide={() => setModalShow(false)} /> */}
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default ViewDriver;
