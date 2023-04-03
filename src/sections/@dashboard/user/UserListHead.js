import PropTypes from "prop-types";
// @mui
import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  styled,
} from "@mui/material";

// ----------------------------------------------------------------------

const StyledRoot = styled("span")(({ theme }) => ({
  color: "#ffff",
  backgroundColor: "#1F1E25",
}));

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
};

UserListHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

export default function UserListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    // <StyledRoot>
    <TableHead>
      <TableRow>
        <TableCell
          sx={{
            // for purple theme
            // color: "#7E4EFC",
            // backgroundColor: "#EBEEF7",
            // borderColor: "#7E4EFC",
            color: "#276BC7",
            backgroundColor: "#26303C",
            borderColor: "#89CFF0",
            // for black theme
            // color: "#ffff",
            // borderColor: "#343434",
            // backgroundColor: "#1F1E25",
          }}
          padding="checkbox"
        >
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headLabel.map((headCell) => (
          <TableCell
            sx={{
              color: "#6CA0DC",
              backgroundColor: "#26303C",
              borderColor: "#89CFF0",
              // for theme purple
              // color: "#7E4EFC",
              // backgroundColor: "#EBEEF7",
              // borderColor: "#7E4EFC",
              // for black theme
              // color: "#B6B6B4",
              // backgroundColor: "#1F1E25",
              // borderColor: "#343434",
            }}
            key={headCell.id}
            align={headCell.alignRight ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    // </StyledRoot>
  );
}
