import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from './weatherSlice';
import tripReducer from './tripSlice';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    trips: tripReducer,
  },
});

export default store;
