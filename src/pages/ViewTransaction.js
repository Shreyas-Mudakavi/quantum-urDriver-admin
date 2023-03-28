import { useReducer } from "react";
import {
  Container,
  Divider,
  Typography,
  Stack,
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Modal,
  Skeleton,
  Avatar,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { motion } from "framer-motion";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        transaction: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
  }
};

const ViewTransaction = () => {
  const [{ loading, transaction, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { token } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [status, setStatus] = useState();

  const params = useParams();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: "30rem",
    overflow: "scroll",
    borderRadius: "0.6rem",
  };

  const handleEditClose = () => setOpenEdit(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const getUser = async (id) => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.get(
        `http://3.239.229.120:5000/api/admin/transaction/${params?.id}`,
        {
          headers: { Authorization: token },
        }
      );

      console.log("transaction ", data);

      dispatch({ type: "FETCH_SUCCESS", payload: data?.data?.transaction });
      setStatus(data?.data?.transaction?.status);
    } catch (error) {
      console.log(error);
      dispatch({ type: "FETCH_FAIL", payload: error });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    console.log("update");
    try {
      const { data } = await axios.put(
        `http://3.239.229.120:5000/api/admin/transactions/${params?.id}`,
        {
          status,
        },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Ride details updated!", toastOptions);
      getUser();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later", toastOptions);
      getUser();
    }

    setOpenEdit(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Helmet>
          <title> View Transaction | UR DRIVER </title>
        </Helmet>

        <Container>
          <Typography variant="h5" component="span">
            {transaction?.user?.name} details
          </Typography>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            // className="w-6 h-6"
            style={{ width: "2rem", marginLeft: "1rem", cursor: "pointer" }}
            onClick={() => handleEditOpen()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>

          <Divider />
          <Box
            component="div"
            sx={{
              border: "1px solid #E8EBEE",
              width: "100%",
              height: "100%",
              p: 2,
            }}
          >
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              direction={{ sm: "column", md: "row" }}
            >
              <Grid item xs={12} md={5}>
                <div>
                  {loading ? (
                    <Skeleton variant="circular" width={100} height={100}>
                      <Avatar />
                    </Skeleton>
                  ) : (
                    <img
                      src={transaction?.user?.profile_image}
                      alt={transaction?.user?.name}
                      style={{ width: "12rem" }}
                    />
                  )}
                </div>
              </Grid>
              {loading ? (
                <Skeleton animation="wave" width={500} height={300} />
              ) : (
                <>
                  <Grid item xs="auto" md={2}>
                    <div>
                      <div>
                        <b>Name</b>
                      </div>
                      <p>{transaction?.user?.name}</p>
                    </div>
                    <div>
                      <div>
                        <b>Sex</b>
                      </div>
                      <p>{transaction?.user?.sex}</p>
                    </div>

                    <div>
                      <div>
                        <b>Updated At</b>
                      </div>
                      <p>
                        {moment(transaction?.updatedAt)
                          .utc()
                          .format("MMMM DD, YYYY")}
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={2}>
                    <div>
                      <div>
                        <b>Email</b>
                      </div>
                      <p>{transaction?.user?.email}</p>
                    </div>
                    <div>
                      <div>
                        <b>City</b>
                      </div>
                      <p>{transaction?.user?.city}</p>
                    </div>
                    <div>
                      <div>
                        <b>Deactivated</b>
                      </div>
                      <p>
                        {transaction?.user?.deactivated ? (
                          <svg
                            style={{ width: "2rem" }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="not-verified"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            style={{ width: "2rem" }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-2 h-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={2}>
                    <div>
                      <div>
                        <b>Mobile No.</b>
                      </div>
                      <p>{transaction?.user?.phone}</p>
                    </div>
                    <div>
                      <div>
                        <b>Age</b>
                      </div>
                      <p>{transaction?.user?.age}</p>
                    </div>

                    <div>
                      <div>
                        <b>Created At</b>
                      </div>
                      <p>
                        {moment(transaction?.createdAt)
                          .utc()
                          .format("MMMM DD, YYYY")}
                      </p>
                    </div>
                  </Grid>
                </>
              )}
            </Grid>

            {loading ? (
              <Skeleton animation="wave" width="40%" />
            ) : (
              <>
                <div style={{ marginTop: "5rem" }}>
                  <div style={{ marginBottom: "2rem" }}>
                    <div>
                      <b>Transaction details</b>
                    </div>
                    <Divider component="div" />
                  </div>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 4 }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    direction={{ sm: "column", md: "row" }}
                  >
                    <Grid item xs={12} md={3}>
                      <div>
                        <b>Transaction Amount</b>
                      </div>
                    </Grid>
                    <Grid item xs="auto" md={2}>
                      <div>
                        <p>${transaction?.amount}</p>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 4 }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    direction={{ sm: "column", md: "row" }}
                  >
                    <Grid item xs={12} md={3}>
                      <div>
                        <b>Status</b>
                      </div>
                    </Grid>
                    <Grid item xs="auto" md={2}>
                      <div>
                        <p>{status}</p>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 4 }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    direction={{ sm: "column", md: "row" }}
                  >
                    <Grid item xs={12} md={3}>
                      <div>
                        <b>Transaction type</b>
                      </div>
                    </Grid>
                    <Grid item xs="auto" md={2}>
                      <div>
                        <p>{transaction?.type}</p>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 4 }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    direction={{ sm: "column", md: "row" }}
                  >
                    <Grid item xs={12} md={3}>
                      <div>
                        <b>Description</b>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <div>
                        <p>{transaction?.metadata?.description}</p>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </>
            )}
          </Box>

          <Modal
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit transaction
              </Typography>
              <Stack direction="column" spacing={3}>
                <form onSubmit={handleEditSubmit}>
                  <div style={{ margin: "2rem 0rem" }}>
                    <TextField
                      fullWidth
                      disabled
                      name="amount"
                      id="outlined-transaction-amount"
                      label="Transaction Amount"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={transaction?.amount}
                    />
                  </div>

                  <div style={{ margin: "2rem 0rem" }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={status}
                      label="status"
                      onChange={handleStatusChange}
                    >
                      <MenuItem value="PENDING">PENDING</MenuItem>
                      <MenuItem value="TXN_FAILURE">TXN_FAILURE</MenuItem>
                      <MenuItem value="TXN_SUCCESS">TXN_SUCCESS</MenuItem>
                    </Select>
                  </div>

                  <div style={{ margin: "2rem 0rem" }}>
                    <TextField
                      disabled
                      fullWidth
                      name="description"
                      id="outlined-description"
                      label="Description"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={transaction?.metadata?.description}
                    />
                  </div>

                  <div style={{ margin: "2rem 0rem" }}>
                    <TextField
                      disabled
                      fullWidth
                      name="type"
                      id="outlined-description"
                      label="Type"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={transaction?.type}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="medium"
                  >
                    Update
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    size="medium"
                    onClick={handleEditClose}
                    style={{ marginLeft: "1rem" }}
                  >
                    Cancel
                  </Button>
                </form>
              </Stack>
            </Box>
          </Modal>
        </Container>
      </motion.div>
      <ToastContainer />
    </>
  );
};

export default ViewTransaction;
