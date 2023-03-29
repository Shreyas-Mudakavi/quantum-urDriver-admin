import axios from "../../utils/axios";
import { loginFailure, loginStart, loginSuccess } from "./authSlice";

export const login = async (dispatch, user) => {
  dispatch(loginStart());

  const { email, password } = user;

  try {
    const { data } = await axios.post("/api/admin/login", { email, password });

    dispatch(loginSuccess(data?.data));
  } catch (error) {
    dispatch(loginFailure(error?.response?.data?.error?.message));
    console.log(error);
  }
};
