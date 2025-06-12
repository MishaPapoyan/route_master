import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/drivers';

export const fetchDrivers = createAsyncThunk('Drivers/fetchDrivers', async () => {
    const response = await axios.get(BASE_URL);
    return response.data.map(driver => ({
        ...driver,
        id: String(driver.id),
    }));
});

export const createDriver = createAsyncThunk(
    'Drivers/createDriver',
    async (driverData, { rejectWithValue }) => {
        try {
            const cleanData = { ...driverData };
            delete cleanData.created_date;

            const response = await axios.post(BASE_URL, cleanData);
            return { ...response.data, id: String(response.data.id) };
        } catch (err) {
            console.error('❌ createDriver error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to create driver');
        }
    }
);

export const updateDriver = createAsyncThunk('Drivers/updateDriver', async ({ id, ...updates }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, updates);
        return { ...response.data, id: String(response.data.id) };
    } catch (err) {
        console.error('❌ updateDriver error:', err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || 'Failed to update driver');
    }
});

export const deleteDriver = createAsyncThunk('Drivers/deleteDriver', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
        return String(id);
    } catch (err) {
        console.error('❌ deleteDriver error:', err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || 'Failed to delete driver');
    }
});

export const updateDriverClick = createAsyncThunk('Drivers/updateDriverClick', async ({ id, type, change }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}/click`, { type, change });
        return { ...response.data, id: String(response.data.id) };
    } catch (err) {
        console.error('❌ updateDriverClick error:', err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || 'Failed to update click');
    }
});

const driverSlice = createSlice({
    name: 'drivers',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDrivers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDrivers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchDrivers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(createDriver.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.error = null;
            })
            .addCase(createDriver.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateDriver.fulfilled, (state, action) => {
                const index = state.list.findIndex(driver => driver.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
                state.error = null;
            })
            .addCase(updateDriver.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteDriver.fulfilled, (state, action) => {
                state.list = state.list.filter(driver => driver.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteDriver.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateDriverClick.fulfilled, (state, action) => {
                const index = state.list.findIndex(driver => driver.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
                state.error = null;
            })
            .addCase(updateDriverClick.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { resetError } = driverSlice.actions;
export default driverSlice.reducer;