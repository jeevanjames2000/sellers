import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  propertyType: "",
  lookingTo: "",
  transactionType: "",
};
const basicDetailsSlice = createSlice({
  name: "basicDetails",
  initialState,
  reducers: {
    setPropertyType: (state, action) => {
      state.propertyType = action.payload;
    },
    setLookingTo: (state, action) => {
      state.lookingTo = action.payload;
    },
    setTransactionType: (state, action) => {
      state.transactionType = action.payload;
    },
  },
});
export const { setPropertyType, setLookingTo, setTransactionType } =
  basicDetailsSlice.actions;
export default basicDetailsSlice.reducer;
