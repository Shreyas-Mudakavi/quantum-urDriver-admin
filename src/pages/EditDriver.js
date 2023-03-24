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
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const EditDriver = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [openViewPanCard, setOpenViewPanCard] = useState(false);
  const [openViewRegis, setOpenViewRegis] = useState(false);
  const [expiryDate, setExpiryDate] = useState();
  const [values, setValues] = useState({
    name: '',
    email: '',
    city: '',
    license_no: '',
    license_image: '',
    vehicle: '',
    profile_image: '',
    phone: '',
    verified: '',
    createdAt: '',
    updatedAt: '',
    sex: '',
    age: '',
  });
  const [role, setRole] = useState('');
  const params = useParams();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '30rem',
    overflow: 'scroll',
    borderRadius: '0.6rem',
  };

  const styleTwo = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    // height: '40rem',
    borderRadius: '0.6rem',
  };

  const handleSelectChange = (e) => {
    setRole(e.target.value);
  };

  const handleDateChange = (e) => {
    setExpiryDate(e.target.value);
  };

  const handleEditClose = () => setOpenEdit(false);
  const handleVerifyClose = () => setOpenVerify(false);
  const handleViewPanCardClose = () => setOpenViewPanCard(false);
  const handleViewRegisClose = () => setOpenViewRegis(false);

  const handleViewPanCardOpen = () => setOpenViewPanCard(true);
  const handleViewRegisOpen = () => setOpenViewRegis(true);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleVerifyOpen = () => {
    setOpenVerify(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    console.log('update');

    editUser(params?.id);

    setOpenEdit(false);
  };

  const verifyUser = async () => {
    const userId = params?.id;

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/admin/verify-user/${params?.id}`,
        { expiryDate, userId: userId },
        { headers: { Authorization: token } }
      );

      console.log(data);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    verifyUser();

    setOpenVerify(false);
  };

  const editUser = async (id) => {
    const { firstname, city, lastname, license, panCard, profilePic, registration } = values;

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/admin/update-user/${id}`,
        { firstname, city, lastname, role },
        {
          headers: { Authorization: token },
        }
      );

      console.log('upadted! ', data);

      getUser();
      //   fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://3.239.229.120:5000/api/admin/user/${params?.id}`, {
        headers: { Authorization: token },
      });

      console.log('user ', data);

      setValues({
        name: data?.data?.user?.name,
        city: data?.data?.user?.city,
        profile_image: data?.data?.user?.profilePic,
        license_image: data?.data?.user?.license?.image,
        license_no: data?.data?.user?.license?.license_no,
        phone: data?.data?.user?.phone,
        // verified: data?.data?.user?.verified,
        createdAt: data?.data?.user?.createdAt,
        updatedAt: data?.data?.user?.updatedAt,
        sex: data?.data?.user?.sex,
        age: data?.data?.user?.age,
        vehicle: data?.data?.user?.vehicle,
      });

      setRole(data?.data?.user?.account_type);
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
      <Helmet>
        <title> Edit Driver | UR DRIVER </title>
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
            style={{ width: '2rem', marginLeft: '1rem', cursor: 'pointer' }}
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
        <Box component="div" sx={{ border: '1px solid #E8EBEE', width: '100%', height: '100%', p: 2 }}>
          <Grid container spacing={{ xs: 2, md: 4 }} direction={{ xs: 'column', md: 'row' }}>
            <Grid item xs={12} md={5}>
              <div>
                {loading ? (
                  <Skeleton variant="circular" animation="wave" width={100} height={100}>
                    <Avatar />
                  </Skeleton>
                ) : (
                  <img src={values?.profile_image} alt={values?.name} style={{ width: '12rem' }} />
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
                      <b>Role</b>
                    </div>
                    <p>{role}</p>
                  </div>

                  <div>
                    <div>
                      <b>Updated At</b>
                    </div>
                    <p>{moment(values?.updatedAt).utc().format('MMMM DD, YYYY')}</p>
                  </div>
                  {/* {values?.license && (
                  <div>
                    <Button variant="contained" size="sm" onClick={handleVerifyOpen}>
                      Verify!
                    </Button>
                    <img src={values?.license} alt={values?.firstname} style={{ width: '12rem' }} />
                  </div>
                )} */}
                </Grid>
                <Grid item md={2}>
                  <div>
                    <div>
                      <b>City</b>
                    </div>
                    <p>{values?.city}</p>
                  </div>
                  <div>
                    <div>
                      <b>Verified</b>
                    </div>
                    <p>
                      {values?.verified ? (
                        <svg
                          style={{ width: '2rem' }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="not-verified"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg
                          style={{ width: '2rem' }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-2 h-2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                    <p>{moment(values?.createdAt).utc().format('MMMM DD, YYYY')}</p>
                  </div>
                </Grid>
              </>
            )}
          </Grid>
          {loading ? (
            <Skeleton animation="wave" width="40%" />
          ) : (
            <>
              <div style={{ marginTop: '5rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                  <div>
                    <b>License Details</b>
                  </div>
                  <Divider component="div" />
                </div>
                <Grid
                  container
                  spacing={{ xs: 2, md: 4 }}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  direction={{ sm: 'column', md: 'row' }}
                >
                  <Grid item xs={12} md={3}>
                    <img src={values?.license_image} alt={values?.name} style={{ width: '12rem' }} />
                  </Grid>
                  <Grid item xs="auto" md={2}>
                    <div>
                      <b>License No.</b>
                      <p>{values?.license_no}</p>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div style={{ marginTop: '5rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                  <div>
                    <b>Vehicle Details</b>
                  </div>
                  <Divider component="div" />
                </div>
                <Grid
                  container
                  spacing={{ xs: 2, md: 4 }}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  direction={{ sm: 'column', md: 'row' }}
                >
                  <Grid item xs="auto" md={2}>
                    <div>
                      <div>
                        <b>Brand</b>
                      </div>
                      <p>{values?.vehicle?.information?.brand}</p>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={2}>
                    <div>
                      <div>
                        <b>Model</b>
                      </div>
                      <p>{values?.vehicle?.information?.model}</p>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={2}>
                    <div>
                      <div>
                        <b>Registration No.</b>
                      </div>
                      <p>{values?.vehicle?.information?.registration_no}</p>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={2}>
                    <div>
                      <div>
                        <b>Wheels</b>
                      </div>
                      <p>{values?.vehicle?.wheels}</p>
                    </div>
                  </Grid>
                  <Grid item xs="auto" md={2}>
                    <div>
                      <div>
                        <b>Type</b>
                      </div>
                      <p>{values?.vehicle?.type}</p>
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
              Edit User
            </Typography>
            {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography> */}
            <Stack direction="column" spacing={3}>
              <form onSubmit={handleEditSubmit}>
                <div style={{ margin: '2rem 0rem' }}>
                  <TextField
                    fullWidth
                    id="outlined-name"
                    label="Your name"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.name}
                  />
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={role}
                    label="Age"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="car-owner">car-owner</MenuItem>
                    <MenuItem value="partner-driver">partner-driver</MenuItem>
                    <MenuItem value="buraq moto">buraq moto</MenuItem>
                    <MenuItem value="passenger">passenger</MenuItem>
                    <MenuItem value="admin">admin</MenuItem>
                  </Select>
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <TextField
                    fullWidth
                    id="outlined-city"
                    label="City"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={values?.city}
                  />
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <b>License</b>
                  <img src={values?.license} alt={values?.name} />
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <b>License no.</b>
                  <p>{values?.license_no}</p>
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <b>Vehicle brand</b>
                  <p>{values?.vehicle?.information?.brand}</p>
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <b>Vehicle model</b>
                  <p>{values?.vehicle?.information?.model}</p>
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <b>Vehicle registration no</b>
                  <p>{values?.vehicle?.information?.registration_no}</p>
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <b>Vehicle wheels</b>
                  <p>{values?.vehicle?.wheels}</p>
                </div>
                <div style={{ margin: '2rem 0rem' }}>
                  <b>Vehicle type</b>
                  <p>{values?.vehicle?.type}</p>
                </div>

                <Button type="submit" variant="contained" color="primary" size="medium">
                  Update
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  size="medium"
                  onClick={handleEditClose}
                  style={{ marginLeft: '1rem' }}
                >
                  Cancel
                </Button>
              </form>
            </Stack>
          </Box>
        </Modal>

        <Modal
          open={openVerify}
          onClose={handleVerifyClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleTwo}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {!values?.verified ? 'Verify user' : 'View User'}
            </Typography>

            <Stack direction="column" spacing={3}>
              {/* <Zoom
                  img={values?.license}
                  zoomScale={3}
                  width={350}
                  height={300}
                  // style={{ width: '100%', height }}
                  className=""
                /> */}


              {!values?.verified ? (
                <form onSubmit={handleVerify}>
                  <div style={{ margin: '2rem 0rem' }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-date"
                      label="Expiry Date"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleDateChange}
                    />
                  </div>

                  <div>
                    <Button type="submit" variant="contained" color="primary" size="medium">
                      Verify
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      size="medium"
                      onClick={handleVerifyClose}
                      style={{ marginLeft: '1rem' }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button onClick={handleVerifyClose} variant="contained" color="primary" size="medium">
                  Close
                </Button>
              )}
            </Stack>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default EditDriver;
