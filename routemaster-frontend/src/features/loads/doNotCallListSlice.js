import { createSlice } from '@reduxjs/toolkit';

const doNotCallSlice = createSlice({
    name: 'doNotCall',
    initialState: {
        companies: [],
    },
    reducers: {
        addDoNotCall: (state, action) => {
            const { company } = action.payload;
            const name = company.trim().toLowerCase();
            if (!state.companies.find(c => c.toLowerCase() === name)) {
                state.companies.push(company);
            }
        },
        removeDoNotCall: (state, action) => {
            const name = action.payload.trim().toLowerCase();
            state.companies = state.companies.filter(c => c.toLowerCase() !== name);
        }
    }
});

export const { addDoNotCall, removeDoNotCall } = doNotCallSlice.actions;
export default doNotCallSlice.reducer;
