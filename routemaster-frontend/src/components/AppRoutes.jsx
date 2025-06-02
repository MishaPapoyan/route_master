import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadCardList from '../components/loads/LoadCardList';
import DriverTable from './Drivers/DriverTable';
import HomePage from './HomePage/HomePage.jsx';
import PageNotFound from "../pages/PageNotFound.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import ContactedLoadsTable from "./Loads/ContactedLoadsTable.jsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/drivers" element={<DriverTable />} />
                <Route path="/loads" element={<LoadCardList />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contacted-loads" element={<ContactedLoadsTable />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
