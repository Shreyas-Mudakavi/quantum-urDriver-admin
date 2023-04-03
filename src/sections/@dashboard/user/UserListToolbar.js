import PropTypes from "prop-types";
// @mui
import { styled, alpha } from "@mui/material/styles";
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
// component
import Iconify from "../../../components/iconify";
import { useLocation } from "react-router-dom";

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  // for theme purple
  color: "#7E4EFC",
  backgroundColor: "#EBEEF7",
  // for new-zealdn theme
  // color: "#6CA0DC",
  // backgroundColor: "#26303C",
  // for black theme
  // color: "#ffff",
  // backgroundColor: "#1F1E25",
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({
  numSelected,
  filterName,
  onFilterName,
  filterType,
  onFilterType,
  fetchTransactions,
  filterStatus,
  onFilterStatus,
  fetchTrips,
}) {
  const location = useLocation();

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          // for theme purple
          color: "#7E4EFC",
          bgcolor: "#EBEEF7",
          // for new-zealand theme
          // color: "#89CFF0",
          // bgcolor: "#26303C",
          // for black theme
          // color: "#ffff",
          // bgcolor: "#1F1E25",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <StyledSearch
            value={filterName}
            onChange={onFilterName}
            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled", width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
          {location.pathname === "/dashboard/transaction" && (
            <>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={filterType}
                label="role"
                onChange={onFilterType}
                displayEmpty
              >
                <MenuItem value="" onClick={() => fetchTransactions()}>
                  Select Type
                </MenuItem>
                <Divider as="div" />
                <MenuItem value="Credit" onClick={() => fetchTransactions()}>
                  Credit
                </MenuItem>
                <MenuItem value="Debit" onClick={() => fetchTransactions()}>
                  Debit
                </MenuItem>
              </Select>
            </>
          )}
          {location.pathname === "/dashboard/trip" && (
            <>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={filterStatus}
                label="role"
                onChange={onFilterStatus}
                displayEmpty
              >
                <MenuItem value="" onClick={() => fetchTrips()}>
                  Select Status
                </MenuItem>
                <Divider as="div" />
                <MenuItem value="ongoing">On-going</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </>
          )}
        </>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
