import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers, deleteDriver } from "../../features/drivers/driverSlice.js";
import DriverRow from './DriverRow';
import DriverTableHeader from './DriverTableHeader';
import DriverForm from "./DriverForm.jsx";
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import Header from "../HomePage/Header.jsx";

export default function DriverTable() {
    const dispatch = useDispatch();
    const { loading, error, list } = useSelector((state) => state.drivers);
    const [isOpen, setIsOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [daysAgo, setDaysAgo] = useState(0);

    const [activeFilters, setActiveFilters] = useState({
        hasLoad: false,
        noLoad: false,
        covered: false,
        notRigz: false,
    });

    useEffect(() => {
        const loadData = async () => {
            setIsRefreshing(true);
            await dispatch(fetchDrivers());
            setIsRefreshing(false);
        };
        loadData();
    }, [dispatch]);

    const filteredByDate = daysAgo === 5 ? list : list.filter(driver => {
        const createdDate = new Date(driver.createdAt).toDateString();
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - daysAgo);
        return new Date(createdDate).toDateString() === targetDate.toDateString();
    });

    const filteredList = filteredByDate
        .filter(driver =>
            ['name', 'phone_number', 'current_location', 'next_location', 'rigz_id', 'nationality']
                .some(key => String(driver[key]).toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter(driver => {
            if (activeFilters.hasLoad && !driver.loadId) return false;
            if (activeFilters.noLoad && driver.loadId) return false;
            if (activeFilters.covered && !driver.covered) return false;
            if (activeFilters.notRigz && driver.is_from_rigz) return false;
            return true;
        });

    const groupedDrivers = filteredList.reduce((acc, driver) => {
        const route = driver.main_route || 'Unknown Route';
        if (!acc[route]) acc[route] = [];
        acc[route].push(driver);
        return acc;
    }, {});

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await dispatch(fetchDrivers());
        setIsRefreshing(false);
    };

    return (
        <div className="p-4 md:p-6">
            <Header />

            {loading && !isRefreshing && (
                <div className="fixed inset-0 w-full bg-white/50 z-50 flex items-center justify-center">
                    <FiRefreshCw size={32} className="text-blue-600 animate-spin" />
                </div>
            )}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>Error: {error}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-6 border-b border-gray-100">
          <span className='text-4xl text-yellow-500 bg-blue-500 underline rounded-xl border p-4'>
            {filteredByDate.length}
          </span>

                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">🚚</span>
                            Driver Management
                        </h2>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                            title="Refresh data"
                        >
                            <FiRefreshCw size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search drivers..."
                                className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <select
                            value={daysAgo}
                            onChange={(e) => setDaysAgo(Number(e.target.value))}
                            className="px-4 py-2 border border-gray-200 rounded-lg"
                        >
                            <option value={0}>Today</option>
                            <option value={1}>Yesterday</option>
                            <option value={2}>2 Days Ago</option>
                            <option value={3}>3 Days Ago</option>
                            <option value={4}>4 Days Ago</option>
                            <option value={5}>All Time</option>
                        </select>

                        <button
                            onClick={() => {
                                setEditingDriver(null);
                                setIsOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            <FiPlus size={18} />
                            Add Driver
                        </button>
                    </div>
                </div>

                <div className="px-4 pb-4 flex flex-wrap gap-2">
                    {[
                        { label: 'Has Load', key: 'hasLoad' },
                        { label: 'No Load', key: 'noLoad' },
                        { label: 'Covered', key: 'covered' },
                        { label: 'Not from Rigz', key: 'notRigz' }
                    ].map(filter => (
                        <button
                            key={filter.key}
                            onClick={() =>
                                setActiveFilters(prev => ({
                                    ...prev,
                                    [filter.key]: !prev[filter.key]
                                }))
                            }
                            className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                                activeFilters[filter.key]
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <DriverTableHeader sortConfig={sortConfig} setSortConfig={setSortConfig} />
                        <tbody className="divide-y divide-gray-100">
                        <AnimatePresence>
                            {Object.entries(groupedDrivers).map(([route, drivers]) => (
                                <React.Fragment key={route}>
                                    <tr>
                                        <td colSpan="12" className="bg-gray-50 font-semibold text-lg text-gray-700 px-4 py-2">
                                            {route}
                                        </td>
                                    </tr>
                                    {drivers.map(driver => (
                                        <DriverRow
                                            key={driver.id}
                                            driver={driver}
                                            onDelete={(id) => dispatch(deleteDriver(id))}
                                            onEdit={(driver) => {
                                                setEditingDriver(driver);
                                                setIsOpen(true);
                                            }}
                                            setSortConfig={setSortConfig}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <DriverForm
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        editingDriver={editingDriver}
                        setEditingDriver={setEditingDriver}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
