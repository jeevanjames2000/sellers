import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [], 
  loading: false, 
  error: null,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload; 
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
  },
});

export const { setLocations, setLoading, setError } = locationsSlice.actions;
export default locationsSlice.reducer;