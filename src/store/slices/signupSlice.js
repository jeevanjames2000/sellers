import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  apiResponse:null,
  token: null,
  loading: false,
  error: null,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setSignup: (state, action) => {
      state.user = action.payload.user_details;
      state.token = action.payload.accessToken;
      state.loading = false;
      state.error = null;
    },
      setOtpSent: (state, action) => {
      state.otp = action.payload.otp;
      state.apiResponse = action.payload.apiResponse;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSignup: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setSignup, setLoading,setOtpSent, setError, clearSignup } = signupSlice.actions;
export default signupSlice.reducer;