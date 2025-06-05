import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  properties: [],
  loading: false, 
  error: null, 
  results: [],
  resultsLoading: false, 
  resultsError: null, 
};

const enquirySlice = createSlice({
  name: "enquiry",
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
    
    setActivity: (state, action) => {
      state.results = action.payload.results;
      state.resultsLoading = false;
      state.resultsError = null;
    },
    setResultsLoading: (state) => {
      state.resultsLoading = true;
      state.resultsError = null;
    },
    setResultsError: (state, action) => {
      state.resultsLoading = false;
      state.resultsError = action.payload;
    },
  },
});

export const { setEnquiries, setLoading, setError, setActivity, setResultsLoading, setResultsError } =
  enquirySlice.actions;
export default enquirySlice.reducer;