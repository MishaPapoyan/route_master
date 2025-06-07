import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all DNC entries
const fetchDoNotCallList = createAsyncThunk('doNotCall/fetch', async () => {
    const res = await axios.get('/api/dnc');
    return res.data;
});

// Add new DNC entry
const addDoNotCall = createAsyncThunk('doNotCall/add', async (entry) => {
    const res = await axios.post('/api/dnc', entry);
    return res.data;
});

// Delete entry by ID
const deleteDoNotCall = createAsyncThunk('doNotCall/delete', async (id) => {
    await axios.delete(`/api/dnc/${id}`);
    return id;
});

const doNotCallSlice = createSlice({
    name: 'doNotCall',
    initialState: {
        companies: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoNotCallList.fulfilled, (state, action) => {
                state.companies = action.payload;
            })
            .addCase(addDoNotCall.fulfilled, (state, action) => {
                state.companies.push(action.payload);
            })
            .addCase(deleteDoNotCall.fulfilled, (state, action) => {
                state.companies = state.companies.filter(entry => entry.id !== action.payload);
            });
    }
});

export default doNotCallSlice.reducer;

// ✅ Export all once, cleanly
export {
    fetchDoNotCallList,
    addDoNotCall,
    deleteDoNotCall
};
