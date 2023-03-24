import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('userToken');
const user = localStorage.getItem('userId');
const userName = localStorage.getItem('name');
const userProfile = localStorage.getItem('profile');
const userEmail = localStorage.getItem('email');
const userRole = localStorage.getItem('role');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user,
    token: token,
    isFetching: false,
    error: false,
    errMsg: '',
    userName: userName,
    userProfile: userProfile,
    userEmail: userEmail,
    userRole: userRole,
  },
  reducers: {
    loginStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.error = false;

      state.isFetching = false;
      state.error = false;
      state.user = action.payload.user_profile?.user?._id;
      state.userName = action.payload.user_profile?.user?.name;
      state.userProfile = action.payload.user_profile?.user?.profilePic;
      state.userEmail = action.payload.user_profile?.user?.email;
      state.userRole = action.payload.user_profile?.user?.role || 'admin';
      state.token = action.payload.token;

      localStorage.setItem('userToken', state.token);
      localStorage.setItem('name', state.userName);
      localStorage.setItem('email', state.userEmail);
      localStorage.setItem('profile', state.userProfile);
      localStorage.setItem('role', state.userRole);
    },
    loginFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },

    registerStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    registerSuccess: (state, action) => {
      state.error = false;
      state.isFetching = false;
      state.error = false;
      state.user = action.payload.savedAdmin._id;
      state.token = action.payload.token;
      state.errMsg = '';

      localStorage.setItem('userToken', state.token);
      localStorage.setItem('userId', state.user);
    },
    registerFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errMsg = action.payload.msg;
    },

    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userToken');
      localStorage.removeItem('name');
      localStorage.removeItem('profile');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
    },
  },
});

export const { logOut, loginStart, loginSuccess, loginFailure, registerSuccess, registerStart, registerFailure } =
  authSlice.actions;
export default authSlice.reducer;
