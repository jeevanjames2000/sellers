import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  loading: false, 
  error: null,
   updateLoading: false, 
  updateError: null,  
  updateMessage: null, 
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
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
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.loading = false;
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
      updateProfileStart: (state) => {
      state.updateLoading = true;
      state.updateError = null;
      state.updateMessage = null;
    },
    updateProfileSuccess: (state, action) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateMessage = action.payload.message; 
      state.profile = { ...state.profile, ...action.payload.updatedData }; 
    },
    updateProfileFailure: (state, action) => {
      state.updateLoading = false;
      state.updateError = action.payload;
      state.updateMessage = null;
    },
  },
});

export const {
  setProfile,
  setLoading,
  setError,
  updateProfile,
  clearProfile,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} = profileSlice.actions;

export default profileSlice.reducer;