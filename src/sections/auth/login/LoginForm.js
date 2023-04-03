import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../components/iconify";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
// import { login } from 'src/components/features/apiCall';
import { login } from "../../../components/features/apiCall";

// ----------------------------------------------------------------------

const styles = {
  input: {
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px white inset",
      fontSize: "30px",
    },
  },
  input2: {
    WebkitBoxShadow: "0 0 0 1000px white inset",
  },
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { isFetching, error, errMsg, token } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;

    console.log(email, password);

    await login(dispatch, { email, password });

    setLoggedIn(true);
  };

  if (error && !isFetching && loggedIn) {
    toast.error(errMsg, toastOptions);

    setLoggedIn(false);
  }

  return (
    <>
      <Stack spacing={3}>
        <form onSubmit={handleSubmit}>
          <div style={{ paddingBottom: "2rem" }}>
            <TextField
              id="outlined-basic"
              fullWidth
              name="email"
              sx={{
                input: {
                  "&:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #181F2A inset",
                    WebkitTextFillColor: "#6CA0DC",
                  },
                  color: "#6CA0DC",
                },
              }}
              label="email@mail.com"
              type="email"
              required
              onChange={handleChange}
              variant="outlined"
            />
          </div>

          <div style={{ paddingBottom: "2rem" }}>
            <TextField
              id="outlined-basic2"
              variant="outlined"
              fullWidth
              required
              sx={{
                input: {
                  "&:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #181F2A inset",
                    WebkitTextFillColor: "#6CA0DC",
                  },
                  color: "#6CA0DC",
                },
              }}
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {isFetching ? (
            <Button disabled fullWidth size="large" variant="contained">
              <CircularProgress color="primary" />
            </Button>
          ) : (
            <Button fullWidth size="large" type="submit" variant="contained">
              Login
            </Button>
          )}
        </form>
      </Stack>

      {/* <Checkbox name="remember" label="Remember me" /> */}
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

      {/* <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton> */}

      <ToastContainer />
    </>
  );
}
