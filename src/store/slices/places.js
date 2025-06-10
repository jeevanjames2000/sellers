import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";

export const fetchAllStates = createAsyncThunk(
  "places/fetchAllStates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/getAllStates");
      const uniqueStates = Array.from(
        new Set(response.data.map((item) => item.state))
      ).map((state) => ({ name: state }));
      return uniqueStates;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch states" }
      );
    }
  }
);

export const fetchAllCities = createAsyncThunk(
  "places/fetchAllCities",
  async ({ state } = {}, { rejectWithValue }) => {
    try {
      const url = state
        ? `/api/v1/getAllCities?state=${encodeURIComponent(state)}`
        : "/api/v1/getAllCities";
      const response = await axiosInstance.get(url);
      const uniqueCities = Array.from(
        new Set(response.data.map((item) => item.city))
      ).map((city) => ({
        name: city,
        state: state || "",
      }));
      return uniqueCities;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch cities" }
      );
    }
  }
);

const placesSlice = createSlice({
  name: "places",
  initialState: {
    states: [],
    statesLoading: false,
    statesError: null,
    cities: [],
    citiesLoading: false,
    citiesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStates.pending, (state) => {
        state.statesLoading = true;
        state.statesError = null;
      })
      .addCase(fetchAllStates.fulfilled, (state, action) => {
        state.statesLoading = false;
        state.states = action.payload;
      })
      .addCase(fetchAllStates.rejected, (state, action) => {
        state.statesLoading = false;
        state.statesError = action.payload.message || "Failed to fetch states";
      });
    builder
      .addCase(fetchAllCities.pending, (state) => {
        state.citiesLoading = true;
        state.citiesError = null;
      })
      .addCase(fetchAllCities.fulfilled, (state, action) => {
        state.citiesLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchAllCities.rejected, (state, action) => {
        state.citiesLoading = false;
        state.citiesError = action.payload.message || "Failed to fetch cities";
      });
  },
});

export default placesSlice.reducer;