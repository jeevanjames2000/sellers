import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  properties: [],
  loading: false,
  error: null,
  
};

const enquirySlice = createSlice({
  name: 'enquiry',
  initialState,
  reducers: {
    setEnquiries: (state, action) => {
      state.count = action.payload.count;
      state.properties = action.payload.properties;
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

export const { setEnquiries, setLoading, setError } = enquirySlice.actions;
export default enquirySlice.reducer; 