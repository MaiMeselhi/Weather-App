import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/items';

const initialState = {
  trips: JSON.parse(localStorage.getItem('trips')) || [],
};

export const syncTripsWithBackend = () => async (dispatch) => {
  try {
    const response = await axios.get(API_URL);
    const tripsFromServer = response.data;
    localStorage.setItem('trips', JSON.stringify(tripsFromServer));
    dispatch(setTrips(tripsFromServer));
  } catch (error) {
    console.error('Error fetching trips from backend', error);
  }
};

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips: (state, action) => {
      state.trips = action.payload;
    },
    addTrip: (state, action) => {
      state.trips.push(action.payload);
      localStorage.setItem('trips', JSON.stringify(state.trips));
      axios.post(API_URL, action.payload);
    },
    removeTrip: (state, action) => {
      const updatedTrips = state.trips.filter(trip => trip.id !== action.payload);
      state.trips = updatedTrips;
      localStorage.setItem('trips', JSON.stringify(state.trips));
      axios.delete(`${API_URL}/${action.payload}`);
    },
    updateTrip: (state, action) => {
      const updatedTrips = state.trips.map(trip =>
        trip.id === action.payload.id ? { ...trip, ...action.payload } : trip
      );
      state.trips = updatedTrips;
      localStorage.setItem('trips', JSON.stringify(state.trips));
      axios.put(`${API_URL}/${action.payload.id}`, action.payload);
    },
  },
});

export const { setTrips, addTrip, removeTrip, updateTrip } = tripSlice.actions;

export default tripSlice.reducer;
