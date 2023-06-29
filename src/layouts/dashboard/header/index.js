import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar, IconButton } from "@mui/material";
// utils
import { bgBlur } from "../../../utils/cssStyles";
// components
import Iconify from "../../../components/iconify";
//
import AccountPopover from "./AccountPopover";

// ----------------------------------------------------------------------

const NAV_WIDTH = 270;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 82;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  // ...bgBlur({ color: "#F1F4F9" }),
  // the black theme
  // ...bgBlur({ color: "#151419" }),
  // for new-zealnd theme
  // background: "linear-gradient(to right, #050A13, #26303C 67%, #306BAF)",
  backgroundColor: "#fff",
  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  // boxShadow: "none",

  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            // color: "#A866EE",
            // for new-zealand theme
            color: "#2D5A8E",
            display: { lg: "none" },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
