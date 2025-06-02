import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import {store} from "./app/store.js";
import AppRoutes from "./components/AppRoutes.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
        <Provider store={store}>
            <AppRoutes />
        </Provider>
);
