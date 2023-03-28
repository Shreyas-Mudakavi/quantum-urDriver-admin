import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useEffect, useState, useReducer } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  Skeleton,
} from "@mui/material";
// components
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// mock
// import USERLIST from '../_mock/user';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  // { id: 'company', label: 'Company', alignRight: false },
  { id: "role", label: "Account type", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "city", label: "City", alignRight: false },
  { id: "license", label: "License No.", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
  { id: "sex", label: "Sex", alignRight: false },
  { id: "age", label: "Age", alignRight: false },
  { id: "createdAt", label: "Reg. Date", alignRight: false },
  { id: "vType", label: "Vechile type", alignRight: false },
  //   { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: "actions", label: "Actions", alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user?.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

function applySortRoleFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user?.role?.indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        usersList: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
  }
};

export default function DriverPage() {
  const [{ loading, usersList, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  // const [usersList, setUsersList] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  // const [loading, setLoading] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const styleTwo = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: "0.6rem",
  };

  const fetchUsers = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.get(
        "http://3.239.229.120:5000/api/admin/drivers",
        {
          headers: { Authorization: token },
        }
      );

      // console.log(data);
      // setUsersList(data?.data?.drivers);
      dispatch({ type: "FETCH_SUCCESS", payload: data?.data?.drivers });
    } catch (error) {
      console.log(error);
      dispatch({ type: "FETCH_FAIL", payload: error });
    }
  };

  const deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/admin/delete-user/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      console.log(data);

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteOpen = (_id) => {
    setOpenDelete(true);

    setDeleteUserId(_id);
  };

  const handleDelete = () => {
    deleteUser(deleteUserId);

    setOpenDelete(false);
  };

  const handleDeleteClose = () => setOpenDelete(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = usersList?.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterByRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersList?.length) : 0;

  let filteredUsers = applySortFilter(
    usersList,
    getComparator(order, orderBy),
    filterName
  );
  const filteredRoleUsers =
    filterRole !== "" &&
    applySortRoleFilter(usersList, getComparator(order, orderBy), filterRole);

  const isNotFound =
    (!filteredUsers?.length && !!filterName) ||
    (!filteredRoleUsers?.length && !!filterRole);

  if (filteredRoleUsers) {
    filteredUsers = "";
  }

  return (
    <>
      <Helmet>
        <title> Drivers | UR DRIVER </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Drivers
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterRole={filterRole}
            onFilterRole={handleFilterByRole}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Skeleton variant="text" animation="wave" width={500}>
                    <Avatar />
                  </Skeleton>
                  <Skeleton variant="text" animation="wave" width={500}>
                    <Avatar />
                  </Skeleton>
                  <Skeleton variant="text" animation="wave" width={500}>
                    <Avatar />
                  </Skeleton>
                </div>
              ) : (
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={usersList?.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      ? filteredUsers
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => {
                            const {
                              _id,
                              name,
                              email,
                              account_type,
                              profile_image,
                              verified,
                              city,
                              phone,
                              sex,
                              age,
                              createdAt,
                              vehicle,
                              license,
                            } = row;
                            const selectedUser = selected.indexOf(_id) !== -1;

                            return (
                              <>
                                <TableRow
                                  hover
                                  key={_id}
                                  tabIndex={-1}
                                  role="checkbox"
                                  selected={selectedUser}
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={selectedUser}
                                      onChange={(event) =>
                                        handleClick(event, _id)
                                      }
                                    />
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    padding="none"
                                  >
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={2}
                                    >
                                      <Avatar alt={name} src={profile_image} />
                                      <Typography variant="subtitle2" noWrap>
                                        {name}
                                      </Typography>
                                    </Stack>
                                  </TableCell>

                                  <TableCell align="left">
                                    {account_type}
                                  </TableCell>
                                  <TableCell align="left">{email}</TableCell>
                                  <TableCell align="left">{city}</TableCell>
                                  <TableCell align="left">
                                    {license?.license_no}
                                  </TableCell>
                                  <TableCell align="left">{phone}</TableCell>
                                  <TableCell align="left">{sex}</TableCell>
                                  <TableCell align="left">{age}</TableCell>
                                  <TableCell align="left">
                                    {moment(createdAt)
                                      .utc()
                                      .format("MMMM DD, YYYY")}
                                  </TableCell>
                                  <TableCell align="left">
                                    {vehicle?.type}
                                  </TableCell>

                                  {/* <TableCell align="left">{verified ? 'Yes' : 'No'}</TableCell> */}

                                  <TableCell align="left">
                                    <div style={{ display: "flex" }}>
                                      <div
                                        style={{
                                          margin: "0rem 1rem",
                                          width: "1.7rem",
                                          color: "blue",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          navigate(
                                            `/dashboard/driver/view/${_id}`
                                          )
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          // className="w-6 h-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                        </svg>
                                      </div>

                                      <div
                                        style={{
                                          width: "1.7rem",
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleDeleteOpen(_id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          // className="w-6 h-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })
                      : filteredRoleUsers &&
                        filteredRoleUsers
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => {
                            const {
                              _id,
                              firstname,
                              lastname,
                              role,
                              status,
                              company,
                              profilePic,
                              verified,
                              city,
                              mobile,
                            } = row;
                            const selectedUser = selected.indexOf(_id) !== -1;

                            return (
                              <>
                                <TableRow
                                  hover
                                  key={_id}
                                  tabIndex={-1}
                                  role="checkbox"
                                  selected={selectedUser}
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={selectedUser}
                                      onChange={(event) =>
                                        handleClick(event, _id)
                                      }
                                    />
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    padding="none"
                                  >
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={2}
                                    >
                                      <Avatar
                                        alt={firstname}
                                        src={profilePic}
                                      />
                                      <Typography variant="subtitle2" noWrap>
                                        {firstname} {lastname}
                                      </Typography>
                                    </Stack>
                                  </TableCell>

                                  {/* <TableCell align="left">{company}</TableCell> */}

                                  <TableCell align="left">{role}</TableCell>
                                  <TableCell align="left">{city}</TableCell>
                                  <TableCell align="left">{mobile}</TableCell>

                                  <TableCell align="left">
                                    {verified ? "Yes" : "No"}
                                  </TableCell>

                                  <TableCell align="left">
                                    <div style={{ display: "flex" }}>
                                      <div
                                        style={{
                                          margin: "0rem 1rem",
                                          width: "1.7rem",
                                          color: "blue",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          navigate(
                                            `/dashboard/user/view/${_id}`
                                          )
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          // className="w-6 h-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                        </svg>
                                      </div>

                                      <div
                                        style={{
                                          width: "1.7rem",
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleDeleteOpen(_id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          // className="w-6 h-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>
                                &quot;{filterName || filterRole}&quot;
                              </strong>
                              .
                              <br /> Try checking for typos or using complete
                              words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              )}
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={usersList?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Modal
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleTwo}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete User
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this user?
          </Typography>

          <Stack direction="row" spacing={3} style={{ marginTop: "1rem" }}>
            <Button
              variant="contained"
              color="error"
              size="medium"
              onClick={() => handleDelete()}
              style={{ marginRight: "1rem" }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="info"
              size="medium"
              onClick={handleDeleteClose}
              // style={{ margin: '0rem 1rem' }}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
