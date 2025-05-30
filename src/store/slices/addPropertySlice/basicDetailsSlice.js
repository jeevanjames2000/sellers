import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  property_in: "",
  property_for: "",
  transaction_type: "",
  unique_property_id: "",
  user_type: "",
  user_id: "",
};
const basicDetailsSlice = createSlice({
  name: "basicDetails",
  initialState,
  reducers: {
    setPropertyIn: (state, action) => {
      state.property_in = action.payload;
    },
    setPropertyFor: (state, action) => {
      state.property_for = action.payload;
    },
    setTransactionType: (state, action) => {
      state.transaction_type = action.payload;
    },
    setBasicDetails: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});
export const {
  setPropertyIn,
  setPropertyFor,
  setTransactionType,
  setBasicDetails,
} = basicDetailsSlice.actions;
export default basicDetailsSlice.reducer;
