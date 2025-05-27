import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const photosSlice = createSlice({
  name: "propertyPhotos",
  initialState,
  reducers: {},
});

export const {} = photosSlice.actions;
export default photosSlice.reducer;
