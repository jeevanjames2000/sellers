import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  state_id: "",
  city_id: "",
  locality: "",
  unit_flat_house_no: "",
  floors: "",
  total_floors: "",
  unique_property_id: "",
  property_name: "",
  plot_number: "",
};
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setState: (stateData, action) => {
      stateData.state = action.payload;
      stateData.city = "";
      stateData.locality = "";
    },
    setCity: (stateData, action) => {
      stateData.city = action.payload;
      stateData.locality = "";
    },
    setLocality: (stateData, action) => {
      stateData.locality = action.payload;
    },
    setAddress: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});
export const { setState, setCity, setLocality, setAddress } =
  addressSlice.actions;
export default addressSlice.reducer;
