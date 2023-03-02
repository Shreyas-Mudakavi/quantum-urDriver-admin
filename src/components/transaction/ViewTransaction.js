import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
// import EditCategoryModel from "./EditTransaction.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        transaction: action.payload.transaction,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewTransaction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // transaction/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, transaction }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`http://3.239.229.120:5000/api/admin/transaction/${id}`, {
          headers: { Authorization: token },
        });
        console.log("transaction", data.data);

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
                  <h3 className="card-title">Transaction Details</h3>
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
                                <p className="mb-0">
                                  <label>User</label>
                                </p>
                                <p>{transaction.user.name}</p>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Amount</label>
                                </p>
                                <p>{transaction.amount}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Description</label>
                                </p>
                                <p>{transaction.metadata.description}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Type</label>
                                </p>
                                <p>{transaction.type}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Status</label>
                                </p>
                                <p>{transaction.status}</p>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Created At</label>
                                </p>
                                <p>{getDateTime(transaction.createdAt)}</p>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Last Update</label>
                                </p>
                                <p>{getDateTime(transaction.updatedAt)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* /.card-body */}
                      </div>

                      {/* /.row */}
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

          {/* <EditCategoryModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          /> */}
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default ViewTransaction;
