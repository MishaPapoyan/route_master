import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDrivers = createAsyncThunk('Drivers/fetchDrivers', async () => {
    const response = await axios.get('http://localhost:5000/api/drivers');
    // Normalize IDs to strings
    return response.data.map(driver => ({
        ...driver,
        id: String(driver.id),
    }));
});

export const createDriver = createAsyncThunk('Drivers/createDriver', async (driverData) => {
    const response = await axios.post('http://localhost:5000/api/drivers', driverData);
    return { ...response.data, id: String(response.data.id) };
});

export const updateDriver = createAsyncThunk('Drivers/updateDriver', async ({ id, ...updates }) => {
    console.log('update', updates);
    const response = await axios.put(`http://localhost:5000/api/drivers/${id}`, updates);
    return { ...response.data, id: String(response.data.id) };
});

export const deleteDriver = createAsyncThunk('Drivers/deleteDriver', async (id) => {
    await axios.delete(`/api/drivers/${id}`);
    return String(id);
});

export const updateDriverClick = createAsyncThunk('Drivers/updateDriverClick', async ({ id, type, change }) => {
    const response = await axios.put(`http://localhost:5000/api/drivers/${id}/click`, { type, change });
    return { ...response.data, id: String(response.data.id) };
});

const driverSlice = createSlice({
    name: 'drivers',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDrivers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDrivers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchDrivers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createDriver.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateDriver.fulfilled, (state, action) => {
                const index = state.list.findIndex(driver => driver.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteDriver.fulfilled, (state, action) => {
                state.list = state.list.filter(driver => driver.id !== action.payload);
            })
            .addCase(updateDriverClick.fulfilled, (state, action) => {
                const index = state.list.findIndex(driver => driver.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            });
    }
});

export default driverSlice.reducer;