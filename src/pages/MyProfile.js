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
  Switch,
  FormControlLabel,
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

const MyProfile = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [values, setValues] = useState({
    name: "",
    city: "",
    profile_image: "",
    phone: "",
    verified: "",
    createdAt: "",
    updatedAt: "",
    sex: "",
    age: 0,
    email: "",
    license: "",
    vehicle: "",
  });
  const [role, setRole] = useState("");
  const [deactivated, setDeactivated] = useState();
  const params = useParams();
  const [updatedDetails, setUpdatedDetails] = useState({
    name: "",
    profile_image: "",
    phone: "",
  });

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

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const handleEditClose = () => setOpenEdit(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    console.log("update");

    editUser(params?.id);

    setOpenEdit(false);
  };

  console.log(deactivated);

  const editUser = async (id) => {
    const { name, profile_image, phone } = values;
    try {
      const { data } = await axios.put(
        `http://3.239.229.120:5000/api/users`,
        { name, profile_image, phone },
        {
          headers: { Authorization: token },
        }
      );

      toast.success("Details updated!", toastOptions);
      getUser();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later", toastOptions);
      getUser();
    }
  };

  const getUser = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://3.239.229.120:5000/api/users/authenticate`,
        {
          headers: { Authorization: token },
        }
      );

      console.log("user ", data);

      setValues({
        name: data?.data?.userInfo?.name,
        email: data?.data?.userInfo?.email,
        city: data?.data?.userInfo?.city,
        profile_image: data?.data?.userInfo?.profile_image,
        phone: data?.data?.userInfo?.phone,
        createdAt: data?.data?.userInfo?.createdAt,
        updatedAt: data?.data?.userInfo?.updatedAt,
        sex: data?.data?.userInfo?.sex,
        age: data?.data?.userInfo?.age,
        license: data?.data?.userInfo?.license,
        vehicle: data?.data?.userInfo?.vehicle,
      });

      setRole(data?.data?.userInfo?.account_type);
      setDeactivated(data?.data?.userInfo?.deactivated);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
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
          <title> Admin details | UR DRIVER </title>
        </Helmet>

        <Container>
          <Typography variant="h5" component="span">
            {values?.name} details
          </Typography>
          <>
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
          </>
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
              spacing={{ xs: 2, md: 4 }}
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item xs={12} md={5}>
                <div>
                  {loading ? (
                    <Skeleton
                      variant="circular"
                      animation="wave"
                      width={100}
                      height={100}
                    >
                      <Avatar />
                    </Skeleton>
                  ) : (
                    <img
                      src={values?.profile_image}
                      alt={values?.name}
                      style={{ width: "15rem", borderRadius: "1.5rem" }}
                    />
                  )}
                </div>
              </Grid>
              {loading ? (
                <Skeleton animation="wave" width={500} height={300} />
              ) : (
                <>
                  <Grid item md={2}>
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
                        <b>Updated At</b>
                      </div>
                      <p>
                        {moment(values?.updatedAt)
                          .utc()
                          .format("MMMM DD, YYYY")}
                      </p>
                    </div>
                    <div>
                      <div>
                        <b>Sex</b>
                      </div>
                      <p>{values?.sex}</p>
                    </div>
                  </Grid>
                  <Grid item md={2}>
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
                            // className="not-verified"
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
                            // className="w-2 h-2"
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
                  <Grid item sm={3} md={2}>
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
                        {moment(values?.createdAt)
                          .utc()
                          .format("MMMM DD, YYYY")}
                      </p>
                    </div>

                    <div>
                      <div>
                        <b>Age</b>
                      </div>
                      <p>{values?.age}</p>
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>

          <Modal
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit your details
              </Typography>
              <Stack direction="column" spacing={3}>
                <form onSubmit={handleEditSubmit}>
                  <div style={{ margin: "2rem 0rem" }}>
                    <b>Account type</b>
                    <p>{role}</p>
                  </div>

                  <div style={{ margin: "2rem 0rem" }}>
                    <TextField
                      fullWidth
                      id="outlined-name"
                      label="Your name"
                      type="text"
                      name="name"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={values?.name}
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
                      id="outlined-phone"
                      label="Phone"
                      type="number"
                      name="phone"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={values?.phone}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div style={{ margin: "2rem 0rem" }}>
                    {/* <TextField
                    fullWidth
                    id="outlined-profile_image"
                    label="Profile image"
                    type="file"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.phone}
                  /> */}
                    <img src={values?.profile_image} alt={values?.name} />
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

export default MyProfile;
