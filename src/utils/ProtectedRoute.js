import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { logOut } from "../components/features/authSlice";

const ProtectedRoute = ({ children }) => {
  const { isFetching, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // this will give us the exact date on which the jwt will expire
  //   console.log(new Date(jwt_decode(token)?.exp * 1000).toLocaleDateString());


  useEffect(() => {
    const checkToken = async () => {
      if (jwt_decode(token)?.exp < Date.now() / 1000) {
        dispatch(logOut())

        navigate('/login', { replace: true });
      }
    };

    checkToken();
  }, [token, navigate]);

  if (!token && !isFetching) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
