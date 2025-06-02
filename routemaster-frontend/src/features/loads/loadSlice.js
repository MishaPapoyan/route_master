import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchLoads = createAsyncThunk('loads/fetchLoads', async () => {
    const response = await axios.get(`${API_BASE}/loads`);
    return response.data;
});

export const createLoad = createAsyncThunk('loads/createLoad', async (loadData) => {
    const response = await axios.post(`${API_BASE}/loads`, {
        ...loadData,
        rigz_id: loadData.rigz_id  // ✅ renamed from driver_rigz_id to rigz_id
    });
    return response.data;
});

export const updateLoad = createAsyncThunk('loads/updateLoad', async ({ id, loadData }) => {
    const response = await axios.put(`${API_BASE}/loads/${id}`, {
        ...loadData,
        rigz_id: loadData.rigz_id // ✅ same fix for updates
    });
    return response.data;
});

export const deleteLoad = createAsyncThunk('loads/deleteLoad', async (id) => {
    await axios.delete(`${API_BASE}/loads/${id}`);
    return id;
});

export const markLoadContacted = createAsyncThunk('loads/markContacted', async ({ id, method, notes }) => {
    const response = await axios.put(`${API_BASE}/loads/${id}/contact`, { method, notes });
    return response.data;
});

export const updateLoadStatus = createAsyncThunk('loads/updateStatus', async ({ id, status }) => {
    const response = await axios.put(`${API_BASE}/loads/${id}/status`, { status });
    return response.data;
});

const loadSlice = createSlice({
    name: 'loads',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoads.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLoads.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchLoads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createLoad.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateLoad.fulfilled, (state, action) => {
                const index = state.list.findIndex(load => load.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteLoad.fulfilled, (state, action) => {
                state.list = state.list.filter(load => load.id !== action.payload);
            })
            .addCase(markLoadContacted.fulfilled, (state, action) => {
                const index = state.list.findIndex(load => load.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(updateLoadStatus.fulfilled, (state, action) => {
                const index = state.list.findIndex(load => load.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            });
    }
});

export default loadSlice.reducer;
