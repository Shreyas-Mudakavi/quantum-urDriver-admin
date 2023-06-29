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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import axios from "../utils/axios";
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
        user: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
  }
};

const EditUser = () => {
  const [{ loading, user, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { token } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [account_type, setAccount_Type] = useState("");
  const [deactivated, setDeactivated] = useState();
  const params = useParams();

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

  const handleSelectChange = (e) => {
    setAccount_Type(e.target.value);
  };

  const handleDeactivateChange = (e) => {
    setDeactivated(e.target.checked);
  };

  const handleEditClose = () => setOpenEdit(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    editUser(params?.id);

    setOpenEdit(false);
  };

  const editUser = async (id) => {
    try {
      console.log("deac", deactivated);
      const { data } = await axios.put(
        `/api/admin/user/${id}`,
        { account_type, deactivated },
        {
          headers: { Authorization: token },
        }
      );

      console.log("upadted! ", data);

      toast.success("User updated!", toastOptions);
      getUser();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later", toastOptions);
    }
  };

  const getUser = async (id) => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.get(`/api/admin/user/${params?.id}`, {
        headers: { Authorization: token },
      });

      // console.log("user ", data);

      dispatch({ type: "FETCH_SUCCESS", payload: data?.data?.user });
      setAccount_Type(data?.data?.user?.account_type);
      setDeactivated(data?.data?.user?.deactivated);
    } catch (error) {
      console.log(error);
      dispatch({ type: "FETCH_FAIL", payload: error });
    }
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
          <title> Edit User | UR DRIVER </title>
        </Helmet>

        <Container>
          {loading ? (
            <Skeleton variant="text" width={100} animation="wave">
              <Avatar />
            </Skeleton>
          ) : (
            <>
              <Typography
                variant="h5"
                component="span"
                sx={{
                  // for new-zeland theme
                  color: "#276BC7",
                  // color: "#7E4EFC",
                }}
              >
                {user?.name} details
              </Typography>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                // className="w-6 h-6"
                style={{
                  width: "2rem",
                  marginLeft: "1rem",
                  cursor: "pointer",
                  // color: "#CCCCFF",
                }}
                onClick={() => handleEditOpen()}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </>
          )}
          {/* <Divider component="div" sx={{ marginBottom: "1rem" }} /> */}
          <Box
            component="div"
            sx={{
              // border: "1px solid #E3D8F4",
              // for new-zeland theme
              border: "0.5px solid #CCCCFF",
              borderRadius: "0.6rem",
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
                      src={user?.profile_image}
                      alt={user?.name}
                      style={{
                        width: "12rem",
                        // for new-zealdn theme
                        color: "#6CA0DC",
                        // color: "#7E4EFC",
                      }}
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
                      <div
                      // style={{ color: "#CCCCFF" }}
                      >
                        <b>Name</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>{user?.name}</p>
                    </div>

                    <div>
                      <div>
                        <b>Account type</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>{user?.account_type}</p>
                    </div>

                    <div>
                      <div>
                        <b>Updated At</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>
                        {moment(user?.updatedAt).utc().format("MMMM DD, YYYY")}
                      </p>
                    </div>
                    <div>
                      <div>
                        <b>Sex</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>{user?.sex}</p>
                    </div>
                  </Grid>
                  <Grid item md={2}>
                    <div>
                      <div>
                        <b>Email</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>{user?.email}</p>
                    </div>
                    <div>
                      <div>
                        <b>City</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>{user?.city}</p>
                    </div>
                    <div>
                      <div>
                        <b>Deactivated</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>
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
                      <p style={{ color: "#6CA0DC" }}>{user?.phone}</p>
                    </div>

                    <div>
                      <div>
                        <b>Created At</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>
                        {moment(user?.createdAt).utc().format("MMMM DD, YYYY")}
                      </p>
                    </div>

                    <div>
                      <div>
                        <b>Age</b>
                      </div>
                      <p style={{ color: "#6CA0DC" }}>{user?.age}</p>
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
                Edit User
              </Typography>
              <Stack direction="column" spacing={3}>
                <form onSubmit={handleEditSubmit}>
                  <div style={{ margin: "2rem 0rem" }}>
                    <TextField
                      fullWidth
                      disabled
                      id="outlined-name"
                      label="Your name"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={user?.name}
                    />
                  </div>
                  <div style={{ margin: "2rem 0rem" }}>
                    <TextField
                      fullWidth
                      disabled
                      id="outlined-city"
                      label="City"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={user?.city}
                    />
                  </div>
                  <div style={{ margin: "2rem 0rem" }}>
                    <TextField
                      fullWidth
                      disabled
                      id="outlined-city"
                      label="Sex"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={user?.sex}
                    />
                  </div>
                  <div style={{ margin: "2rem 0rem" }}>
                    <TextField
                      fullWidth
                      disabled
                      id="outlined-city"
                      label="Age"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={user?.age}
                    />
                  </div>

                  <div style={{ margin: "2rem 0rem" }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Account type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={account_type}
                      label="account_type"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="driver">Driver</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </div>

                  {/* <div style={{ margin: "2rem 0rem" }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={deactivated}
                        onChange={handleDeactivateChange}
                      />
                    }
                    label={`Deactivate this user`}
                  />
                  {deactivated && (
                    <p style={{ color: "red" }}>
                      You are deactivating this user!
                    </p>
                  )}
                </div> */}

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

export default EditUser;
