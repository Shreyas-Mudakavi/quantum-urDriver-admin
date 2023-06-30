import { Helmet } from "react-helmet-async";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
// components
import Iconify from "../components/iconify";
// sections
// import {
// import { motion } from 'framer-motion';
import { motion } from "framer-motion";

//   AppNewsUpdate,
//   AppOrderTimeline,
//   AppCurrentVisits,
//   AppWebsiteVisits,
//   AppTrafficBySite,
//   AppWidgetSummary,
//   AppCurrentSubject,
//   AppConversionRates,
// } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Helmet>
          <title> Dashboard | UR DRIVERS </title>
        </Helmet>

        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{
              mb: 5,
              // for new-zealand theme
              color: "#276BC7",
              // color: "#7E4EFC",
            }}
          >
            Hi, Welcome back
          </Typography>

          <div
            style={{
              backgroundColor: "#fff",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              marginTop: "2rem",
            }}
          >
            <p
              style={{
                padding: "0.8rem 1rem",
                marginBottom: "0rem",
                fontWeight: 700,
              }}
            >
              Users
            </p>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3} sx={{}}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background:
                      "linear-gradient(to bottom, #06C5F7, #2C59D0, #3C28BE)",
                    margin: "1rem",
                    padding: "1rem 1rem",
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  <span>Total Clients</span>
                  <span style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
                    1
                  </span>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background:
                      "linear-gradient(to bottom, #06C5F7, #2C59D0, #3C28BE)",
                    margin: "1rem",
                    padding: "1rem 1rem",
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  <span>Total Clients</span>
                  <span style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
                    1
                  </span>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background:
                      "linear-gradient(to bottom, #06C5F7, #2C59D0, #3C28BE)",
                    margin: "1rem",
                    padding: "1rem 1rem",
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  <span>Something here</span>
                  <span style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
                    1
                  </span>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background:
                      "linear-gradient(to bottom, #06C5F7, #2C59D0, #3C28BE)",
                    margin: "1rem",
                    padding: "1rem 1rem",
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  <span>Something here</span>
                  <span style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
                    1
                  </span>
                </div>
              </Grid>
            </Grid>
          </div>

          <div
            style={{
              backgroundColor: "#fff",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              marginTop: "2rem",
            }}
          >
            <p
              style={{
                padding: "0.8rem 1rem",
                marginBottom: "0rem",
                fontWeight: 700,
              }}
            >
              Drivers
            </p>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3} sx={{}}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background:
                      "linear-gradient(to bottom, #06C5F7, #2C59D0, #3C28BE)",
                    margin: "1rem",
                    padding: "1rem 1rem",
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  <span>Total Clients</span>
                  <span style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
                    1
                  </span>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background:
                      "linear-gradient(to bottom, #06C5F7, #2C59D0, #3C28BE)",
                    margin: "1rem",
                    padding: "1rem 1rem",
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  <span>Total Clients</span>
                  <span style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
                    1
                  </span>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background:
                      "linear-gradient(to bottom, #06C5F7, #2C59D0, #3C28BE)",
                    margin: "1rem",
                    padding: "1rem 1rem",
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  <span>Something here</span>
                  <span style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
                    1
                  </span>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background:
                      "linear-gradient(to bottom, #06C5F7, #2C59D0, #3C28BE)",
                    margin: "1rem",
                    padding: "1rem 1rem",
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  <span>Something here</span>
                  <span style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
                    1
                  </span>
                </div>
              </Grid>
            </Grid>
          </div>
        </Container>
      </motion.div>
    </>
  );
}
