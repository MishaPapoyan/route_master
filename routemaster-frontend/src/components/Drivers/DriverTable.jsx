import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers, deleteDriver } from "../../features/drivers/driverSlice.js";
import DriverRow from './DriverRow';
import DriverTableHeader from './DriverTableHeader';
import DriverForm from "./DriverForm.jsx";
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus, FiSearch, FiRefreshCw, FiFilter } from 'react-icons/fi';
import Header from "../HomePage/Header.jsx";

export default function DriverTable() {
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const dispatch = useDispatch();
    const { loading, error, list } = useSelector((state) => state.drivers);
    const [isOpen, setIsOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [daysAgo, setDaysAgo] = useState(0);
    const [activeFilters, setActiveFilters] = useState({
        hasLoad: false,
        noLoad: false,
        covered: false,
        notRigz: false,
    });
    const [filters, setFilters] = useState({}); // Store column filters
    const sortedDrivers = [...list]
        .sort((a, b) => {
            // Always put covered drivers at the bottom
            if (a.covered && !b.covered) return 1;
            if (!a.covered && b.covered) return -1;

            // Dynamic column sort
            if (sortKey) {
                const valA = a[sortKey] || '';
                const valB = b[sortKey] || '';

                if (typeof valA === 'string') {
                    return sortDirection === 'asc'
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                } else {
                    return sortDirection === 'asc'
                        ? valA - valB
                        : valB - valA;
                }
            }

            // Default fallback: sort by name
            return a.name.localeCompare(b.name);
        });


    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };
    useEffect(() => {
        const loadData = async () => {
            setIsRefreshing(true);
            await dispatch(fetchDrivers());
            setIsRefreshing(false);
        };
        loadData();
    }, [dispatch]);

    const filteredByDate = list.filter(driver => {
        if (daysAgo === 5) return true;

        if (daysAgo === 100) {
            return driver.current_location?.toLowerCase().includes('los');
        }

        if (daysAgo === 200) {
            return driver.next_location?.toLowerCase().includes('los');
        }

        const created = new Date(driver.createdAt);
        const today = new Date();
        return (
            created.getFullYear() === today.getFullYear() &&
            created.getMonth() === today.getMonth() &&
            created.getDate() === today.getDate() - daysAgo
        );
    });

    const filteredList = filteredByDate
        .filter(driver => {
            // Apply column filters
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true; // Skip empty filters
                return String(driver[key] || '').toLowerCase() === value.toLowerCase();
            });
        })
        .filter(driver => {
            // Apply search query
            if (!searchQuery) return true;
            return ['name', 'phone_number', 'current_location', 'next_location', 'rigz_id', 'nationality', 'main_route']
                .some(key => String(driver[key] || '').toLowerCase().includes(searchQuery.toLowerCase()));
        })
        .filter(driver => {
            // Apply existing checkbox filters
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

    const handleFilterChange = (field, value) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters[field] === value) {
                delete newFilters[field]; // Toggle off if same value
            } else {
                newFilters[field] = value;
            }
            return newFilters;
        });
    };

    const handleClearFilters = () => {
        setFilters({});
        setSearchQuery('');
    };

    const handleClearAll = () => {
        setFilters({});
        setSearchQuery('');
        setActiveFilters({
            hasLoad: false,
            noLoad: false,
            covered: false,
            notRigz: false,
        });
        setDaysAgo(0); // Reset to Today
    };

    // Get unique values for each filterable field
    const getUniqueValues = (field) => {
        const values = [...new Set(filteredByDate.map(driver => driver[field] || '-'))];
        return values.filter(v => v !== '-'); // Exclude '-' as a filter option
    };

    const filterOptions = {
        name: getUniqueValues('name'),
        phone_number: getUniqueValues('phone_number'),
        current_location: getUniqueValues('current_location'),
        next_location: getUniqueValues('next_location'),
        rigz_id: getUniqueValues('rigz_id'),
        nationality: getUniqueValues('nationality'),
        main_route: getUniqueValues('main_route'),
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

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-4xl text-yellow-500 bg-blue-600 rounded-lg border-2 border-yellow-500 p-3 font-bold">
                        {filteredByDate.length}
                    </span>

                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">🚚</span>
                            Driver Management
                        </h2>
                        <div className="flex gap-4 px-4 py-2">
                            <button
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    daysAgo === 100 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setDaysAgo(100)} // 100 means "Los Out"
                            >
                                🚛 Los Out
                            </button>

                            <button
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    daysAgo === 200 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setDaysAgo(200)} // 200 means "Back to Los"
                            >
                                🏁 Back to Los
                            </button>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors disabled:opacity-50"
                            title="Refresh data"
                        >
                            <FiRefreshCw size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-end md:items-center">
                        <div className="relative flex-1 max-w-md w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search drivers..."
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />

                        </div>
                        {searchQuery || Object.keys(filters).length > 0 || Object.values(activeFilters).some(v => v) || daysAgo > 0 ? (
                            <div className="mt-2 md:mt-0 md:ml-2 flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                >
                                    Clear Filters
                                </button>
                                <button
                                    onClick={handleClearAll}
                                    className="px-4 py-2 bg-red-200 text-gray-700 rounded-lg hover:bg-red-300 transition-colors text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                        ) : null}
                        <select
                            value={daysAgo}
                            onChange={(e) => setDaysAgo(Number(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium"
                        >
                            <FiPlus size={18} />
                            Add Driver
                        </button>
                    </div>
                </div>

                {/* Filter Dropdown Menu */}
                <div className="px-4 py-3 bg-gray-50 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <FiFilter className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Filter by:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                        {Object.keys(filterOptions).map((field) => (
                            <div key={field} className="flex flex-col">
                                <label className="text-xs text-gray-500 uppercase tracking-wide">{field.replace('_', ' ')}</label>
                                <select
                                    value={filters[field] || ''}
                                    onChange={(e) => handleFilterChange(field, e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full"
                                >
                                    <option value="">All</option>
                                    {filterOptions[field].map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-4 py-2 bg-gray-50 flex flex-wrap gap-2">
                    {[
                        { label: 'Has Load', key: 'hasLoad' },
                        { label: 'No Load', key: 'noLoad' },
                        { label: 'Covered', key: 'covered' },
                        { label: 'Not from Rigz', key: 'notRigz' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() =>
                                setActiveFilters((prev) => ({
                                    ...prev,
                                    [filter.key]: !prev[filter.key],
                                }))
                            }
                            className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
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


                        <DriverTableHeader />
                        <tbody className="divide-y divide-gray-100">
                        <AnimatePresence>
                            {Object.entries(groupedDrivers).map(([route, drivers]) => (
                                <React.Fragment key={route}>
                                    <tr>
                                        <td
                                            colSpan="12"
                                            className="bg-gray-100 font-semibold text-lg text-gray-700 px-4 py-2 cursor-pointer hover:bg-gray-200 hover:text-blue-600 transition-colors"
                                            onClick={() => handleFilterChange('main_route', route)}
                                        >
                                            {route}
                                        </td>
                                    </tr>
                                    {drivers
                                        .sort((a, b) => {
                                            // sort logic here...
                                        })
                                        .map(driver => (
                                            <DriverRow
                                                key={driver.id}
                                                driver={driver}
                                                onDelete={(id) => dispatch(deleteDriver(id))}
                                                onEdit={(driver) => {
                                                    setEditingDriver(driver);
                                                    setIsOpen(true);
                                                }}
                                                onCellClick={handleFilterChange}
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