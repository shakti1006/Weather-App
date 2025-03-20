import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'bd8b2a4edae84a6fb6090247251903';
const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

export const fetchWeather = createAsyncThunk('weather/fetchWeather', async (city) => {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${city}&days=30`);
  return response.data;
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => { state.loading = true; })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
