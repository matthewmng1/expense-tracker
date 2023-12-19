import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload
      state.user = user;
      state.token = accessToken;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken);
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');    
      localStorage.removeItem('token');
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
