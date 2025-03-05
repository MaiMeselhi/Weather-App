import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "bfd487c8330b4d529c275648250403";
const BASE_URL = "http://api.weatherapi.com/v1";

// Fetch forecast by city
export const fetchForcastByCity = createAsyncThunk(
  "weather/fetchForcastByCity",
  async (city) => {
    const response = await axios.get(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7`);
    return response.data;
  }
);

// Fetch forecast by geolocation
// Fetch forecast by geolocation (use accurate coordinates)
export const fetchForcastByGeoLocation = createAsyncThunk(
  "weather/fetchForcastByGeoLocation",
  async ({ latitude, longitude }) => {
    const response = await axios.get(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7`
    );
    return response.data;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    forecast: {},
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForcastByCity.fulfilled, (state, action) => {
        state.forecast = action.payload;
      })
      .addCase(fetchForcastByGeoLocation.fulfilled, (state, action) => {
        state.forecast = action.payload;
      });
  },
});

export default weatherSlice.reducer;
