import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  propertySubtype: "",
  constructionStatus: "",
  bhk: "",
  bathroom: "",
  balcony: "",
  furnishType: "",
  ageOfProperty: "",
  areaUnit: "",
  builtupArea: "",
  carpetArea: "",
  totalProjectArea: "",
  unitCost: "",
  pentHouse: "",
  propertyCost: "",
  facilities: [],
  possessionStatus: "",
  investorProperty: "",
  loanFacility: "",
  facing: "",
  carParking: "",
  bikeParking: "",
  openParking: "",
  nearbyPlace: "",
  distanceFromProperty: "",
  servantRoom: "",
  propertyDescription: "",
};

const propertySlice = createSlice({
  name: "propertyDetails",
  initialState,
  reducers: {
    updatePropertyDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetPropertyDetails: () => initialState,
  },
});

export const { updatePropertyDetails, resetPropertyDetails } =
  propertySlice.actions;
export default propertySlice.reducer;
