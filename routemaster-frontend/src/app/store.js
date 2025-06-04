import driverReducer from '../features/drivers/driverSlice';
import {configureStore} from "@reduxjs/toolkit";
import loadReducer from '../features/loads/loadSlice'; // ✅ Add this
import contactedLoadsReducer from '../features/loads/contactedLoadsSlice';

import doNotCallReducer from '../features/loads/doNotCallListSlice.js';

export const store = configureStore({
    reducer: {
        drivers: driverReducer,
        loads: loadReducer,
        doNotCall: doNotCallReducer,
        contactedLoads: contactedLoadsReducer,
    },
});