import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchContactedLoads = createAsyncThunk('contactedLoads/fetchContactedLoads', async () => {
    const response = await axios.get(`${API_BASE}/loads`);
    return response.data.filter(load => load.contacted === true);
});

export const createContactedLoad = createAsyncThunk('contactedLoads/createContactedLoad', async (loadData) => {
    const response = await axios.post(`${API_BASE}/loads`, loadData);
    return response.data;
});

export const updateContactedLoad = createAsyncThunk(
    'contactedLoads/updateContactedLoad',
    async ({ id, loadData }, thunkAPI) => {
        try {
            const response = await axios.put(`${API_BASE}/loads/${id}`, loadData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteContactedLoad = createAsyncThunk(
    'contactedLoads/deleteContactedLoad',
    async (id, thunkAPI) => {
        try {
            await axios.delete(`${API_BASE}/loads/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const markLoadDidntConnect = createAsyncThunk(
    'contactedLoads/markLoadDidntConnect',
    async ({ id }) => {
        const response = await axios.put(`${API_BASE}/loads/${id}/contact`, {
            method: 'call',
            notes: "Didn't connect",
        });
        return response.data;
    }
);

export const updateContactedLoadClick = createAsyncThunk(
    'contactedLoads/updateContactedLoadClick',
    async ({ id, type, change }) => {
        const response = await axios.put(`${API_BASE}/loads/${id}/click`, { type, change });
        return response.data;
    }
);
export const updateLoadCovered = createAsyncThunk('loads/updateCovered', async ({ id, covered }) => {
    const res = await axios.put(`/api/loads/${id}/covered`, { covered });
    return res.data;
});

const contactedLoadsSlice = createSlice({
    name: 'contactedLoads',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContactedLoads.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchContactedLoads.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchContactedLoads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createContactedLoad.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(markLoadDidntConnect.fulfilled, (state, action) => {
                const index = state.list.findIndex(load => load.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(updateContactedLoadClick.fulfilled, (state, action) => {
                const index = state.list.findIndex(load => load.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(updateContactedLoad.fulfilled, (state, action) => {
                const index = state.list.findIndex(load => load.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = { ...state.list[index], ...action.payload };
                }
            })

            // 🗑 Delete Contacted Load
            .addCase(deleteContactedLoad.fulfilled, (state, action) => {
                state.list = state.list.filter(load => load.id !== action.payload);
            })
            .addCase(updateLoadCovered.fulfilled, (state, action) => {
                const idx = state.list.findIndex(l => l.id === action.payload.id);
                if (idx !== -1) state.list[idx] = action.payload;
            });
    }
});

export default contactedLoadsSlice.reducer;
