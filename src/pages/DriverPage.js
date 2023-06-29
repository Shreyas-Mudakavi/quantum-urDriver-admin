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
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Skeleton,
} from "@mui/material";
// components
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// mock
// import USERLIST from '../_mock/user';
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { motion } from "framer-motion";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "role", label: "Account type", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "city", label: "City", alignRight: false },
  { id: "license", label: "License No.", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
  { id: "sex", label: "Sex", alignRight: false },
  { id: "age", label: "Age", alignRight: false },
  { id: "createdAt", label: "Reg. Date", alignRight: false },
  { id: "vType", label: "Vechile type", alignRight: false },
  { id: "actions", label: "Actions", alignRight: false },
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

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchUsers = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.get("/api/admin/drivers", {
        headers: { Authorization: token },
      });

      // console.log(data);
      // setUsersList(data?.data?.drivers);
      dispatch({ type: "FETCH_SUCCESS", payload: data?.data?.drivers });
    } catch (error) {
      console.log(error);
      dispatch({ type: "FETCH_FAIL", payload: error });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          <title> Drivers | UR DRIVER </title>
        </Helmet>

        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom sx={{ color: "#276BC7" }}>
              Drivers
            </Typography>
          </Stack>

          <Card
          // style={{ backgroundColor: "#26303C" }}
          >
            <UserListToolbar
              numSelected={selected.length}
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
                                  l
                                  padding="checkbox"
                                >
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

                                <TableCell
                                  align="left"
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
                                  {account_type}
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
                                  {email}
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
                                  {city}
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
                                  {license?.license_no}
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
                                  {phone}
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
                                  {sex}
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
                                  {age}
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
                                  {moment(createdAt)
                                    .utc()
                                    .format("MMMM DD, YYYY")}
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
                                  {vehicle?.type}
                                </TableCell>

                                <TableCell
                                  sx={
                                    {
                                      // for new-zealdnd theme
                                      // borderColor: "#89CFF0",
                                      // borderColor: "#E3D8F4",
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
                                  </div>
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}

                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell
                            colSpan={6}
                            // style={{ color: "#6CA0DC" }}
                          />
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
                                // for new-zealdn theme
                                // color: "#6CA0DC",
                                // color: "#7E4EFC",
                                backgroundColor: "transparent",
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                Not found
                              </Typography>

                              <Typography variant="body2">
                                No results found for &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>
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
              style={
                {
                  // for new-zeland theme
                  // color: "#6CA0DC",
                  // color: "#7E4EFC",
                }
              }
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
      </motion.div>
    </>
  );
}
