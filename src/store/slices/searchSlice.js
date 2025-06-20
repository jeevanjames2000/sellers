import { createSlice } from "@reduxjs/toolkit";
const searchSlice = createSlice({
  name: "search",
  initialState: {
    city: "",
    tab: "Buy",
    property_for: "Sell",
    property_in: "",
    bhk: null,
    budget: "",
    sub_type: "",
    plot_subType: "Buy",
    commercial_subType: "Buy",
    occupancy: "",
    location: "",
    userCity: null,
    statusFilter: {
      buy: null,
      rent: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setTab: (state, action) => {
      state.tab = action.payload;
    },
    setPropertyFor: (state, action) => {
      state.property_for = action.payload;
    },
    setPropertyIn: (state, action) => {
      state.property_in = action.payload;
    },
    setBHK: (state, action) => {
      state.bhk = action.payload;
    },
    setBudget: (state, action) => {
      state.budget = action.payload;
    },
    setSubType: (state, action) => {
      state.sub_type = action.payload;
    },
    setOccupancy: (state, action) => {
      state.occupancy = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setUserCity: (state, action) => {
      state.userCity = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSearchData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setPlotSubType: (state, action) => {
      state.plot_subType = action.payload;
    },
    setCommercialSubType: (state, action) => {
      state.commercial_subType = action.payload;
    },
     setStatusFilter(state, action) {
      const { type, value } = action.payload;
      state.statusFilter[type] = value;
    },
  },
});
export const {
  setCity,
  setTab,
  setPropertyFor,
  setPropertyIn,
  setBHK,
  setBudget,
  setSubType,
  setOccupancy,
  setLocation,
  setUserCity,
  setLoading,
  setError,
  setSearchData,
  setPlotSubType,
  setCommercialSubType,
  setStatusFilter
} = searchSlice.actions;
export default searchSlice.reducer;