import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./slices/addPropertySlice/propertyDetailsSlice";
import basicDetails from "./slices/addPropertySlice/basicDetailsSlice";
import addressSlice from "./slices/addPropertySlice/addressSlice";
import photosSlice from "./slices/addPropertySlice/propertyPhotosSlice";
import enquirySlice from "./slices/enquirySlice";
import searchSlice from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    basicDetails: basicDetails,
    propertyDetails: propertySlice,
    address: addressSlice,
    photos: photosSlice,
    enquiries:enquirySlice,
    search:searchSlice
  },
});
