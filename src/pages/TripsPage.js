import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
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
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "account_type", label: "Account type", alignRight: false },
  { id: "pickUpAddress", label: "Pickup Addr", alignRight: false },
  { id: "destinationAddress", label: "Destination Addr", alignRight: false },
  { id: "fare", label: "Fare", alignRight: false },
  { id: "payment", label: "Payment", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "actions", label: "Actions", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (
    orderBy === "name" || orderBy === "account_type"
      ? b?.user[orderBy] < a?.user[orderBy]
      : b[orderBy] < a[orderBy]
  ) {
    return -1;
  }
  if (
    orderBy === "name" || orderBy === "account_type"
      ? b?.user[orderBy] > a?.user[orderBy]
      : b[orderBy] > a[orderBy]
  ) {
    return 1;
  }
  if (
    orderBy === "pickUpAddress"
      ? b?.pickup[orderBy] > a?.pickup[orderBy]
      : b[orderBy] > a[orderBy]
  ) {
    return 1;
  }
  if (
    orderBy === "pickUpAddress"
      ? b?.pickup[orderBy] < a?.pickup[orderBy]
      : b[orderBy] < a[orderBy]
  ) {
    return -1;
  }
  if (
    orderBy === "destinationAddress"
      ? b?.destination[orderBy] < a?.destination[orderBy]
      : b[orderBy] < a[orderBy]
  ) {
    return -1;
  }
  if (
    orderBy === "destinationAddress"
      ? b?.destination[orderBy] > a?.destination[orderBy]
      : b[orderBy] > a[orderBy]
  ) {
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
      (_user) =>
        _user?.user?.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
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

export default function TripsPage() {
  const [{ loading, usersList, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterByStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const fetchTrips = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.get(
        `/api/rides/all/?status=${filterStatus}`,
        {
          headers: { Authorization: token },
        }
      );

      // console.log("trips ", data);
      // setUsersList(data?.data?.trips);
      dispatch({ type: "FETCH_SUCCESS", payload: data?.data?.trips });
    } catch (error) {
      console.log(error);
      dispatch({ type: "FETCH_FAIL", payload: error });
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [filterStatus]);

  const deleteDetails = async (id) => {
    try {
      const { data } = await axios.delete(`/api/rides/${id}`, {
        headers: { Authorization: token },
      });

      toast.success("Ride details deleted!", toastOptions);

      fetchTrips();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later", toastOptions);
    }
  };

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDeleteOpen = (_id) => {
    setOpenDelete(true);

    setDeleteId(_id);
  };

  const handleDelete = () => {
    deleteDetails(deleteId);

    setOpenDelete(false);
  };

  const handleDeleteClose = () => setOpenDelete(false);

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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersList?.length) : 0;

  let filteredUsers = applySortFilter(
    usersList,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers?.length && !!filterName;

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Helmet>
          <title> Rides | UR DRIVER </title>
        </Helmet>

        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                // for new-zealdn theme
                color: "#276BC7",
                // color: "#7E4EFC",
              }}
            >
              Rides
            </Typography>
          </Stack>

          <Card
            style={
              {
                // for new-zealnd theme
                // backgroundColor: "#26303C",
                // backgroundColor: "#EBEEF7",
              }
            }
          >
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              filterStatus={filterStatus}
              onFilterStatus={handleFilterByStatus}
              fetchTrips={fetchTrips}
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
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            _id,
                            user,
                            fare,
                            payment,
                            pickup,
                            destination,
                            status,
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
                                <TableCell
                                  padding="checkbox"
                                  sx={
                                    {
                                      // for new-zealdn theme
                                      // color: "#CCCCFF",
                                      // borderColor: "#89CFF0",
                                      // color: "text.secondary",
                                      // borderColor: "#E3D8F4",
                                    }
                                  }
                                >
                                  <Checkbox
                                    checked={selectedUser}
                                    onChange={(event) =>
                                      handleClick(event, _id)
                                    }
                                  />
                                </TableCell>

                                <TableCell
                                  sx={
                                    {
                                      // for new-zealdn theme
                                      // color: "#CCCCFF",
                                      // borderColor: "#89CFF0",
                                      // color: "text.secondary",
                                      // borderColor: "#E3D8F4",
                                    }
                                  }
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
                                      alt={user?.name}
                                      src={user?.profilePic}
                                    />
                                    <Typography variant="subtitle2" noWrap>
                                      {user?.name}
                                    </Typography>
                                  </Stack>
                                </TableCell>

                                <TableCell
                                  sx={
                                    {
                                      // for new-zealdn theme
                                      // color: "#CCCCFF",
                                      // borderColor: "#89CFF0",
                                      // color: "text.secondary",
                                      // borderColor: "#E3D8F4",
                                    }
                                  }
                                  align="left"
                                >
                                  {user?.account_type}
                                </TableCell>
                                <TableCell
                                  sx={
                                    {
                                      // for new-zealdn theme
                                      // color: "#CCCCFF",
                                      // borderColor: "#89CFF0",
                                      // color: "text.secondary",
                                      // borderColor: "#E3D8F4",
                                    }
                                  }
                                  align="left"
                                >
                                  {pickup?.pickUpAddress.slice(0, 20) ||
                                    pickup?.address?.slice(0, 20)}
                                  ...
                                </TableCell>
                                <TableCell
                                  sx={
                                    {
                                      // for new-zealdn theme
                                      // color: "#CCCCFF",
                                      // borderColor: "#89CFF0",
                                      // color: "text.secondary",
                                      // borderColor: "#E3D8F4",
                                    }
                                  }
                                  align="left"
                                >
                                  {destination?.destinationAddress.slice(
                                    0,
                                    20
                                  ) || destination?.address?.slice(0, 20)}
                                  ...
                                </TableCell>
                                <TableCell
                                  sx={
                                    {
                                      // for new-zealdn theme
                                      // color: "#CCCCFF",
                                      // borderColor: "#89CFF0",
                                      // color: "text.secondary",
                                      // borderColor: "#E3D8F4",
                                    }
                                  }
                                  align="left"
                                >
                                  ${fare}
                                </TableCell>
                                <TableCell
                                  sx={
                                    {
                                      // for new-zealdn theme
                                      // color: "#CCCCFF",
                                      // borderColor: "#89CFF0",
                                      // color: "text.secondary",
                                      // borderColor: "#E3D8F4",
                                    }
                                  }
                                  align="left"
                                >
                                  {payment ? "True" : "False"}
                                </TableCell>
                                <TableCell
                                  sx={
                                    {
                                      // for new-zealdn theme
                                      // color: "#CCCCFF",
                                      // borderColor: "#89CFF0",
                                      // color: "text.secondary",
                                      // borderColor: "#E3D8F4",
                                    }
                                  }
                                  align="left"
                                >
                                  {status}
                                </TableCell>

                                <TableCell
                                  sx={
                                    {
                                      // borderColor: "#89CFF0",
                                    }
                                  }
                                  align="left"
                                >
                                  <div style={{ display: "flex" }}>
                                    <div
                                      style={{
                                        margin: "0rem 1rem",
                                        width: "1.7rem",
                                        color: "#6CA0DC",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        navigate(`/dashboard/trip/view/${_id}`)
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
                          <TableCell
                            align="center"
                            colSpan={6}
                            sx={{ py: 3, border: "none" }}
                          >
                            <Paper
                              sx={{
                                textAlign: "center",
                                backgroundColor: "transparent",
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                Not found
                              </Typography>

                              <Typography variant="body2">
                                No results found for &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>.
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
              Delete ride details
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this user's ride details?
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
      </motion.div>
      <ToastContainer />
    </>
  );
}
