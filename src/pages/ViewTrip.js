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

const ViewTrip = () => {
  const { token } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    city: "",
    sex: "",
    age: "",
    profile_image: "",
    phone: "",
    createdAt: "",
    updatedAt: "",
    fare: "",
    otp: "",
    // status: '',
    destinationAddr: "",
    destinationLat: "",
    destinationLong: "",
    pickupAddr: "",
    pickupLat: "",
    pickupLong: "",
    driver: "",
  });
  const [role, setRole] = useState("");
  const [status, setStatus] = useState();
  const [mode, setMode] = useState("");
  const [deactivated, setDeactivated] = useState();
  const [payment, setPayment] = useState(false);

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

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPayment(e.target.value);
  };

  const handleEditClose = () => setOpenEdit(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const getUser = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://3.239.229.120:5000/api/rides/${params?.id}`,
        {
          headers: { Authorization: token },
        }
      );

      console.log("trip ", data);

      setValues({
        driver: data?.data?.trip?.driver,
        name: data?.data?.trip?.user?.name,
        email: data?.data?.trip?.user?.email,
        sex: data?.data?.trip?.user?.sex,
        age: data?.data?.trip?.user?.age,
        city: data?.data?.trip?.user?.city,
        profilePic: data?.data?.trip?.user?.profile_image,
        phone: data?.data?.trip?.user?.phone,
        createdAt: data?.data?.trip?.createdAt,
        updatedAt: data?.data?.trip?.updatedAt,
        fare: data?.data?.trip?.fare,
        destinationAddr: data?.data?.trip?.destination?.destinationAddress,
        pickupAddr: data?.data?.trip?.pickup?.pickUpAddress,
        destinationLat: data?.data?.trip?.destination?.latLng?.latitude,
        destinationLong: data?.data?.trip?.destination?.latLng?.longitude,
        pickupLat: data?.data?.trip?.pickup?.latLng?.latitude,
        pickupLong: data?.data?.trip?.pickup?.latLng?.longitude,
        otp: data?.data?.trip?.otp,
      });

      setRole(data?.data?.trip?.user?.account_type);
      setDeactivated(data?.data?.trip?.user?.deactivated);
      setStatus(data?.data?.trip?.status);
      setPayment(data?.data?.trip?.payment);
      setMode(data?.data?.trip?.mode);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  console.log(payment);
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `http://3.239.229.120:5000/api/admin/rides/${params?.id}`,
        {
          status,
          payment,
          mode,
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
    }

    setOpenEdit(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Helmet>
        <title> View Trip | UR DRIVER </title>
      </Helmet>

      <Container>
        <Typography variant="h5" component="span">
          {values?.name}
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
                    src={values?.profile_image}
                    alt={values?.name}
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
                    <p>{values?.name}</p>
                  </div>
                  <div>
                    <div>
                      <b>Account type</b>
                    </div>
                    <p>{role}</p>
                  </div>
                  <div>
                    <div>
                      <b>Sex</b>
                    </div>
                    <p>{values?.sex}</p>
                  </div>

                  <div>
                    <div>
                      <b>Updated At</b>
                    </div>
                    <p>
                      {moment(values?.updatedAt).utc().format("MMMM DD, YYYY")}
                    </p>
                  </div>

                  <div>
                    <div>
                      <b>OTP</b>
                    </div>
                    <p>{values?.otp}</p>
                  </div>

                  {/* <div style={{ marginTop: "6rem" }}>
                    <div>
                      <b>Pickup Address</b>
                    </div>
                    <p>{values?.pickupAddr}</p>
                  </div>

                  <div style={{ marginTop: "6rem" }}>
                    <div>
                      <b>Pickup Lat</b>
                    </div>
                    <p>{values?.pickupLat}</p>
                  </div>

                  <div>
                    <div>
                      <b>Pickup Long</b>
                    </div>
                    <p>{values?.pickupLong}</p>
                  </div> */}
                </Grid>
                <Grid item xs="auto" md={2}>
                  <div>
                    <div>
                      <b>Email</b>
                    </div>
                    <p>{values?.email}</p>
                  </div>
                  <div>
                    <div>
                      <b>City</b>
                    </div>
                    <p>{values?.city}</p>
                  </div>
                  <div>
                    <div>
                      <b>Deactivated</b>
                    </div>
                    <p>
                      {deactivated ? (
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

                  <div>
                    <div>
                      <b>Status</b>
                    </div>
                    <p>{status}</p>
                  </div>
                </Grid>
                <Grid item xs="auto" md={2}>
                  <div>
                    <div>
                      <b>Mobile No.</b>
                    </div>
                    <p>{values?.phone}</p>
                  </div>

                  <div>
                    <div>
                      <b>Created At</b>
                    </div>
                    <p>
                      {moment(values?.createdAt).utc().format("MMMM DD, YYYY")}
                    </p>
                  </div>

                  <div>
                    <div>
                      <b>Fare</b>
                    </div>
                    <p>$ {values?.fare}</p>
                  </div>

                  <div>
                    <div>
                      <b>Payment</b>
                    </div>
                    <p>{payment ? "Paid" : "Not paid"}</p>
                  </div>

                  {mode && (
                    <div>
                      <div>
                        <b>Payment Mode</b>
                      </div>
                      <p>{mode}</p>
                    </div>
                  )}
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
                    <b>Ride Details</b>
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
                      <b>Pickup Address</b>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={4}>
                    <div>
                      <p>{values?.pickupAddr}</p>
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
                      <b>Pickup Latitude</b>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={4}>
                    <div>
                      <p>{values?.pickupLat}</p>
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
                      <b>Pickup Longitude</b>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={4}>
                    <div>
                      <p>{values?.pickupLong}</p>
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
                      <b>Destination Address</b>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={4}>
                    <div>
                      <p>{values?.destinationAddr}</p>
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
                      <b>Destination Latitude</b>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={4}>
                    <div>
                      <p>{values?.destinationLat}</p>
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
                      <b>Destination Longitude</b>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={4}>
                    <div>
                      <p>{values?.destinationLong}</p>
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
              Edit Trip
            </Typography>
            <Stack direction="column" spacing={3}>
              <form onSubmit={handleEditSubmit}>
                <div style={{ margin: "2rem 0rem" }}>
                  <TextField
                    fullWidth
                    disabled
                    name="pickUpAddr"
                    id="outlined-pickup-address"
                    label="Pickup Address"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.pickupAddr}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div style={{ margin: "2rem 0rem" }}>
                  <TextField
                    fullWidth
                    disabled
                    name="destinationAddr"
                    id="outlined-destination-address"
                    label="Destination Address"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.destinationAddr}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div style={{ margin: "2rem 0rem" }}>
                  <TextField
                    fullWidth
                    disabled
                    name="pickUpLat"
                    id="outlined-pickup-Lat"
                    label="Pickup Latitude"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.pickupLat}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div style={{ margin: "2rem 0rem" }}>
                  <TextField
                    fullWidth
                    disabled
                    name="pickUpLong"
                    id="outlined-pickup-Long"
                    label="Pickup Longitutde"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.pickupLong}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div style={{ margin: "2rem 0rem" }}>
                  <TextField
                    fullWidth
                    disabled
                    name="destinationLat"
                    id="outlined-destiantion-Lat"
                    label="Destination Latitude"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.destinationLat}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div style={{ margin: "2rem 0rem" }}>
                  <TextField
                    fullWidth
                    disabled
                    name="destinationLong"
                    id="outlined-destiantion-Long"
                    label="Destination Longitutde"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.destinationLong}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>

                <div style={{ margin: "2rem 0rem" }}>
                  <TextField
                    fullWidth
                    disabled
                    name="fare"
                    id="outlined-fare"
                    label="Fare"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.fare}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
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
                    required
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="ongoing">On-going</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </div>

                <div style={{ margin: "2rem 0rem" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Payment
                  </InputLabel>
                  <Select
                    name="payment"
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={payment}
                    label="payment"
                    required
                    onChange={handlePaymentChange}
                  >
                    <MenuItem value={false}>Not paid</MenuItem>
                    <MenuItem value={true}>Paid</MenuItem>
                  </Select>
                </div>

                <div style={{ margin: "2rem 0rem" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Mode
                  </InputLabel>
                  <Select
                    name="payment"
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={mode}
                    label="payment"
                    required
                    onChange={handleModeChange}
                    displayEmpty
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="paypal">Paypal</MenuItem>
                    <MenuItem value="wallet">Wallet</MenuItem>
                  </Select>
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

      <ToastContainer />
    </>
  );
};

export default ViewTrip;
