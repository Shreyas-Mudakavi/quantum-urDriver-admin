import axios from "axios";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
} from "./authSlice";

export const login = async (dispatch, user) => {
  dispatch(loginStart());

  const { email, password } = user;

  try {
    const { data } = await axios.post(
      "http://3.239.229.120:5000/api/admin/login",
      { email, password }
    );

    dispatch(loginSuccess(data?.data));
  } catch (error) {
    dispatch(loginFailure(error?.response?.data?.error?.message));
    console.log(error);
  }
};
