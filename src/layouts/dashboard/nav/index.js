import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// @mui
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
// mock
// hooks
import useResponsive from "../../../hooks/useResponsive";
// components
import Logo from "../../../components/logo";
import Scrollbar from "../../../components/scrollbar";
import NavSection from "../../../components/nav-section";
//
import navConfig from "./config";
import { useSelector } from "react-redux";
import { bgGradient } from "../../../utils/cssStyles";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;
// const drawerBackground = <bgGradient startColor={"black"} endColor={"white"} />;
// const drawerBackground = "linear-gradient(to right bottom, #000, #9198e5)";

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  // backgroundColor: alpha(theme.palette.grey[500], 0.12),
  // for purple theme
  backgroundColor: "#6838EE",
  // the black theme
  // backgroundColor: "#1B1B1B",
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const { userRole, userProfile, userName } = useSelector(
    (state) => state.auth
  );

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={userProfile} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  // for new-zealand theme
                  // color: "#276BC7"
                  color: "#fff",
                }}
              >
                {userName}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  // for purple theme
                  color: "#BE93E4",
                  // color: "text.secondary",
                }}
              >
                {userRole}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      {/* <Box sx={{ flexGrow: 1 }} /> */}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            // elevation: 12,
            sx: {
              width: NAV_WIDTH,
              // for new-zealand theme
              // background:
              //   "linear-gradient(to bottom, #050A13, #26303C 67%, #306BAF)",
              // for purple theme
              backgroundColor: "#7E4EFC",
              borderTopRightRadius: "2rem",
              borderBottomRightRadius: "2rem",
              // for black theme
              // backgroundColor: "#1F1E25",
              // borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              // for purple theme
              backgroundColor: "#7E4EFC",
              borderTopRightRadius: "2rem",
              borderBottomRightRadius: "2rem",
              // for new-zealand theme
              // background:
              //   "linear-gradient(to bottom, #050A13, #26303C 67%, #306BAF)",
              boxShadow: "none",
              // for black theme
              // backgroundColor: "#1F1E25",
              // background: "linear-gradient(#000, #1F2029)",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
