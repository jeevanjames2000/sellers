import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./slices/addPropertySlice/propertyDetailsSlice";
import basicDetails from "./slices/addPropertySlice/basicDetailsSlice";
import addressSlice from "./slices/addPropertySlice/addressSlice";
import photosSlice from "./slices/addPropertySlice/propertyPhotosSlice";
import enquirySlice from "./slices/enquirySlice";
import searchSlice from './slices/searchSlice';
import invoiceSlice from './slices/invoiceSlice';
import loginSlice from './slices/loginSlice';
import profileSlice from './slices/profileSlice';
import locationsSlice from './slices/locationSlice';
import signUpSlice from './slices/signupSlice';
import placesSlice from './slices/places';

export const store = configureStore({
  reducer: {
    basicDetails: basicDetails,
    propertyDetails: propertySlice,
    address: addressSlice,
    photos: photosSlice,
    enquiries:enquirySlice,
    search:searchSlice,
    invoices:invoiceSlice,
    login:loginSlice,
    profile:profileSlice,
    locations:locationsSlice,
    signup:signUpSlice,
    places:placesSlice
  },
});

