import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  state: "",
  city: "",
  locality: "",
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
  },
});
export const { setState, setCity, setLocality } = addressSlice.actions;
export default addressSlice.reducer;
